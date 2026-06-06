export type StyleTokens = {
  theme: "light" | "dark" | "unknown";
  section: {
    background?: string;
    color?: string;
    fontFamily?: string;
    padding?: string;
  };
  heading: {
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
  };
  body: {
    color?: string;
    fontSize?: string;
    lineHeight?: string;
  };
  muted: {
    color?: string;
  };
  card: {
    background?: string;
    border?: string;
    borderColor?: string;
    borderRadius?: string;
    boxShadow?: string;
    padding?: string;
  };
  button: {
    background?: string;
    color?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    fontWeight?: string;
  };
  accentColor?: string;
  diagnostics: {
    headingSelector?: string;
    cardSelector?: string;
    buttonSelector?: string;
  };
};

export function extractStyleTokens(root: HTMLElement): StyleTokens {
  const rootStyle = getComputedStyle(root);
  const heading = firstVisible(root, "h1,h2,h3,[role='heading']");
  const body = firstVisible(root, "p,li,span");
  const card = findLikelyCard(root);
  const button = firstVisible(root, "button,a[href],[role='button']");
  const headingStyle = heading ? getComputedStyle(heading) : null;
  const bodyStyle = body ? getComputedStyle(body) : null;
  const cardStyle = card ? getComputedStyle(card) : null;
  const buttonStyle = button ? getComputedStyle(button) : null;
  const sectionBackground =
    nonTransparentColor(rootStyle.backgroundColor) ??
    firstVisibleBackground(root) ??
    "rgb(255, 255, 255)";
  const sectionColor = nonTransparentColor(rootStyle.color);
  const buttonBackground = buttonStyle
    ? nonTransparentColor(buttonStyle.backgroundColor)
    : undefined;
  const linkColor = firstVisible(root, "a[href]")
    ? nonTransparentColor(getComputedStyle(firstVisible(root, "a[href]")!).color)
    : undefined;
  const cardBorderColor = cardStyle ? firstBorderColor(cardStyle) : undefined;

  return {
    theme: detectTheme(sectionBackground, sectionColor),
    section: {
      background: sectionBackground,
      color: sectionColor,
      fontFamily: rootStyle.fontFamily,
      padding: usableSpacing(rootStyle.padding)
    },
    heading: {
      color: headingStyle?.color ?? sectionColor,
      fontFamily: headingStyle?.fontFamily ?? rootStyle.fontFamily,
      fontSize: headingStyle?.fontSize,
      fontWeight: headingStyle?.fontWeight,
      lineHeight: headingStyle?.lineHeight,
      letterSpacing: headingStyle?.letterSpacing
    },
    body: {
      color: bodyStyle?.color ?? sectionColor,
      fontSize: bodyStyle?.fontSize,
      lineHeight: bodyStyle?.lineHeight
    },
    muted: {
      color: bodyStyle?.color ?? sectionColor
    },
    card: {
      background: cardStyle ? nonTransparentColor(cardStyle.backgroundColor) : undefined,
      border: cardStyle ? visibleBorder(cardStyle) : undefined,
      borderColor: cardBorderColor,
      borderRadius: cardStyle ? usableRadius(cardStyle.borderRadius) : undefined,
      boxShadow: cardStyle ? usableShadow(cardStyle.boxShadow) : undefined,
      padding: cardStyle ? usableSpacing(cardStyle.padding) : undefined
    },
    button: {
      background: buttonBackground,
      color: buttonStyle?.color,
      border: buttonStyle ? visibleBorder(buttonStyle) : undefined,
      borderRadius: buttonStyle ? usableRadius(buttonStyle.borderRadius) : undefined,
      padding: buttonStyle ? usableSpacing(buttonStyle.padding) : undefined,
      fontWeight: buttonStyle?.fontWeight
    },
    accentColor: buttonBackground ?? linkColor ?? cardBorderColor,
    diagnostics: {
      headingSelector: heading ? describeElement(heading) : undefined,
      cardSelector: card ? describeElement(card) : undefined,
      buttonSelector: button ? describeElement(button) : undefined
    }
  };
}

function firstVisible(root: HTMLElement, selector: string): HTMLElement | null {
  return (
    Array.from(root.querySelectorAll(selector)).find(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && isVisible(element)
    ) ?? null
  );
}

function isVisible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);

  return (
    rect.width > 2 &&
    rect.height > 2 &&
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    Number(style.opacity) !== 0
  );
}

function findLikelyCard(root: HTMLElement): HTMLElement | null {
  const candidates = Array.from(root.querySelectorAll("article,li,div,section"))
    .filter((element): element is HTMLElement => element instanceof HTMLElement)
    .filter((element) => element !== root && isVisible(element))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const classKey = usefulClasses(element).join(" ");
      const siblingClassCount = classKey
        ? Array.from(root.querySelectorAll(`.${CSS.escape(usefulClasses(element)[0] ?? "")}`)).length
        : 0;
      const hasText = element.textContent ? element.textContent.trim().length > 8 : false;
      const score =
        (hasText ? 3 : 0) +
        (rect.width >= 80 && rect.height >= 50 ? 3 : 0) +
        (nonTransparentColor(style.backgroundColor) ? 3 : 0) +
        (Number.parseFloat(style.borderRadius) > 0 ? 2 : 0) +
        (usableShadow(style.boxShadow) ? 3 : 0) +
        (firstBorderColor(style) ? 2 : 0) +
        (Number.parseFloat(style.padding) > 4 ? 2 : 0) +
        (siblingClassCount > 1 ? 2 : 0);

      return { element, score };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.score >= 5 ? candidates[0].element : firstTextContainer(root);
}

function firstTextContainer(root: HTMLElement): HTMLElement | null {
  return (
    Array.from(root.children).find(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        isVisible(element) &&
        Boolean(element.textContent?.trim())
    ) ?? null
  );
}

function usefulClasses(element: Element) {
  return Array.from(element.classList).filter(
    (className) => className.length <= 64 && /^[A-Za-z0-9:_/-]+$/.test(className)
  );
}

function firstVisibleBackground(element: Element): string | undefined {
  let current: Element | null = element;

  while (current) {
    const color = nonTransparentColor(getComputedStyle(current).backgroundColor);
    if (color) return color;
    current = current.parentElement;
  }

  return nonTransparentColor(getComputedStyle(document.body).backgroundColor);
}

function nonTransparentColor(value: string | undefined) {
  if (!value || value === "transparent" || value === "currentColor") return undefined;
  const parsed = parseCssColor(value);
  if (!parsed || parsed.a === 0) return undefined;
  return value;
}

function visibleBorder(style: CSSStyleDeclaration) {
  const borderColor = firstBorderColor(style);
  if (!borderColor) return undefined;

  return `${style.borderTopWidth} ${style.borderTopStyle} ${borderColor}`;
}

function firstBorderColor(style: CSSStyleDeclaration) {
  return [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor]
    .map(nonTransparentColor)
    .find((value): value is string => Boolean(value && !isNeutralTransparent(value)));
}

function usableRadius(value: string | undefined) {
  return value && value !== "0px" ? value : undefined;
}

function usableSpacing(value: string | undefined) {
  return value && value !== "0px" ? value : undefined;
}

function usableShadow(value: string | undefined) {
  return value && value !== "none" ? value : undefined;
}

function detectTheme(background: string | undefined, color: string | undefined): StyleTokens["theme"] {
  const backgroundColor = background ? parseCssColor(background) : null;
  const textColor = color ? parseCssColor(color) : null;

  if (!backgroundColor) return "unknown";

  const backgroundLuminance = luminance(backgroundColor);
  const textLuminance = textColor ? luminance(textColor) : backgroundLuminance > 0.55 ? 0 : 1;

  return backgroundLuminance > textLuminance ? "light" : "dark";
}

function describeElement(element: HTMLElement) {
  const className = usefulClasses(element).slice(0, 3).join(".");
  return className ? `${element.tagName.toLowerCase()}.${className}` : element.tagName.toLowerCase();
}

type ParsedColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function parseCssColor(value: string): ParsedColor | null {
  const rgbMatch = value.match(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*([0-9.]+))?\)/i);

  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] ? Number(rgbMatch[4]) : 1
    };
  }

  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hexMatch) return null;

  const hex = hexMatch[1];
  const normalized =
    hex.length === 3
      ? hex.split("").map((char) => `${char}${char}`).join("")
      : hex;

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: 1
  };
}

function luminance(color: ParsedColor) {
  const [r, g, b] = [color.r, color.g, color.b].map((channelValue) => {
    const channel = channelValue / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isNeutralTransparent(value: string) {
  const color = parseCssColor(value);
  if (!color || color.a === 0) return true;

  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  return max - min < 18 || max < 28 || min > 238;
}

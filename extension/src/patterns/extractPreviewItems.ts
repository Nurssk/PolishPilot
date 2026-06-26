import type {
  AIUnderstandingResult,
  MatchedElement,
  RectangleCapture,
  StyleContext
} from "../shared/types";

export type PreviewIcon = {
  exists: boolean;
  type?: "svg" | "image" | "emoji" | "unknown";
  color?: string;
  position?: "top" | "left" | "inline";
};

export type PreviewSourceRole =
  | "section"
  | "heading"
  | "subtitle"
  | "card"
  | "cardTitle"
  | "cardText"
  | "button"
  | "stat"
  | "form"
  | "unknown";

export type PreviewItem = {
  id: string;
  title: string;
  description?: string;
  eyebrow?: string;
  cta?: string;
  meta?: string;
  value?: string;
  rawText?: string;
  icon?: PreviewIcon;
  sourceTagName?: string;
  sourceClassName?: string;
  sourceClasses?: string[];
  sourceRole?: PreviewSourceRole;
  titleSourceTagName?: string;
  titleSourceClassName?: string;
  titleSourceClasses?: string[];
  textSourceClassName?: string;
  textSourceClasses?: string[];
  buttonSourceClassName?: string;
  buttonSourceClasses?: string[];
};

export type PreviewContent = {
  sectionEyebrow?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  rootTagName?: string;
  rootClassName?: string;
  rootClasses?: string[];
  sectionTitleSourceTagName?: string;
  sectionTitleSourceClassName?: string;
  sectionTitleSourceClasses?: string[];
  sectionSubtitleSourceTagName?: string;
  sectionSubtitleSourceClassName?: string;
  sectionSubtitleSourceClasses?: string[];
  outsideText: string[];
  items: PreviewItem[];
  theme: PreviewTheme;
};

export type PreviewTheme = {
  mode: "light" | "dark";
  sectionBackground: string;
  cardBackground: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  accentColor: string;
  borderRadius: string;
  cardShadow?: string;
  cardPadding?: string;
  fontFamily?: string;
  headingFontSize?: string;
  bodyFontSize?: string;
  buttonBackground?: string;
  buttonColor?: string;
  buttonBorderRadius?: string;
};

const VALUE_PATTERN = /(?:[$€£]\s?\d+(?:[.,]\d+)?[kKmM]?|\d+(?:[.,]\d+)?\s?(?:%|\+|k|K|m|M|x|X))/;
const PRICE_PATTERN = /(?:[$€£]\s?\d+(?:[.,]\d+)?(?:\/\w+)?|\d+(?:[.,]\d+)?\s?(?:USD|EUR|KZT))/i;
const CTA_PATTERN = /\b(get started|start|try|learn more|book|contact|sign up|subscribe|buy|choose|request|join|download|apply|learn more)\b/i;

export function extractPreviewContent(args: {
  capture: RectangleCapture | null;
  aiResult?: AIUnderstandingResult | null;
}): PreviewContent {
  try {
    const elements = normalizeElements(args.capture?.matchedElements ?? []);
    const sectionType = args.aiResult?.sectionType ?? "unknown";
    const theme = detectPreviewTheme(elements, args.capture?.styleContext);
    const rootMeta = findRootMeta(args.capture?.matchedElements ?? []);

    if (!elements.length) {
      return {
        outsideText: [],
        items: [],
        theme,
        ...rootMeta
      };
    }

    const sectionHeading = findSectionHeading(elements);
    const sectionTitle = sectionHeading ? truncateText(sectionHeading.text, 120) : undefined;
    const sectionEyebrow = sectionHeading
      ? findSectionEyebrow(elements, sectionHeading)
      : undefined;
    const sectionSubtitle = sectionHeading
      ? findSectionSubtitle(elements, sectionHeading)
      : undefined;
    const reservedTexts = new Set(
      [sectionEyebrow, sectionTitle, sectionSubtitle]
        .filter((text): text is string => Boolean(text))
        .map((text) => text.toLowerCase())
    );
    const cardGroups = extractRepeatedCardItems(elements, reservedTexts, theme);
    const items =
      cardGroups.length >= 2
        ? cardGroups
        : sectionType === "stats"
          ? extractStatsItems(elements, reservedTexts)
          : sectionType === "pricing"
            ? extractPricingItems(elements, reservedTexts)
            : [];
    const outsideText = extractOutsideText(elements, reservedTexts, items);

    return {
      sectionEyebrow,
      sectionTitle,
      sectionSubtitle,
      ...rootMeta,
      sectionTitleSourceTagName: sectionHeading?.tagName,
      sectionTitleSourceClassName: filteredClassName(sectionHeading?.className),
      sectionTitleSourceClasses: filteredClasses(sectionHeading?.className),
      sectionSubtitleSourceTagName: findElementByText(elements, sectionSubtitle)?.tagName,
      sectionSubtitleSourceClassName: filteredClassName(findElementByText(elements, sectionSubtitle)?.className),
      sectionSubtitleSourceClasses: filteredClasses(findElementByText(elements, sectionSubtitle)?.className),
      outsideText,
      items: limitItems(items),
      theme
    };
  } catch {
    return {
      outsideText: [],
      items: [],
      theme: lightTheme()
    };
  }
}

function normalizeElements(elements: MatchedElement[]) {
  const seen = new Set<string>();

  return elements
    .filter((element) => element.rect.width > 0 && element.rect.height > 0)
    .map((element) => ({
      ...element,
      text: cleanText(element.text)
    }))
    .filter((element) => element.text.length > 1)
    .filter((element) => {
      const key = `${element.tagName}:${element.text.toLowerCase()}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
}

function findRootMeta(elements: MatchedElement[]) {
  const root = elements
    .filter((element) => ["section", "article", "main", "div"].includes(element.tagName))
    .sort((a, b) => b.rect.width * b.rect.height - a.rect.width * a.rect.height)[0];

  return {
    rootTagName: root?.tagName,
    rootClassName: filteredClassName(root?.className),
    rootClasses: filteredClasses(root?.className)
  };
}

function findElementByText(elements: MatchedElement[], text: string | undefined) {
  if (!text) {
    return undefined;
  }

  const normalized = text.toLowerCase();
  return elements.find(
    (element) =>
      element.text.toLowerCase() === normalized ||
      element.text.toLowerCase().includes(normalized)
  );
}

function filteredClassName(className: string | null | undefined) {
  const classes = filteredClasses(className);
  return classes?.length ? classes.join(" ") : undefined;
}

function filteredClasses(className: string | null | undefined) {
  if (!className) {
    return undefined;
  }

  const classes = className
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => value.length <= 64)
    .filter((value) => /^[A-Za-z0-9:_/-]+$/.test(value))
    .filter((value) => !/[a-f0-9]{18,}/i.test(value))
    .slice(0, 10);

  return classes.length ? classes : undefined;
}

function findSectionHeading(elements: MatchedElement[]) {
  const headings = elements.filter(isLikelyHeading);

  if (!headings.length) {
    return undefined;
  }

  return headings
    .map((element, index) => ({
      element,
      score:
        headingLevelScore(element) +
        element.rect.width * 0.02 +
        element.rect.height * 0.8 -
        index * 20 -
        element.rect.top * 0.08
    }))
    .sort((a, b) => b.score - a.score)[0]?.element;
}

function findSectionSubtitle(elements: MatchedElement[], heading: MatchedElement) {
  const candidates = elements
    .filter((element) => element !== heading)
    .filter((element) => !isLikelyHeading(element))
    .filter((element) => !isButtonLike(element))
    .filter((element) => element.text.length > 20)
    .filter((element) => element.text.length <= 240)
    .filter((element) => element.rect.top >= heading.rect.top)
    .map((element) => ({
      element,
      distance: rectDistance(heading, element),
      vertical: Math.abs(element.rect.top - heading.rect.bottom)
    }))
    .sort((a, b) => a.vertical + a.distance * 0.1 - (b.vertical + b.distance * 0.1));

  return candidates[0] ? truncateText(candidates[0].element.text, 180) : undefined;
}

function findSectionEyebrow(elements: MatchedElement[], heading: MatchedElement) {
  const candidate = elements
    .filter((element) => element !== heading)
    .filter((element) => element.text.length <= 48)
    .filter((element) => element.rect.bottom <= heading.rect.top + 8)
    .filter((element) => Math.abs(element.rect.left - heading.rect.left) < Math.max(120, heading.rect.width * 0.4))
    .sort((a, b) => Math.abs(a.rect.bottom - heading.rect.top) - Math.abs(b.rect.bottom - heading.rect.top))[0];

  return candidate ? truncateText(candidate.text, 48) : undefined;
}

function extractOutsideText(
  elements: MatchedElement[],
  reservedTexts: Set<string>,
  items: PreviewItem[]
) {
  const itemText = new Set(
    items
      .flatMap((item) => [item.title, item.description, item.eyebrow, item.cta, item.value])
      .filter((text): text is string => Boolean(text))
      .map((text) => text.toLowerCase())
  );
  const seen = new Set<string>();

  return elements
    .filter((element) => !isLikelyHeading(element))
    .filter((element) => !isButtonLike(element))
    .filter((element) => !isIconLikeElement(element))
    .map((element) => element.text)
    .filter((text) => text.length > 12)
    .filter((text) => !reservedTexts.has(text.toLowerCase()))
    .filter((text) => !itemText.has(text.toLowerCase()))
    .filter((text) => {
      const key = text.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, 3)
    .map((text) => truncateText(text, 180));
}

function extractRepeatedCardItems(
  elements: MatchedElement[],
  reservedTexts: Set<string>,
  theme: PreviewTheme
) {
  const candidates = elements
    .filter((element) => isCardContainerCandidate(element, elements, reservedTexts, theme))
    .map((element) => ({
      element,
      score: cardContainerScore(element, elements, theme)
    }))
    .sort((a, b) => b.score - a.score);
  const selected: MatchedElement[] = [];

  candidates.forEach(({ element }) => {
    if (selected.some((existing) => rectContains(existing, element) || rectContains(element, existing))) {
      return;
    }

    selected.push(element);
  });

  const group = pickBestCardGroup(selected);

  return group
    .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left)
    .map((card, index) => buildPreviewItemFromCard(card, elements, reservedTexts, theme, index))
    .filter((item): item is PreviewItem => Boolean(item));
}

function isCardContainerCandidate(
  element: MatchedElement,
  elements: MatchedElement[],
  reservedTexts: Set<string>,
  theme: PreviewTheme
) {
  const tagName = element.tagName.toLowerCase();

  if (!["article", "li", "div", "section"].includes(tagName)) {
    return false;
  }

  if (!element.text || reservedTexts.has(element.text.toLowerCase())) {
    return false;
  }

  if ([...reservedTexts].some((text) => text && element.text.toLowerCase().includes(text))) {
    return false;
  }

  const area = element.rect.width * element.rect.height;
  const fullArea = Math.max(...elements.map((candidate) => candidate.rect.width * candidate.rect.height));

  if (area < 6000 || area > fullArea * 0.72) {
    return false;
  }

  return cardContainerScore(element, elements, theme) >= 2;
}

function cardContainerScore(
  element: MatchedElement,
  elements: MatchedElement[],
  theme: PreviewTheme
) {
  const childElements = elements.filter((candidate) => candidate !== element && rectContains(element, candidate));
  const backgroundDiffers =
    Boolean(element.style.backgroundColor) &&
    element.style.backgroundColor !== "transparent" &&
    element.style.backgroundColor !== theme.sectionBackground;
  const hasRadius = Number.parseFloat(element.style.borderRadius) > 0;
  const hasBorder = hasVisibleBorderColor(element.style.borderColor);
  const hasShadow = element.style.boxShadow && element.style.boxShadow !== "none";
  const hasPadding = Number.parseFloat(element.style.padding) >= 4;
  const hasIcon = childElements.some(isIconLikeElement);
  const hasHeadingTextPair =
    childElements.some(isLikelyHeading) &&
    childElements.some((candidate) => !isLikelyHeading(candidate) && !isIconLikeElement(candidate) && candidate.text.length > 8);
  const similarSiblingCount = elements.filter(
    (candidate) =>
      candidate !== element &&
      Math.abs(candidate.rect.width - element.rect.width) < element.rect.width * 0.22 &&
      Math.abs(candidate.rect.height - element.rect.height) < element.rect.height * 0.28
  ).length;

  return [
    backgroundDiffers,
    hasRadius,
    hasBorder,
    hasShadow,
    hasPadding,
    hasIcon,
    hasHeadingTextPair,
    similarSiblingCount >= 1
  ].filter(Boolean).length;
}

function pickBestCardGroup(candidates: MatchedElement[]) {
  if (candidates.length < 2) {
    return [];
  }

  const groups = candidates.map((anchor) => {
    const group = candidates.filter(
      (candidate) =>
        Math.abs(candidate.rect.width - anchor.rect.width) < anchor.rect.width * 0.28 &&
        Math.abs(candidate.rect.height - anchor.rect.height) < anchor.rect.height * 0.42
    );

    return group;
  });

  return groups
    .filter((group) => group.length >= 2)
    .sort((a, b) => b.length - a.length || averageTop(a) - averageTop(b))[0] ?? [];
}

function buildPreviewItemFromCard(
  card: MatchedElement,
  elements: MatchedElement[],
  reservedTexts: Set<string>,
  theme: PreviewTheme,
  index: number
): PreviewItem | null {
  const children = elements
    .filter((element) => element !== card && rectContains(card, element))
    .filter((element) => !reservedTexts.has(element.text.toLowerCase()))
    .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
  const titleElement =
    children.find((element) => isLikelyHeading(element) && element.text.length <= 96) ??
    children.find((element) => !isIconLikeElement(element) && !isButtonLike(element) && element.text.length <= 96);
  const title = titleElement?.text ?? firstCardLine(card.text);

  if (!title || reservedTexts.has(title.toLowerCase())) {
    return null;
  }

  const description = children.find(
    (element) =>
      element !== titleElement &&
      !isLikelyHeading(element) &&
      !isButtonLike(element) &&
      !isIconLikeElement(element) &&
      element.text.length > 8 &&
      !reservedTexts.has(element.text.toLowerCase())
  )?.text;
  const cta = children.find(isButtonLike)?.text;
  const ctaElement = children.find(isButtonLike);
  const eyebrow = children.find(
    (element) =>
      element !== titleElement &&
      element.rect.top < (titleElement?.rect.top ?? card.rect.top + card.rect.height) &&
      element.text.length <= 32 &&
      !isIconLikeElement(element)
  )?.text;

  return {
    id: `card-${index}`,
    title: truncateText(title, 80),
    description: description ? truncateText(description, 180) : undefined,
    eyebrow: eyebrow && eyebrow !== title ? truncateText(eyebrow, 40) : undefined,
    cta: cta ? truncateText(cta, 40) : undefined,
    rawText: card.text,
    icon: detectPreviewIcon(card, children, titleElement, theme),
    sourceTagName: card.tagName,
    sourceClassName: filteredClassName(card.className),
    sourceClasses: filteredClasses(card.className),
    sourceRole: "card",
    titleSourceTagName: titleElement?.tagName,
    titleSourceClassName: filteredClassName(titleElement?.className),
    titleSourceClasses: filteredClasses(titleElement?.className),
    textSourceClassName: filteredClassName(description ? findElementByText(children, description)?.className : null),
    textSourceClasses: filteredClasses(description ? findElementByText(children, description)?.className : null),
    buttonSourceClassName: filteredClassName(ctaElement?.className),
    buttonSourceClasses: filteredClasses(ctaElement?.className)
  };
}

function detectPreviewIcon(
  card: MatchedElement,
  children: MatchedElement[],
  titleElement: MatchedElement | undefined,
  theme: PreviewTheme
): PreviewIcon | undefined {
  const iconElement = children.find(isIconLikeElement);

  if (!iconElement) {
    return undefined;
  }

  const position =
    titleElement && iconElement.rect.right <= titleElement.rect.left + 16
      ? "left"
      : iconElement.rect.bottom <= (titleElement?.rect.top ?? card.rect.top + card.rect.height / 2)
        ? "top"
        : "inline";

  return {
    exists: true,
    type:
      iconElement.tagName === "svg"
        ? "svg"
        : iconElement.tagName === "img"
          ? "image"
          : "unknown",
    color: iconElement.style.color || theme.accentColor,
    position
  };
}

function rectContains(parent: MatchedElement, child: MatchedElement) {
  const x = child.rect.left + child.rect.width / 2;
  const y = child.rect.top + child.rect.height / 2;

  return (
    x >= parent.rect.left &&
    x <= parent.rect.right &&
    y >= parent.rect.top &&
    y <= parent.rect.bottom
  );
}

function averageTop(elements: MatchedElement[]) {
  return elements.reduce((sum, element) => sum + element.rect.top, 0) / elements.length;
}

function hasVisibleBorderColor(value: string | undefined) {
  return Boolean(value && value !== "transparent" && value !== "rgba(0, 0, 0, 0)");
}

function isIconLikeElement(element: MatchedElement) {
  const tagName = element.tagName.toLowerCase();

  return (
    tagName === "svg" ||
    tagName === "img" ||
    (element.rect.width <= 80 &&
      element.rect.height <= 80 &&
      element.text.length <= 4 &&
      (tagName === "span" || tagName === "i"))
  );
}

function firstCardLine(text: string) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+|\s{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)[0];
}

function extractStatsItems(elements: MatchedElement[], reservedTexts: Set<string>) {
  const valueElements = elements.filter(
    (element) => VALUE_PATTERN.test(element.text) && !reservedTexts.has(element.text.toLowerCase())
  );

  return valueElements.map((valueElement, index) => {
    const label = findNearbyDescription(elements, valueElement, {
      excludeValues: true,
      maxLength: 120
    });

    return {
      id: `stat-${index}`,
      title: label ? truncateText(label, 70) : `Metric ${index + 1}`,
      value: truncateText(valueElement.text, 40),
      rawText: [valueElement.text, label].filter(Boolean).join(" "),
      sourceTagName: valueElement.tagName,
      sourceClassName: filteredClassName(valueElement.className),
      sourceClasses: filteredClasses(valueElement.className),
      sourceRole: "stat" as const
    };
  });
}

function extractPricingItems(elements: MatchedElement[], reservedTexts: Set<string>) {
  const headings = elements
    .filter(isLikelyHeading)
    .filter((element) => !reservedTexts.has(element.text.toLowerCase()));
  const prices = elements.filter((element) => PRICE_PATTERN.test(element.text));
  const buttons = elements.filter((element) => isButtonLike(element));
  const count = Math.max(2, Math.min(4, headings.length || prices.length || 3));
  const items: PreviewItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const anchor = headings[index] ?? prices[index];
    const title = headings[index]?.text || `Plan ${index + 1}`;
    const value = prices[index]?.text;
    const description = findNearbyDescription(elements, anchor, {
      excludeValues: true,
      maxLength: 160
    });
    const cta = anchor ? findNearestButton(buttons, anchor)?.text : buttons[index]?.text;

    items.push({
      id: `pricing-${index}`,
      title: truncateText(title, 80),
      value: value ? truncateText(value, 50) : undefined,
      description: description ? truncateText(description, 160) : undefined,
      cta: cta ? truncateText(cta, 40) : undefined,
      rawText: [title, value, description, cta].filter(Boolean).join(" "),
      sourceTagName: anchor?.tagName,
      sourceClassName: filteredClassName(anchor?.className),
      sourceClasses: filteredClasses(anchor?.className),
      sourceRole: "card" as const,
      titleSourceTagName: headings[index]?.tagName,
      titleSourceClassName: filteredClassName(headings[index]?.className),
      titleSourceClasses: filteredClasses(headings[index]?.className)
    });
  }

  return items;
}

function fallbackItems(rawText: string, sectionType = "unknown") {
  const chunks = splitIntoChunks(rawText).filter((chunk) => chunk.length <= 180);

  if (!chunks.length) {
    return [];
  }

  return [0, 1, 2].flatMap((index) => {
    const title = chunks[index * 2];

    if (!title) {
      return [];
    }

    return {
    id: `fallback-${index}`,
      title: truncateText(title, 80),
    description: chunks[index * 2 + 1]
      ? truncateText(chunks[index * 2 + 1], 160)
      : undefined,
    rawText: chunks[index] ?? "",
    sourceRole: "unknown" as const
    };
  });
}

function findNearbyDescription(
  elements: MatchedElement[],
  anchor: MatchedElement | undefined,
  options: {
    excludeValues?: boolean;
    maxLength?: number;
  } = {}
) {
  if (!anchor) {
    return undefined;
  }

  const maxLength = options.maxLength ?? 220;
  const candidates = elements
    .filter((element) => element !== anchor)
    .filter((element) => !isLikelyHeading(element))
    .filter((element) => !isButtonLike(element))
    .filter((element) => element.text !== anchor.text)
    .filter((element) => element.text.length > 8)
    .filter((element) => element.text.length <= maxLength)
    .filter((element) => (options.excludeValues ? !VALUE_PATTERN.test(element.text) : true))
    .map((element) => ({
      element,
      score:
        rectDistance(anchor, element) +
        (element.rect.top >= anchor.rect.top ? -80 : 60) +
        Math.abs(element.rect.left - anchor.rect.left) * 0.4
    }))
    .sort((a, b) => a.score - b.score);

  return candidates[0]?.element.text;
}

function findNearestButton(buttons: MatchedElement[], anchor: MatchedElement) {
  return buttons
    .map((button) => ({
      button,
      distance: rectDistance(anchor, button)
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.button;
}

function detectPreviewTheme(
  elements: MatchedElement[],
  styleContext?: StyleContext
): PreviewTheme {
  if (styleContext) {
    return themeFromStyleContext(styleContext, elements);
  }

  const backgroundSamples = elements
    .map((element) => parseRgb(element.style.backgroundColor))
    .filter((color): color is RGB => Boolean(color));
  const textSamples = elements
    .map((element) => parseRgb(element.style.color))
    .filter((color): color is RGB => Boolean(color));
  const radii = elements
    .map((element) => Number.parseFloat(element.style.borderRadius))
    .filter((radius) => Number.isFinite(radius) && radius > 0);
  const background = backgroundSamples[0] ?? { r: 255, g: 255, b: 255 };
  const isLight = luminance(background) > 0.55;
  const text = textSamples[0] ?? (isLight ? { r: 15, g: 23, b: 42 } : { r: 248, g: 250, b: 252 });

  return {
    mode: isLight ? "light" : "dark",
    sectionBackground: rgbToCss(background),
    cardBackground: isLight ? "rgba(255, 255, 255, 0.92)" : "rgba(15, 23, 42, 0.88)",
    textColor: rgbToCss(text),
    mutedTextColor: isLight ? "rgba(71, 85, 105, 0.95)" : "rgba(203, 213, 225, 0.9)",
    borderColor: isLight ? "rgba(148, 163, 184, 0.45)" : "rgba(71, 85, 105, 0.75)",
    accentColor: isLight ? "rgb(8, 145, 178)" : "rgb(103, 232, 249)",
    borderRadius: `${Math.min(Math.max(Math.round(radii[0] ?? 14), 6), 24)}px`
  };
}

function themeFromStyleContext(
  styleContext: StyleContext,
  elements: MatchedElement[]
): PreviewTheme {
  const fallback = detectPreviewTheme(elements);
  const mode = styleContext.theme;
  const sectionBackground =
    styleContext.section.backgroundColor ?? fallback.sectionBackground;
  const textColor =
    styleContext.text.headingColor ??
    styleContext.section.color ??
    fallback.textColor;
  const cardBackground =
    styleContext.card.backgroundColor ??
    (mode === "light" ? "rgba(255, 255, 255, 0.94)" : "rgba(15, 23, 42, 0.86)");
  const cardBorderColor =
    styleContext.card.borderColor ??
    styleContext.accent.borderColor ??
    fallback.borderColor;

  return {
    mode,
    sectionBackground,
    cardBackground,
    textColor,
    mutedTextColor:
      styleContext.text.mutedColor ??
      styleContext.text.bodyColor ??
      fallback.mutedTextColor,
    borderColor: cardBorderColor,
    accentColor:
      styleContext.accent.color ??
      styleContext.accent.backgroundColor ??
      fallback.accentColor,
    borderRadius:
      styleContext.card.borderRadius ??
      styleContext.section.borderRadius ??
      fallback.borderRadius,
    cardShadow: styleContext.card.boxShadow,
    cardPadding: styleContext.card.padding,
    fontFamily:
      styleContext.text.fontFamily ??
      styleContext.section.fontFamily,
    headingFontSize: styleContext.text.headingFontSize,
    bodyFontSize: styleContext.text.bodyFontSize,
    buttonBackground:
      styleContext.button?.backgroundColor ??
      styleContext.accent.backgroundColor ??
      styleContext.accent.color,
    buttonColor: styleContext.button?.color,
    buttonBorderRadius: styleContext.button?.borderRadius
  };
}

function lightTheme(): PreviewTheme {
  return {
    mode: "light",
    sectionBackground: "rgb(248, 250, 252)",
    cardBackground: "rgba(255, 255, 255, 0.94)",
    textColor: "rgb(15, 23, 42)",
    mutedTextColor: "rgba(71, 85, 105, 0.95)",
    borderColor: "rgba(148, 163, 184, 0.45)",
    accentColor: "rgb(8, 145, 178)",
    borderRadius: "14px"
  };
}

type RGB = {
  r: number;
  g: number;
  b: number;
};

function parseRgb(value: string): RGB | null {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i);

  if (!match || match[4] === "0") {
    return null;
  }

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3])
  };
}

function luminance(color: RGB) {
  const [r, g, b] = [color.r, color.g, color.b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rgbToCss(color: RGB) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function rectDistance(a: MatchedElement, b: MatchedElement) {
  const ax = a.rect.left + a.rect.width / 2;
  const ay = a.rect.top + a.rect.height / 2;
  const bx = b.rect.left + b.rect.width / 2;
  const by = b.rect.top + b.rect.height / 2;

  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function isLikelyHeading(element: MatchedElement) {
  const tagName = element.tagName.toLowerCase();
  const fontWeight = Number.parseInt(element.style.fontWeight, 10);

  return (
    /^h[1-6]$/.test(tagName) ||
    element.role === "heading" ||
    (Number.isFinite(fontWeight) && fontWeight >= 600 && element.text.length <= 96)
  );
}

function headingLevelScore(element: MatchedElement) {
  const match = element.tagName.toLowerCase().match(/^h([1-6])$/);

  if (!match) {
    return 0;
  }

  return (7 - Number(match[1])) * 100;
}

function isButtonLike(element: MatchedElement) {
  const tagName = element.tagName.toLowerCase();

  return tagName === "button" || element.role === "button" || CTA_PATTERN.test(element.text);
}

function splitIntoChunks(text: string) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+|\s{2,}/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 2)
    .slice(0, 8);
}

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}...` : text;
}

function limitItems(items: PreviewItem[]) {
  return items.filter((item) => item.title).slice(0, 6);
}

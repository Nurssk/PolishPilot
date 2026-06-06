import type { CSSProperties, ReactNode } from "react";
import type { PreviewContent, PreviewItem, PreviewTheme } from "../patterns/extractPreviewItems";
import type { LayoutPatternId } from "../patterns/layoutPatterns";
import type { StyleContext } from "../shared/types";

type LiveLayoutPreviewProps = {
  patternId: LayoutPatternId;
  content: PreviewContent;
  sectionType?: string;
  styleContext?: StyleContext;
  size?: "compact" | "full";
};

export function LiveLayoutPreview({
  patternId,
  content,
  sectionType = "unknown",
  styleContext,
  size = "compact"
}: LiveLayoutPreviewProps) {
  const previewContent = ensureContent(content, sectionType);
  const items = previewContent.items;
  const theme = previewContent.theme;
  const styles = getThemeStyles(theme, styleContext);

  return (
    <section
      className={`overflow-hidden rounded-xl border shadow-pilot ${
        size === "full" ? "min-h-[600px] p-8" : "p-4"
      }`}
      style={styles.frame}
    >
      {previewContent.sectionEyebrow ? (
        <div
          className={`${size === "full" ? "mb-2 text-sm" : "mb-1 text-[11px]"} font-black uppercase tracking-[0.12em]`}
          style={styles.accent}
        >
          {previewContent.sectionEyebrow}
        </div>
      ) : null}
      {previewContent.sectionTitle ? (
        <h2
          className={`${size === "full" ? "text-3xl leading-10" : "text-base leading-6"} font-black`}
          style={styles.text}
        >
          {previewContent.sectionTitle}
        </h2>
      ) : null}
      {previewContent.sectionSubtitle ? (
        <p
          className={`${size === "full" ? "mt-3 max-w-3xl text-base leading-7" : "mt-1 text-xs leading-5"}`}
          style={styles.mutedText}
        >
          {previewContent.sectionSubtitle}
        </p>
      ) : null}
      <div
        className={
          previewContent.sectionTitle || previewContent.sectionSubtitle
            ? size === "full"
              ? "mt-8"
              : "mt-4"
            : ""
        }
      >
        {renderPatternCards(patternId, items, styles, size)}
      </div>
      {previewContent.outsideText.length ? (
        <div className={size === "full" ? "mt-8 space-y-3" : "mt-4 space-y-2"}>
          {previewContent.outsideText.map((text) => (
            <p
              className={size === "full" ? "text-base leading-7" : "text-xs leading-5"}
              key={text}
              style={styles.mutedText}
            >
              {text}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function renderPatternCards(
  patternId: LayoutPatternId,
  items: PreviewItem[],
  styles: PreviewStyles,
  size: "compact" | "full"
) {
  const previewKey = patternId as string;
  const gap = size === "full" ? "gap-5" : "gap-2";

  if (!items.length) {
    return (
      <div className="rounded-lg border p-3 text-xs leading-5" style={styles.card}>
        No repeated card content was detected in this selection.
      </div>
    );
  }

  if (previewKey === "featured-side-stack") {
    return (
      <div className={`grid ${gap} sm:grid-cols-[1.25fr_0.75fr]`}>
        <PreviewCard item={items[0]} size={size} strong styles={styles} />
        <div className={`grid ${gap}`}>
          {items.slice(1, 3).map((item) => (
            <PreviewCard compact item={item} key={item.id} size={size} styles={styles} />
          ))}
        </div>
      </div>
    );
  }

  if (previewKey === "bento-grid") {
    return (
      <div className={`grid ${gap} sm:grid-cols-2`}>
        <PreviewCard className="sm:row-span-2" item={items[0]} size={size} strong styles={styles} />
        {items.slice(1, 4).map((item) => (
          <PreviewCard compact item={item} key={item.id} size={size} styles={styles} />
        ))}
      </div>
    );
  }

  if (previewKey === "center-highlight") {
    return (
      <div className={size === "full" ? "space-y-5" : "space-y-2"}>
        <PreviewCard className="mx-auto max-w-[88%]" item={items[0]} size={size} strong styles={styles} />
        <div className={`grid ${gap} sm:grid-cols-2`}>
          {items.slice(1, 5).map((item) => (
            <PreviewCard compact item={item} key={item.id} size={size} styles={styles} />
          ))}
        </div>
      </div>
    );
  }

  if (previewKey === "workflow-feature-grid") {
    return (
      <div className={`grid ${gap} sm:grid-cols-3`}>
        {items.slice(0, 4).map((item, index) => (
          <PreviewCard
            eyebrow={`0${index + 1}`}
            item={item}
            key={item.id}
            size={size}
            styles={styles}
          />
        ))}
      </div>
    );
  }

  if (previewKey === "pricing-emphasis") {
    return (
      <div className={`grid ${gap} sm:grid-cols-3`}>
        {items.slice(0, 3).map((item, index) => (
          <PricingCard emphasized={index === 1} item={item} key={item.id} size={size} styles={styles} />
        ))}
      </div>
    );
  }

  if (
    previewKey === "stats-highlight" ||
    previewKey === "hero-metric-support-stats" ||
    previewKey === "metric-bento"
  ) {
    return (
      <div className={`grid ${gap} sm:grid-cols-[1.15fr_0.85fr]`}>
        <StatCard item={items[0]} size={size} strong styles={styles} />
        <div className={`grid ${gap}`}>
          {items.slice(1, 5).map((item) => (
            <StatCard item={item} key={item.id} size={size} styles={styles} />
          ))}
        </div>
      </div>
    );
  }

  if (previewKey === "split-hero") {
    return (
      <div className={`grid ${size === "full" ? "gap-8" : "gap-3"} sm:grid-cols-[0.95fr_1.05fr] sm:items-center`}>
        <HeroCopy item={items[0]} size={size} styles={styles} />
        <ProductPanel items={items.slice(1, 4)} size={size} styles={styles} />
      </div>
    );
  }

  if (previewKey === "hero-product-preview") {
    return (
      <div className="space-y-3">
        <div className="text-center">
          <HeroCopy centered item={items[0]} size={size} styles={styles} />
        </div>
        <ProductPanel items={items.slice(1, 5)} size={size} styles={styles} />
      </div>
    );
  }

  if (previewKey === "split-cta") {
    return (
      <div className={`grid ${size === "full" ? "gap-8" : "gap-3"} sm:grid-cols-[1fr_0.85fr] sm:items-center`}>
        <HeroCopy item={items[0]} size={size} styles={styles} />
        <div className={`grid ${gap}`}>
          {items.slice(1, 4).map((item) => (
            <PreviewCard compact item={item} key={item.id} size={size} styles={styles} />
          ))}
        </div>
      </div>
    );
  }

  if (previewKey === "form-benefits-sidebar") {
    return (
      <div className={`grid ${size === "full" ? "gap-8" : "gap-3"} sm:grid-cols-[0.9fr_1.1fr]`}>
        <div className={`grid ${gap}`}>
          {items.slice(0, 3).map((item) => (
            <BenefitRow item={item} key={item.id} size={size} styles={styles} />
          ))}
        </div>
        <FakeForm styles={styles} />
      </div>
    );
  }

  return (
    <div className={`grid ${gap} sm:grid-cols-2`}>
      {items.slice(0, 6).map((item, index) => (
        <PreviewCard item={item} key={item.id} size={size} strong={index === 0} styles={styles} />
      ))}
    </div>
  );
}

type PreviewStyles = {
  frame: CSSProperties;
  card: CSSProperties;
  strongCard: CSSProperties;
  text: CSSProperties;
  mutedText: CSSProperties;
  accent: CSSProperties;
  button: CSSProperties;
};

function getThemeStyles(theme: PreviewTheme, styleContext?: StyleContext): PreviewStyles {
  return {
    frame: {
      background: theme.sectionBackground,
      borderColor: theme.borderColor,
      color: theme.textColor,
      fontFamily: theme.fontFamily ?? styleContext?.section.fontFamily
    },
    card: {
      background: theme.cardBackground,
      borderColor: theme.borderColor,
      borderRadius: theme.borderRadius,
      color: theme.textColor,
      boxShadow: theme.cardShadow ?? styleContext?.card.boxShadow,
      padding: theme.cardPadding ?? styleContext?.card.padding
    },
    strongCard: {
      background: theme.cardBackground,
      borderColor: theme.accentColor,
      borderRadius: theme.borderRadius,
      color: theme.textColor,
      boxShadow: theme.cardShadow ?? styleContext?.card.boxShadow,
      padding: theme.cardPadding ?? styleContext?.card.padding
    },
    text: {
      color: styleContext?.text.headingColor ?? theme.textColor,
      fontFamily: theme.fontFamily ?? styleContext?.text.fontFamily,
      fontSize: theme.headingFontSize
    },
    mutedText: {
      color: styleContext?.text.mutedColor ?? theme.mutedTextColor,
      fontFamily: theme.fontFamily ?? styleContext?.text.fontFamily,
      fontSize: theme.bodyFontSize,
      lineHeight: styleContext?.text.lineHeight
    },
    accent: {
      color: theme.accentColor
    },
    button: {
      background: theme.buttonBackground ?? theme.accentColor,
      color:
        theme.buttonColor ??
        (theme.mode === "light" ? "white" : "rgb(8, 47, 73)"),
      borderRadius: theme.buttonBorderRadius ?? theme.borderRadius
    }
  };
}

function PreviewCard({
  item,
  styles,
  size,
  strong = false,
  compact = false,
  className = "",
  eyebrow
}: {
  item: PreviewItem;
  styles: PreviewStyles;
  size: "compact" | "full";
  strong?: boolean;
  compact?: boolean;
  className?: string;
  eyebrow?: string;
}) {
  return (
    <article
      className={`border shadow-sm ${compact ? "p-2.5" : "p-3"} ${className}`}
      style={strong ? styles.strongCard : styles.card}
    >
      {item.icon?.exists ? <IconPlaceholder item={item} styles={styles} /> : null}
      {eyebrow ?? item.eyebrow ? (
        <p
          className={`${size === "full" ? "mb-2 text-xs" : "mb-1 text-[10px]"} font-semibold uppercase tracking-[0.12em]`}
          style={styles.accent}
        >
          {eyebrow ?? item.eyebrow}
        </p>
      ) : null}
      <h4
        className={`${size === "full" ? (strong ? "text-xl leading-7" : "text-lg leading-6") : strong ? "text-sm leading-5" : "text-xs leading-5"} font-bold`}
        style={styles.text}
      >
        {item.title}
      </h4>
      {item.description ? (
        <p
          className={`${size === "full" ? "mt-3 text-sm leading-6" : "mt-1 line-clamp-3 text-[11px] leading-4"}`}
          style={styles.mutedText}
        >
          {item.description}
        </p>
      ) : null}
      {item.cta ? (
        <p className={`${size === "full" ? "mt-4 text-sm" : "mt-2 text-[11px]"} font-bold`} style={styles.accent}>
          {item.cta}
        </p>
      ) : null}
    </article>
  );
}

function IconPlaceholder({ item, styles }: { item: PreviewItem; styles: PreviewStyles }) {
  const iconStyle: CSSProperties = {
    backgroundColor: "transparent",
    borderColor: item.icon?.color ?? styles.accent.color,
    color: item.icon?.color ?? styles.accent.color
  };

  return (
    <div
      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border-2 text-xs font-black ${
        item.icon?.position === "left" ? "float-left mr-3" : ""
      }`}
      style={iconStyle}
    >
      ·
    </div>
  );
}

function PricingCard({
  item,
  emphasized,
  size,
  styles
}: {
  item: PreviewItem;
  emphasized: boolean;
  size: "compact" | "full";
  styles: PreviewStyles;
}) {
  return (
    <article
      className="border p-3 shadow-sm"
      style={emphasized ? styles.strongCard : styles.card}
    >
      {emphasized ? (
        <span className="mb-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black" style={styles.button}>
          Recommended
        </span>
      ) : null}
      <h4 className={`${size === "full" ? "text-lg" : "text-xs"} font-bold`} style={styles.text}>
        {item.title}
      </h4>
      {item.value ? (
        <p className={`${size === "full" ? "mt-4 text-3xl" : "mt-2 text-lg"} font-black`} style={styles.text}>
          {item.value}
        </p>
      ) : null}
      {item.description ? (
        <p className={`${size === "full" ? "mt-3 text-sm leading-6" : "mt-1 line-clamp-3 text-[11px] leading-4"}`} style={styles.mutedText}>
          {item.description}
        </p>
      ) : null}
      {item.cta ? (
        <div className="mt-3 rounded-md px-2 py-1 text-center text-[11px] font-bold" style={styles.button}>
          {item.cta}
        </div>
      ) : null}
    </article>
  );
}

function StatCard({
  item,
  styles,
  size,
  strong = false
}: {
  item: PreviewItem;
  styles: PreviewStyles;
  size: "compact" | "full";
  strong?: boolean;
}) {
  return (
    <article className={`border ${strong ? "p-4" : "p-3"}`} style={strong ? styles.strongCard : styles.card}>
      <p className={`${size === "full" ? (strong ? "text-5xl" : "text-3xl") : strong ? "text-2xl" : "text-lg"} font-black tracking-tight`} style={styles.text}>
        {item.value ?? item.title}
      </p>
      <p className={`${size === "full" ? "mt-3 text-sm leading-6" : "mt-1 text-[11px] leading-4"} font-semibold`} style={styles.mutedText}>
        {item.value ? item.title : item.description}
      </p>
    </article>
  );
}

function HeroCopy({
  item,
  styles,
  size,
  centered = false
}: {
  item: PreviewItem;
  styles: PreviewStyles;
  size: "compact" | "full";
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-sm" : ""}>
      <h4 className={`${size === "full" ? "text-3xl leading-10" : "text-base leading-5"} font-black`} style={styles.text}>
        {item.title}
      </h4>
      {item.description ? (
        <p className={`${size === "full" ? "mt-4 text-base leading-7" : "mt-2 text-xs leading-5"}`} style={styles.mutedText}>
          {item.description}
        </p>
      ) : null}
      {item.cta ? (
        <button className="mt-3 rounded-lg px-3 py-2 text-xs font-black" style={styles.button} type="button">
          {item.cta}
        </button>
      ) : null}
    </div>
  );
}

function ProductPanel({
  items,
  styles,
  size
}: {
  items: PreviewItem[];
  styles: PreviewStyles;
  size: "compact" | "full";
}) {
  const panelItems = items.length ? items.slice(0, 3) : [];

  return (
    <div className="border p-3" style={styles.card}>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-300/80" />
        <span className="h-2 w-2 rounded-full bg-yellow-300/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
      </div>
      <div className="grid gap-2">
        {panelItems.map((item, index) => (
          <PreviewCard
            compact
            item={item}
            key={item.id}
            size={size}
            strong={index === 0}
            styles={styles}
          />
        ))}
        {!panelItems.length ? (
          <p className="text-[11px] leading-4" style={styles.mutedText}>
            No supporting cards detected.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function BenefitRow({
  item,
  styles,
  size
}: {
  item: PreviewItem;
  styles: PreviewStyles;
  size: "compact" | "full";
}) {
  return <PreviewCard compact item={item} size={size} styles={styles} />;
}

function FakeForm({ styles }: { styles: PreviewStyles }) {
  return (
    <div className="border p-3" style={styles.card}>
      <div className="space-y-2">
        <div className="h-7 rounded-md border" style={{ borderColor: styles.card.borderColor }} />
        <div className="h-7 rounded-md border" style={{ borderColor: styles.card.borderColor }} />
        <div className="h-14 rounded-md border" style={{ borderColor: styles.card.borderColor }} />
        <div className="h-8 rounded-md" style={styles.button} />
      </div>
    </div>
  );
}

function ensureContent(content: PreviewContent, sectionType: string): PreviewContent {
  return content;
}

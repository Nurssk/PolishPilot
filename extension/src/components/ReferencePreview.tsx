import { useState, type ReactNode } from "react";

export function ReferencePreview({
  active,
  children,
  imageUrl,
  title
}: {
  active: boolean;
  children: ReactNode;
  imageUrl?: string;
  title: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl && !imageFailed);

  return (
    <div
      className={`mb-3 h-32 overflow-hidden rounded-lg border ${
        active
          ? "border-pilot-primary/40 bg-pilot-primary/10"
          : "border-pilot-border bg-pilot-surface"
      }`}
    >
      {showImage ? (
        <img
          alt={`${title} preview`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
          referrerPolicy="no-referrer"
          src={imageUrl}
        />
      ) : (
        children
      )}
    </div>
  );
}

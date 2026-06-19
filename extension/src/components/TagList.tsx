export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          className="rounded-md border border-pilot-border bg-pilot-bg px-2 py-0.5 text-[10px] font-medium text-pilot-muted"
          key={tag}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

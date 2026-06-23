export function SectionCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
        <span aria-hidden>{icon}</span>
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">
        {children}
      </div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  if (!items?.length) return <p className="text-slate-400">—</p>;
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function TagList({ items }: { items: string[] }) {
  if (!items?.length) return <p className="text-slate-400">—</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand-dark"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

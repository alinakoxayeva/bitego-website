type Props = { eyebrow: string; title: string; subtitle?: string };

export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-fire">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl text-russet md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-3 text-russet">{subtitle}</p>}
      </div>
    </section>
  );
}
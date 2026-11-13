export default function AuthPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="hidden rounded-3xl bg-forest p-4 text-cream lg:block">
      <img
        src="/images/restaurant.jpg"
        alt="Savor restoranı"
        className="aspect-4/3 w-full rounded-2xl object-cover"
      />
      <h2 className="mt-8 px-4 font-display text-4xl leading-tight">{title}</h2>
      <p className="mt-4 px-4 pb-4 text-sm">{text}</p>
    </div>
  );
}
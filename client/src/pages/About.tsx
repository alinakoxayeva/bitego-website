import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

const values = [
  {
    title: "Təbii məhsullar",
    text: "Mövsümi məhsullar və etibarlı təchizatçılar. Öz süfrəmizə qoymayacağımız heç nəyi sizə göndərmirik.",
  },
  {
    title: "Hazırlanır, hazır gəlmir",
    text: "Biz doğrayırıq, qarışdırırıq, bişiririk və dadına baxırıq. Öz mətbəximizdə, hər gün.",
  },
  {
    title: "Hər kəsə xoş gəlmisiniz",
    text: "Böyük iştahlar, kiçik həvəslər və bitki əsaslı sevimlilər. Sizin üçün həmişə bir stul var.",
  },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:grid-cols-2">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-fire">
              Buyurun, əyləşin
            </p>
            <h1 className="font-display text-5xl leading-[1.05] text-russet md:text-6xl">
              Kiçik mətbəx.
              <br />
              Böyük ürək.
            </h1>
            <p className="mt-6 max-w-md text-russet">
              Biz inanırıq ki, ən yaxşı yeməklər xüsusi bir səbəb tələb etmir. Sadəcə
              təmiz məhsullar, bir az qayğı və onu bölüşəcək biri kifayətdir.
            </p>
            <p className="mt-4 max-w-md text-russet">
              Savor-u məhz buna görə yaratdıq: gündəlik istəklər və aralarındakı
              anlar üçün sizin məhəllənin mətbəxi.
            </p>
          </div>

          <img
            src="/images/restaurant.jpg"
            alt="Savor restoranının interyeri"
            className="aspect-4/3 w-full rounded-3xl object-cover"
          />
        </div>
      </section>

      {/* Dəyərlər */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-fire">
          Necə işləyirik
        </p>
        <h2 className="font-display text-4xl text-russet md:text-5xl">
          Yaxşı yemək yaxşı seçimlərdən başlayır.
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {values.map((v, i) => (
            <div key={v.title}>
              <span className="text-xs font-bold text-fire">0{i + 1}</span>
              <h3 className="mt-2 font-display text-2xl text-russet">{v.title}</h3>
              <p className="mt-3 text-sm text-russet/80">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dəvət bölməsi */}
      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-saffron">
              Masanız sizi gözləyir
            </p>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Yeməyə gəlin.
              <br />
              Bir az da qalın.
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-lg">
              Bakı Şəhəri
              <br />
              Baku, Azerbaijan
            </p>
            <p className="text-sm">
              Hər gün 11:00 – 22:00
              <br />
              Yerində, özünüz götürün və ya biz çatdıraq.
            </p>
            <Link
              to="/menu"
              className="mt-2 inline-flex items-center gap-2 rounded-md bg-saffron px-6 py-3 text-sm font-bold text-russet"
            >
              Menyuya bax <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-fire">
            Sizin məhəllənin mətbəxi
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-russet md:text-7xl">
            Dadlı yemək.
            <br />
            Gözəl əhval.
          </h1>
          <p className="mt-6 max-w-md text-russet">
            Mətbəximizdən təzə hazırlanmış doyumlu yeməklər sizin ünvanınıza.
            Siz yalnız ac gəlin, qalanını bizə qoyun.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="flex items-center gap-2 rounded-md bg-fire px-6 py-3 text-sm font-bold text-white"
            >
              Menyuya bax <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/about"
              className="rounded-md border border-russet px-6 py-3 text-sm font-bold text-russet"
            >
              Haqqımızda
            </Link>
          </div>

          <p className="mt-8 text-xs font-bold text-forest">
            25–35 dəq çatdırılma &nbsp;/&nbsp; Hər gün təzə hazırlanır
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <img
            src="/images/pasta.jpg"
            alt="Savor pasta"
            className="aspect-4/5 w-full rounded-t-[280px] rounded-b-3xl object-cover"
          />
          <div className="absolute -bottom-5 -left-5 flex size-28 flex-col items-center justify-center rounded-full bg-forest text-center text-cream">
            <span className="text-[9px] uppercase tracking-wider">Hazırlanıb</span>
            <span className="font-display text-xl">sevgi ilə.</span>
            <span className="text-[9px] uppercase tracking-wider">Təzə təqdim</span>
          </div>
        </div>
      </div>
    </section>
  );
}
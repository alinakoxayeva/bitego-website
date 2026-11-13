import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-5xl">savor.</p>
          <p className="mt-2 text-sm">Good food. A little closer.</p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-saffron">Explore</p>
          <ul className="space-y-1 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/orders">My orders</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-saffron">Come say hello</p>
          <p className="text-sm">Baku, Azerbaijan</p>
          <p className="text-sm">Every day, 11 am – 10 pm</p>
          <p className="mt-4 text-sm">hello@savor.kitchen</p>
        </div>
      </div>

      <div className="border-t border-cream/20">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-4 text-xs">
          <span>© 2026 Savor. All good things reserved.</span>
          <span>Privacy policy · Terms & conditions</span>
        </div>
      </div>
    </footer>
  );
}
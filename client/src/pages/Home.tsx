import { ArrowRight, Star, Clock, MapPin, Phone } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useRef } from 'react';

export default function RestaurantTemplate() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75; 
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className="min-h-screen min-w-full bg-white text-gray-900 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-6">
        <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 font-medium text-sm">
              <Star className="w-4 h-4 fill-current text-yellow-500" /> Restoran Adı / Slogan
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              Əsas başlıq burada <span className="text-red-600">qeyd olunacaq</span>.
            </h1>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Restoranınız haqqında qısa, cəlbedici təqdimat mətni. Qonaqlara təqdim edəcəyiniz təcrübəni burada vurğulaya bilərsiniz.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/menu" className="px-8 py-4 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all flex items-center gap-3 group">Menyuya keç
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
              <a 
                href="#booking" 
                className="px-8 py-4 rounded-xl border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-all"
              >
                Stol Sifariş Et
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-lg aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl border border-gray-200">
              {/* Hero şəkil yeri */}
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" 
                alt="Restaurant Hero" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HIGHLIGHTS / FEATURES SECTION */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-lg mb-4 text-gray-800">
              01
            </div>
            <h3 className="text-xl font-bold mb-2">Xüsusiyyət Bir</h3>
            <p className="text-gray-600 text-sm">Keyfiyyət, təravət və ya xüsusi yanaşma haqqında qısa açıqlama.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-lg mb-4 text-gray-800">
              02
            </div>
            <h3 className="text-xl font-bold mb-2">Xüsusiyyət İki</h3>
            <p className="text-gray-600 text-sm">Keyfiyyət, təravət və ya xüsusi yanaşma haqqında qısa açıqlama.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-lg mb-4 text-gray-800">
              03
            </div>
            <h3 className="text-xl font-bold mb-2">Xüsusiyyət Üç</h3>
            <p className="text-gray-600 text-sm">Keyfiyyət, təravət və ya xüsusi yanaşma haqqında qısa açıqlama.</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED MENU SECTION */}
      <section id="menu" className="py-24 px-6 overflow-hidden">
      <div className="max-w-full mx-auto">
        
        {/* Başlıq və Navigasiya Oxları */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <span className="text-red-600 font-semibold uppercase tracking-wider text-xs">Kataloq</span>
            <h2 className="text-4xl font-bold">Seçilmiş Yeməklər</h2>
            <p className="text-gray-600">Menyudan ən populyar təamların siyahısı.</p>
          </div>
          
          {/* Ox düymələri */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Sola"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Sağa"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Sürüşdürülə bilən kartlar container-i */}
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-6 px-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className="min-w-[300px] sm:min-w-[350px] md:min-w-[380px] bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between snap-start flex-shrink-0"
            >
              <div>
                <div className="w-full h-48 rounded-xl bg-gray-100 mb-6 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" 
                    alt="Dish" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">Yemək Adı {item}</h3>
                  <span className="text-lg font-bold text-red-600">00 AZN</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">Yeməyin tərkibi haqqında qısa məlumat buraya yazılacaq.</p>
              </div>
              <button className="w-full py-3 rounded-xl bg-gray-100 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors">
                Ətraflı Bax
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>

      {/* 4. FOOTER */}
      <footer className="bg-[#76413D] text-white py-16 px-6 w-full">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-800 pb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">BiteGo</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Qısa restoran haqqında məlumat və ya şüar.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-bold text-gray-200">İş Saatları</h4>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Həftə içi: 10:00 - 23:00
            </p>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Həftə sonu: 10:00 - 01:00
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-bold text-gray-200">Əlaqə</h4>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" /> Ünvan məlumatı
            </p>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" /> +994 (XX) XXX-XX-XX
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 Restoran. Bütün hüquqlar qorunur.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gray-300">Məxfilik Siyasəti</a>
            <a href="#" className="hover:text-gray-300">İstifadə Şərtləri</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
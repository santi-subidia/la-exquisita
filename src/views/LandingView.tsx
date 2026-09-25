import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { DailyBuffetSection } from '../components/DailyBuffetSection';
import { Product, CategoryCode } from '../domain/models';
import { formatMoneyARS } from '../domain/pricing';
import { ArrowRight, Sparkles, Utensils, Clock, MapPin, Instagram, Phone, ShoppingBag } from 'lucide-react';

interface LandingViewProps {
  onNavigateToMenu: (category?: CategoryCode) => void;
  featuredProducts: Product[];
  onOpenProductModal: (product: Product) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateToMenu,
  featuredProducts,
  onOpenProductModal,
}) => {
  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16">
      {/* 1. Hero Principal con Tarta Flotante y Mascota */}
      <HeroSection onScrollToMenu={() => onNavigateToMenu()} />

      {/* 2. Banner de Invitación Directa a la Carta Online */}
      <section className="max-w-6xl mx-auto px-4 -mt-4 sm:-mt-6 relative z-20 w-full">
        <div className="bg-slate-900 text-amber-100 p-5 sm:p-7 rounded-3xl border-3 border-slate-950 shadow-retro-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Menú Digital Automatizado
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase font-serif text-white tracking-tight">
              ¿Listo para cenar rico hoy?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
              Elegí tus pizzas con masa casera, lomos XL o empanadas. Tu pedido se arma en segundos y le llega al cajero directo por WhatsApp.
            </p>
          </div>

          <button
            onClick={() => onNavigateToMenu()}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl border-2 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 transition-all text-sm sm:text-base shrink-0 uppercase tracking-wide"
          >
            <ShoppingBag className="w-5 h-5 text-slate-950" />
            <span>Abrir Carta Online</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </div>
      </section>

      {/* 3. Sección Especial: Masa Casera, Comida al Paso por Peso & Menú del Día */}
      <DailyBuffetSection />

      {/* 4. Platos Estrella / Destacados de la Carta */}
      <section className="max-w-6xl mx-auto px-4 my-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 border-b-3 border-slate-900 pb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-600 block">
              Directo de la Cocina
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-serif text-slate-900 tracking-tight">
              Especialidades Favoritas
            </h2>
          </div>
          <button
            onClick={() => onNavigateToMenu()}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-red-700 hover:text-red-800 uppercase tracking-wide group self-start sm:self-auto"
          >
            <span>Ver toda la carta ({featuredProducts.length}+ platos)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid de Destacados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProducts.slice(0, 6).map((product) => {
            const hasVariants = product.variants && product.variants.length > 0;
            const minPrice = hasVariants
              ? Math.min(...product.variants!.map((v) => v.price))
              : product.basePrice || 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border-2 border-slate-900 shadow-retro p-4 flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex gap-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-slate-900 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center text-3xl shrink-0">
                      🍽️
                    </div>
                  )}

                  <div className="space-y-1 flex-1 min-w-0">
                    {product.badge && (
                      <span className="inline-block bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-slate-900 shadow-retro-sm">
                        {product.badge}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-black uppercase text-slate-900 font-serif truncate">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="pt-1 text-sm font-black text-slate-950 font-mono">
                      {hasVariants ? `Desde $${formatMoneyARS(minPrice)}` : `$${formatMoneyARS(minPrice)}`}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenProductModal(product)}
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-2 px-3 rounded-xl border border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <span>Configurar y Pedir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Menu */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigateToMenu()}
            type="button"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3.5 rounded-2xl border-2 border-slate-900 shadow-retro text-sm sm:text-base uppercase tracking-wider active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Utensils className="w-4 h-4 text-amber-300" />
            <span>Ver la Carta Completa y Armar Pedido</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. Ubicación, Horarios y Redes Sociales */}
      <section className="max-w-6xl mx-auto px-4 my-8 w-full">
        <div className="bg-[#FFFBEB] p-6 sm:p-8 rounded-3xl border-3 border-slate-900 shadow-retro">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna 1: Ubicación Maps */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-red-600 text-xs font-black uppercase">
                <MapPin className="w-4 h-4" />
                <span>¿Dónde estamos?</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase font-serif">
                Entre Ríos, San Luis
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Vení a retirar tu pedido caliente o a disfrutar de nuestra comida por peso en el local.
              </p>
              <div className="pt-2">
                <a
                  href="https://maps.app.goo.gl/pj1xdjjb5M7FxLtZ7"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-100 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-900 shadow-retro-sm transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Ver en Google Maps</span>
                </a>
              </div>
            </div>

            {/* Columna 2: Horarios */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-amber-700 text-xs font-black uppercase">
                <Clock className="w-4 h-4" />
                <span>Turno Noche</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase font-serif">
                20:00 a 00:30 hs
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                De Lunes a Domingos. Atención continua para retiro en mostrador y delivery a domicilio en San Luis Capital.
              </p>
            </div>

            {/* Columna 3: Instagram & WhatsApp */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-pink-600 text-xs font-black uppercase">
                <Instagram className="w-4 h-4" />
                <span>Nuestra Comunidad</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase font-serif">
                @la.exquisitasl
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Seguinos en Instagram para enterarte de los menús del día, sorteos y novedades.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://www.instagram.com/la.exquisitasl/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-pink-50 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-900 shadow-retro-sm transition-all"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Seguir en Instagram</span>
                </a>
                <a
                  href="https://wa.me/5492664193004"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-900 shadow-retro-sm transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp 2664193004</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

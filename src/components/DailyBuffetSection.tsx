import React from 'react';
import { Scale, Utensils, MessageCircle, MapPin, Instagram, Sparkles, ChefHat } from 'lucide-react';

export const DailyBuffetSection: React.FC = () => {
  const whatsappMenuUrl = `https://wa.me/5492664193004?text=${encodeURIComponent(
    '¡Hola La Exquisita! Quisiera consultar cuál es el Menú del Día de hoy 🍽️'
  )}`;

  const whatsappPesoUrl = `https://wa.me/5492664193004?text=${encodeURIComponent(
    '¡Hola La Exquisita! Quisiera consultar qué opciones de comida al paso por peso tienen listas hoy ⚖️'
  )}`;

  return (
    <section className="max-w-6xl mx-auto px-4 my-8">
      {/* Banner de Masa Casera Artesanal */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 p-5 sm:p-7 rounded-3xl border-3 border-slate-900 shadow-retro mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none text-slate-950">
          <ChefHat className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full border border-slate-900 shadow-retro-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Orgullo de la Casa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-serif tracking-tight">
              Masa 100% Casera de Elaboración Propia
            </h2>
            <p className="text-sm sm:text-base text-slate-800 font-medium max-w-2xl leading-relaxed">
              En <strong>La Exquisita</strong> no usamos masas industriales: amasamos todos los días nuestras propias recetas de masa casera para pizzas a la piedra crocantes, empanadas al horno criollo y tartas doradas. 
              ¡Sentí la diferencia de lo auténticamente artesanal!
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-slate-900 shadow-retro-sm shrink-0 text-center">
            <span className="block text-2xl font-black text-red-600 font-mono">100%</span>
            <span className="block text-xs font-bold text-slate-700 uppercase">Amasado a Mano</span>
          </div>
        </div>
      </div>

      {/* Grid de Servicios Especiales: Comida al Paso por Peso & Menú del Día */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta 1: Comida al Paso por Peso */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-3 border-slate-900 shadow-retro flex flex-col justify-between relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-amber-200 text-slate-900 text-xs font-black uppercase px-3 py-1 rounded-full border border-slate-900">
                <Scale className="w-3.5 h-3.5 text-slate-900" />
                Autoservicio en el Local
              </span>
              <span className="text-3xl">⚖️</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black uppercase font-serif text-slate-900">
              Comida al Paso por Peso
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Vení a nuestro salón, tomá tu bandeja y <strong>servite a tu gusto</strong> de nuestras islas de comida casera caliente y fría recién preparadas. Pagás exactamente según el peso.
            </p>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-slate-600 font-semibold space-y-1">
              <p>• Opciones frescas y variadas listas todos los días.</p>
              <p>• Ideal para almorzar (12 a 15 hs) o cenar (20 a 00:30 hs) de Mié a Dom.</p>
              <p className="text-red-700 font-bold italic">
                *(No está en la carta online porque las opciones cambian día a día)*
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t-2 border-slate-100">
            <a
              href={whatsappPesoUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-4 py-3 rounded-xl border-2 border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar Opciones de Hoy por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Tarjeta 2: Menú del Día Rotativo */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-3 border-slate-900 shadow-retro flex flex-col justify-between relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-red-800">
                <Utensils className="w-3.5 h-3.5" />
                Rotativo Diario
              </span>
              <span className="text-3xl">🍲</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black uppercase font-serif text-slate-900">
              Menú del Día
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Todos los días preparamos un <strong>plato del día especial</strong> abundante y casero para resolver tu almuerzo o cena con la mejor sazón de San Luis.
            </p>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-slate-600 font-semibold space-y-1">
              <p>• Platos caseros rotativos (pastas, guisados, milas especiales, etc.).</p>
              <p>• Disponible mediodía (12 a 15) y noche (20 a 00:30) de Mié a Dom.</p>
              <p className="text-red-700 font-bold italic">
                *(Consultanos por WhatsApp el plato del día y precio actual)*
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t-2 border-slate-100">
            <a
              href={whatsappMenuUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm px-4 py-3 rounded-xl border-2 border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Preguntar Menú del Día por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Barrita informativa de cómo funciona la Carta Automática vs Consultas */}
      <div className="mt-6 bg-[#FFFBEB] p-4 rounded-2xl border-2 border-slate-900 shadow-retro-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-lg shrink-0">
            📱
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900">
              ¿Cómo pedir desde esta Web?
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
              Elegí tus pizzas, lomos, empanadas o hamburguesas de la carta abajo, configuralos y envialo estructurado directo al WhatsApp del cajero.
            </p>
          </div>
        </div>

        {/* Links a Google Maps e Instagram */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://maps.app.goo.gl/pj1xdjjb5M7FxLtZ7"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-100 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-900 shadow-retro-sm transition-all"
            title="Ver ubicación en Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>Cómo Llegar</span>
          </a>
          <a
            href="https://www.instagram.com/la.exquisitasl/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-100 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-900 shadow-retro-sm transition-all"
            title="Seguinos en Instagram @la.exquisitasl"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
};

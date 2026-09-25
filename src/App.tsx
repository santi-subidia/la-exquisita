import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PRODUCTS } from './data/catalog';
import { Product, CategoryCode } from './domain/models';
import { useCart } from './hooks/useCart';
import { useCatalogFilter } from './hooks/useCatalogFilter';
import {
  Header,
  ProductModal,
  StickyCartBar,
  CartDrawer,
  CheckoutModal,
  OrderSuccessModal,
  BottomNav,
} from './components';
import { LandingView, MenuView } from './views';
import { Phone, Clock, MapPin, Instagram } from 'lucide-react';

const getInitialView = (): 'home' | 'menu' => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.toLowerCase();
  if (hash === '#carta' || hash === '#menu') return 'menu';
  return 'home';
};

export const App: React.FC = () => {
  // 1. Navigation state synchronized with URL hash
  const [currentView, setCurrentView] = useState<'home' | 'menu'>(getInitialView);

  // 2. Hooks for Cart & Filter
  const {
    items,
    totals,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
    clearSearch,
    filteredProducts,
  } = useCatalogFilter({ products: PRODUCTS });

  // 3. UI Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Listen to hash changes in window
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#carta' || hash === '#menu') {
        setCurrentView('menu');
      } else if (hash === '#inicio' || hash === '#home' || hash === '') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation handler
  const navigateTo = useCallback(
    (view: 'home' | 'menu', category?: CategoryCode) => {
      setCurrentView(view);
      if (view === 'menu') {
        window.location.hash = '#carta';
        if (category) {
          setSelectedCategory(category);
        }
      } else {
        window.location.hash = '#inicio';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setSelectedCategory]
  );

  // Quick add for simple items
  const handleQuickAdd = useCallback(
    (product: Product) => {
      addItem(product);
      showToast(`¡"${product.name}" agregado a tu comanda!`);
    },
    [addItem, showToast]
  );

  // Open checkout from cart drawer
  const handleProceedToCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  // Order success handler
  const handleOrderSuccess = useCallback(
    (ticketId: string) => {
      setIsCheckoutOpen(false);
      setSuccessTicketId(ticketId);
      setIsSuccessOpen(true);
      clearCart();
    },
    [clearCart]
  );

  // Restart order
  const handleNewOrder = useCallback(() => {
    setIsSuccessOpen(false);
    setSuccessTicketId(null);
    setSelectedCategory('PIZZAS');
    clearSearch();
    navigateTo('menu');
  }, [clearSearch, navigateTo, setSelectedCategory]);

  // Featured products for Landing view
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured || Boolean(p.badge));

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Sticky Header with View Switcher */}
      <Header
        itemCount={totals.itemCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* 2. Main View Container (LandingView vs MenuView) */}
      <div className="flex-1 flex flex-col">
        {currentView === 'home' ? (
          <LandingView
            onNavigateToMenu={(cat) => navigateTo('menu', cat)}
            featuredProducts={featuredProducts}
            onOpenProductModal={(p) => setModalProduct(p)}
          />
        ) : (
          <MenuView
            onNavigateToHome={() => navigateTo('home')}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              clearSearch();
            }}
            categoryCounts={categoryCounts}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onClearSearch={clearSearch}
            filteredProducts={filteredProducts}
            onOpenProductModal={(p) => setModalProduct(p)}
            onQuickAdd={handleQuickAdd}
          />
        )}
      </div>

      {/* 3. Sticky Floating Cart Bar (floats above mobile nav at bottom-16 sm:bottom-4) */}
      <StickyCartBar
        totals={totals}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 4. Mobile Bottom Navigation Bar (sm:hidden) */}
      <BottomNav
        currentView={currentView}
        onNavigate={navigateTo}
        itemCount={totals.itemCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 5. Product Modal / Customization Drawer */}
      <ProductModal
        product={modalProduct}
        isOpen={Boolean(modalProduct)}
        onClose={() => setModalProduct(null)}
        onAddToCart={(product, options) => {
          addItem(product, options);
          showToast(`¡${options.quantity || 1}x "${product.name}" agregado a tu comanda!`);
        }}
      />

      {/* 6. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        totals={totals}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 7. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        totals={totals}
        onOrderSuccess={handleOrderSuccess}
        onShowToast={showToast}
      />

      {/* 8. Order Success Confirmation Modal */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        ticketId={successTicketId}
        onNewOrder={handleNewOrder}
      />

      {/* 9. Retro Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-300 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl border-3 border-amber-400 shadow-retro-xl animate-bounce flex items-center gap-2 max-w-sm text-center"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 10. Traditional Rotisería Footer */}
      <footer className="bg-slate-900 text-amber-100 border-t-4 border-slate-950 py-10 px-4 mt-auto mb-14 sm:mb-0">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Identity */}
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-11 h-11 rounded-full bg-amber-200 border-2 border-slate-900 overflow-hidden flex items-center justify-center p-0.5 shadow-retro-sm">
                <img
                  src="/assets/logo-pinup-transparent.png"
                  alt="La Exquisita"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-black uppercase font-serif text-amber-400 block leading-tight">
                  La Exquisita
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Rotisería & Pizzería
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Masa 100% casera amasada todos los días por nosotras. Disfrutá de comida al paso por peso, menú del día rotativo y las mejores pizzas y lomos de San Luis.
            </p>
          </div>

          {/* Horarios & Ubicación */}
          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className="text-amber-400 font-black uppercase tracking-wider">
              Ubicación & Horarios
            </h4>
            <p className="flex items-center justify-center md:justify-start gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Lunes a Domingos: 20:00 a 00:30 hs</span>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 text-slate-300 pt-1">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <a
                href="https://maps.app.goo.gl/pj1xdjjb5M7FxLtZ7"
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-bold text-amber-300 flex items-center gap-1"
                title="Abrir ubicación en Google Maps"
              >
                <span>Entre Ríos, San Luis Capital (Ver Mapa 🗺️)</span>
              </a>
            </p>
          </div>

          {/* Contacto & Redes */}
          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className="text-amber-400 font-black uppercase tracking-wider">
              Contacto & Redes
            </h4>
            <p className="flex items-center justify-center md:justify-start gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href="https://wa.me/5492664193004"
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-bold text-amber-300"
              >
                +54 9 266 419-3004
              </a>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 text-slate-300">
              <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
              <a
                href="https://www.instagram.com/la.exquisitasl/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-bold text-pink-300"
              >
                @la.exquisitasl
              </a>
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Enviá tu pedido online directo a WhatsApp. Para Menú del Día o comida por peso, ¡escribinos!
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 font-medium">
          © {new Date().getFullYear()} La Exquisita - San Luis. Hecho con masa casera artesanal.
        </div>
      </footer>
    </div>
  );
};

export default App;

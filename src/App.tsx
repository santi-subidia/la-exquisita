import React, { useState, useCallback, useRef } from 'react';
import { PRODUCTS, CATEGORIES } from './data/catalog';
import { Product } from './domain/models';
import { useCart } from './hooks/useCart';
import { useCatalogFilter } from './hooks/useCatalogFilter';
import {
  Header,
  HeroSection,
  CategoryTabs,
  SearchBar,
  ProductCard,
  ProductModal,
  StickyCartBar,
  CartDrawer,
  CheckoutModal,
  OrderSuccessModal,
} from './components';
import { Utensils, Phone, Clock, MapPin } from 'lucide-react';

export const App: React.FC = () => {
  // 1. Hooks for Cart & Filter
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

  // 2. UI Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const menuSectionRef = useRef<HTMLDivElement>(null);

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

  // Scroll to menu
  const handleScrollToMenu = useCallback(() => {
    if (menuSectionRef.current) {
      menuSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Quick add for simple items
  const handleQuickAdd = useCallback((product: Product) => {
    addItem(product);
    showToast(`¡"${product.name}" agregado a tu comanda!`);
  }, [addItem, showToast]);

  // Open checkout from cart drawer
  const handleProceedToCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  // Order success handler
  const handleOrderSuccess = useCallback((ticketId: string) => {
    setIsCheckoutOpen(false);
    setSuccessTicketId(ticketId);
    setIsSuccessOpen(true);
    clearCart();
  }, [clearCart]);

  // Restart order
  const handleNewOrder = useCallback(() => {
    setIsSuccessOpen(false);
    setSuccessTicketId(null);
    setSelectedCategory('PIZZAS');
    clearSearch();
  }, [clearSearch, setSelectedCategory]);

  // Active category display name
  const currentCategoryInfo = CATEGORIES.find((c) => c.code === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Header */}
      <Header
        itemCount={totals.itemCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Hero Section */}
      <HeroSection onScrollToMenu={handleScrollToMenu} />

      {/* 3. Category Navigation Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          clearSearch();
        }}
        categoryCounts={categoryCounts}
      />

      {/* 4. Search Bar with Empty State */}
      <SearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onClear={clearSearch}
        resultCount={filteredProducts.length}
        onViewAll={() => {
          setSelectedCategory('ALL');
          clearSearch();
        }}
      />

      {/* 5. Main Catalog Products Section */}
      <main ref={menuSectionRef} id="menu" className="flex-1 max-w-6xl w-full mx-auto px-4 pb-28">
        {/* Section title & description */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-3 border-slate-900 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">
                {selectedCategory === 'ALL'
                  ? '🔥'
                  : currentCategoryInfo?.badge
                  ? '⭐'
                  : '🍽️'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase font-serif text-slate-900 tracking-tight">
                {searchQuery.trim().length > 0
                  ? `Resultados para "${searchQuery}"`
                  : selectedCategory === 'ALL'
                  ? 'Menú Completo La Exquisita'
                  : currentCategoryInfo?.name || 'Menú'}
              </h2>
            </div>
            {currentCategoryInfo?.description && searchQuery.trim().length === 0 && (
              <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
                {currentCategoryInfo.description}
              </p>
            )}
          </div>

          <span className="text-xs sm:text-sm font-black text-slate-700 bg-amber-200 px-3 py-1 rounded-xl border border-slate-900 shrink-0 self-start sm:self-auto">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'variedad' : 'variedades'}
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={(p) => setModalProduct(p)}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}
      </main>

      {/* 6. Sticky Floating Cart Bar */}
      <StickyCartBar
        totals={totals}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 7. Product Modal / Customization Drawer */}
      <ProductModal
        product={modalProduct}
        isOpen={Boolean(modalProduct)}
        onClose={() => setModalProduct(null)}
        onAddToCart={(product, options) => {
          addItem(product, options);
          showToast(`¡${options.quantity || 1}x "${product.name}" agregado a tu comanda!`);
        }}
      />

      {/* 8. Cart Drawer */}
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

      {/* 9. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        totals={totals}
        onOrderSuccess={handleOrderSuccess}
        onShowToast={showToast}
      />

      {/* 10. Order Success Confirmation Modal */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        ticketId={successTicketId}
        onNewOrder={handleNewOrder}
      />

      {/* 11. Retro Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-300 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl border-3 border-amber-400 shadow-retro-xl animate-bounce flex items-center gap-2 max-w-sm text-center"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 12. Traditional Bodegón Footer */}
      <footer className="bg-slate-900 text-amber-100 border-t-4 border-slate-950 py-10 px-4 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Identity */}
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white border border-amber-300">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-xl font-black uppercase font-serif text-amber-400">
                La Exquisita
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Rotisería, lomitería y pizzería tradicional de barrio. Sabor casero de verdad, porciones generosas y atención personalizada en San Luis.
            </p>
          </div>

          {/* Horarios & Ubicación */}
          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className="text-amber-400 font-black uppercase tracking-wider">
              Horario de Atención
            </h4>
            <p className="flex items-center justify-center md:justify-start gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Lunes a Domingos: 20:00 a 00:30 hs</span>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 text-slate-300 pt-1">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>San Luis Capital, Argentina</span>
            </p>
          </div>

          {/* Contacto & WhatsApp */}
          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className="text-amber-400 font-black uppercase tracking-wider">
              Pedidos & WhatsApp
            </h4>
            <p className="flex items-center justify-center md:justify-start gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400" />
              <a
                href="https://wa.me/5492664193004"
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-bold text-amber-300"
              >
                +54 9 266 419-3004
              </a>
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Enviá tu pedido directamente a nuestro WhatsApp oficial y pasá a retirar o esperalo calentito en tu casa.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 font-medium">
          © {new Date().getFullYear()} La Exquisita - San Luis. Hecho con pasión criolla y masa casera.
        </div>
      </footer>
    </div>
  );
};

export default App;

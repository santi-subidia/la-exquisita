import React, { useEffect } from 'react';
import {
  CartItem,
  CartTotals,
} from '../domain/models';
import { formatMoneyARS } from '../domain/pricing';
import { useCheckout } from '../hooks/useCheckout';
import {
  X,
  Truck,
  Store,
  DollarSign,
  CreditCard,
  Send,
  Copy,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  onOrderSuccess: (ticketId: string) => void;
  onShowToast: (message: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  onOrderSuccess,
  onShowToast,
}) => {
  const {
    form,
    status,
    errors,
    updateField,
    updateAddressField,
    setDeliveryMethod,
    setPaymentMethod,
    getCashChange,
    submitWhatsApp,
    copyOrderToClipboard,
  } = useCheckout({
    onSuccess: (order) => {
      onOrderSuccess(order.ticketId);
    },
  });

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'SUBMITTING') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, status]);

  if (!isOpen) return null;

  const cashChange = getCashChange(totals.total);

  const handleSubmitWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    const sent = await submitWhatsApp(items, totals);
    if (sent) {
      onShowToast('¡Redirigiendo a WhatsApp con tu pedido!');
    }
  };

  const handleCopyClipboard = async () => {
    const copied = await copyOrderToClipboard(items, totals);
    if (copied) {
      onShowToast('📋 ¡Ticket copiado al portapapeles!');
    } else {
      onShowToast('⚠️ No se pudo copiar al portapapeles.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && status !== 'SUBMITTING') onClose();
      }}
    >
      <div className="bg-[#FFFBEB] w-full max-w-xl rounded-2xl border-4 border-slate-900 shadow-retro-xl flex flex-col max-h-[94vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-red-600 p-4 border-b-3 border-slate-900 flex items-center justify-between text-white">
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-200">
              Paso Final • Despacho Directo
            </span>
            <h2 id="checkout-modal-title" className="text-xl sm:text-2xl font-black uppercase font-serif">
              Confirmar mi Pedido
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar checkout"
            className="p-1.5 rounded-xl bg-white hover:bg-amber-400 text-slate-900 border-2 border-slate-900 shadow-retro-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitWhatsApp} className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Modalidad de Entrega */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wide">
              1. Modalidad de Entrega:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('DELIVERY')}
                className={`p-3 rounded-xl border-2 border-slate-900 flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all ${
                  form.deliveryMethod === 'DELIVERY'
                    ? 'bg-amber-400 text-slate-950 shadow-retro scale-[1.02]'
                    : 'bg-white hover:bg-amber-50 text-slate-800 shadow-retro-sm'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Envío a Domicilio</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('PICKUP')}
                className={`p-3 rounded-xl border-2 border-slate-900 flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all ${
                  form.deliveryMethod === 'PICKUP'
                    ? 'bg-amber-400 text-slate-950 shadow-retro scale-[1.02]'
                    : 'bg-white hover:bg-amber-50 text-slate-800 shadow-retro-sm'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Retiro en Local</span>
              </button>
            </div>
          </div>

          {/* 2. Datos Personales */}
          <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-slate-900 shadow-retro-sm">
            <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900">
              2. Tus Datos de Contacto
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="checkout-customer-name" className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  id="checkout-customer-name"
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => updateField('customerName', e.target.value)}
                  placeholder="Ej: Marcelo Gómez"
                  className="w-full bg-[#FFFBEB] p-2.5 rounded-lg border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {errors.customerName && (
                  <p className="text-[11px] text-red-600 font-bold mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-customer-phone" className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  id="checkout-customer-phone"
                  type="tel"
                  required
                  value={form.customerPhone}
                  onChange={(e) => updateField('customerPhone', e.target.value)}
                  placeholder="Ej: 2664123456"
                  className="w-full bg-[#FFFBEB] p-2.5 rounded-lg border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {errors.customerPhone && (
                  <p className="text-[11px] text-red-600 font-bold mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. Dirección (Condicional para Delivery) */}
          {form.deliveryMethod === 'DELIVERY' && (
            <div className="space-y-3 bg-amber-100 p-4 rounded-xl border-2 border-slate-900 shadow-retro-sm animate-fadeIn">
              <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900">
                3. Dirección de Entrega (San Luis)
              </h4>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="col-span-2">
                  <label htmlFor="checkout-street" className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Calle *
                  </label>
                  <input
                    id="checkout-street"
                    type="text"
                    required
                    value={form.deliveryAddress?.street || ''}
                    onChange={(e) => updateAddressField('street', e.target.value)}
                    placeholder="Ej: Av. Illia"
                    className="w-full bg-white p-2.5 rounded-lg border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {errors.street && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">{errors.street}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-number" className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Número *
                  </label>
                  <input
                    id="checkout-number"
                    type="text"
                    required
                    value={form.deliveryAddress?.number || ''}
                    onChange={(e) => updateAddressField('number', e.target.value)}
                    placeholder="Ej: 450"
                    className="w-full bg-white p-2.5 rounded-lg border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {errors.number && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">{errors.number}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label htmlFor="checkout-floor-or-apt" className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Piso / Depto (Opcional)
                  </label>
                  <input
                    id="checkout-floor-or-apt"
                    type="text"
                    value={form.deliveryAddress?.floorOrApt || ''}
                    onChange={(e) => updateAddressField('floorOrApt', e.target.value)}
                    placeholder="Ej: 2° B"
                    className="w-full bg-white p-2.5 rounded-lg border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-between-streets" className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Entre Calles / Referencias *
                  </label>
                  <input
                    id="checkout-between-streets"
                    type="text"
                    required
                    value={form.deliveryAddress?.betweenStreets || ''}
                    onChange={(e) => updateAddressField('betweenStreets', e.target.value)}
                    placeholder="Ej: Entre San Martín y Rivadavia"
                    className="w-full bg-white p-2.5 rounded-lg border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {errors.betweenStreets && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">{errors.betweenStreets}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. Forma de Pago y Vuelto */}
          <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-slate-900 shadow-retro-sm">
            <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900">
              4. Medio de Pago
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('EFECTIVO')}
                className={`p-2.5 rounded-lg border-2 border-slate-900 flex flex-col items-center text-xs font-black transition-all ${
                  form.paymentMethod === 'EFECTIVO'
                    ? 'bg-emerald-400 text-slate-950 shadow-retro-sm'
                    : 'bg-amber-50 text-slate-800'
                }`}
              >
                <DollarSign className="w-4 h-4 mb-1" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('TRANSFERENCIA')}
                className={`p-2.5 rounded-lg border-2 border-slate-900 flex flex-col items-center text-xs font-black transition-all ${
                  form.paymentMethod === 'TRANSFERENCIA'
                    ? 'bg-emerald-400 text-slate-950 shadow-retro-sm'
                    : 'bg-amber-50 text-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1" />
                <span>Transferencia</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('MERCADOPAGO')}
                className={`p-2.5 rounded-lg border-2 border-slate-900 flex flex-col items-center text-xs font-black transition-all ${
                  form.paymentMethod === 'MERCADOPAGO'
                    ? 'bg-emerald-400 text-slate-950 shadow-retro-sm'
                    : 'bg-amber-50 text-slate-800'
                }`}
              >
                <span className="text-xs mb-1 font-mono">📱</span>
                <span>Mercado Pago</span>
              </button>
            </div>

            {/* Cash change field */}
            {form.paymentMethod === 'EFECTIVO' && (
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label htmlFor="checkout-cash-amount" className="block text-[11px] font-bold uppercase text-slate-700">
                  ¿Con cuánto vas a abonar? ($ ARS) *
                </label>
                <input
                  id="checkout-cash-amount"
                  type="number"
                  min={totals.total}
                  step={500}
                  value={form.cashAmountPaid || ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : undefined;
                    updateField('cashAmountPaid', val);
                  }}
                  placeholder={`Ej: ${Math.ceil(totals.total / 1000) * 1000 + 1000}`}
                  className="w-full bg-[#FFFBEB] p-2.5 rounded-lg border-2 border-slate-900 text-sm font-black text-slate-900 font-mono"
                />

                {/* Change dynamic status */}
                {form.cashAmountPaid !== undefined && (
                  <div className="text-xs font-bold p-2 rounded-lg border border-slate-900 bg-amber-50">
                    {cashChange.isInsufficient ? (
                      <span className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {cashChange.message}
                      </span>
                    ) : cashChange.isExact ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pago exacto: sin vuelto a preparar.
                      </span>
                    ) : (
                      <span className="text-slate-900 flex items-center gap-1">
                        💵 Vuelto a preparar: <strong className="text-emerald-700">${formatMoneyARS(cashChange.change)}</strong>
                      </span>
                    )}
                  </div>
                )}
                {errors.cashAmountPaid && (
                  <p className="text-[11px] text-red-600 font-bold">{errors.cashAmountPaid}</p>
                )}
              </div>
            )}

            {form.paymentMethod === 'TRANSFERENCIA' && (
              <p className="text-xs text-slate-600 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                ℹ️ Al enviar el mensaje, el local te facilitará el Alias/CBU para transferir y aguardará tu comprobante.
              </p>
            )}

            {form.paymentMethod === 'MERCADOPAGO' && (
              <p className="text-xs text-slate-600 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                ℹ️ El cajero te compartirá el link de pago o código QR oficial por WhatsApp.
              </p>
            )}
          </div>

          {/* 5. Observaciones generales */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-general-notes" className="block text-xs font-bold uppercase text-slate-800">
              Notas Adicionales (Opcional):
            </label>
            <input
              id="checkout-general-notes"
              type="text"
              value={form.generalNotes || ''}
              onChange={(e) => updateField('generalNotes', e.target.value)}
              placeholder="Ej: Timbre blanco no anda, llamar al llegar..."
              className="w-full bg-white p-2.5 rounded-lg border-2 border-slate-900 text-xs sm:text-sm font-medium text-slate-900"
            />
          </div>

          {/* Order Summary line */}
          <div className="bg-amber-200 p-3 rounded-xl border-2 border-slate-900 flex justify-between items-center text-sm font-black">
            <span>TOTAL A PAGAR:</span>
            <span className="text-base sm:text-lg font-mono text-red-700">
              ${formatMoneyARS(totals.total)}
            </span>
          </div>

          {/* Submission Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={status === 'SUBMITTING'}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-xl border-2 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-5 h-5 text-amber-200" />
              <span>
                {status === 'SUBMITTING' ? 'Preparando WhatsApp...' : 'Enviar Pedido a WhatsApp'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyClipboard}
              className="w-full bg-white hover:bg-amber-100 text-slate-900 font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl border-2 border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 transition-all"
            >
              <Copy className="w-4 h-4 text-slate-700" />
              <span>Copiar Pedido al Portapapeles (Respaldo)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { CheckCircle2, MessageCircle, RotateCcw } from 'lucide-react';
import { OFFICIAL_WHATSAPP_PHONE } from '../domain/whatsapp-compiler';

interface OrderSuccessModalProps {
  isOpen: boolean;
  ticketId: string | null;
  onNewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  ticketId,
  onNewOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#FFFBEB] w-full max-w-md rounded-2xl border-4 border-slate-900 shadow-retro-xl p-6 text-center space-y-5 animate-scaleUp">
        {/* Animated Success Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-400 text-slate-950 rounded-full border-3 border-slate-900 flex items-center justify-center mx-auto shadow-retro">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-red-700 block">
            ¡Comanda Recibida!
          </span>
          <h2 id="success-modal-title" className="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-serif mt-1">
            ¡Gracias por tu compra!
          </h2>
          {ticketId && (
            <div className="inline-block mt-2 bg-amber-300 text-slate-950 font-black font-mono text-sm px-3.5 py-1 rounded-lg border-2 border-slate-900 shadow-retro-sm">
              TICKET #{ticketId}
            </div>
          )}
        </div>

        {/* Message body */}
        <div className="bg-amber-100 p-4 rounded-xl border-2 border-slate-900 text-xs sm:text-sm text-slate-800 space-y-2 text-left shadow-retro-sm">
          <p className="font-bold flex items-center gap-1.5 text-slate-900">
            <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verificá tu WhatsApp:</span>
          </p>
          <p className="font-medium text-slate-700">
            Se ha preparado el mensaje con todos los detalles de tu orden hacia el número oficial del cajero ({OFFICIAL_WHATSAPP_PHONE}).
          </p>
          <p className="font-semibold text-slate-900 text-[11px] pt-1 border-t border-amber-200">
            ⏱️ Tiempo de cocción habitual: 25 a 45 minutos. Te confirmaremos por WhatsApp apenas entre al horno.
          </p>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNewOrder}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base py-3 px-4 rounded-xl border-2 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Hacer Otro Pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import { CartItem, CheckoutForm, CartTotals } from './models';
import { formatFlavorSummary } from './empanada-rules';
import { formatMoneyARS } from './pricing';

export const OFFICIAL_WHATSAPP_PHONE = '5492664193004';
export const WHATSAPP_BASE_URL = 'https://wa.me';

export interface BuildTicketParams {
  ticketId: string;
  createdAt: Date;
  customer: CheckoutForm;
  items: CartItem[];
  totals: CartTotals;
}

/**
 * Formats a Date object in Argentine locale representation (DD/MM/YYYY, HH:mm hs).
 */
export function formatArgentineDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year}, ${hours}:${minutes} hs`;
}

/**
 * Builds the canonical kitchen & customer ticket for WhatsApp.
 */
export function buildCanonicalTicket({
  ticketId,
  createdAt,
  customer,
  items,
  totals,
}: BuildTicketParams): string {
  const fechaHora = formatArgentineDateTime(createdAt);
  const isDelivery = customer.deliveryMethod === 'DELIVERY';
  const tipoEntrega = isDelivery ? 'Envío a Domicilio' : 'Retiro por el Local (Mostrador)';

  // Domicilio o retiro
  let bloqueDomicilio = '';
  if (isDelivery && customer.deliveryAddress) {
    const { street, number, floorOrApt, betweenStreets } = customer.deliveryAddress;
    const floorInfo = floorOrApt ? ` (Piso/Dpto: ${floorOrApt})` : '';
    bloqueDomicilio = [
      `• Dirección: *${street} ${number}*${floorInfo}`,
      `• Entre Calles / Referencia: *${betweenStreets || 'Sin datos'}*`,
    ].join('\n');
  } else {
    const retiroTime = customer.pickupEstimatedTime || 'Lo antes posible (20-30 min)';
    bloqueDomicilio = `• Horario estimado de retiro: *${retiroTime}*`;
  }

  // Detalle de productos
  const lineasPedido = items.map((item) => {
    const variantText = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
    let lineText = `• ${item.quantity}x *${item.productName}${variantText}* - *$${formatMoneyARS(item.subtotal)}*`;

    const subLines: string[] = [];
    if (item.modifiers.sideDish) {
      const sideName = item.modifiers.sideDish === 'PAPAS_FRITAS' ? 'Papas Fritas' : 'Ensalada';
      subLines.push(`  ↳ Guarnición: *${sideName}*`);
    }

    if (item.modifiers.empanadaFlavors) {
      const flavorsSummary = formatFlavorSummary(item.modifiers.empanadaFlavors);
      if (flavorsSummary) {
        subLines.push(`  ↳ Sabores: *${flavorsSummary}*`);
      }
    }

    if (item.modifiers.comboEmpanadaFlavors) {
      const comboFlavorsSummary = formatFlavorSummary(item.modifiers.comboEmpanadaFlavors);
      if (comboFlavorsSummary) {
        subLines.push(`  ↳ Empanadas: *${comboFlavorsSummary}*`);
      }
    }

    if (item.modifiers.customNotes && item.modifiers.customNotes.trim()) {
      subLines.push(`  ↳ Nota: _"${item.modifiers.customNotes.trim()}"_`);
    }

    if (subLines.length > 0) {
      lineText += '\n' + subLines.join('\n');
    }

    return lineText;
  }).join('\n');

  // Costo de envío
  let costoEnvioTexto = '*Gratis / No aplica*';
  if (isDelivery) {
    if (totals.deliveryFee === 'A_COORDINAR') {
      costoEnvioTexto = '*A coordinar con el local*';
    } else if (typeof totals.deliveryFee === 'number' && totals.deliveryFee > 0) {
      costoEnvioTexto = `*$${formatMoneyARS(totals.deliveryFee)}*`;
    }
  }

  // Forma de pago
  let formaPagoTexto = 'Efectivo';
  let bloquePagoEfectivo = '';
  if (customer.paymentMethod === 'EFECTIVO') {
    formaPagoTexto = 'Efectivo';
    if (customer.cashAmountPaid && customer.cashAmountPaid >= totals.total) {
      const vuelto = customer.cashAmountPaid - totals.total;
      bloquePagoEfectivo = [
        `• Paga con: *$${formatMoneyARS(customer.cashAmountPaid)}*`,
        vuelto > 0
          ? `• Vuelto a preparar: *$${formatMoneyARS(vuelto)}*`
          : '• Pago exacto: *Sin vuelto*',
      ].join('\n');
    }
  } else if (customer.paymentMethod === 'TRANSFERENCIA') {
    formaPagoTexto = 'Transferencia Bancaria';
    bloquePagoEfectivo = '• _Aguardando alias/CBU para enviar comprobante._';
  } else {
    formaPagoTexto = 'Mercado Pago';
    bloquePagoEfectivo = '• _Aguardando link de pago o QR._';
  }

  // Observaciones generales
  let bloqueObservaciones = '';
  if (customer.generalNotes && customer.generalNotes.trim()) {
    bloqueObservaciones = `\n📝 *Observaciones Generales:*\n_${customer.generalNotes.trim()}_`;
  }

  return [
    '🍕 *NUEVO PEDIDO - LA EXQUISITA* 🍕',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📋 *TICKET #${ticketId}*`,
    `📅 ${fechaHora}`,
    '',
    '👤 *DATOS DEL CLIENTE:*',
    `• Nombre: *${customer.customerName.trim()}*`,
    `• Teléfono: *${customer.customerPhone.trim()}*`,
    `• Tipo de Entrega: *${tipoEntrega}*`,
    bloqueDomicilio,
    '',
    '🛒 *DETALLE DEL PEDIDO:*',
    lineasPedido,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '💰 *RESUMEN DE PAGO:*',
    `• Subtotal Productos: *$${formatMoneyARS(totals.subtotal)}*`,
    `• Envío: ${costoEnvioTexto}`,
    `• *TOTAL A PAGAR: $${formatMoneyARS(totals.total)}*`,
    '',
    `💳 *Forma de Pago:* *${formaPagoTexto}*`,
    bloquePagoEfectivo,
    bloqueObservaciones,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '💬 *Pedido generado desde el Menú Online de La Exquisita*',
  ].filter((segment) => segment !== '').join('\n');
}

/**
 * Compiles canonical ticket text and generates the full wa.me URL.
 */
export function generateWhatsAppUrl(
  ticketText: string,
  phone: string = OFFICIAL_WHATSAPP_PHONE
): string {
  const encodedText = encodeURIComponent(ticketText);
  return `${WHATSAPP_BASE_URL}/${phone}?text=${encodedText}`;
}

/**
 * Generates a human-friendly ticket identifier (e.g. "EXQ-4821").
 */
export function generateTicketId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EXQ-${randomNum}`;
}

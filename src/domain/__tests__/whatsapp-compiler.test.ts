import { describe, it, expect } from 'vitest';
import {
  buildCanonicalTicket,
  generateWhatsAppUrl,
  formatArgentineDateTime,
  OFFICIAL_WHATSAPP_PHONE,
} from '../whatsapp-compiler';
import { CartItem, CheckoutForm, CartTotals } from '../models';

describe('WhatsApp Compiler (Dominio Puro)', () => {
  const fixedDate = new Date(2026, 8, 25, 21, 30); // 25 Sept 2026 21:30

  describe('Formateo de Fecha y Hora Argentina', () => {
    it('debe formatear con día, mes, año, hora y minutos (DD/MM/YYYY, HH:mm hs)', () => {
      const formatted = formatArgentineDateTime(fixedDate);
      expect(formatted).toBe('25/09/2026, 21:30 hs');
    });
  });

  describe('Construcción Canónica del Ticket de Cocina', () => {
    const mockCustomerDelivery: CheckoutForm = {
      customerName: 'Juan Pérez',
      customerPhone: '2664123456',
      deliveryMethod: 'DELIVERY',
      deliveryAddress: {
        street: 'Mitre',
        number: '850',
        floorOrApt: '2 B',
        betweenStreets: 'Junín y Pringles',
      },
      paymentMethod: 'EFECTIVO',
      cashAmountPaid: 50000,
      generalNotes: 'Tocar timbre fuerte que el perro ladra',
    };

    const mockItems: CartItem[] = [
      {
        lineId: 'line-1',
        productId: 'pizza-especial',
        productName: 'Pizza Especial',
        selectedVariant: { id: 'v1', name: 'Entera (8 porciones)', sizeCode: 'ENTERA', price: 16000 },
        modifiers: {},
        unitPrice: 16000,
        quantity: 1,
        subtotal: 16000,
      },
      {
        lineId: 'line-2',
        productId: 'mila-carne-napolitana',
        productName: 'Milanesa Napolitana (Carne)',
        modifiers: {
          sideDish: 'PAPAS_FRITAS',
          customNotes: 'Bien crocante',
        },
        unitPrice: 17000,
        quantity: 1,
        subtotal: 17000,
      },
      {
        lineId: 'line-3',
        productId: 'empanadas-docena',
        productName: 'Docena de Empanadas al Horno',
        modifiers: {
          empanadaFlavors: {
            CARNE: 6,
            ARABES: 4,
            JAMON_Y_QUESO: 2,
          },
        },
        unitPrice: 12000,
        quantity: 1,
        subtotal: 12000,
      },
    ];

    const mockTotals: CartTotals = {
      itemCount: 3,
      subtotal: 45000,
      deliveryFee: 'A_COORDINAR',
      total: 45000,
    };

    it('debe compilar el ticket de delivery con todos los detalles especificados', () => {
      const ticket = buildCanonicalTicket({
        ticketId: 'EXQ-4821',
        createdAt: fixedDate,
        customer: mockCustomerDelivery,
        items: mockItems,
        totals: mockTotals,
      });

      // Cabecera y metadatos
      expect(ticket).toContain('🍕 *NUEVO PEDIDO - LA EXQUISITA* 🍕');
      expect(ticket).toContain('📋 *TICKET #EXQ-4821*');
      expect(ticket).toContain('📅 25/09/2026, 21:30 hs');

      // Cliente y Entrega
      expect(ticket).toContain('• Nombre: *Juan Pérez*');
      expect(ticket).toContain('• Teléfono: *2664123456*');
      expect(ticket).toContain('• Tipo de Entrega: *Envío a Domicilio*');
      expect(ticket).toContain('• Dirección: *Mitre 850* (Piso/Dpto: 2 B)');
      expect(ticket).toContain('• Entre Calles / Referencia: *Junín y Pringles*');

      // Desglose de Items
      expect(ticket).toContain('• 1x *Pizza Especial (Entera (8 porciones))*');
      expect(ticket).toContain('• 1x *Milanesa Napolitana (Carne)*');
      expect(ticket).toContain('↳ Guarnición: *Papas Fritas*');
      expect(ticket).toContain('↳ Nota: _"Bien crocante"_');
      expect(ticket).toContain('• 1x *Docena de Empanadas al Horno*');
      expect(ticket).toContain('↳ Sabores: *Carne Criolla (6), Árabes (Sfijas) (4), Jamón y Queso (2)*');

      // Totales y Pagos
      expect(ticket).toContain('• Envío: *A coordinar con el local*');
      expect(ticket).toContain('💳 *Forma de Pago:* *Efectivo*');
      expect(ticket).toContain('• Paga con:');
      expect(ticket).toContain('• Vuelto a preparar:');

      // Observaciones y pie
      expect(ticket).toContain('📝 *Observaciones Generales:*');
      expect(ticket).toContain('Tocar timbre fuerte');
      expect(ticket).toContain('💬 *Pedido generado desde el Menú Online de La Exquisita*');
    });

    it('debe compilar ticket para retiro en local (PICKUP) con transferencia bancaria', () => {
      const mockCustomerPickup: CheckoutForm = {
        customerName: 'Silvia Gómez',
        customerPhone: '2664000111',
        deliveryMethod: 'PICKUP',
        pickupEstimatedTime: 'En 25 minutos',
        paymentMethod: 'TRANSFERENCIA',
      };

      const ticket = buildCanonicalTicket({
        ticketId: 'EXQ-9999',
        createdAt: fixedDate,
        customer: mockCustomerPickup,
        items: [mockItems[0]],
        totals: {
          itemCount: 1,
          subtotal: 16000,
          deliveryFee: 0,
          total: 16000,
        },
      });

      expect(ticket).toContain('• Tipo de Entrega: *Retiro por el Local (Mostrador)*');
      expect(ticket).toContain('• Horario estimado de retiro: *En 25 minutos*');
      expect(ticket).toContain('💳 *Forma de Pago:* *Transferencia Bancaria*');
      expect(ticket).toContain('• _Aguardando alias/CBU para enviar comprobante._');
      expect(ticket).toContain('• Envío: *Gratis / No aplica*');
    });
  });

  describe('Generación de URL de WhatsApp (wa.me)', () => {
    it('debe ensamblar URL con prefijo oficial y codificación limpia RFC 3986', () => {
      const sampleText = '🍕 *NUEVO PEDIDO - LA EXQUISITA* 🍕\nTotal: $16.000';
      const url = generateWhatsAppUrl(sampleText);

      expect(url.startsWith(`https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=`)).toBe(true);
      // Al decodificar el parámetro 'text', debe ser exactamente el texto original
      const encodedParam = url.split('?text=')[1];
      expect(decodeURIComponent(encodedParam)).toBe(sampleText);
    });
  });
});

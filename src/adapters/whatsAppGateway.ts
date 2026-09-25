import { WhatsAppGatewayPort } from '../domain/ports/WhatsAppGatewayPort';
import { generateWhatsAppUrl, OFFICIAL_WHATSAPP_PHONE } from '../domain/whatsapp-compiler';

export class WhatsAppGateway implements WhatsAppGatewayPort {
  private defaultPhone: string;

  constructor(defaultPhone: string = OFFICIAL_WHATSAPP_PHONE) {
    this.defaultPhone = defaultPhone;
  }

  buildUrl(phone: string = this.defaultPhone, text: string): string {
    const targetPhone = phone.trim() ? phone.trim() : this.defaultPhone;
    return generateWhatsAppUrl(text, targetPhone);
  }

  sendOrder(phone: string = this.defaultPhone, text: string): boolean {
    const url = this.buildUrl(phone, text);

    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        // Fallback for pop-up blockers: direct window redirect
        window.location.href = url;
      }
      return true;
    } catch (err) {
      console.warn('[WhatsAppGateway] window.open failed, attempting direct location assign:', err);
      try {
        window.location.href = url;
        return true;
      } catch (locErr) {
        console.error('[WhatsAppGateway] Failed to navigate to WhatsApp URL:', locErr);
        return false;
      }
    }
  }
}

export const whatsAppGateway = new WhatsAppGateway();

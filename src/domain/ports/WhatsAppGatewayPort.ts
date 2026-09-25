export interface WhatsAppGatewayPort {
  sendOrder(phone: string, text: string): boolean;
  buildUrl(phone: string, text: string): string;
}

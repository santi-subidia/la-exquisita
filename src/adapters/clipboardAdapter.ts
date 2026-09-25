import { ClipboardPort } from '../domain/ports/ClipboardPort';

export class WebClipboardAdapter implements ClipboardPort {
  async copyText(text: string): Promise<boolean> {
    // 1. Try modern navigator.clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('[WebClipboardAdapter] navigator.clipboard failed, attempting fallback:', err);
      }
    }

    // 2. Fallback using document.execCommand('copy')
    try {
      if (typeof document === 'undefined') return false;

      const textArea = document.createElement('textarea');
      textArea.value = text;
      // Prevent scrolling to bottom of page
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '-9999px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (fallbackError) {
      console.error('[WebClipboardAdapter] Clipboard fallback failed:', fallbackError);
      return false;
    }
  }
}

export const clipboardAdapter = new WebClipboardAdapter();

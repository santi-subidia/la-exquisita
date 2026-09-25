import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalStorageAdapter } from '../localStorageAdapter';
import { WebClipboardAdapter } from '../clipboardAdapter';
import { WhatsAppGateway } from '../whatsAppGateway';
import { generateLineId } from '../../hooks/useCart';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    const mockStorage = {
      getItem: vi.fn((key: string) => mockStore[key] || null),
      setItem: vi.fn((key: string, val: string) => {
        mockStore[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStore[key];
      }),
      clear: vi.fn(() => {
        mockStore = {};
      }),
    };

    vi.stubGlobal('localStorage', mockStorage);
    adapter = new LocalStorageAdapter();
  });

  it('stores and retrieves JSON objects correctly', () => {
    const data = [{ id: 'pizza-1', quantity: 2 }];
    adapter.setItem('test_cart', data);

    const retrieved = adapter.getItem<typeof data>('test_cart');
    expect(retrieved).toEqual(data);
  });

  it('returns null if item does not exist or JSON is invalid', () => {
    expect(adapter.getItem('nonexistent')).toBeNull();

    mockStore['invalid'] = 'not-json{';
    expect(adapter.getItem('invalid')).toBeNull();
  });

  it('removes item and clears storage cleanly', () => {
    adapter.setItem('key1', 'val1');
    adapter.removeItem('key1');
    expect(adapter.getItem('key1')).toBeNull();

    adapter.setItem('key2', 'val2');
    adapter.clear();
    expect(adapter.getItem('key2')).toBeNull();
  });
});

describe('WebClipboardAdapter', () => {
  it('uses navigator.clipboard if available in secure context', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });
    vi.stubGlobal('window', { isSecureContext: true });

    const clipboard = new WebClipboardAdapter();
    const result = await clipboard.copyText('Texto de prueba');

    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('Texto de prueba');
  });

  it('falls back to document.execCommand when clipboard API fails or is unavailable', async () => {
    vi.stubGlobal('navigator', { clipboard: null });
    vi.stubGlobal('window', { isSecureContext: false });

    const execMock = vi.fn().mockReturnValue(true);
    vi.stubGlobal('document', {
      createElement: vi.fn(() => ({
        style: {},
        setAttribute: vi.fn(),
        focus: vi.fn(),
        select: vi.fn(),
      })),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      execCommand: execMock,
    });

    const clipboard = new WebClipboardAdapter();
    const result = await clipboard.copyText('Texto fallback');

    expect(result).toBe(true);
    expect(execMock).toHaveBeenCalledWith('copy');
  });
});

describe('WhatsAppGateway', () => {
  it('builds canonical wa.me URL correctly', () => {
    const gateway = new WhatsAppGateway('5492664193004');
    const url = gateway.buildUrl('5492664193004', '¡Hola Exquisita!');

    expect(url).toContain('https://wa.me/5492664193004?text=');
    expect(url).toContain(encodeURIComponent('¡Hola Exquisita!'));
  });

  it('invokes window.open safely with target _blank', () => {
    const openMock = vi.fn().mockReturnValue({ closed: false });
    vi.stubGlobal('window', {
      open: openMock,
      location: { href: '' },
    });

    const gateway = new WhatsAppGateway('5492664193004');
    const success = gateway.sendOrder('5492664193004', 'Pedido #EXQ-1234');

    expect(success).toBe(true);
    expect(openMock).toHaveBeenCalled();
  });
});

describe('useCart generateLineId deterministic hashing', () => {
  it('generates unique deterministic lineId for identical and different modifiers', () => {
    const lineId1 = generateLineId('pizza-muzza', 'pz-muzza-entera', {
      customNotes: 'bien doradita',
    });

    const lineId2 = generateLineId('pizza-muzza', 'pz-muzza-entera', {
      customNotes: '  BIEN DORADITA  ',
    });

    // Case and spacing normalized notes match
    expect(lineId1).toBe(lineId2);

    // Different variant produces different lineId
    const lineId3 = generateLineId('pizza-muzza', 'pz-muzza-media');
    expect(lineId1).not.toBe(lineId3);

    // Flavors order independence
    const lineIdFlavorsA = generateLineId('empanadas-docena', undefined, {
      empanadaFlavors: { CARNE: 6, POLLO: 6 },
    });
    const lineIdFlavorsB = generateLineId('empanadas-docena', undefined, {
      empanadaFlavors: { POLLO: 6, CARNE: 6 },
    });
    expect(lineIdFlavorsA).toBe(lineIdFlavorsB);
  });
});

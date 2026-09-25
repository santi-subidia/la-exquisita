# tasks.md - Desglose de Tareas Atómicas de Implementación
## Proyecto: La Exquisita - Menú Online & Pedidos WhatsApp

---

### Fase 1: Setup del Proyecto & Entorno de Desarrollo
- [x] 1.1 Inicializar proyecto Vite con plantilla React + TypeScript.
- [x] 1.2 Configurar Tailwind CSS e incorporar tokens de diseño temático en `tailwind.config.js`:
  - [x] Paleta: Amarillo Rotisería (`#F59E0B`), Rojo Pimiento (`#DC2626`), Crema Manteca (`#FFFBEB`), Negro Carbón (`#111827`).
  - [x] Utilidades para sombras retro bodegón (`shadow-retro`, bordes de sello).
- [x] 1.3 Instalar y configurar `lucide-react` para iconografía gastronómica y de carrito.
- [x] 1.4 Configurar entorno de pruebas con Vitest.
- [x] 1.5 Crear la estructura de directorios canónica:
  - `src/domain/` (models, pricing, empanadas, checkout, whatsapp, ports)
  - `src/services/image-processor/`
  - `src/data/` (catálogo y configuración de negocio)
  - `src/adapters/` (storage, whatsapp, clipboard)
  - `src/hooks/` (useCart, useCheckout, useCatalogFilter, useProductModal)
  - `src/components/` (ui, hero, catalog, cart, checkout)
- [x] 1.6 Migrar y organizar las fotos reales de `media/comida/` a `public/assets/comida/`.

---

### Fase 2: Procesamiento del Chroma Key & Catálogo de Datos Tipado
- [x] 2.1 Crear y ejecutar el script para procesar `tarta-jamon_y_queso-fondoverde.png`:
  - [x] Algoritmo de detección de verde `#00FF00` con tolerancia cromática y despill.
  - [x] Generación del asset final recortado: `public/assets/tarta-hero-transparent.png`.
- [x] 2.2 Implementar el servicio fallback runtime `src/services/image-processor/canvasChromaKey.ts` para renderizado dinámico en Canvas.
- [x] 2.3 Construir `src/data/catalog.ts` conteniendo todos los ítems de `CONTEXT.md` tipados rigurosamente:
  - [x] 23 Pizzas (con variantes Entera / Media).
  - [x] 15 Promos & Combos (con promociones 2x y combos con empanadas).
  - [x] 6 Especialidades (Lomopizza, Hamburpizza, Barroluco, etc.).
  - [x] 6 Sándwichs con papas fritas incluidas.
  - [x] 3 Hamburguesas (con promos 2x aplicables).
  - [x] Empanadas al Horno (Docena y Media Docena) con los 8 sabores oficiales.
  - [x] 6 Variedades de Papas Fritas.
  - [x] 9 Variedades de Milanesas (con regla de guarnición obligatoria).
  - [x] Minutas, Tartas y Tortillas.

---

### Fase 3: Dominio Puro & Compilador de WhatsApp con Tests Unitarios
- [x] 3.1 Definir los tipos de dominio en `src/domain/models.ts` (`Product`, `CartItem`, `OrderTicket`, etc.).
- [x] 3.2 Implementar el motor de cálculo de precios en `src/domain/pricing.ts`:
  - [x] Cálculo de variantes de tamaño y guarniciones.
  - [x] Reglas automáticas de promociones 2x (Lomo XL, Chorilomo, Hamburguesas).
  - [x] Cálculo de subtotales y totales.
- [x] 3.3 Implementar el gestor de cuotas de empanadas en `src/domain/empanada-rules.ts`:
  - [x] Validación de cupos de 6 y 12 unidades.
  - [x] Helpers para incremento/decremento y resumen de sabores en texto.
- [x] 3.4 Implementar el validador de checkout en `src/domain/checkout-rules.ts`:
  - [x] Reglas obligatorias para Delivery (calle, altura, entrecalles, nombre, teléfono).
  - [x] Reglas para Retiro en el local (nombre, teléfono).
  - [x] Lógica de pago en efectivo y cálculo exacto de vuelto.
- [x] 3.5 Implementar el compilador de WhatsApp en `src/domain/whatsapp-compiler.ts`:
  - [x] Generación de la plantilla canónica con formato de ticket de cocina.
  - [x] Formateo de fecha y hora local de San Luis.
  - [x] Codificación RFC 3986 / URIComponent y ensamblado de la URL `wa.me/5492664193004`.
- [x] 3.6 Escribir la suite de tests unitarios exhaustivos en `src/domain/__tests__/`:
  - [x] `pricing.test.ts`: verificar precios base, variantes y promociones 2x.
  - [x] `empanada-rules.test.ts`: probar bloqueos al exceder cuota y validación de faltantes.
  - [x] `checkout-rules.test.ts`: validar campos requeridos condicionales y cálculo de vuelto.
  - [x] `whatsapp-compiler.test.ts`: verificar concordancia exacta con la plantilla de `CONTEXT.md`.

---

### Fase 4: Componentes UI de Catálogo, Filtros y Modal de Producto
- [x] 4.1 Implementar el `Header` retro con la identidad de marca ("La Exquisita") y horario de atención.
- [x] 4.2 Implementar el `HeroSection`:
  - [x] Incorporación de la tarta recortada flotante con animación suave CSS.
  - [x] Badge dentado retro: "¡Masa Casera La Exquisita!".
  - [x] Frase vendedora de rotisería de barrio y botón de scroll rápido.
- [x] 4.3 Implementar `CategoryTabs`:
  - [x] Barra horizontal scrollable con píldoras de categorías y badges numéricos.
  - [x] Estado activo con estilo Pop-Retro y scroll sincronizado.
- [x] 4.4 Implementar `SearchBar`:
  - [x] Filtro reactivo en tiempo real por nombre e ingredientes.
  - [x] Estado vacío con diseño humorístico de bodegón ("¡Acá no tenemos sushi, che!").
- [x] 4.5 Implementar `ProductCard`:
  - [x] Visualización de foto real o placeholder retro temático.
  - [x] Badges llamativos ("2x $32.000", "Para 4 personas", "Bomba").
  - [x] Precio en pesos argentinos y botón de apertura de modal o agregado directo.
- [x] 4.6 Implementar `ProductModal` / Drawer de configuración:
  - [x] Trampa de foco (focus trap) y accesibilidad con teclado (Escape para cerrar).
  - [x] Selector de tamaño (Entera / Media) con actualización de precio en vivo.
  - [x] Selector obligatorio de guarnición (Papas Fritas / Ensalada) para milanesas/minutas.
  - [x] Selector interactivo de empanadas con stepper táctil (+/-) y barra de cuota restante.
  - [x] Campo para observaciones particulares del cliente.

---

### Fase 5: Carrito Reactivo, Checkout y Despacho a WhatsApp
- [x] 5.1 Implementar `LocalStorageAdapter` e integrarlo con el hook `useCart`:
  - [x] Identificación única de ítems mediante hash de producto + modificadores.
  - [x] Persistencia automática y recuperación en recarga de página.
- [x] 5.2 Implementar `StickyCartBar`:
  - [x] Barra flotante inferior animada que aparece al tener >= 1 ítem.
  - [x] Muestra resumen de ítems, subtotal y botón de acceso al carrito.
- [x] 5.3 Implementar `CartDrawer`:
  - [x] Vista detallada de ítems con modificación de cantidades y eliminación.
  - [x] Visualización clara de guarniciones, sabores de empanadas y notas.
  - [x] Subtotal general y botón para avanzar al Checkout.
- [x] 5.4 Implementar `CheckoutModal` y el hook `useCheckout`:
  - [x] Selector Delivery vs Retiro con renderizado condicional de campos de dirección.
  - [x] Selector Efectivo / Transferencia con cálculo automático del vuelto en vivo.
  - [x] Validación estricta en tiempo real antes de habilitar el botón de envío.
- [x] 5.5 Integrar despacho a WhatsApp y mecanismo de resiliencia:
  - [x] Botón primario: redirección directa a `wa.me/5492664193004`.
  - [x] Botón secundario: copia del ticket estructurado al portapapeles con Toast retro de confirmación.
- [x] 5.6 Implementar `OrderSuccessModal`:
  - [x] Resumen del pedido con código de ticket `#TKT-XXXX`.
  - [x] Limpieza segura del carrito tras la confirmación del despacho.

---

### Fase 6: Auditoría de Accesibilidad, Responsive en Móviles y Polish Final Pre-Ship
- [x] 6.1 Auditoría de accesibilidad (WCAG 2.1 AA):
  - [x] Verificación de ratio de contraste en amarillo/rojo con negro carbón.
  - [x] Atributos `aria-label`, `role="dialog"` y navegación por teclado en modales.
- [x] 6.2 Pruebas de responsividad en viewports móviles (360px a 430px) y tablets.
- [x] 6.3 Optimización de rendimiento web:
  - [x] Lazy loading de imágenes de catálogo.
  - [x] Verificación de First Contentful Paint < 1.2s.
- [x] 6.4 Validación end-to-end de los escenarios Gherkin de `spec.md`.
- [x] 6.5 Polish estético final con detalles Pop-Retro bodegón argentino.

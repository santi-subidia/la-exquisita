# 🍕 La Exquisita — Menú Online & Pedidos WhatsApp

> **MVP de Alta Conversión** para pizzería y rotisería tradicional con despacho estructurado directo al cajero por WhatsApp.  
> Ubicación: **Entre Ríos, San Luis Capital, Argentina**.

[![GitHub Repo](https://img.shields.io/badge/GitHub-la--exquisita-181717?logo=github)](https://github.com/santi-subidia/la-exquisita)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-51%20Passed-4BB543?logo=vitest)](https://vitest.dev/)

---

## 🌟 Características Principales

### 1. Arquitectura en Dos Vistas Optimizadas
- **Landing Page Institucional (`#inicio`)**:
  - Presentación de marca con estética retro pop y mascota pin-up al teléfono.
  - Showcase de la **tarta artesanal flotante** con masa casera recortada.
  - Destacado de **Masa 100% Casera de Elaboración Propia** (amasada diariamente por ellas).
  - Sección de **Comida al Paso por Peso** (autoservicio en salón) con consulta directa por WhatsApp.
  - Sección de **Menú del Día Rotativo** con consulta directa por WhatsApp.
  - Horarios de atención: **Miércoles a Domingos (12:00 a 15:00 y 20:00 a 00:30 hs)**, Lunes y Martes cerrado.
  - Enlaces directos a [Google Maps](https://maps.app.goo.gl/pj1xdjjb5M7FxLtZ7) e [Instagram (@la.exquisitasl)](https://www.instagram.com/la.exquisitasl/).
- **Carta Digital Mobile-First (`#carta`)**:
  - Experiencia ultra-minimalista, rápida y sin distracciones.
  - **Tarjetas compactas horizontales** en celulares para recorrer los 50+ platos sin scroll interminable.
  - Pestañas de categorías fijas (*CategoryTabs sticky*) con scroll horizontal táctil.
  - Buscador en tiempo real con empty state amigable.
  - Navegación ergonómica por el pulgar con barra inferior **BottomNav** (`Inicio` | `Carta` | `Mi Pedido`).

### 2. Pedidos Automatizados a WhatsApp
- **Número del Cajero:** `+54 9 266 419-3004` (`5492664193004`).
- **Ticket Estructurado:** Genera una comanda lista para cocina con emojis, datos del cliente, método de entrega (Delivery con dirección o Retiro en mostrador), desglose detallado de ítems, cálculo automático de vuelto en efectivo y subtotal.
- **Fallback a Portapapeles:** Si WhatsApp Web no abre automáticamente, el cliente puede copiar el pedido al portapapeles con un solo toque.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + TypeScript + Vite 5.
- **Estilos:** Tailwind CSS con paleta Pop-Retro (`#F59E0B`, `#DC2626`, `#FFFBEB`, `#111827`, sombras retro duras).
- **Iconografía:** Lucide React.
- **Testing:** Vitest (51 pruebas unitarias cubriendo pricing, reglas de empanadas, checkout y compilador de WhatsApp).
- **Deploy:** Optimizado para Vercel (`vercel.json` con soporte SPA).

---

## 🚀 Despliegue en Vercel (1 Clic)

1. Ingresá a [vercel.com/new](https://vercel.com/new).
2. Seleccioná el repositorio público: **`santi-subidia/la-exquisita`**.
3. Vercel detectará automáticamente el framework **Vite**.
4. Hacé clic en **Deploy**. ¡Listo en menos de 1 minuto!

---

## 💻 Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/santi-subidia/la-exquisita.git

# 2. Instalar dependencias
cd la-exquisita
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Correr tests
npm test -- --run

# 5. Compilar para producción
npm run build
```

---

© 2026 La Exquisita — San Luis Capital. Elaboración propia & masa casera artesanal.

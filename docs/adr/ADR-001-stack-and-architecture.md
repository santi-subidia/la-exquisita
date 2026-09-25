# ADR-001: Elección del Stack Tecnológico y Arquitectura en Capas con Módulos Profundos

* **Estado:** Aprobado
* **Fecha:** 2026-09-25
* **Decisores:** Subi (Product Owner), Arquitecto de Software
* **Contexto de Negocio:** Rotisería "La Exquisita" (San Luis, Argentina).

---

## 1. Contexto y Problema

"La Exquisita" requiere digitalizar su carta física para eliminar la saturación del mostrador telefónico y erradicar los errores en comandas de cocina (pedidos sin especificar sabores de empanadas, sin tipo de guarnición o sin dirección completa). El canal de recepción de pedidos es un número de WhatsApp atendido por el cajero (+54 9 266 419-3004).

El sistema debe operar de manera ágil en smartphones de comensales en San Luis, garantizando alta velocidad de carga, persistencia local y una interfaz temática de bodegón tradicional.

---

## 2. Opciones Tecnológicas Evaluadas

### Opción 1: Next.js (App Router) + Base de Datos (PostgreSQL/Prisma) + API Backend
* **Pros:** Soporte de Server Components y SEO nativo.
* **Contras:** Sobrecarga innecesaria para un menú que no requiere autenticación de usuarios ni pasarela bancaria mandatoria. Mayor costo de infraestructura y latencia de red innecesaria para una interacción que termina en WhatsApp.

### Opción 2: Single Page Application (Vite + React) con Arquitectura Monolítica Espagueti
* **Pros:** Velocidad inicial de codificación sin abstracciones.
* **Contras:** Lógica de promociones (2x en sándwichs) y cuotas de empanadas acopladas en componentes visuales. Imposibilidad de probar unitariamente la generación del ticket de WhatsApp sin montar la UI.

### Opción 3: Single Page Application (Vite + React + TypeScript + Tailwind CSS) con Arquitectura por Capas, Deep Modules y Seams de I/O (Seleccionada)
* **Pros:**
  - **Dominio Desacoplado:** Reglas puras de precios, cuotas y compilación de mensajes ejecutables en Node y Vitest a ultra alta velocidad.
  - **Desempeño Extremo:** Carga instantánea, sin servidores que mantener, hosteable en cualquier CDN estático (Vercel, Netlify, Cloudflare Pages).
  - **Experiencia Pop-Retro:** Tailwind CSS permite implementar la paleta bodegón con sombras duras y tipografía bold rápidamente.
  - **Resiliencia Operativa:** Integración con WhatsApp vía URL RFC 3986 con fallback seguro a portapapeles.

---

## 3. Decisión

Se adopta formalmente la **Opción 3**:
1. **Build Tool & Runtime:** Vite + React (TypeScript estricto).
2. **Estilizado & Diseño:** Tailwind CSS con configuración de tema personalizado Pop-Retro rotisería (`amber-50`, `#F59E0B`, `#DC2626`, `#111827`).
3. **Iconografía:** Lucide React.
4. **Patrón Arquitectónico:** Clean Frontend Architecture con **Módulos Profundos** (`src/domain/`, `src/hooks/`, `src/adapters/`, `src/components/`, `src/services/image-processor/`).
5. **Testing:** Vitest para pruebas unitarias de dominio y Testing Library para componentes y flujos.

---

## 4. Consecuencias

### Positivas:
- **Cero Dependencia de Backend:** Menores costos de hosting y mantenimiento nulo de base de datos.
- **Confiabilidad Total en Comanda:** Es matemáticamente imposible enviar un pedido incompleto o con cuota de empanadas errónea.
- **Testing Continuo:** Cobertura de pruebas completa sobre el motor de precios y el compilador de mensajes de WhatsApp.

### Negativas / Riesgos Mitigados:
- *Riesgo:* Bloqueo de pop-ups al abrir `wa.me` en navegadores móviles restrictivos.
- *Mitigación:* Se implementa el puerto `ClipboardPort` con botón visible de fallback que copia el ticket al portapapeles y notifica al usuario vía Toast amigable.

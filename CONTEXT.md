# CONTEXT.md - Dominio Gastronómico, Arquitectura de Datos y Mensajería WhatsApp
## Proyecto: La Exquisita - Menú Online & Pedidos WhatsApp

---

## 1. Visión General, Identidad y Propósito Estratégico

### 1.1. Contexto del Negocio
**"La Exquisita"** es una rotisería, lomitería y pizzería de barrio tradicional ubicada en San Luis, Argentina. Con una larga tradición en cocina criolla abundante, minutas al paso y pizzas a la piedra, el negocio opera en un entorno de alta demanda durante los turnos vespertinos y nocturnos (20:00 a 00:30 hs).

### 1.2. El Problema a Resolver
Actualmente, los pedidos recibidos por llamada o mensajes de WhatsApp no estructurados colapsan al personal de mostrador/caja. Se pierde tiempo crítico en un ciclo repetitivo de preguntas y respuestas:
- "¿De qué sabores querés la docena de empanadas?"
- "¿La pizza la querés entera o media?"
- "¿Las milanesas salen con fritas o con ensalada?"
- "¿Es con envío o pasás a retirar?"
- "¿Cuál es la dirección exacta y entre qué calles queda?"
- "¿Abonás en efectivo o con transferencia? ¿Precisás cambio de cuánto?"

Este cuello de botella genera demoras de 5 a 10 minutos por cliente, malentendidos en las comandas de cocina y pérdida de conversiones.

### 1.3. La Solución: Menú Online Interactivo de Alta Conversión
Un menú online web (PWA / Mobile-First) con estética retro de rotisería argentina popular, diseñado para que el comensal configure su orden de manera guiada, intuitiva y a prueba de errores. 
El resultado final no es un carrito transaccional con pasarela obligatoria, sino un **Despacho Directo a WhatsApp**: el sistema compila un ticket digital ultra estructurado que se envía al número oficial del cajero (+54 9 266 419-3004 / `wa.me/5492664193004`) listo para pasar a comanda sin una sola pregunta de descarte.

### 1.4. Identidad de Marca & Sistema Visual Pop-Retro
- **Concepto:** Bodegón / Rotisería popular de los años 60s-70s en clave moderna y vibrante ("La rotisería de barrio que todos amamos").
- **Colores Principales:**
  - `Amarillo Rotisería Cálido`: `#F59E0B` / `#FBBF24` (energía, apetito, tradición papel manteca).
  - `Negro Carbón / Pizarra`: `#111827` / `#0F172A` (contraste sólido, tipografía retro bold).
  - `Rojo Tomate / Pimiento`: `#DC2626` / `#B91C1C` (urgencia, promociones bomba, sellos retro).
  - `Blanco Crema`: `#FFFBEB` / `#FEF3C7` (fondo de tarjetas, estética menú de chapa enlozada).
- **Mascota & Elementos Icónicos:**
  - Pin-up girl tradicional al teléfono atendiendo el pedido ("¡La Exquisita te escucha!").
  - Badges dentados estilo sello ("¡BOMBA!", "SALE CON FRITAS", "PARA COMPARTIR").
  - Elemento Hero flotante dinámico: Tarta de Jamón y Queso recortada por Chroma Key (`tarta-jamon_y_queso-fondoverde.png` fondo `#00FF00` extraído).
- **Assets Reales Mapeados:**
  - `chorilomo.jpeg` -> Chorilomo / Mega Chorilomo
  - `empanadas arabes.jpeg` -> Empanadas al Horno (Docena y Media)
  - `hamburguesa.jpeg` -> Hamburguesas de Carne y Especiales
  - `lomo pizza.jpeg` -> Lomopizza (Especialidad de la casa)
  - `lomo.jpeg` -> Sándwich de Lomo XL
  - `milanesa a la napolitana.jpeg` -> Milanesa Napolitana de Carne
  - `milanesa xxl.jpeg` -> Milanesa Napolitana XXL (4 personas)
  - `pizza especial.jpeg` -> Pizza Especial (jamón y morrones)
  - `tarta-jamon y queso.jpeg` -> Tartas Caseras
  - `tarta-jamon_y_queso-fondoverde.png` -> Hero recortado flotante sin fondo

---

## 2. Glosario Canónico del Dominio Gastronómico (Ubiquitous Language)

| Término Canónico | Definición en el Dominio | Reglas de Negocio Asociadas |
| :--- | :--- | :--- |
| **Categoría (`Category`)** | Clasificador de primer nivel del menú. | Permite navegación rápida sticky pills con scroll reactivo. |
| **Producto (`Product`)** | Bien gastronómico ofrecido. Posee título, descripción, precio base o matriz de variantes, e imagen real o fallback. | Puede o no requerir selección obligatoria de modificadores. |
| **Variante de Tamaño (`SizeVariant`)** | Versión de un producto según tamaño o porción. | Aplica a Pizzas (`ENTERA` / `MEDIA`), Tartas (`ENTERA` / `MEDIA`) y Papas Clásicas (`CHICA` / `GRANDE`). Determina el precio final del ítem. |
| **Guarnición (`SideDishModifier`)** | Acompañamiento obligatorio a seleccionar para Milanesas, Costeletas y Omelettes. | Opciones excluyentes: `Papas Fritas` o `Ensalada`. Sin costo adicional. |
| **Docena / Media Docena de Empanadas** | Formato de comercialización de empanadas al horno. | Docena = 12 unidades ($12.000). Media Docena = 6 unidades ($8.000). La selección de sabores debe sumar exactamente el cupo total. |
| **Distribución de Sabores (`FlavorDistribution`)** | Conteo exacto por sabor de empanadas. | Sabores oficiales: Carne, Pollo, Árabes, Capresse, Verdura, Humita, Jamón y Queso, Tomate Cebolla y Queso. Total sumado == Cupo. |
| **Combo / Promoción (`ComboDeal`)** | Paquete promocional cerrado o con selección guiada. | Requiere selección de sabores si incluye empanadas (ej: "1 Muzza + 1 Docena"). |
| **Línea de Carrito (`CartItem`)** | Instancia concreta de un producto configurado dentro del carrito. | Definida por una clave compuesta única: producto + variante + modificadores + distribución de sabores + notas especiales. |
| **Método de Entrega (`DeliveryMethod`)** | Modalidad de recepción de la orden. | `DELIVERY` (requiere dirección exacta, piso/depto y entrecalles) o `PICKUP` (retiro por mostrador). |
| **Método de Pago (`PaymentMethod`)** | Medio con el que el cliente liquidará la compra. | `EFECTIVO` (requiere especificar monto para calcular cambio), `TRANSFERENCIA` (solicita comprobante), `MERCADOPAGO` (dinero en cuenta / link). |
| **Ticket de Despacho (`OrderPayload`)** | Estado final consolidado de la orden listo para su transmisión a WhatsApp. | Incluye timestamp, desglose de items, subtotales, recargos, datos de cliente y mensaje formateado. |

---

## 3. Matriz del Catálogo y Reglas de Modificadores

### 3.1. Pizzas (Entera: 8 porciones / Media: 4 porciones)
*Todas con salsa de tomate casera y orégano.*
- **Muzzarella:** Entera: $11.000 | Media: $7.000
- **Doble Muzza** *(muzza x2, morrones, ajo y perejil)*: Entera: $16.000 | Media: $8.500
- **Especial** *(muzza, jamón y morrón)*: Entera: $16.000 | Media: $9.000
- **Calabresa** *(muzza y calabresa)*: Entera: $17.000 | Media: $9.000
- **Roquefort** *(muzza y queso roquefort)*: Entera: $17.000 | Media: $9.000
- **Capresse** *(muzza, tomate y albahaca)*: Entera: $13.000 | Media: $7.500
- **Cuatro Quesos** *(muzza, barra, rallado y roquefort)*: Entera: $16.000 | Media: $9.000
- **Napolitana** *(muzza, tomate, ajo y perejil)*: Entera: $14.000 | Media: $8.000
- **Champignones** *(muzza c/ champignones salteados)*: Entera: $18.000 | Media: $10.000
- **Palmitos** *(muzza, jamón, palmitos y salsa golf)*: Entera: $19.500 | Media: $10.000
- **Fugazza** *(muzza y cebolla caramelizada/asada)*: Entera: $16.000 | Media: $8.500
- **Exquisita** *(4 sabores en una: especial, calabresa, napolitana y roquefort)*: Entera: $18.000 | Media: $9.500
- **Muzza c/ Anchoas:** Entera: $15.000 | Media: $8.500
- **Especial c/ Anchoas:** Entera: $18.000 | Media: $10.000
- **Jamón Crudo y Rúcula** *(muzza, crudo, rúcula, cherrys)*: Entera: $18.500 | Media: $10.000
- **Muzza c/ Choclo:** Entera: $13.000 | Media: $8.000
- **Vegetariana** *(brócoli, cebolla, mix vegetales, cherry, zanahoria, aceitunas)*: Entera: $14.000 | Media: $9.000
- **Muzza c/ Huevo** *(muzza y huevo duro rallado)*: Entera: $12.500 | Media: $7.500
- **Especial c/ Roquefort:** Entera: $19.000 | Media: $10.000
- **Hawaiana** *(muzza, ananá, jamón, guindas, azúcar negra)*: Entera: $18.000 | Media: $10.000
- **Panceta y Peras** *(muzza, panceta crocante, peras salteadas, rúcula)*: Entera: $18.000 | Media: $10.000
- **Mortadela** *(muzza, mortadela, cherrys, huevo duro)*: Entera: $13.500 | Media: $8.000
- **Bomba** *(muzza, papas fritas a caballo, huevos fritos, morrón)*: Entera: $18.000 | Media: $10.000

### 3.2. Promociones & Combos (Ahorro por Volumen)
- **2 Pizzas Muzzarellas:** $19.000
- **1 Muzza + 1 Especial:** $24.000
- **1 Muzza + 1 Fugazza:** $23.000
- **1 Muzza + 1 Docena a Elección:** $20.000 *(requiere selección de 12 empanadas)*
- **1 Especial + 1 Docena a Elección:** $24.000 *(requiere selección de 12 empanadas)*
- **1 Exquisita + 1 Docena a Elección:** $25.000 *(requiere selección de 12 empanadas)*
- **1 Muzza + 1 Especial + 1 Docena a Elección:** $33.000 *(requiere selección de 12 empanadas)*
- **1 Muzza + 1 Exquisita + 1 Docena a Elección:** $35.000 *(requiere selección de 12 empanadas)*
- **1 Muzza + 1 Calabresa + 1 Docena a Elección:** $34.000 *(requiere selección de 12 empanadas)*
- **1/2 Fuga + 1/2 Especial + 1/2 Doc Empanadas:** $22.000 *(requiere selección de 6 empanadas)*
- **1/2 Napolitana + 1/2 Doble Muzza + 1/2 Doc Empanadas:** $22.000 *(requiere selección de 6 empanadas)*
- **2 Milanesas de Carne a Elección:** $30.000 *(seleccionar variedad de mila y guarnición de cada una)*
- **2 Chorilomos con Fritas:** $19.000
- **2 Lomos XL con Fritas:** $32.000
- **2 Hamburguesas de Carne con Fritas:** $22.000

### 3.3. Especialidades (Salen siempre con papas fritas incluidas)
- **Lomopizza:** $36.000 *(Lomo completo servido entre dos masas de pizza con muzzarella)*
- **Hamburpizza:** $34.000 *(Mega hamburguesas caseras gratinadas estilo pizza)*
- **Barroluco:** $27.000 *(Sándwich tradicional de carne, queso derretido en pan de miga tostado o pebete)*
- **Barroluco a la pizza:** $32.000
- **Mega Chorilomo:** $28.000 *(Chorizo y lomo combinados, salsas especiales, papas fritas)*
- **Criminal:** $30.000 *(Pan artesanal XXL, doble milanesa de carne, queso cheddar fundido, jamón crudo, huevos fritos)*

### 3.4. Sándwichs (Salen con papas fritas incluidas)
- **Lomo XL:** $17.000 *(Promo 2x: $32.000)*
- **Chorilomo:** $11.000 *(Promo 2x: $19.000)*
- **Mechado:** $13.000 *(Carne mechada braseada en pan artesanal)*
- **Bondiola:** $13.000 *(Bondiola braseada a la plancha)*
- **Sándwich de Milanesa:** $15.000 *(Milanesa de carne completa c/ lechuga, tomate, mayonesa)*
- **Vegetariano:** $12.000 *(Mix de vegetales asados, queso, huevo)*

### 3.5. Hamburguesas (Salen con papas fritas incluidas)
- **De Carne Clásica:** $13.000 *(Promo 2x: $22.000)*
- **La Exquisita:** $15.000 *(Promo 2x: $25.000 - Doble carne, cheddar, bacon, huevo, salsa de la casa)*
- **Miga Real:** $15.000 *(Promo 2x: $26.000 - Presentación en pan de miga triple tostado)*

### 3.6. Empanadas al Horno (Masa Criolla Tradicional)
- **Docena (12 unidades):** $12.000
- **Media Docena (6 unidades):** $8.000
- **Sabores:**
  1. Carne Criolla
  2. Pollo al Verdeo
  3. Árabes (sfijas c/ limón)
  4. Capresse (muzza, tomate, albahaca)
  5. Verdura (espinaca/acelga, salsa blanca, queso)
  6. Humita (choclo cremoso)
  7. Jamón y Queso
  8. Tomate, Cebolla y Queso

### 3.7. Papas Fritas
- **Con Cheddar:** $13.000
- **La Exquisita** *(papas, cheddar, panceta, verdeo y huevos fritos)*: $16.000
- **Rústicas a la Provenza:** $14.000
- **Huevo Revuelto:** $12.000
- **Revuelto Gramajo** *(papas pai/fritas, jamón, arvejas, huevo revuelto)*: $13.000
- **Clásicas:** Chica $7.000 | Grande $9.000

### 3.8. Milanesas (Carne o Soja - Con Guarnición a elección: Papas Fritas o Ensalada)
- **Simple (Carne):** $17.000
- **Napolitana (Carne):** $17.000
- **Al Roquefort (Carne):** $17.000
- **Cuatro Quesos (Carne):** $17.000
- **A Caballo (Carne c/ 2 huevos fritos):** $17.000
- **De Soja Simple:** $8.000
- **De Soja Napolitana:** $10.000
- **De Soja A Caballo:** $10.000
- **Napolitana XXL** *(para 4 personas, sale con abundante porción de fritas):* $40.000

### 3.9. Minutas, Tartas & Tortillas
- **Tortilla Simple (Papa o Acelga):** $18.000
- **Tortilla Rellena (JYQ / Cebolla y queso / Tomate, albahaca y queso):** $22.000
- **Tortilla Exquisita (Doble milanesa en el centro, muzza, cheddar, huevos fritos):** $30.000
- **Costeleta (c/ fritas o ensalada):** $9.000
- **Costeleta a Caballo (c/ fritas o ensalada):** $11.000
- **Omelette Simple (c/ fritas o ensalada):** $8.000
- **Omelette JYQ (c/ fritas o ensalada):** $10.000
- **Tostados (Jamón y Queso en pan de miga):** $15.000
- **Tartas Caseras (JYQ o Verdura):** Entera $18.000 | Media $10.000

---

## 4. Estructura y Template del Mensaje de WhatsApp

### 4.1. Parámetros de Envío
- **Número de WhatsApp Oficial:** `+54 9 266 419-3004`
- **URI Base WhatsApp Web/App:** `https://wa.me/5492664193004`
- **Codificación:** Todo el cuerpo del mensaje debe ser procesado con `encodeURIComponent()` para preservar saltos de línea (`%0A`), asteriscos de negrita y emojis sin alteración de caracteres especiales latinos (tildes, eñes).

### 4.2. Plantilla Canónica de Texto

```text
🍕 *NUEVO PEDIDO - LA EXQUISITA* 🍕
━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *TICKET #{ticket_id}*
📅 {fecha_hora}

👤 *DATOS DEL CLIENTE:*
• Nombre: *{cliente_nombre}*
• Teléfono: *{cliente_telefono}*
• Tipo de Entrega: *{tipo_entrega}*
{bloque_domicilio}

🛒 *DETALLE DEL PEDIDO:*
{lineas_pedido}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *RESUMEN DE PAGO:*
• Subtotal Productos: *${subtotal_formateado}*
• Envío: *{costo_envio}*
• *TOTAL A PAGAR: ${total_formateado}*

💳 *Forma de Pago:* *{forma_pago}*
{bloque_pago_efectivo}
{bloque_observaciones}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 *Pedido generado desde el Menú Online de La Exquisita*
```

---

## 5. Especificaciones de Arquitectura de Datos (Modelos DDD & TypeScript)

```typescript
export type CategoryCode = 
  | 'PIZZAS'
  | 'PROMOS_COMBOS'
  | 'ESPECIALIDADES'
  | 'SANDWICHS'
  | 'HAMBURGUESAS'
  | 'EMPANADAS'
  | 'PAPAS_FRITAS'
  | 'MILANESAS'
  | 'MINUTAS_TARTAS';

export type SizeVariantCode = 'ENTERA' | 'MEDIA' | 'CHICA' | 'GRANDE';
export type SideDishOption = 'PAPAS_FRITAS' | 'ENSALADA';

export type EmpanadaFlavorCode = 
  | 'CARNE'
  | 'POLLO'
  | 'ARABES'
  | 'CAPRESSE'
  | 'VERDURA'
  | 'HUMITA'
  | 'JAMON_Y_QUESO'
  | 'TOMATE_CEBOLLA_QUESO';

export type DeliveryMethod = 'DELIVERY' | 'PICKUP';
export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'MERCADOPAGO';
export type MoneyARS = number;

export interface ProductVariant {
  id: string;
  name: string;
  sizeCode: SizeVariantCode;
  price: MoneyARS;
  description?: string;
}

export interface ModifierRule {
  requiresSideDish?: boolean;
  isEmpanadaPack?: boolean;
  empanadaQuota?: 6 | 12;
  isComboWithEmpanadas?: boolean;
  comboEmpanadasQuota?: 6 | 12;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: CategoryCode;
  description: string;
  basePrice?: MoneyARS;
  variants?: ProductVariant[];
  modifierRule?: ModifierRule;
  image?: string;
  isFeatured?: boolean;
  badge?: string;
}

export type FlavorSelection = Record<EmpanadaFlavorCode, number>;

export interface CartItemModifierSelection {
  sideDish?: SideDishOption;
  empanadaFlavors?: FlavorSelection;
  comboEmpanadaFlavors?: FlavorSelection;
  customNotes?: string;
}

export interface CartItem {
  lineId: string;
  productId: string;
  productName: string;
  selectedVariant?: ProductVariant;
  modifiers: CartItemModifierSelection;
  unitPrice: MoneyARS;
  quantity: number;
  subtotal: MoneyARS;
}

export interface CartTotals {
  itemCount: number;
  subtotal: MoneyARS;
  deliveryFee: MoneyARS | 'A_COORDINAR';
  total: MoneyARS;
}

export interface CheckoutForm {
  customerName: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: {
    street: string;
    number: string;
    floorOrApt?: string;
    betweenStreets?: string;
    referenceNotes?: string;
  };
  pickupEstimatedTime?: string;
  paymentMethod: PaymentMethod;
  cashAmountPaid?: MoneyARS;
  generalNotes?: string;
}
```

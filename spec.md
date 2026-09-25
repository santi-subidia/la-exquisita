# spec.md - Especificación BDD / Gherkin & Criterios de Aceptación
## Proyecto: La Exquisita - Menú Online & Pedidos WhatsApp

---

## 1. Objetivos del Negocio y KPIs de Aceptación del MVP

El objetivo central de este producto digital es dotar a "La Exquisita" de un canal de autoservicio que transforme una carta física estática en una experiencia de pedido interactiva, atractiva y 100% libre de ambigüedades operativas.

### KPIs Cuantitativos del MVP
1. **Tasa de Conversión a WhatsApp:** $\ge 35\%$ de los usuarios que agregan al menos un ítem al carrito completan el checkout y hacen click en "Enviar Pedido a WhatsApp".
2. **Tasa de Error en Comanda de Cocina:** $0\%$ de pedidos con datos incompletos (prohibido que un pedido llegue sin definir sabores de empanadas, sin tipo de guarnición o sin dirección de entrega cuando es delivery).
3. **Tiempo de Despacho de Pedido:** Reducción del tiempo de toma de pedidos en mostrador de 5-7 minutos telefónicos a menos de 15 segundos para el cajero (solo reenvío a comanda y acuse de recibo).
4. **Desempeño y Accesibilidad Móvil:** First Contentful Paint $< 1.2s$ y Total Blocking Time $< 100ms$ en redes 4G estándar. Experiencia 100% utilizable en smartphones de gama media/baja.

---

## 2. Criterios de Aceptación en Formato Gherkin (Spec-Driven Development)

### REGLA 1: Catálogo y Navegación Reactiva

```gherkin
Feature: Navegación del Catálogo y Búsqueda de Productos
  Como cliente de La Exquisita
  Quiero explorar el menú por categorías o buscar un plato en tiempo real
  Para encontrar rápidamente lo que deseo cenar sin fricciones

  Background:
    Given que el cliente accede a la aplicación web de La Exquisita
    And el catálogo contiene 9 categorías activas y los productos de la carta física

  Scenario: Navegación horizontal por píldoras de categorías (Pills)
    When el cliente visualiza la barra de navegación superior de categorías
    Then observa botones de filtro: "Pizzas", "Promos & Combos", "Especialidades", "Sándwichs", "Hamburguesas", "Empanadas", "Papas Fritas", "Milanesas", "Tartas y Minutas"
    When el cliente hace tap en la categoría "Hamburguesas"
    Then la vista se desplaza suavemente o filtra el listado mostrando únicamente los productos pertenecientes a "Hamburguesas"
    And la píldora "Hamburguesas" queda marcada como activa con estilo retro destacado

  Scenario: Búsqueda reactiva de productos por texto
    When el cliente escribe "napolitana" en el campo de búsqueda
    Then el catálogo filtra en tiempo real y muestra:
      | Producto | Categoría |
      | Pizza Napolitana | PIZZAS |
      | Milanesa Napolitana (Carne) | MILANESAS |
      | Milanesa Napolitana XXL | MILANESAS |
      | De Soja Napolitana | MILANESAS |
    And se ocultan los platos que no coincidan con la búsqueda

  Scenario: Búsqueda sin coincidencias (Empty State amigable)
    When el cliente escribe "sushi" en el campo de búsqueda
    Then se muestra un mensaje retro ilustrado: "¡Acá no tenemos sushi, che! Pero tenemos unos lomos y pizzas tremendas"
    And se visualiza un botón "Ver toda la carta"
    When el cliente presiona "Ver toda la carta"
    Then el campo de búsqueda se limpia y se restablece el catálogo completo

  Scenario: Visualización de badges promocionales y fotos reales
    Then los productos con promoción muestran una etiqueta visual llamativa:
      | Producto | Badge |
      | Lomo XL | "2x $32.000 con Fritas" |
      | Chorilomo | "2x $19.000 con Fritas" |
      | Hamburpizza | "Especial de la Casa" |
      | Napolitana XXL | "Para 4 Personas" |
    And los productos con fotos provistas muestran su imagen real optimizada
```

---

### REGLA 2: Configuración de Productos y Modificadores Obligatorios

```gherkin
Feature: Configuración de Productos con Modificadores
  Como cliente de La Exquisita
  Quiero seleccionar porciones, guarniciones y sabores con claridad
  Para que mi comida llegue exactamente como me gusta sin confusiones

  Scenario: Selección de tamaño en Pizzas (Entera vs Media)
    Given que el cliente selecciona "Pizza Especial" desde el catálogo
    When se abre el modal/drawer de configuración del producto
    Then se presentan las opciones de tamaño:
      | Variante | Precio |
      | Entera (8 porciones) | $16.000 |
      | Media (4 porciones) | $9.000 |
    When el cliente elige "Media (4 porciones)"
    Then el botón de acción refleja: "Agregar al Carrito - $9.000"
    When el cliente confirma la acción
    Then se agrega 1 ítem "Pizza Especial (Media)" por $9.000 al carrito

  Scenario: Selección obligatoria de guarnición en Milanesas
    Given que el cliente selecciona "Milanesa Napolitana (Carne)" ($17.000)
    When se abre el configurador de producto
    Then se muestran las opciones de guarnición:
      | Opción | Tipo |
      | Papas Fritas | Radio button |
      | Ensalada | Radio button |
    And el botón "Agregar al Carrito" permanece deshabilitado hasta que se elija una guarnición
    When el cliente selecciona "Papas Fritas"
    And escribe en las observaciones: "Milanesa bien crocante"
    Then el botón "Agregar al Carrito" se habilita mostrando "$17.000"
    When el cliente presiona el botón
    Then el ítem se añade al carrito con la guarnición "Papas Fritas" y la nota adjunta

  Scenario: Selección estricta de sabores para Docena de Empanadas
    Given que el cliente selecciona "Docena de Empanadas al Horno" ($12.000)
    When se abre el selector de sabores
    Then se visualiza un contador de cuota: "Seleccionadas: 0 / 12"
    And el botón "Agregar al Carrito" se encuentra deshabilitado con la leyenda "Faltan 12 empanadas"
    When el cliente distribuye los sabores:
      | Sabor | Cantidad |
      | Carne Criolla | 6 |
      | Árabes | 4 |
      | Jamón y Queso | 2 |
    Then el contador de cuota indica: "¡Docena completa! (12/12)"
    And todos los botones de incremento (+) de los sabores se bloquean para evitar exceder 12
    And el botón "Agregar al Carrito - $12.000" se torna activo
    When el cliente confirma
    Then se añade la docena con el desglose exacto al carrito

  Scenario: Prevención de cuota incompleta en empanadas
    Given que el cliente selecciona "Media Docena de Empanadas" (cupo 6)
    When el cliente selecciona únicamente 3 empanadas de Humita y 1 de Verdura (total 4)
    Then el botón muestra "Elegí 2 empanadas más para completar la media docena"
    And no es posible agregar el producto al carrito hasta satisfacer exactamente 6 unidades

  Scenario: Configuración de Combo complejo (1 Muzza + 1 Docena a Elección)
    Given que el cliente selecciona la promo "1 Muzza + 1 Docena a Elección" ($20.000)
    When se abre el asistente del combo
    Then se indica automáticamente que incluye 1 Pizza Muzzarella Entera
    And se despliega el selector de 12 empanadas a elección obligatoria
    When el cliente completa las 12 empanadas
    Then se habilita el botón para añadir el combo completo por $20.000
```

---

### REGLA 3: Carrito de Compras Reactivo

```gherkin
Feature: Carrito de Compras Reactivo y Persistencia
  Como cliente
  Quiero ver el resumen acumulado de mi compra y modificar cantidades
  Para tener control total de mi gasto antes de ordenar

  Background:
    Given que el cliente tiene una sesión activa en el navegador

  Scenario: Barra flotante y contador de items (Sticky Cart Bar)
    When el carrito contiene 0 productos
    Then la barra flotante inferior del carrito permanece oculta
    When el cliente agrega 1 "Lomopizza" ($36.000)
    Then la barra flotante aparece con una animación suave
    And muestra: "1 plato | $36.000" con un botón retro "Ver mi Pedido"

  Scenario: Agrupación inteligente vs líneas separadas
    Given que el carrito contiene 1 "Lomo XL" con Papas Fritas sin notas
    When el cliente vuelve a agregar otro "Lomo XL" con Papas Fritas sin notas
    Then la línea del carrito actualiza su cantidad a 2 y subtotal a $32.000 (aplicando la promo 2x)
    When el cliente agrega un tercer "Lomo XL" con la nota "Sin mayonesa ni tomate"
    Then se crea una línea separada en el carrito para preservar la instrucción particular de cocina

  Scenario: Modificación de cantidades y eliminación
    Given que el carrito contiene 2 "Papas con Cheddar" ($26.000)
    When el cliente presiona el botón decrementar (-) en dicha línea
    Then la cantidad pasa a 1 y el total se recalcula a $13.000
    When el cliente vuelve a presionar (-)
    Then se solicita confirmación rápida o se elimina el ítem del carrito
    And si el carrito queda vacío, se muestra el estado "Tu carrito está esperando que lo llenes"

  Scenario: Persistencia en recarga de página (Local Storage)
    Given que el cliente agregó productos al carrito
    When el cliente recarga la pestaña o cierra y vuelve a abrir el navegador
    Then el carrito recupera automáticamente todos los ítems y modificadores guardados
```

---

### REGLA 4: Checkout y Validación Estricta de Datos

```gherkin
Feature: Formulario de Checkout y Validación Previa
  Como personal de caja y cadetería de La Exquisita
  Necesitamos recibir todos los datos del cliente sin omisiones
  Para despachar el pedido sin tener que repreguntar por chat

  Scenario: Validación estricta para Envío a Domicilio (Delivery)
    Given que el cliente tiene productos en el carrito y abre el Checkout
    When selecciona el método de entrega "Envío a Domicilio"
    Then el formulario exige obligatoriamente los campos:
      | Campo | Validación |
      | Nombre completo | No vacío, mínimo 3 caracteres |
      | Teléfono | Numérico, formato válido argentino |
      | Calle y Altura | No vacío (ej: "Mitre 850") |
      | Entre calles / Referencia | No vacío (ej: "Entre Junín y Pringles") |
    And el campo "Piso / Departamento" es opcional
    And el botón "Pedir por WhatsApp" permanece bloqueado si falta algún campo obligatorio

  Scenario: Validación para Retiro por el Local (Take Away)
    Given que el cliente abre el Checkout
    When selecciona el método de entrega "Retiro por el Local"
    Then los campos de dirección de entrega se ocultan
    And se solicita únicamente:
      | Campo | Condición |
      | Nombre | Obligatorio |
      | Teléfono | Obligatorio |
      | Horario aproximado de retiro | Opcional con sugerencias ("En 20-30 min", "21:30 hs", "22:00 hs") |

  Scenario: Selección de Forma de Pago en Efectivo y cálculo de vuelto
    Given que el total del pedido es $24.000
    When el cliente selecciona método de pago "Efectivo"
    Then se despliega la pregunta: "¿Con cuánto vas a pagar?"
    When el cliente ingresa "$30.000"
    Then el sistema calcula en tiempo real: "Tu vuelto será de $6.000"
    And esta información se integrará en el ticket de WhatsApp para el repartidor

  Scenario: Selección de Forma de Pago por Transferencia
    When el cliente selecciona método de pago "Transferencia Bancaria"
    Then se muestra un aviso: "Al enviar el pedido te pasaremos el alias/CBU para que nos compartas el comprobante"
```

---

### REGLA 5: Despacho a WhatsApp y Mecanismo de Fallback

```gherkin
Feature: Despacho a WhatsApp y Resiliencia con Fallback
  Como cliente
  Quiero que mi pedido se transmita directamente a WhatsApp de forma fluida
  Y contar con un plan de respaldo si la aplicación no abre automáticamente

  Background:
    Given que el cliente completó válidamente el formulario de checkout
    And el número de destino configurado es "5492664193004"

  Scenario: Generación exitosa de URI wa.me y redirección
    When el cliente presiona "Enviar Pedido a WhatsApp"
    Then el sistema compila el texto completo según el template canónico de CONTEXT.md
    And aplica encodeURIComponent() a toda la cadena
    And genera la URL: "https://wa.me/5492664193004?text=..."
    And abre el enlace en una nueva pestaña (o en la app nativa de WhatsApp)

  Scenario: Mecanismo de Fallback (Copiar Pedido al Portapapeles)
    When el cliente presiona el botón secundario "Copiar pedido"
    Then el texto estructurado completo se copia al portapapeles del dispositivo
    And se muestra un Toast emergente: "¡Pedido copiado! Abrí WhatsApp y pegalo en el chat (+54 9 266 419-3004)"
    And se presenta un enlace directo para abrir el chat limpio con el número oficial

  Scenario: Limpieza controlada del carrito post-envío
    When el cliente confirma que el pedido fue despachado exitosamente
    Then el carrito local se vacía
    And se redirige a una pantalla de agradecimiento con el resumen del ticket y botón para iniciar un nuevo pedido
```

---

### REGLA 6: Showcase Gastronómico y Procesamiento de Assets Visuales

```gherkin
Feature: Utilización de Assets Fotográficos y Recorte Chroma Key
  Como usuario del menú
  Quiero ver fotografías reales y apetitosas de los platos con diseño pop retro
  Para sentir la calidez y calidad de una auténtica rotisería de barrio

  Scenario: Recorte de fondo verde de la tarta para elemento Hero flotante
    Given la imagen original "media/comida/tarta-jamon_y_queso-fondoverde.png" con fondo verde puro #00FF00
    When el motor de visualización renderiza el Hero visual
    Then la silueta de la tarta aparece con fondo completamente transparente (vía canvas chromakey filter o asset procesado PNG alfa)
    And la tarta flota sutilmente con una sombra difuminada y un sello retro: "¡Masa Casera La Exquisita!"

  Scenario: Mapeo de fotos reales del menú
    When el cliente navega por las categorías
    Then observa las imágenes de alta calidad provistas en "media/comida/":
      | Categoría | Producto | Archivo de Imagen |
      | SÁNDWICHS | Chorilomo | media/comida/chorilomo.jpeg |
      | EMPANADAS | Árabes / Variadas | media/comida/empanadas arabes.jpeg |
      | HAMBURGUESAS | Hamburguesa | media/comida/hamburguesa.jpeg |
      | ESPECIALIDADES | Lomopizza | media/comida/lomo pizza.jpeg |
      | SÁNDWICHS | Lomo XL | media/comida/lomo.jpeg |
      | MILANESAS | Milanesa Napolitana | media/comida/milanesa a la napolitana.jpeg |
      | MILANESAS | Milanesa XXL | media/comida/milanesa xxl.jpeg |
      | PIZZAS | Pizza Especial | media/comida/pizza especial.jpeg |
      | MINUTAS_TARTAS | Tarta Jamón y Queso | media/comida/tarta-jamon y queso.jpeg |

  Scenario: Placeholder retro de respaldo para productos sin foto específica
    Given un producto del menú que no cuenta con fotografía propia en media/ (ej: "Tortilla de Acelga")
    When la tarjeta de dicho producto se dibuja en pantalla
    Then se renderiza un contenedor con textura retro, icono temático de comida y la paleta de marca (#F59E0B / #111827)
    And no se visualiza ninguna imagen rota ni espacio en blanco desprolijo
```

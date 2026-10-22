# Toto Aromística — tienda online

Sitio estático (HTML generado + CSS compilado) para la tienda de Toto Aromística.
No usa frameworks ni Tailwind por CDN: el CSS se compila con Tailwind y el HTML
se genera desde `data.json`, así que la tienda funciona incluso sin JavaScript.

- Catálogo, ofertas, reseñas y fichas de producto **prerenderizadas**.
- Carrito con variantes y cantidades, persistente en el navegador.
- Checkout que arma el pedido y lo envía por WhatsApp (no cobra).
- Envíos por zona (costo manual) o "A cotizar"; retiro sin costo.
- Panel de administración con productos, combos, envíos, costos, reseñas, ventas, diseño, asistente, avisos y backups.
- Firebase opcional (Firestore + Auth + Storage) para publicar cambios de verdad.
- Asistente local con base de conocimiento editable, sin API externa ni claves.

---

## Requisitos

- Node.js 18 o superior (probado con Node 22).
- npm.

En **PowerShell**, si `npm` falla por la política de ejecución de scripts, usá
`npm.cmd` (por ejemplo `npm.cmd install`).

## Puesta en marcha

```bash
npm install          # dependencias (Tailwind + sharp)
npm run images       # descarga y optimiza imágenes (necesita internet, se corre una vez)
npm run dev          # compila y sirve en http://localhost:4173
```

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Compila Tailwind, prerenderiza el catálogo y las fichas en `dist/`. |
| `npm run build:css` | Solo compila el CSS a `.tmp/tailwind.css` (para depurar). |
| `npm run serve` | Sirve `dist/` sin recompilar (http://localhost:4173). |
| `npm run images` | Regenera WebP 200/400/800, hero, logo, favicons y `og-image.jpg`. |
| `npm run clean` | Borra `dist/`. |

> `dist/` se genera. No lo edites a mano: se pisa en cada build.
> Las rutas son absolutas (`/assets/...`), así que hay que abrir el sitio con
> `npm run dev` o `npm run serve`; con doble clic en `dist/index.html` no carga.

## Estructura

```
data.json                 Fuente de verdad del catálogo y la configuración
src/index.html            Plantilla del inicio (con tokens {{...}})
src/js/app.js             Tienda: render, carrito, checkout, bot, header
src/js/store.js           Estado, stock, carrito, envíos, mensaje de WhatsApp
src/js/bot.js             Asistente: búsqueda en la base de conocimiento y fallback
src/js/admin.js           Panel de administración
src/js/firebase.js        Capa opcional de Firestore / Auth / Storage
src/js/ui.js, dom.js      Modales accesibles, toasts, helpers
src/styles/               Tailwind (entrada) + estilos propios
scripts/build.js          Build: CSS, prerender, fichas, sitemap, robots, manifest
scripts/optimize-images.js  Imágenes y favicons
scripts/templates/        Plantilla de ficha de producto
assets/img/               Imágenes optimizadas (WebP)
firestore.rules           Reglas de seguridad de Firestore
storage.rules             Reglas de Storage
```

## Cómo editar la tienda

### Panel de administración

El acceso es **oculto**: no hay botón visible en la tienda. Se abre con **F2** o
con **tres clics seguidos en el logo** (también funciona con teclado: el logo es
un botón con `aria-keyshortcuts="F2"`). El panel se cierra con Escape, con la X o
con un clic afuera.

- **Sin Firebase** el panel funciona como *sandbox*: guarda todo en el navegador
  (`localStorage`), **no publica nada** y **no tiene autenticación real**.
  Sirve para probar. Para llevar los cambios al sitio: **Datos y ajustes → Descargar
  data.json**, reemplazá el archivo del proyecto y volvé a compilar. También
  podés **Importar data.json** desde el mismo panel para restaurar un respaldo.
- **Con Firebase** el panel pide email y contraseña, y los cambios se publican
  en Firestore al guardar. La tienda escucha esos cambios en vivo: si editás
  desde el celular, las pestañas abiertas se actualizan solas.

Pestañas del panel:

| Pestaña | Qué permite |
| --- | --- |
| **Resumen** | KPIs (productos, stock bajo, reseñas pendientes, ventas), accesos rápidos, publicar/actualizar la nube y reponer stock en un clic. |
| **Productos** | Alta y edición, variantes, imágenes, ofertas, filtros aromáticos, ingredientes, tamaño, uso, cuidados, advertencias, regalo, duplicar, ordenar por stock y ajustar unidades. |
| **Combos** | Precio y stock calculados a partir de los productos que lo componen. |
| **Envíos** | Zonas por prefijo de código postal, costo y estado de la tarifa. |
| **Costos** | Costo y margen por producto; nunca se muestran en la tienda. |
| **Reseñas** | Aprobar o rechazar reseñas pendientes. |
| **Ventas** | Registrar una venta (descuenta stock) y exportar el historial a CSV. |
| **Diseño** | Identidad, textos, colores, tipografías, imágenes, animaciones, políticas, regalos y seguridad. |
| **Asistente** | Mensajes del bot, base de conocimiento (CRUD), publicación y probador de respuestas. |
| **Avisos** | Pedidos de reposición con consentimiento; el contacto solo lo ve el admin. |
| **Datos y ajustes** | Exportar productos, stock y pedidos a CSV; descargar y restaurar backups; importar/exportar `data.json`; sincronización con Firebase. |

El catálogo público **no crea pedidos ni descuenta stock**: el checkout solo abre
WhatsApp. El descuento se registra a mano desde **Ventas**.

### data.json

Es el catálogo que usa el build. Campos principales de cada producto:

| Campo | Para qué |
| --- | --- |
| `id` | Número único. |
| `slug` | URL de la ficha (`/producto/<slug>.html`). |
| `name`, `shortDesc`, `description`, `details` | Textos. |
| `category` | `sahumerios`, `tecnologia` o `herramientas`. |
| `price`, `compareAtPrice` | Precio y precio anterior (tachado). |
| `stock` | Unidades totales del producto (no se muestra en la tienda). |
| `variants` | Lista `{ id, name, available }`. |
| `families`, `moments`, `intensity` | Filtros aromáticos: familia, ambiente/momento e intensidad (1 a 5). |
| `ingredients`, `size`, `usage`, `care`, `duration` | Ficha ampliada; se muestra solo si el dato está cargado. |
| `warnings` | Advertencias específicas del producto (se suman a las generales). |
| `giftEligible` | Si puede ofrecerse como regalo. |
| `images` | `{ file, alt, source }`; `file` es el nombre base de los WebP. |
| `badge`, `isOffer` | Etiqueta y si aparece en Ofertas. |

- **Agregado**: se muestra siempre como `Agotado` (nunca se alterna con otra palabra).
- **Stock**: el público solo ve *disponible* o *agotado*; la cantidad exacta se
  usa para limitar el carrito y se ve solo en el panel.
- **Combos**: `type: "combo"` + `comboItems: [{ productId, qty }]`. El precio y el
  stock se calculan con los componentes.
- **Costos y márgenes**: no van en `data.json`. En modo local se guardan en
  `localStorage`; con Firebase, en la colección `costs` (solo admin).

Después de editar `data.json`: `npm run build`.

### Envíos

En **Admin → Envíos** se cargan zonas: nombre, prefijos de código postal y costo.

- Sin zonas cargadas, el checkout dice **"A cotizar"** (no se inventan tarifas).
- Cada zona puede marcarse como *estimada* o *tarifa confirmada*.
- El retiro es sin costo.
- **Correo Argentino no está integrado**: no hay API pública simple ni tarifas
  automáticas. Si más adelante se contrata un servicio de cotización, hay que
  reemplazar `quoteShipping()` en `src/js/store.js`. Mientras tanto, el costo se
  confirma por WhatsApp.

## Asistente y base de conocimiento

El bot vive en `src/js/bot.js` y **no usa API externa ni claves**: busca en la
base de conocimiento y en el catálogo que ya está en la página. Se abre desde el
botón **Asistente** de la barra de navegación, el menú lateral o el acceso rápido.

- **Admin → Asistente** permite editar nombre, saludo, introducción, fallback,
  aviso y preguntas sugeridas.
- Cada entrada de conocimiento tiene `title`, `category`, `content`, `keywords`,
  `published`, fuente (`sourceType`, `sourceId`, `sourceUrl`) y `updatedAt`.
- El CRUD está en el mismo tab: crear, editar, publicar/despublicar y eliminar.
  Las entradas vacías o sin contenido se rechazan.
- El probador muestra la respuesta y la fuente interna, sin abrir WhatsApp.
- Si no hay coincidencia confiable, el bot lo dice y ofrece WhatsApp. No inventa
  precios, ingredientes, stock, beneficios, tiempos ni políticas.
- Precios y disponibilidad se consultan desde el catálogo en memoria; el stock
  exacto nunca se muestra.
- El bot bloquea consultas sobre costos, márgenes, pedidos, datos personales,
  credenciales, claves API y administración.
- En la nube, las entradas publicadas se leen con `knowledge`. Hasta que se
  publique la base, la tienda usa la copia incluida en el build para no quedar
  sin ayuda.
- El contenido de la base **no debe incluir datos privados**. Las reglas de
  Firestore solo permiten escribir a la cuenta autenticada.

Para editar la base sin tocar código: **Admin → Asistente**, cambiá el texto y
guardá. Si estás con Firebase, los cambios se publican para todos; sin Firebase
quedan en este navegador y podés exportarlos desde **Datos y ajustes**.

### Avisos de reposición

Cuando una variante está agotada, la ficha ofrece avisar. El visitante deja un
email o WhatsApp y acepta el consentimiento. En modo local el aviso se envía por
WhatsApp; con Firebase se guarda en `stockAlerts` con `status: "pending"`. Solo el
admin puede leer, actualizar o borrar esos contactos. No se publica stock exacto.

### Exportar y respaldar

En **Admin → Datos y ajustes**:

- CSV de productos, stock y pedidos.
- Backup JSON con catálogo, configuración, envíos, categorías, conocimiento,
  reseñas, testimonios, pedidos y costos.
- Restauración de un backup con los IDs originales.
- Importar/exportar `data.json` para el modo local.

Los backups pueden contener datos privados (costos, pedidos, contactos). Guardalos
en un lugar seguro y no los subas al repositorio.

## Firebase (opcional)

Sin configuración, todo funciona en modo local. Para publicar de verdad:

1. Creá un proyecto en <https://console.firebase.google.com> y agregá una app **Web**.
2. Activá **Authentication → Sign-in method → Email/Password**. No hay registro
   público desde la tienda: la cuenta se crea a mano en **Authentication → Users →
   Add user**. Después, en **Authentication → Settings → User actions**, dejá
   apagado **Enable create (sign-up)** para que nadie pueda registrarse por API.
3. Creá **Firestore Database** (modo producción) y **Storage** si vas a subir fotos.
4. Copiá `.env.example` a `.env` y completá los datos de la app web
   (`FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc.). La configuración web **no es
   secreta**: viaja al navegador por diseño. La seguridad la dan las reglas.
5. Desplegá las reglas:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

6. `npm run build` y desplegar. Abrí el panel con **F2** o **tres clics en el
   logo** e ingresá con la cuenta creada. La primera vez, si la colección
   `products` está vacía, el panel publica el catálogo local automáticamente. Si
   ya hay datos, usá **Datos y ajustes → Actualizar desde la nube** para traerlos
   o **Publicar catálogo completo** para sobrescribirlos. Publicá también la base
   de conocimiento desde **Asistente** para que el bot use la versión de la nube.

> El checkout público **no crea pedidos ni descuenta stock**: solo abre WhatsApp.
> El descuento se registra desde **Admin → Ventas** (transacción atómica). Para
> descontar automáticamente al confirmar un pago haría falta una **Cloud Function**.

### Problemas frecuentes de Firebase

- **`PASSWORD_LOGIN_DISABLED` al ingresar**: falta habilitar
  **Authentication → Sign-in method → Email/Password**. Después creá o
  restablecé la cuenta del dueño en **Authentication → Users**.
- **El panel no sincroniza**: revisá que `.env` tenga todas las variables
  `FIREBASE_*` y que el build diga `Firebase: configurado`.
- **Cualquiera puede escribir en Firestore**: las reglas todavía no se
  desplegaron. Ejecutá `firebase deploy --only firestore:rules,storage` o pegá
  `firestore.rules` y `storage.rules` en la consola.
- **El bot responde con datos viejos**: publicá la base desde **Asistente** o
  esperá la sincronización en vivo. Si la nube no tiene entradas, la tienda usa
  la base incluida en el build.

## Seguridad

- No hay claves privadas en el frontend. `data.json` no contiene contraseñas ni
  tokens (se eliminaron `pass`, `geminiApiKey`, `jsonBin*`, `githubToken`).
- Las reglas de Firestore permiten:
  - lectura pública de catálogo, configuración, conocimiento **publicado** y
    reseñas **aprobadas**;
  - crear reseñas solo como pendientes (`approved: false`) y con validación;
  - crear avisos de reposición con consentimiento, sin poder leerlos después;
  - escritura de productos, configuración, conocimiento, costos, ventas,
    avisos y moderación solo a usuarios autenticados.
- Los borradores de conocimiento no se pueden listar sin sesión: la consulta
  pública filtra `published == true`.
- Los avisos de reposición (`stockAlerts`) contienen contacto y por eso solo los
  lee el admin. El público únicamente puede crear un aviso válido.
- El registro público de cuentas debe quedar desactivado en Firebase: la única
  cuenta es la del dueño, creada a mano. Con registro abierto, cualquiera podría
  autenticarse y escribir.
- Los costos y márgenes se guardan aparte del catálogo público.
- El asistente no recibe claves ni accede a Firestore: trabaja con datos públicos
  ya cargados. No puede leer costos, pedidos, avisos ni datos de clientes.
- `storage.rules` permite subir solo imágenes de menos de 5 MB a `products/` y
  `site/`, y solo con sesión iniciada.
- `vercel.json` agrega `nosniff`, `X-Frame-Options`, `Referrer-Policy` y
  `Permissions-Policy`. Si querés una CSP estricta, hay que sumarla teniendo en
  cuenta los scripts inline del tema y del JSON-LD.

## Accesibilidad y SEO

- Modales con Escape, click afuera, bloqueo de scroll, foco atrapado y foco
  devuelto al botón que los abrió.
- Un solo modal a la vez; `aria-modal`, `aria-labelledby`, `role="status"` en
  mensajes dinámicos.
- Skip link, foco visible, `prefers-reduced-motion` respetado, sin scroll snap.
- HTML válido: no hay botones dentro de enlaces.
- `<noscript>` con alternativa por WhatsApp en la calculadora de envíos; el
  catálogo se ve sin JavaScript porque está prerenderizado.
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, canonical, Open Graph,
  Twitter Card y JSON-LD (`Store`, `Product`, `BreadcrumbList`).

## Rendimiento

- CSS compilado y minificado (~77 KB, ~14 KB con gzip), sin CDN de Tailwind ni
  Font Awesome.
- Iconos como sprite SVG inline; fuentes de Google cargadas de forma asíncrona.
- Imágenes WebP con `srcset`/`sizes`, `loading="lazy"` salvo la portada.
- JS en módulos ES, Firebase se descarga recién si hay configuración.

## Deploy

### Vercel

El repo ya trae `vercel.json` (`buildCommand: npm run build`, salida `dist/`).
Importá el repo en Vercel o corré `vercel`. Cargá en **Settings → Environment
Variables** todas las claves de `.env.example` (`FIREBASE_*` y `SITE_URL`); si
faltan, el build se genera en modo local y el panel no sincroniza. Configurá
`SITE_URL` si el dominio final no es `https://totoaromistica.vercel.app`.

### Firebase Hosting (alternativa)

`firebase.json` ya apunta a `dist`. `firebase deploy --only hosting`.

## Advertencia por OneDrive

El proyecto está dentro de **OneDrive**. OneDrive sincroniza `.git`, `node_modules`
y `dist`, lo que puede generar conflictos, archivos bloqueados o un `.git`
corrupto (sobre todo si hay dos dispositivos). Recomendación: moverlo a una
carpeta local como `C:\Users\cuent\Dev\toto-aromistica` y dejar OneDrive solo
para respaldos. **No se movió nada automáticamente.**

## Pendientes antes de publicar

- Definir el dominio real en `SITE_URL` (o en `settings.siteUrl`). Hoy el valor
  por defecto es `https://totoaromistica.vercel.app` y se usa en canonical,
  Open Graph y sitemap.
- Reemplazar las fotos de Unsplash por fotos reales de los productos
  (`assets/img/.cache/` guarda los originales descargados).
- Verificar que los testimonios de Mariana R., Gonzalo M. y Camila V. sean reales
  y estén autorizados.
- Cargar las tarifas de envío reales (o dejar "A cotizar").
- Configurar Firebase:
  - **Authentication → Sign-in method → Email/Password** habilitado.
  - Una cuenta de dueño creada en **Authentication → Users**.
  - **Authentication → Settings → User actions → Enable create (sign-up)**
    desactivado.
  - Reglas de `firestore.rules` y `storage.rules` desplegadas. Mientras sigan en
    modo abierto, cualquier visitante puede escribir.
- El catálogo actual ya está cargado en Firestore (`products` + `config/site`).
  Verificá que los cambios del panel se vean en otro dispositivo.
- Revisar precios, stock y descripciones contra la lista real de la tienda.

# Pokédex — Global66 Challenge (Front End Developer, Vue.js)

Pokédex construida en **Nuxt 3** (Vue.js) consumiendo [PokeAPI](https://pokeapi.co/), con
listado, búsqueda, filtro por tipo, detalle de pokémon, favoritos persistidos,
onboarding, y una versión de escritorio con sidebar además de la mobile con
bottom nav.

## Índice

- [Stack y por qué](#stack-y-por-qué)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Endpoints usados y por qué son 5, no 2](#endpoints-usados-y-por-qué-son-5-no-2)
- [Decisiones de arquitectura clave](#decisiones-de-arquitectura-clave)
- [Composables](#composables)
- [Utils](#utils)
- [Stores (Pinia)](#stores-pinia)
- [Componentes](#componentes)
- [Layouts y flujo de navegación](#layouts-y-flujo-de-navegación)
- [Cero tablas de traducción propias](#cero-tablas-de-traducción-propias)
- [Debilidades: por qué no es solo "unir listas"](#debilidades-por-qué-no-es-solo-unir-listas)
- [Libertades tomadas donde el diseño no especifica](#libertades-tomadas-donde-el-diseño-no-especifica)
- [Botón compartir: qué copia y por qué](#botón-compartir-qué-copia-y-por-qué)
- [Tests](#tests)
- [Mejoras a futuro](#mejoras-a-futuro)
- [Cómo correr](#cómo-correr)

## Stack y por qué

- **Nuxt 3**: el brief pide "Vue.js" a secas, pero Nuxt da estructura de
  carpetas, auto-imports, layouts y SSR out-of-the-box — mostrando también
  criterio de arquitectura, uno de los puntos que evalúan.
- **Tailwind**: iteración rápida de UI, fácil de mapear contra tokens de
  diseño (spacing, colores reales del Figma).
- **Pinia + `@pinia-plugin-persistedstate/nuxt`**: store oficial de Vue 3. El
  plugin de persistencia resuelve "favoritos persistidos sin backend" con una
  sola línea (`persist: { storage: persistedState.localStorage }`), en vez de
  reinventar lectura/escritura manual de `localStorage`.
- **`@nuxt/icon` + Material Symbols (Iconify)**: íconos como SVG inline
  (no fuente/ligature), tree-shakeable — solo empaqueta los que realmente se
  usan — y con color controlado 100% por CSS (`currentColor`).

## Estructura del proyecto

```
app.vue                     # Monta el layout + <Toast /> global
nuxt.config.ts               # Módulos, alias de componentes (pathPrefix: false), runtimeConfig
tailwind.config.ts           # Theme, importa colores desde utils/typeColors.ts
plugins/pokeapi.ts           # Cliente ofetch preconfigurado (baseURL + manejo de error)
layouts/
  default.vue                 # Sidebar (desktop) + padding para el contenido
  blank.vue                   # Sin nav — "/" (splash) y onboarding
pages/
  index.vue                    # Splash: pokebola girando, siempre al entrar → /onboarding
  onboarding.vue                # 2 pasos (responsive, layout distinto en desktop) → /list
  list.vue                      # Pokedex real: listado + búsqueda + filtro
  favoritos.vue                  # Lista de favoritos + búsqueda + filtro + swipe-delete
  perfil.vue                     # Perfil dummy (Ash Ketchum) + stats reales
  regiones.vue                   # "Próximamente"
  pokemon/[name].vue             # Detalle de un pokémon
components/
  global/     # Genéricos, auto-registrados sin prefijo de carpeta: nav, búsqueda,
              # badges de tipo, loader, toast, etc.
  pokemon/    # Específicos de dominio: card, filtro, compartir, habilidad
  states/     # EmptyState reutilizable (error / vacío / "en construcción")
composables/  # Lógica reutilizable (ver sección propia)
stores/       # Pinia (ver sección propia)
utils/        # Datos/constantes compartidas (ver sección propia)
types/pokemon.d.ts   # Todos los tipos TS: raw de la API + normalizados
tests/unit/          # Vitest — lógica pura, sin dependencia de contexto Nuxt
public/
  type-icons/{slug}.svg        # SVG de cada tipo (18), badge normal + máscara de degradado
  nav-icons/                    # pokeball.svg, pokeballGray.svg, pokeRadar.svg, habilidad.svg
  illustrations/                 # Estados vacíos, onboarding, loader
  profile/ash.jpg                 # Avatar del perfil dummy
```

## Endpoints usados y por qué son 5, no 2

El brief original pide "solo 2 llamados" (`GET /pokemon` y
`GET /pokemon/{name}`). Para armar la pantalla de detalle tal cual el diseño
(descripción, categoría, género, debilidades, nombres de tipo/habilidad en
español) eso no alcanza — esos datos no existen en esos 2 endpoints. Se
sumaron 3 más, todos de solo lectura y del mismo dominio:

| Endpoint                      | Para qué                                                              |
| ----------------------------- | --------------------------------------------------------------------- |
| `GET /pokemon`                | Listado paginado                                                      |
| `GET /pokemon/{name}`         | Detalle base: tipos, sprite, peso, altura, stats, habilidades (slugs) |
| `GET /pokemon-species/{name}` | Descripción, categoría (genus), % de género                           |
| `GET /type/{name}`            | Label del tipo en español + relaciones de daño (debilidades)          |
| `GET /ability/{name}`         | Label de la habilidad en español                                      |

## Decisiones de arquitectura clave

### Fetch en un plugin + composable, no todo mezclado

`plugins/pokeapi.ts` crea **una sola instancia de `ofetch`** con la
`baseURL` de PokeAPI y manejo de error centralizado, inyectada como
`nuxtApp.$pokeApi`. `usePokemonApi()` la consume en vez de armar su propia
config. Si mañana hace falta un API key, reintentos, o loguear errores a un
servicio externo, se toca **un solo archivo** (el plugin), no cada lugar que
hace fetch.

### Detalle lazy por card (`IntersectionObserver`)

`GET /pokemon` solo da nombre + URL — **no** tipo, sprite, ni nada visual.
Para pintar cada card (color de fondo por tipo, sprite, badges) hace falta el
detalle de cada pokémon individual. Con ~1300 pokémon en total, pedirlo todo
de una sería un problema de performance real ("pensar en gran cantidad de
data" es justo lo que evita esto).

Solución: `useLazyPokemonDetail` — cada `PokemonCard` observa su propia
visibilidad y solo entonces pide su detalle (con `rootMargin: 200px` para
precargar un poco antes de que sea 100% visible). El resultado queda
cacheado en el store, así que scrollear de ida y vuelta no repite llamados.

**Trade-off documentado, no silencioso**: el filtro por tipo
(`pages/list.vue`, `pages/favoritos.vue`) solo puede evaluar contra pokémon
cuyo detalle ya esté en cache — si se activa un filtro antes de scrollear
toda la lista, pokémon que matchean pero aún no cargaron no van a aparecer.
Consecuencia directa de que el endpoint de lista no trae tipo.

### Botón "Cargar más" en vez de infinite scroll

Se evaluó reemplazar el botón por auto-carga al
llegar al final del scroll. Se descartó por una razón concreta: el problema
real de "gran cantidad de data" en el listado **no es** el disparador del
fetch (botón vs. scroll automático) — es que ningún `PokemonCard` montado se
desmonta nunca. Cada card trae su propio `IntersectionObserver` para el
detalle lazy; con cientos de items cargados en una sesión larga, eso es
cientos de nodos DOM + observers vivos simultáneamente, sin importar cómo se
disparó la carga.

El botón, con la fricción de un click consciente, autolimita cuánta data se
acumula en una sesión típica. Infinite scroll saca esa fricción y hace más
fácil acumular cientos de cards sin querer, **agravando** el problema en vez
de resolverlo.

### Debilidades: por qué no es solo "unir listas"

Con dos tipos (ej. Bulbasaur = Planta + Veneno), un tipo atacante puede ser
2x contra uno de los tipos propios pero 0.5x o 0x contra el otro — el
resultado neto no es una simple unión. Ejemplo real: Veneno es 2x contra
Planta, pero Veneno se resiste a sí mismo (0.5x) → neto 1x (neutro). Sumar
ingenuamente los `double_damage_from` de cada tipo hubiera mostrado "Veneno"
y "Bicho" como debilidades de Bulbasaur, cosa que el juego real no hace.

`composables/useTypeEffectiveness.ts` calcula el multiplicador real
cruzando `double/half/no_damage_from` de **todos** los tipos del pokémon
para cada tipo candidato, y solo lo cuenta como debilidad si el resultado
neto es mayor a 1x. Cubierto por test con el caso real de Bulbasaur.

### Tipos técnicos excluidos del filtro

`GET /type` devuelve 21 registros, no 18: además de los tipos jugables
normales incluye `unknown` (placeholder, traduce a "???"), `shadow` (tipo
de los Pokémon Sombra de Colosseum/XD) y `stellar` (el tipo Tera de
Scarlet/Violet — real, pero no forma parte de los 18 clásicos que soporta
el diseño, sin color/ícono/silueta definidos). Los tres se excluyen en
`usePokemonApi().fetchTypeList()` con un `Set` explícito y comentado, no a
ciegas.

## Composables

Todos en `composables/`, auto-importados por Nuxt (no hace falta `import`
en componentes/páginas).

- **`usePokemonApi()`** — capa de acceso a PokeAPI. Habla con el cliente
  inyectado por el plugin (`$pokeApi`), nunca arma su propia config de
  fetch. Expone `fetchList`, `fetchDetail`, `fetchSpecies`, `fetchType`,
  `fetchTypeList`, `fetchAbility`, cada uno con su función `normalize*`
  privada que convierte la respuesta cruda de la API al modelo que consume
  la UI (`types/pokemon.d.ts`).
- **`usePokemonType()`** — **solo colores** (decisión de diseño visual, no
  traducción de idioma): `classes(type)` para las clases de Tailwind
  (`bg-type-*`), `icon(type)` y `shape(type)` para los SVG locales de
  `public/type-icons/`, y `gradient(type)` para el degradado inline que usa
  `TypeShape`. Los colores hex vienen de `utils/typeColors.ts`, no
  duplicados acá.
- **`useLazyPokemonDetail(name)`** — el `IntersectionObserver` por card
  explicado arriba. Devuelve `{ el, detail, loading }`; `el` es el ref que
  hay que atar al elemento que se observa.
- **`useTypeEffectiveness()`** — `weaknessesFor(types: PokemonType[])`, el
  cálculo de debilidades real explicado arriba. Función pura, sin estado,
  100% testeable sin contexto de Nuxt.
- **`useToast()`** — toast global simple (`useState` compartido, no un
  store de Pinia completo porque no hace falta más que un valor + un
  método). `show(message, duration?)` reemplaza el mensaje actual y lo
  autolimpia con `setTimeout`, comparando por `id` para no pisar un toast
  más nuevo si se dispara otro mientras el anterior sigue visible.

## Utils

En `utils/`, también auto-importado, pero son **datos**, no lógica — por
eso van separados de `composables/`.

- **`typeColors.ts`** — `TYPE_COLORS`: los 18 colores reales (extraídos del
  Figma vía Dev Mode) por tipo, `{ DEFAULT, soft }`. Fuente única: la
  importan tanto `tailwind.config.ts` (para generar las clases `bg-type-*`)
  como `usePokemonType.ts` (para el degradado inline) — nunca se duplica un
  hex en dos lugares que puedan desincronizarse.
- **`navItems.ts`** — `NAV_ITEMS`: los 4 ítems de navegación (Pokédex,
  Regiones, Favoritos, Perfil), cada uno marcado como `type: 'image'`
  (Pokédex/Regiones, íconos custom del Figma) o `type: 'icon'`
  (Favoritos/Perfil, Material Symbols). Única fuente que consumen tanto
  `BottomNav.vue` (mobile) como `Sidebar.vue` (desktop) — evita mantener la
  misma lista dos veces.

## Stores (Pinia)

En `stores/`, cuatro stores chicos y enfocados en vez de uno grande:

- **`pokemon.ts`** — `items` (lista liviana: nombre + id), `detailCache` y
  `speciesCache` (por nombre, evitan refetch). `loadNextPage()` pagina con
  `limit`/`offset` y se auto-bloquea si ya está `loading` o no `hasMore`.
  `filtered(search, types)` es un getter parametrizado: filtra `items` por
  texto siempre, y por tipo solo contra lo que ya esté en `detailCache`
  (ver trade-off documentado arriba).
- **`types.ts`** — cache de `PokemonType` por slug. `ensure(slug)` trae y
  cachea uno; `ensureAll()` trae los 18 de una (usado al abrir el modal de
  filtro, que necesita mostrarlos todos con su label real).
- **`abilities.ts`** — mismo patrón que `types.ts` pero para habilidades
  (`PokemonAbility`, solo `ensure(slug)`).
- **`favorites.ts`** — `names: string[]` (solo el nombre; el detalle vive
  en el cache de `pokemon.ts`, no se duplica). `toggle(name)` agrega/saca y
  dispara el toast correspondiente ("agregado"/"quitado de favoritos") —
  centralizado acá para que **cualquier** lugar que llame `toggle` (card,
  botón del detalle, swipe en favoritos) dispare el mensaje sin tener que
  repetir la lógica en cada componente. Persistido con
  `@pinia-plugin-persistedstate/nuxt` en `localStorage`.

## Componentes

### `components/global/` — genéricos, sin conocimiento de dominio Pokémon

Registrados sin prefijo de carpeta (`pathPrefix: false` en `nuxt.config.ts`),
así que se usan como `<BottomNav />`, `<TypeBadge />`, etc. directo.

- **`BottomNav.vue`** / **`Sidebar.vue`** — mismos `NAV_ITEMS`, uno visible
  solo en mobile (`md:hidden`), el otro solo en desktop (`hidden md:flex`).
  Nunca se muestran los dos a la vez.
- **`SearchBar.vue`** — input de búsqueda + botón de filtro opcional
  (prop `show-filter`, default `false` — así `list.vue` y `favoritos.vue`
  deciden si lo muestran sin duplicar el componente).
- **`TypeBadge.vue`** — pill de tipo: ícono (local del Figma, con color
  propio tal cual viene del archivo) + label (resuelto vía `useTypesStore`,
  nunca un diccionario propio).
- **`TypeShape.vue`** — la silueta grande con degradado detrás del sprite
  (card chica y hero del detalle). Usa el mismo SVG de `TypeBadge` pero como
  **máscara CSS** (`mask-image`): el archivo solo aporta la forma, el color
  lo pone `gradient()` con CSS puro — mismo SVG sirve para cualquier
  paleta, sin editar el archivo.
- **`Loader.vue`** — imagen con `animate-spin` (respeta
  `prefers-reduced-motion`), usada en la pagina inicial y en cualquier estado
  de carga.
- **`LoadingOverlay.vue`** — `Loader` + fondo oscuro `fixed inset-0 z-50`
  que bloquea toda interacción con la pantalla (incluso el sidebar/nav, que
  quedan en `z-20`). Compuesto sobre `Loader`, no le agrega este
  comportamiento al `Loader` en sí porque la pagina inicial lo usa de forma
  distinta (sin overlay oscuro).
- **`Toast.vue`** — se monta una sola vez en `app.vue`, fuera de
  `NuxtLayout` (así aparece igual en cualquier layout). `Teleport` a
  `body`, `z-[60]` (por encima de todo, incluso del `LoadingOverlay`).

### `components/pokemon/` — con conocimiento de dominio

- **`PokemonCard.vue`** — la card del listado. `useLazyPokemonDetail` para
  el detalle lazy, skeleton mientras carga, `TypeShape` para el blob de
  fondo.
- **`FilterModal.vue`** — responsive: bottom sheet ancho completo en
  mobile (`items-end`, `rounded-t-2xl`), dialog centrado con ancho acotado
  en desktop (`md:items-center`, `md:max-w-md`, `md:rounded-2xl`) — mismo
  componente, mismo estado, solo cambia la presentación por breakpoint.
- **`ShareButton.vue`** — copia al portapapeles con labels legibles
  (nombre, número de pokédex, tipo, peso, altura, categoría, habilidades
  marcando cuál es la oculta, y debilidades). Resuelve todo eso vía los
  stores ya cacheados justo antes de copiar — si la página ya los pidió
  para pintarse, esto no dispara ningún llamado nuevo a la API.
- **`AbilityLabel.vue`** — mismo patrón que `TypeBadge` pero para
  habilidades: resuelve el label real vía `useAbilitiesStore`.

### `components/states/`

- **`EmptyState.vue`** — un solo componente reutilizado para las pantallas
  que comparten estructura (error de carga, favoritos vacío/sin resultados
  de filtro, "en construcción" de Regiones) — cambia imagen, texto y CTA
  opcional, nunca la estructura.

## Layouts y flujo de navegación

- **`layouts/default.vue`** — `Sidebar` + `md:pl-64` en el contenido (para
  que no quede tapado atrás del sidebar en desktop). Es el layout por
  default de cualquier página que no especifique otro.
- **`layouts/blank.vue`** — sin nav de ningún tipo. Usado por `index.vue`
  (splash) y `onboarding.vue` vía `definePageMeta({ layout: 'blank' })` —
  mostrar el sidebar de fondo durante el onboarding no tendría sentido.

**Flujo real:**

1. `/` (`index.vue`, layout `blank`) — pokebola girando ~1.2s → `/onboarding`.
2. `/onboarding` — 2 pasos (con su propio layout responsive: apilado en
   mobile, imagen + texto lado a lado en desktop) → `/list`.
3. `/list` es la Pokedex real — accesible directo desde el nav
   (mobile/desktop) sin volver a pasar por el splash.

## Cero tablas de traducción propias

Ningún archivo tiene un diccionario tipo `{ grass: 'Planta' }`. Todo label
visible sale de la respuesta real de la API:

- `TypeBadge` y `FilterModal` resuelven el nombre del tipo desde
  `/type/{name}` → `names`, filtrado por `language.name === 'es'`.
- `AbilityLabel` hace lo mismo con `/ability/{name}`.
- Descripción y categoría salen de `/pokemon-species/{name}` →
  `flavor_text_entries` / `genera`, mismo filtro.
- **Si la API no trae español para algo puntual, se muestra tal cual
  vino** (el slug en inglés, u otro idioma si es lo único disponible) —
  nunca se rellena con una traducción inventada a mano.

Los únicos "diccionarios" que quedan en el código son de **color**
(`usePokemonType` / `utils/typeColors.ts`), porque eso es una decisión de
diseño visual, no de idioma.

## Libertades tomadas donde el diseño no especifica

- **Perfil**: en las capturas originales solo existía como ítem de bottom
  nav, sin contenido. Se armó un perfil dummy con **Ash Ketchum** como
  usuario de ejemplo (nombre, ciudad, medallas coloreadas reusando la
  paleta de tipos existente) — los únicos datos reales son el contador de
  favoritos y la mini-lista de "Mis favoritos" (`favoritesStore`).
- **Sidebar de desktop**: no estaba en el brief original (pensado para
  mobile), se agregó como versión de escritorio con su propio layout.
- **Toast al agregar/quitar favoritos**: mejora de UX de confirmación no
  contemplada en el brief original.

## Botón compartir: qué copia y por qué

Cumple el requisito del brief ("copiar en el portapapeles el nombre del
pokémon con sus atributos separados por coma") con formato legible por
labels en vez de valores sueltos. Ejemplo real (Bulbasaur):

```
Nombre: Bulbasaur, Nro pokédex: 001, Tipo: Planta, Veneno, Peso: 6.9 kg,
Altura: 0.7 m, Categoría: Semilla, Habilidades: Espesura, Clorofila (oculta),
Debilidades: Fuego, Hielo, Volador, Psíquico
```

## Tests

`tests/unit/` — Vitest, cubriendo lógica de negocio pura (stores de Pinia
y composables sin efectos secundarios ni dependencia de contexto de Nuxt en
runtime), incluyendo específicamente el cálculo de debilidades con el caso
real de Bulbasaur y los casos que una implementación ingenua calcularía
mal. Se va a seguir ampliando la cobertura.

```bash
npm run test
```

## Mejoras a futuro

- **Flecha de "volver" redundante con la navegación principal**: el
  detalle de pokémon y `favoritos.vue` muestran una flecha "‹" para
  volver _al mismo tiempo_ que el sidebar (desktop) o el bottom nav
  (mobile) siguen visibles — dos formas de navegar hacia atrás/al home
  compitiendo en la misma pantalla. Vale la pena definir un criterio único
  (por ejemplo, sacar la flecha en desktop ya que el sidebar cubre esa
  necesidad, y dejarla solo en mobile donde tiene más sentido como patrón
  de navegación por stack).
- **Cambiar imagenes por iconos si es posible**, en algunos casos he usado
  imagenes para ciertos iconos y me tome la libertad de cambiar algunos
  para que vayan mas con la tematica pokemon, eso se podria mejorar buscando
  otra libreria de iconos que quizas contengan algo relacionado a pokemon
  para evitar el uso de imagenes.
- **Componentizar los bloques repetidos del detalle**: los 4 recuadros de
  Peso/Altura/Categoría/Habilidad en `pokemon/[name].vue` son casi
  idénticos entre sí (ícono + label + caja con valor) pero están escritos
  a mano 4 veces — un componente `StatBox` chico los dejaría en un `v-for`
  y evitaría que un cambio de estilo haya que repetirlo 4 veces.
- **Confirmar hex exactos de Figma** en algunos casos los colores diferian
  bastante, si bien algunos son los exactos, otros se tomaron en base
  al diseño para que vayan acorde, pero tocaria confirmar con el equipo.
- **Confirmar posición real del botón "compartir"**, en el figma no figura
  el boton compartir, se tomo la decision de dejarlo al lado del boton
  de agregar a favorito en la seccion de info del pokemon, pero podria
  mejorarse segun el equipo de diseño.

## Cómo correr

```bash
npm install
npm run dev
npm run test
```

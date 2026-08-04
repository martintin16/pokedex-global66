import { TYPE_COLORS } from "~/utils/typeColors";

// Clases de Tailwind (badge/fondo de card). IMPORTANTE: literales, una
// por una — Tailwind JIT escanea el código como TEXTO buscando nombres
// de clase completos; una clase armada en runtime con template strings
// (`bg-type-${slug}`) nunca se generaría en el CSS final, aunque el
// slug sea válido. Por eso no se deriva de TYPE_COLORS con un loop.
const TYPE_CLASSES: Record<string, { badge: string; soft: string }> = {
  grass: { badge: "bg-type-grass text-white", soft: "bg-type-grass-soft" },
  poison: { badge: "bg-type-poison text-white", soft: "bg-type-poison-soft" },
  fire: { badge: "bg-type-fire text-white", soft: "bg-type-fire-soft" },
  water: { badge: "bg-type-water text-white", soft: "bg-type-water-soft" },
  electric: {
    badge: "bg-type-electric text-ink",
    soft: "bg-type-electric-soft",
  },
  psychic: {
    badge: "bg-type-psychic text-white",
    soft: "bg-type-psychic-soft",
  },
  ice: { badge: "bg-type-ice text-ink", soft: "bg-type-ice-soft" },
  dragon: { badge: "bg-type-dragon text-white", soft: "bg-type-dragon-soft" },
  fairy: { badge: "bg-type-fairy text-ink", soft: "bg-type-fairy-soft" },
  ghost: { badge: "bg-type-ghost text-white", soft: "bg-type-ghost-soft" },
  flying: { badge: "bg-type-flying text-ink", soft: "bg-type-flying-soft" },
  bug: { badge: "bg-type-bug text-white", soft: "bg-type-bug-soft" },
  rock: { badge: "bg-type-rock text-white", soft: "bg-type-rock-soft" },
  ground: { badge: "bg-type-ground text-ink", soft: "bg-type-ground-soft" },
  normal: { badge: "bg-type-normal text-white", soft: "bg-type-normal-soft" },
  fighting: {
    badge: "bg-type-fighting text-white",
    soft: "bg-type-fighting-soft",
  },
  steel: { badge: "bg-type-steel text-ink", soft: "bg-type-steel-soft" },
  dark: { badge: "bg-type-dark text-white", soft: "bg-type-dark-soft" },
};

// Un solo SVG por tipo (el mismo que exportaron del Figma, color
// sólido tal cual viene), usado de DOS formas distintas según quién lo
// consuma:
//   - TypeBadge: lo muestra como <img> normal, con su color propio
//     (el que ya trae el archivo, sin tocar).
//   - TypeShape (blob grande en PokemonCard / hero del detalle): lo
//     usa como mask-image, ignorando el color del archivo y pintando
//     un degradado propio con CSS (ver gradient() más abajo).
// Carpeta real: public/type-icons/{slug}.svg — si el nombre de la
// carpeta vuelve a cambiar, este es el único lugar que hay que tocar.
// Se generan las 18 rutas de una porque los 18 SVG ya están
// exportados; si en algún momento falta uno puntual, el síntoma es un
// 404 silencioso en Network (y, en dev, el warning "No match found
// for location" de Vue Router — Nitro cae al router de páginas cuando
// no encuentra el estático). Ese warning apuntando a un slug puntual
// es la señal de que ESE archivo no está o el nombre no matchea.
const TYPE_SVG: Record<string, string> = Object.fromEntries(
  Object.keys(TYPE_COLORS).map((slug) => [slug, `/type-icons/${slug}.svg`]),
);

export function usePokemonType() {
  function classes(type: string) {
    return (
      TYPE_CLASSES[type] ?? {
        badge: "bg-gray-300 text-ink",
        soft: "bg-gray-100",
      }
    );
  }

  /** SVG del tipo, color sólido tal cual viene del Figma — para
   * mostrar directo en TypeBadge. Null solo si el slug no existe en
   * TYPE_COLORS (tipo inválido/desconocido) — no valida si el archivo
   * físico está en disco, así que un nombre de archivo mal escrito da
   * 404 en vez de null. Quien lo consuma cae al ícono de la API o a
   * un placeholder si igual llega a fallar la carga. */
  function icon(type: string): string | null {
    return TYPE_SVG[type] ?? null;
  }

  /** Mismo SVG que icon(), pensado para usar como mask-image (ver
   * TypeShape.vue) — el color del archivo se ignora en ese caso. */
  function shape(type: string): string | null {
    return TYPE_SVG[type] ?? null;
  }

  /** Degradado radial armado con los mismos hex que usa Tailwind
   * (TYPE_COLORS): centro claro (soft) → borde saturado (DEFAULT). */
  function gradient(type: string): string {
    const c = TYPE_COLORS[type];
    if (!c) return "radial-gradient(circle, #E5E7EB, #D1D5DB)"; // gris neutro de fallback
    return `radial-gradient(circle at 35% 30%, ${c.soft}, ${c.DEFAULT})`;
  }

  return { classes, icon, shape, gradient };
}

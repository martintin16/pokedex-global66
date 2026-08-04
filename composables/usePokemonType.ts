// Solo color por tipo: es una decisión de diseño (badge/fondo de card)
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

export function usePokemonType() {
  function classes(type: string) {
    return (
      TYPE_CLASSES[type] ?? {
        badge: "bg-gray-300 text-ink",
        soft: "bg-gray-100",
      }
    );
  }

  return { classes };
}

// Fuente única de los colores por tipo de Pokémon. `tailwind.config.ts`
// los usa para generar las clases `bg-type-*`, y `usePokemonType.ts`
// los usa para armar el degradado inline del componente TypeShape.
// Un solo lugar para tocar si cambia una paleta
export const TYPE_COLORS: Record<string, { DEFAULT: string; soft: string }> = {
  grass: { DEFAULT: "#63BC5A", soft: "#B1DEAC" },
  poison: { DEFAULT: "#B567CE", soft: "#DAB3E6" },
  fire: { DEFAULT: "#FF9800", soft: "#FFCC80" },
  water: { DEFAULT: "#5090D6", soft: "#A8C8EA" },
  electric: { DEFAULT: "#F4D23C", soft: "#FAE89E" },
  psychic: { DEFAULT: "#FA7179", soft: "#FCB8BC" },
  ice: { DEFAULT: "#73CEC0", soft: "#B9E6E0" },
  dragon: { DEFAULT: "#0B6DC3", soft: "#85B6E1" },
  fairy: { DEFAULT: "#EC8FE6", soft: "#F6C7F2" },
  ghost: { DEFAULT: "#5269AD", soft: "#A8B4D6" },
  flying: { DEFAULT: "#89AAE3", soft: "#C4D4F1" },
  bug: { DEFAULT: "#91C12F", soft: "#C8E097" },
  rock: { DEFAULT: "#C5B78C", soft: "#E2DBC6" },
  ground: { DEFAULT: "#D97845", soft: "#ECBCA2" },
  normal: { DEFAULT: "#919AA2", soft: "#C8CCD0" },
  fighting: { DEFAULT: "#CE416B", soft: "#E6A0B5" },
  steel: { DEFAULT: "#5A8EA2", soft: "#ACC6D0" },
  dark: { DEFAULT: "#5A5465", soft: "#ACAAB2" },
};

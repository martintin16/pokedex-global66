import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Azul primario: CTAs (Continuar, Empecemos, Reintentar, Aplicar)
        // TODO: ajustar al hex exacto de Figma
        primary: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
        ink: "#1F2937", // texto principal (títulos)
        muted: "#6B7280", // texto secundario (descripciones)
        surface: "#FFFFFF",
        app: "#F5F5F7", // fondo general de la app

        // Colores por tipo de Pokémon: badge (pill) + fondo de card.
        type: {
          grass: { DEFAULT: "#78C850", soft: "#DCEFD1" },
          poison: { DEFAULT: "#A040A0", soft: "#F1DDF1" },
          fire: { DEFAULT: "#F08030", soft: "#FFE8CC" },
          water: { DEFAULT: "#6890F0", soft: "#DCE7FB" },
          electric: { DEFAULT: "#F8D030", soft: "#FDF3CC" },
          psychic: { DEFAULT: "#F85888", soft: "#FBDDE8" },
          ice: { DEFAULT: "#98D8D8", soft: "#E4F5F5" },
          dragon: { DEFAULT: "#7038F8", soft: "#E2D9FC" },
          fairy: { DEFAULT: "#EE99AC", soft: "#FCE9EE" },
          ghost: { DEFAULT: "#705898", soft: "#E5E1EC" },
          flying: { DEFAULT: "#A890F0", soft: "#EAE3FC" },
          bug: { DEFAULT: "#A8B820", soft: "#EDF0D4" },
          rock: { DEFAULT: "#B8A038", soft: "#EFE9D3" },
          ground: { DEFAULT: "#E0C068", soft: "#F9EFD6" },
          normal: { DEFAULT: "#A8A878", soft: "#ECEBDF" },
          fighting: { DEFAULT: "#C03028", soft: "#F3D6D4" },
          steel: { DEFAULT: "#B8B8D0", soft: "#EEEEF5" },
          dark: { DEFAULT: "#705848", soft: "#E4DDD9" },
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        card: "1.25rem",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

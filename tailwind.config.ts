import type { Config } from "tailwindcss";
import { TYPE_COLORS } from "./utils/typeColors";

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
        ink: "#121212", // texto principal (títulos)
        muted: "#424242", // texto secundario (descripciones)
        surface: "#FFFFFF",
        app: "#F5F5F7", // fondo general de la app
        favorite: "#75757599",
        trash: "#CD3131",

        // Colores por tipo de Pokémon: badge (pill) + fondo de card.
        type: TYPE_COLORS,
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

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
        primary: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
        ink: "#121212",
        muted: "#424242",
        surface: "#FFFFFF",
        app: "#F5F5F7",
        favorite: "#75757599",
        trash: "#CD3131",

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

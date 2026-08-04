export default defineNuxtConfig({
  compatibilityDate: "2026-08-01",
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
  ],

  css: ["~/assets/css/main.css"],

  components: [{ path: "~/components", pathPrefix: false }],

  runtimeConfig: {
    public: {
      pokeApiBase: "https://pokeapi.co/api/v2",
    },
  },

  ssr: true,

  app: {
    head: {
      title: "Pokédex · Global66 Challenge",
    },
  },

  typescript: {
    strict: true,
  },
});

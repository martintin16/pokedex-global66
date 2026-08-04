import { defineStore } from "pinia";
import type { PokemonType } from "~/types/pokemon";

export const useTypesStore = defineStore("types", {
  state: () => ({
    cache: {} as Record<string, PokemonType>,
    slugs: [] as string[], // universo de tipos, sacado de /type, no hardcodeado
  }),

  getters: {
    //Lista completa, para el modal de filtro
    all: (state): PokemonType[] =>
      state.slugs.map((s) => state.cache[s]).filter(Boolean),
  },

  actions: {
    async ensure(slug: string): Promise<PokemonType> {
      if (this.cache[slug]) return this.cache[slug];
      const api = usePokemonApi();
      const type = await api.fetchType(slug);
      this.cache[slug] = type;
      return type;
    },

    // Trae y cachea los 18 tipos de una
    async ensureAll() {
      const api = usePokemonApi();
      if (this.slugs.length === 0) {
        this.slugs = await api.fetchTypeList();
      }
      await Promise.all(this.slugs.map((slug) => this.ensure(slug)));
    },
  },
});

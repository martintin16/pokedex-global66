import { defineStore } from "pinia";
import type { PokemonAbility } from "~/types/pokemon";

export const useAbilitiesStore = defineStore("abilities", {
  state: () => ({
    cache: {} as Record<string, PokemonAbility>,
  }),

  actions: {
    async ensure(slug: string): Promise<PokemonAbility> {
      if (this.cache[slug]) return this.cache[slug];
      const api = usePokemonApi();
      const ability = await api.fetchAbility(slug);
      this.cache[slug] = ability;
      return ability;
    },
  },
});

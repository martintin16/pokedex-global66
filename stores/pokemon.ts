import { defineStore } from "pinia";
import type { Pokemon, PokemonSpecies } from "~/types/pokemon";

export const usePokemonStore = defineStore("pokemon", {
  state: () => ({
    items: [] as { name: string; id: number }[],
    detailCache: {} as Record<string, Pokemon>,
    speciesCache: {} as Record<string, PokemonSpecies>,
    total: 0,
    offset: 0,
    limit: 20,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasMore: (state) => state.offset < state.total,

    filtered: (state) => (search: string, types: string[]) => {
      return state.items.filter((item) => {
        const matchesSearch = item.name.includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (types.length === 0) return true;
        const detail = state.detailCache[item.name];
        return detail ? detail.types.some((t) => types.includes(t)) : false;
      });
    },
  },

  actions: {
    async loadNextPage() {
      if (this.loading || (this.total && !this.hasMore)) return;
      this.loading = true;
      this.error = null;
      const api = usePokemonApi();
      try {
        const res = await api.fetchList(this.limit, this.offset);
        this.total = res.count;
        this.offset += this.limit;
        this.items.push(
          ...res.results.map((r) => ({
            name: r.name,
            id: api.idFromUrl(r.url),
          })),
        );
      } catch (e) {
        this.error = "No pudimos cargar la lista de pokémons.";
      } finally {
        this.loading = false;
      }
    },

    async getDetail(name: string): Promise<Pokemon> {
      if (this.detailCache[name]) return this.detailCache[name];
      const api = usePokemonApi();
      const detail = await api.fetchDetail(name);
      this.detailCache[name] = detail;
      return detail;
    },

    async getSpecies(name: string): Promise<PokemonSpecies> {
      if (this.speciesCache[name]) return this.speciesCache[name];
      const api = usePokemonApi();
      const species = await api.fetchSpecies(name);
      this.speciesCache[name] = species;
      return species;
    },
  },
});

import { defineStore } from "pinia";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    names: [] as string[], // guardo solo el nombre, el detalle esta en el cache de pokemon.ts
  }),

  getters: {
    isFavorite: (state) => (name: string) => state.names.includes(name),
    count: (state) => state.names.length,
  },

  actions: {
    toggle(name: string) {
      const idx = this.names.indexOf(name);
      if (idx === -1) this.names.push(name);
      else this.names.splice(idx, 1);
    },
  },

  persist: {
    storage: persistedState.localStorage,
  },
});

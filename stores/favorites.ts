import { defineStore } from "pinia";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    names: [] as string[], // guardamos solo el nombre; el detalle vive en el cache de pokemon.ts
  }),

  getters: {
    isFavorite: (state) => (name: string) => state.names.includes(name),
    count: (state) => state.names.length,
  },

  actions: {
    toggle(name: string) {
      const idx = this.names.indexOf(name);
      const { show } = useToast();
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);

      if (idx === -1) {
        this.names.push(name);
        show(`${displayName} agregado a favoritos`);
      } else {
        this.names.splice(idx, 1);
        show(`${displayName} quitado de favoritos`);
      }
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});

<script setup lang="ts">
const pokemonStore = usePokemonStore();
const favoritesStore = useFavoritesStore();

const search = ref("");
const filterOpen = ref(false);
const activeTypes = ref<string[]>([]);

onMounted(() => {
  if (pokemonStore.items.length === 0) pokemonStore.loadNextPage();
});

const results = computed(() =>
  pokemonStore.filtered(search.value, activeTypes.value),
);

function applyFilter(types: string[]) {
  activeTypes.value = types;
  filterOpen.value = false;
}

function clearFilter() {
  activeTypes.value = [];
}
</script>

<template>
  <div
    class="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-6 md:max-w-3xl"
  >
    <SearchBar
      v-model="search"
      show-filter
      class="mx-auto w-full max-w-md"
      @open-filter="filterOpen = true"
    />

    <p
      v-if="activeTypes.length"
      class="mx-auto mt-3 w-full max-w-md text-sm text-muted"
    >
      Se han encontrado <strong>{{ results.length }}</strong> resultados
      <button class="text-primary underline" @click="clearFilter">
        Borrar filtro
      </button>
    </p>

    <EmptyState
      v-if="pokemonStore.error"
      image="/illustrations/magikarp-gray.png"
      title="Algo salió mal..."
      description="No pudimos cargar la información en este momento. Verifica tu conexión o intenta nuevamente más tarde."
      cta-label="Reintentar"
      @cta="pokemonStore.loadNextPage()"
    />

    <div v-else class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <PokemonCard
        v-for="item in results"
        :key="item.name"
        :name="item.name"
        :id="item.id"
        :is-favorite="favoritesStore.isFavorite(item.name)"
        @toggle-favorite="favoritesStore.toggle(item.name)"
      />

      <button
        v-if="pokemonStore.hasMore && !activeTypes.length"
        class="mx-auto mt-2 w-full max-w-md rounded-pill border border-gray-200 py-3 text-sm font-semibold text-ink disabled:opacity-50 md:col-span-2"
        :disabled="pokemonStore.loading"
        @click="pokemonStore.loadNextPage()"
      >
        {{ pokemonStore.loading ? "Cargando..." : "Cargar más" }}
      </button>
    </div>

    <FilterModal
      :open="filterOpen"
      :selected="activeTypes"
      @close="filterOpen = false"
      @apply="applyFilter"
    />

    <BottomNav />
  </div>
</template>

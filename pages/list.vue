<script setup lang="ts">
const pokemonStore = usePokemonStore();
const favoritesStore = useFavoritesStore();

const search = ref("");

onMounted(() => {
  if (pokemonStore.items.length === 0) pokemonStore.loadNextPage();
});

// El filtro por tipo se sacó de acá y se movió a favoritos.vue — este
// listado ahora solo busca por texto. filtered() sigue aceptando un
// segundo parámetro (types), pero se le pasa vacío a propósito.
const results = computed(() => pokemonStore.filtered(search.value, []));
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-6">
    <SearchBar v-model="search" />

    <EmptyState
      v-if="pokemonStore.error"
      image="/illustrations/magikarp-gray.png"
      title="Algo salió mal..."
      description="No pudimos cargar la información en este momento. Verifica tu conexión o intenta nuevamente más tarde."
      cta-label="Reintentar"
      @cta="pokemonStore.loadNextPage()"
    />

    <div v-else class="mt-4 flex flex-col gap-4">
      <PokemonCard
        v-for="item in results"
        :key="item.name"
        :name="item.name"
        :id="item.id"
        :is-favorite="favoritesStore.isFavorite(item.name)"
        @toggle-favorite="favoritesStore.toggle(item.name)"
      />

      <button
        v-if="pokemonStore.hasMore"
        class="mt-2 rounded-pill border border-gray-200 py-3 text-sm font-semibold text-ink disabled:opacity-50"
        :disabled="pokemonStore.loading"
        @click="pokemonStore.loadNextPage()"
      >
        {{ pokemonStore.loading ? "Cargando..." : "Cargar más" }}
      </button>
    </div>

    <BottomNav />
  </div>
</template>

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
  <div class="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-6">
    <SearchBar v-model="search" @open-filter="filterOpen = true" />

    <p v-if="activeTypes.length" class="mt-3 text-sm text-muted">
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

    <div v-else class="mt-4 flex flex-col gap-4">
      <!--
        Revisar el filtro por tipo: como la API no expone tipo en el
        endpoint de lista, filtered() solo puede evaluar los pokémons
        cuyo detalle YA está en cache (los que el usuario ya scrolleó).
        Si activo un filtro antes de haber scrolleado toda la lista,
        vas a ver "0 resultados" para pokémons que en realidad matchean
        pero todavía no se cargaron. Es un trade-off directo del límite
        de "solo 2 endpoints" del brief — lo documento en el README como
        decisión consciente, no como bug.
      -->
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
        class="mt-2 rounded-pill border border-gray-200 py-3 text-sm font-semibold text-ink disabled:opacity-50"
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

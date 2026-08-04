<script setup lang="ts">
const favoritesStore = useFavoritesStore();
const pokemonStore = usePokemonStore();

// El store se hidrata desde localStorage durante el setup() del
// componente, PERO Vue ya arranca a renderizar con lo que haya en ese
// instante. Para no arriesgarnos a mostrar "sin favoritos" por una
// fracción de segundo antes de que ese valor asiente, esperamos a
// onMounted (que corre después de que el setup ya terminó del todo)
// antes de decidir qué mostrar. Mientras tanto, loader genérico.
const ready = ref(false);
onMounted(() => {
  ready.value = true;
});

const search = ref("");
const filterOpen = ref(false);
const activeTypes = ref<string[]>([]);

const results = computed(() => {
  return favoritesStore.names.filter((favName) => {
    const matchesSearch = favName.includes(search.value.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTypes.value.length === 0) return true;
    const detail = pokemonStore.detailCache[favName];
    return detail
      ? detail.types.some((t) => activeTypes.value.includes(t))
      : false;
  });
});

function applyFilter(types: string[]) {
  activeTypes.value = types;
  filterOpen.value = false;
}

function clearFilter() {
  activeTypes.value = [];
}

// Revisar swipe de eliminado
const swipeOpenFor = ref<string | null>(null);

const touchStartX = ref(0);

function onTouchStart(e: TouchEvent, name: string) {
  touchStartX.value = e.touches[0].clientX;
}

function onTouchEnd(e: TouchEvent, name: string) {
  const deltaX = e.changedTouches[0].clientX - touchStartX.value;
  if (deltaX < -40) swipeOpenFor.value = name;
  else if (deltaX > 40) swipeOpenFor.value = null;
}

function remove(name: string) {
  favoritesStore.toggle(name);
  swipeOpenFor.value = null;
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-6">
    <div class="relative flex items-center">
      <NuxtLink to="/list" aria-label="Volver" class="absolute left-0 text-ink">
        <Icon name="material-symbols:chevron-left-rounded" class="h-6 w-6" />
      </NuxtLink>
      <h1 class="w-full text-center text-lg font-semibold text-ink">
        Favoritos
      </h1>
    </div>

    <SearchBar
      v-model="search"
      show-filter
      class="mt-4"
      @open-filter="filterOpen = true"
    />

    <LoadingOverlay v-if="!ready" />

    <template v-else>
      <p v-if="activeTypes.length" class="mt-3 text-sm text-muted">
        Se han encontrado <strong>{{ results.length }}</strong> resultados
        <button class="text-primary underline" @click="clearFilter">
          Borrar filtro
        </button>
      </p>

      <EmptyState
        v-if="favoritesStore.count === 0"
        image="/illustrations/magikarp.png"
        title="No has marcado ningún Pokémon como favorito"
        description="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
      />

      <EmptyState
        v-else-if="results.length === 0"
        image="/illustrations/magikarp.png"
        title="No encontramos favoritos con ese filtro"
        description="Probá con otro nombre o borrá el filtro de tipo."
      />

      <div v-else class="mt-4 flex flex-col gap-4">
        <div
          v-for="favName in results"
          :key="favName"
          class="relative overflow-hidden rounded-card"
          @touchstart="onTouchStart($event, favName)"
          @touchend="onTouchEnd($event, favName)"
        >
          <div
            class="flex transition-transform duration-200"
            :style="{
              transform:
                swipeOpenFor === favName
                  ? 'translateX(-72px)'
                  : 'translateX(0)',
            }"
          >
            <div class="w-full shrink-0">
              <PokemonCard
                :name="favName"
                :id="pokemonStore.detailCache[favName]?.id ?? 0"
                is-favorite
                @toggle-favorite="remove(favName)"
              />
            </div>
            <button
              class="flex w-[72px] shrink-0 items-center justify-center bg-red-500 text-white"
              aria-label="Eliminar de favoritos"
              @click="remove(favName)"
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </template>

    <FilterModal
      :open="filterOpen"
      :selected="activeTypes"
      @close="filterOpen = false"
      @apply="applyFilter"
    />

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const favoritesStore = useFavoritesStore();
const pokemonStore = usePokemonStore();

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
    <div class="flex items-center gap-3">
      <NuxtLink to="/" aria-label="Volver" class="text-xl text-ink">‹</NuxtLink>
      <h1 class="text-lg font-bold text-ink">Favoritos</h1>
    </div>

    <EmptyState
      v-if="favoritesStore.count === 0"
      image="/illustrations/magikarp.png"
      title="No has marcado ningún Pokémon como favorito"
      description="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
    />

    <div v-else class="mt-4 flex flex-col gap-4">
      <div
        v-for="favName in favoritesStore.names"
        :key="favName"
        class="relative overflow-hidden rounded-card"
        @touchstart="onTouchStart($event, favName)"
        @touchend="onTouchEnd($event, favName)"
      >
        <div
          class="flex transition-transform duration-200"
          :style="{
            transform:
              swipeOpenFor === favName ? 'translateX(-72px)' : 'translateX(0)',
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

    <BottomNav />
  </div>
</template>

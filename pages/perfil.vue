<script setup lang="ts">
const favoritesStore = useFavoritesStore();
</script>

<template>
  <div
    class="mx-auto flex justify-center min-h-screen max-w-md flex-col px-4 pb-24 pt-6"
  >
    <div
      class="mt-6 flex flex-col items-center rounded-card border border-gray-100 p-6 text-center"
    >
      <div class="h-16 w-16 rounded-full bg-gray-100" aria-hidden="true" />
      <p class="mt-3 text-sm text-muted">Entrenador/a Pokémon</p>
      <p class="mt-1 text-2xl font-bold text-ink">{{ favoritesStore.count }}</p>
      <p class="text-xs text-muted">Pokémon favoritos</p>
    </div>

    <p class="mt-6 text-center text-xs text-muted">
      Esta pantalla no estaba en el figma inicial se agrego contenido mínimo por
      criterio propio como para no dejar inutilizable la seccion.
    </p>

    <BottomNav />
  </div>
</template>

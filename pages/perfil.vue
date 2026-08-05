<script setup lang="ts">
const favoritesStore = useFavoritesStore();
const pokemonStore = usePokemonStore();
const { classes } = usePokemonType();

const trainer = {
  name: "Ash Ketchum",
  hometown: "Pueblo Paleta",
  pokemonCaught: 31,
};

const badges = [
  { label: "Roca", type: "rock" },
  { label: "Agua", type: "water" },
  { label: "Trueno", type: "electric" },
  { label: "Planta", type: "grass" },
  { label: "Veneno", type: "poison" },
  { label: "Psiquica", type: "psychic" },
  { label: "Fuego", type: "fire" },
  { label: "Tierra", type: "ground" },
];

const recentFavorites = computed(() => favoritesStore.names.slice(0, 4));
</script>

<template>
  <div
    class="mx-auto flex justify-center min-h-screen max-w-md flex-col px-4 pb-24 pt-6 md:max-w-2xl"
  >
    <div
      class="mt-6 flex flex-col items-center rounded-card border border-gray-100 p-6 text-center"
    >
      <div
        class="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10"
      >
        <img
          src="/profile/ash.jpg"
          alt="Ash Ketchum"
          class="h-full w-full object-cover rounded-full"
        />
      </div>
      <p class="mt-3 text-xl font-bold text-ink">{{ trainer.name }}</p>
      <p class="flex items-center gap-1 text-sm text-muted">
        <Icon
          name="material-symbols:location-on-outline-rounded"
          class="h-4 w-4"
        />
        {{ trainer.hometown }}
      </p>
    </div>

    <div class="mt-4 grid grid-cols-3 gap-3">
      <div class="rounded-2xl border border-gray-200 p-3 text-center">
        <p class="text-xl font-bold text-ink">{{ badges.length }}</p>
        <p class="text-xs text-muted">Medallas</p>
      </div>
      <div class="rounded-2xl border border-gray-200 p-3 text-center">
        <p class="text-xl font-bold text-ink">{{ trainer.pokemonCaught }}</p>
        <p class="text-xs text-muted">Capturados</p>
      </div>
      <div class="rounded-2xl border border-gray-200 p-3 text-center">
        <p class="text-xl font-bold text-ink">{{ favoritesStore.count }}</p>
        <p class="text-xs text-muted">Favoritos</p>
      </div>
    </div>

    <div class="mt-6">
      <p class="text-sm font-bold text-ink">Medallas de Kanto</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="badge in badges"
          :key="badge.label"
          class="inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold"
          :class="classes(badge.type).badge"
        >
          <Icon
            name="material-symbols:workspace-premium-rounded"
            class="h-3.5 w-3.5"
          />
          {{ badge.label }}
        </span>
      </div>
    </div>

    <div class="mt-6">
      <div class="flex items-center justify-between">
        <p class="text-sm font-bold text-ink">Mis favoritos</p>
        <NuxtLink to="/favoritos" class="text-xs font-semibold text-primary">
          Ver todos
        </NuxtLink>
      </div>

      <p v-if="favoritesStore.count === 0" class="mt-2 text-xs text-muted">
        Todavía no marcaste ningún Pokémon como favorito.
      </p>

      <div v-else class="mt-2 flex gap-3">
        <NuxtLink
          v-for="name in recentFavorites"
          :key="name"
          :to="`/pokemon/${name}`"
          class="flex flex-col items-center gap-1"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100"
          >
            <img
              v-if="pokemonStore.detailCache[name]?.image"
              :src="pokemonStore.detailCache[name].image"
              :alt="name"
              class="h-12 w-12"
            />
            <Icon
              v-else
              name="material-symbols:pets-outline-rounded"
              class="h-6 w-6 text-gray-300"
            />
          </div>
          <span
            class="max-w-[3.5rem] truncate text-[11px] capitalize text-muted"
            >{{ name }}</span
          >
        </NuxtLink>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

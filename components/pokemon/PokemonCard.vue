<script setup lang="ts">
const props = defineProps<{
  name: string;
  id: number;
  isFavorite: boolean;
}>();

defineEmits<{ toggleFavorite: [] }>();

const { classes, icon } = usePokemonType();
const typesStore = useTypesStore();
const { el, detail } = useLazyPokemonDetail(props.name);

const primaryType = computed(() => detail.value?.types[0]);
const cardClasses = computed(() =>
  primaryType.value
    ? classes(primaryType.value)
    : { soft: "bg-gray-100", badge: "bg-gray-200" },
);

watchEffect(() => {
  if (primaryType.value) typesStore.ensure(primaryType.value);
});
</script>

<template>
  <div ref="el">
    <NuxtLink
      :to="`/pokemon/${name}`"
      class="relative flex items-center justify-between overflow-hidden rounded-card p-4"
      :class="cardClasses.soft"
    >
      <div class="z-10">
        <p class="text-xs font-semibold text-muted">
          Nº{{ String(id).padStart(3, "0") }}
        </p>
        <h3 class="text-xl font-semibold capitalize text-ink">{{ name }}</h3>

        <!-- Skeleton, revisar si cambio por pokeball -->
        <div v-if="!detail" class="mt-2 flex gap-2">
          <span class="h-6 w-16 animate-pulse rounded-pill bg-gray-200" />
          <span class="h-6 w-16 animate-pulse rounded-pill bg-gray-200" />
        </div>
        <div v-else class="mt-2 flex gap-2">
          <TypeBadge v-for="t in detail.types" :key="t" :type="t" />
        </div>
      </div>

      <div
        class="absolute right-0 top-1/2 flex h-28 w-28 -translate-y-1/2 items-center justify-center rounded-2xl p-2"
        :class="cardClasses.badge"
        aria-hidden="true"
      >
        <TypeShape v-if="primaryType" :type="primaryType" />
      </div>
      <img
        v-if="detail"
        :src="detail.image"
        :alt="name"
        class="absolute right-6 top-1/2 z-10 h-16 w-16 -translate-y-1/2"
        loading="lazy"
      />
      <div
        v-else
        class="relative z-10 h-20 w-20 animate-pulse rounded-full bg-gray-200/60"
      />

      <button
        class="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-favorite shadow-sm border-2 border-white"
        :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        @click.prevent="$emit('toggleFavorite')"
      >
        <Icon
          :name="
            isFavorite
              ? 'material-symbols:favorite-rounded'
              : 'material-symbols:favorite-outline-rounded'
          "
          class="h-4 w-4"
          :class="isFavorite ? 'text-red-500' : 'text-gray-300'"
          aria-hidden="true"
        />
      </button>
    </NuxtLink>
  </div>
</template>

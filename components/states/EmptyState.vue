<script setup lang="ts">
// Un solo componente para las 3 pantallas de vacio, error o construccion
withDefaults(
  defineProps<{
    image: string;
    title: string;
    description: string;
    ctaLabel?: string;
  }>(),
  { ctaLabel: undefined },
);

const emit = defineEmits<{ cta: [] }>();
</script>

<template>
  <div
    class="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center"
  >
    <img :src="image" alt="" class="mb-6 h-40 w-40 grayscale opacity-80" />
    <h2 class="text-lg font-bold text-ink">{{ title }}</h2>
    <p class="mt-2 text-sm text-muted">{{ description }}</p>
    <button
      v-if="ctaLabel"
      class="mt-6 w-full rounded-pill bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover"
      @click="emit('cta')"
    >
      {{ ctaLabel }}
    </button>
  </div>
</template>

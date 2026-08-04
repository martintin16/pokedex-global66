<script setup lang="ts">
const props = defineProps<{ type: string }>();
const { classes, icon } = usePokemonType();
const typesStore = useTypesStore();

onMounted(() => typesStore.ensure(props.type));
const label = computed(() => typesStore.cache[props.type]?.label ?? props.type);
const iconSrc = computed(
  () => icon(props.type) ?? typesStore.cache[props.type]?.iconUrl ?? null,
);
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-medium capitalize"
    :class="classes(props.type).badge"
  >
    <span
      v-if="iconSrc"
      class="inline-flex shrink-0 items-center justify-center rounded-full bg-white p-0.5"
    >
      <img :src="iconSrc" alt="" class="h-3.5 w-3.5" aria-hidden="true" />
    </span>
    <span
      v-else
      class="h-3.5 w-3.5 shrink-0 rounded-full bg-white/30"
      aria-hidden="true"
    />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ type: string }>();
const { classes } = usePokemonType();
const typesStore = useTypesStore();

onMounted(() => typesStore.ensure(props.type));
const label = computed(() => typesStore.cache[props.type]?.label ?? props.type);
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold capitalize"
    :class="classes(props.type).badge"
  >
    <span class="h-3.5 w-3.5 rounded-full bg-white/30" aria-hidden="true" />
    {{ label }}
  </span>
</template>

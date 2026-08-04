<script setup lang="ts">
const props = defineProps<{ slug: string }>();
const abilitiesStore = useAbilitiesStore();

onMounted(() => abilitiesStore.ensure(props.slug));
const label = computed(
  () => abilitiesStore.cache[props.slug]?.label ?? props.slug,
);
</script>

<template>
  <span>{{ label }}</span>
</template>

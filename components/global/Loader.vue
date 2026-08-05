<script setup lang="ts">
withDefaults(
  defineProps<{
    src?: string;
    size?: string;
  }>(),
  {
    src: "/illustrations/loader.svg",
    size: "6rem",
  },
);
</script>

<template>
  <img
    :src="src"
    alt="Cargando"
    class="animate-spin motion-reduce:animate-none"
    :style="{ width: size, height: size }"
  />
</template>

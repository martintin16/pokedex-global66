<script setup lang="ts">
definePageMeta({ layout: "blank" });

onMounted(() => {
  setTimeout(() => {
    navigateTo("/onboarding");
  }, 1200);
});
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-surface"
  >
    <Loader size="6rem" />
    <span class="sr-only">Cargando Pokédex</span>
  </div>
</template>

<style scoped></style>

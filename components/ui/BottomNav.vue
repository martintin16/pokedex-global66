<script setup lang="ts">
// TODO: Revisar libreria de iconos
const items = [
  { label: "Pokedex", to: "/list", icon: "home" },
  { label: "Regiones", to: "/regiones", icon: "globe" },
  { label: "favoritos", to: "/favoritos", icon: "heart" },
  { label: "Perfil", to: "/perfil", icon: "user" },
];

const route = useRoute();
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-gray-100 bg-surface py-2"
    aria-label="Navegación principal"
  >
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-1 px-3 py-1 text-[11px]"
      :class="
        route.path === item.to ? 'text-primary font-semibold' : 'text-gray-400'
      "
    >
      <!-- swap por <Icon :name="item.icon" /> cuando se defina la librería de iconos -->
      <span class="h-5 w-5" aria-hidden="true" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

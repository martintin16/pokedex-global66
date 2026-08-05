<script setup lang="ts">
import { NAV_ITEMS } from "~/utils/navItems";

const route = useRoute();
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-gray-100 bg-surface px-4 py-6 md:flex"
    aria-label="Navegación principal"
  >
    <div class="mb-6 flex items-center gap-2 px-2">
      <img
        src="/nav-icons/pokeball.svg"
        alt=""
        class="h-7 w-7"
        aria-hidden="true"
      />
      <span class="text-lg font-bold text-ink">Pokédex</span>
    </div>

    <nav class="flex flex-col gap-4">
      <NuxtLink
        v-for="item in NAV_ITEMS"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
        :class="
          route.path === item.to
            ? 'bg-gray-100 font-semibold text-ink'
            : 'text-gray-500 hover:bg-gray-50'
        "
      >
        <img
          v-if="item.type === 'image'"
          :src="item.src"
          alt=""
          class="h-5 w-5"
          aria-hidden="true"
        />
        <Icon v-else :name="item.icon!" class="h-5 w-5" aria-hidden="true" />
        {{ item.label }}
      </NuxtLink>
    </nav>
  </aside>
</template>

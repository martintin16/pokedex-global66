<script setup lang="ts">
import { NAV_ITEMS } from "~/utils/navItems";

const route = useRoute();
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-20 flex justify-around rounded-t-2xl bg-surface py-2 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.08)] md:hidden"
    aria-label="Navegación principal"
  >
    <NuxtLink
      v-for="item in NAV_ITEMS"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-1 px-3 py-1 text-[11px]"
    >
      <img
        v-if="item.type === 'image'"
        :src="item.src"
        alt=""
        class="h-5 w-5"
        aria-hidden="true"
      />
      <Icon
        v-else
        :name="item.icon!"
        class="h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
      <span
        :class="
          route.path === item.to
            ? 'text-primary font-semibold'
            : 'text-gray-400'
        "
      >
        {{ item.label }}
      </span>
    </NuxtLink>
  </nav>
</template>

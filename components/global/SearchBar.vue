<script setup lang="ts">
withDefaults(
  defineProps<{
    showFilter?: boolean;
  }>(),
  { showFilter: false },
);

const model = defineModel<string>({ default: "" });
defineEmits<{ openFilter: [] }>();
</script>

<template>
  <div class="flex items-center gap-2">
    <div
      class="flex flex-1 items-center gap-2 rounded-pill border border-gray-200 px-4 py-2.5"
    >
      <Icon
        name="material-symbols:search-rounded"
        class="h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        v-model="model"
        type="text"
        placeholder="Buscar Pókemon..."
        class="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </div>
    <button
      v-if="showFilter"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500"
      aria-label="Filtrar"
      @click="$emit('openFilter')"
    >
      <Icon
        name="material-symbols:tune-rounded"
        class="h-5 w-5"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
const { toast } = useToast();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="toast"
        :key="toast.id"
        class="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-pill bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-lg"
        role="status"
        aria-live="polite"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

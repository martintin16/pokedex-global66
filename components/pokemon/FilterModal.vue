<script setup lang="ts">
const props = defineProps<{ open: boolean; selected: string[] }>();
const emit = defineEmits<{ close: []; apply: [types: string[]] }>();

const typesStore = useTypesStore();
const draft = ref<string[]>([...props.selected]);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      draft.value = [...props.selected];
      // Trae los 18 tipos con su label real (vía API) recién cuando
      // hace falta mostrarlos, no en cada carga de la app.
      typesStore.ensureAll();
    }
  },
);

function toggle(slug: string) {
  const idx = draft.value.indexOf(slug);
  if (idx === -1) draft.value.push(slug);
  else draft.value.splice(idx, 1);
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-30 flex items-end bg-black/40"
      @click.self="emit('close')"
    >
      <div class="w-full rounded-t-2xl bg-surface p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-ink">
            Filtra por tus preferencias
          </h2>
          <button
            aria-label="Cerrar"
            class="text-xl text-gray-400"
            @click="emit('close')"
          >
            ×
          </button>
        </div>

        <p class="mt-4 text-sm font-semibold text-ink">Tipo</p>

        <ul
          v-if="typesStore.all.length"
          class="mt-2 max-h-72 divide-y divide-gray-100 overflow-y-auto"
        >
          <li
            v-for="t in typesStore.all"
            :key="t.slug"
            class="flex items-center justify-between py-3"
          >
            <span class="text-sm capitalize text-ink">{{ t.label }}</span>
            <input
              type="checkbox"
              class="h-5 w-5 rounded accent-primary"
              :checked="draft.includes(t.slug)"
              @change="toggle(t.slug)"
            />
          </li>
        </ul>
        <p v-else class="mt-4 text-sm text-muted">Cargando tipos...</p>

        <button
          class="mt-4 w-full rounded-pill bg-primary py-3 font-semibold text-white"
          @click="emit('apply', draft)"
        >
          Aplicar
        </button>
        <button
          class="mt-2 w-full rounded-pill bg-gray-100 py-3 font-semibold text-ink"
          @click="emit('close')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Pokemon } from "~/types/pokemon";

const props = defineProps<{ pokemon: Pokemon }>();
const typesStore = useTypesStore();
const abilitiesStore = useAbilitiesStore();
const copied = ref(false);

// Revisar boton compartir
async function share() {
  const [typeLabels, abilityLabels] = await Promise.all([
    Promise.all(props.pokemon.types.map((slug) => typesStore.ensure(slug))),
    Promise.all(
      props.pokemon.abilities.map((a) => abilitiesStore.ensure(a.slug)),
    ),
  ]);

  const parts = [
    props.pokemon.name,
    ...typeLabels.map((t) => t.label),
    `${props.pokemon.weightKg} kg`,
    `${props.pokemon.heightM} m`,
    ...abilityLabels.map((a) => a.label),
  ];
  await navigator.clipboard.writeText(parts.join(", "));
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
  <button
    aria-label="Compartir"
    class="flex h-9 w-9 items-center justify-center rounded-full bg-white/30 text-white"
    @click="share"
  >
    <Icon
      :name="
        copied
          ? 'material-symbols:check-rounded'
          : 'material-symbols:share-rounded'
      "
      class="h-5 w-5"
    />
    <span class="sr-only">{{
      copied ? "Copiado al portapapeles" : "Compartir"
    }}</span>
  </button>
</template>

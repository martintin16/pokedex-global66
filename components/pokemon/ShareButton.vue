<script setup lang="ts">
import type { Pokemon, PokemonSpecies } from "~/types/pokemon";

const props = defineProps<{
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
  weaknesses?: string[];
}>();
const typesStore = useTypesStore();
const abilitiesStore = useAbilitiesStore();
const copied = ref(false);

async function share() {
  const [typeLabels, abilityLabels, weaknessLabels] = await Promise.all([
    Promise.all(props.pokemon.types.map((slug) => typesStore.ensure(slug))),
    Promise.all(
      props.pokemon.abilities.map((a) => abilitiesStore.ensure(a.slug)),
    ),
    Promise.all(
      (props.weaknesses ?? []).map((slug) => typesStore.ensure(slug)),
    ),
  ]);

  const displayName =
    props.pokemon.name.charAt(0).toUpperCase() + props.pokemon.name.slice(1);

  const abilityTexts = abilityLabels.map((a, i) => {
    const isHidden = props.pokemon.abilities[i]?.isHidden;
    return isHidden ? `${a.label} (oculta)` : a.label;
  });

  const parts = [
    `Nombre: ${displayName}`,
    `Nro pokédex: ${String(props.pokemon.id).padStart(3, "0")}`,
    `Tipo: ${typeLabels.map((t) => t.label).join(", ")}`,
    `Peso: ${props.pokemon.weightKg} kg`,
    `Altura: ${props.pokemon.heightM} m`,
    props.species?.genus ? `Categoría: ${props.species.genus}` : null,
    `Habilidades: ${abilityTexts.join(", ")}`,
    weaknessLabels.length
      ? `Debilidades: ${weaknessLabels.map((t) => t.label).join(", ")}`
      : null,
  ].filter((part): part is string => Boolean(part));

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

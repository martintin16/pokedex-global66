<script setup lang="ts">
import type { PokemonType } from '~/types/pokemon'

const route = useRoute()
const name = route.params.name as string

const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const typesStore = useTypesStore()
const { classes } = usePokemonType()
const { weaknessesFor } = useTypeEffectiveness()

const { data: pokemon, pending, error } = await useAsyncData(
  `pokemon-detail-${name}`,
  () => pokemonStore.getDetail(name)
)

const { data: species, pending: speciesPending } = await useAsyncData(
  `pokemon-species-${name}`,
  () => pokemonStore.getSpecies(name)
)

// Resuelve el detalle de CADA tipo del pokémon (label + relaciones de
// daño). Se necesita completo (no solo el label) para calcular
// debilidades reales, no una unión ingenua.
const typeRecords = ref<PokemonType[]>([])
watchEffect(async () => {
  if (!pokemon.value) return
  typeRecords.value = await Promise.all(
    pokemon.value.types.map((slug) => typesStore.ensure(slug))
  )
})

const weaknessSlugs = computed(() => weaknessesFor(typeRecords.value))

const primaryType = computed(() => pokemon.value?.types[0])
const heroClasses = computed(() =>
  primaryType.value ? classes(primaryType.value) : { soft: 'bg-gray-100' }
)

// Género: gender_rate es -1 (sin género) o un entero de 0 a 8 = octavos
// de probabilidad de ser hembra.
const genderPercents = computed(() => {
  const rate = species.value?.genderRate
  if (rate === undefined || rate === -1) return null
  const female = (rate / 8) * 100
  return { male: 100 - female, female }
})
</script>

<template>
  <div class="mx-auto min-h-screen max-w-md pb-24">
    <div v-if="pending" class="flex h-64 items-center justify-center">
      <div class="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
    </div>

    <EmptyState
      v-else-if="error || !pokemon"
      image="/illustrations/magikarp-gray.png"
      title="Algo salió mal..."
      description="No pudimos cargar la información de este pokémon."
      cta-label="Reintentar"
      @cta="refreshNuxtData(`pokemon-detail-${name}`)"
    />

    <template v-else>
      <div class="relative flex flex-col items-center pb-8 pt-4" :class="heroClasses.soft">
        <div class="flex w-full items-center justify-between px-4">
          <NuxtLink to="/" aria-label="Volver" class="text-xl text-ink">‹</NuxtLink>
          <div class="flex items-center gap-2">
            <ShareButton :pokemon="pokemon" />
            <button
              :aria-label="favoritesStore.isFavorite(name) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
              @click="favoritesStore.toggle(name)"
            >
              <span :class="favoritesStore.isFavorite(name) ? 'text-red-500' : 'text-white'">♥</span>
            </button>
          </div>
        </div>
        <img :src="pokemon.image" :alt="pokemon.name" class="mt-4 h-40 w-40" />
      </div>

      <div class="px-5 pt-5">
        <h1 class="text-2xl font-bold capitalize text-ink">{{ pokemon.name }}</h1>
        <p class="text-sm text-muted">Nº{{ String(pokemon.id).padStart(3, '0') }}</p>

        <div class="mt-3 flex gap-2">
          <TypeBadge v-for="t in pokemon.types" :key="t" :type="t" />
        </div>

        <p v-if="speciesPending" class="mt-4 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        <p v-else class="mt-4 text-sm text-muted">{{ species?.description }}</p>

        <hr class="my-5 border-gray-100" />

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl border border-gray-100 p-3">
            <p class="text-xs text-muted">⚖ PESO</p>
            <p class="mt-1 font-bold text-ink">{{ pokemon.weightKg }} kg</p>
          </div>
          <div class="rounded-xl border border-gray-100 p-3">
            <p class="text-xs text-muted">⤢ ALTURA</p>
            <p class="mt-1 font-bold text-ink">{{ pokemon.heightM }} m</p>
          </div>
          <div class="rounded-xl border border-gray-100 p-3">
            <p class="text-xs text-muted">▤ CATEGORÍA</p>
            <p class="mt-1 font-bold uppercase text-ink">{{ species?.genus || '—' }}</p>
          </div>
          <div class="rounded-xl border border-gray-100 p-3">
            <p class="text-xs text-muted">◌ HABILIDAD</p>
            <AbilityLabel
              v-if="pokemon.abilities[0]"
              class="mt-1 block font-bold uppercase text-ink"
              :slug="pokemon.abilities[0].slug"
            />
            <p v-else class="mt-1 font-bold text-ink">—</p>
          </div>
        </div>

        <div v-if="genderPercents" class="mt-5">
          <p class="text-xs font-semibold text-muted">GÉNERO</p>
          <div class="mt-2 flex h-2 overflow-hidden rounded-pill bg-gray-100">
            <div class="bg-blue-400" :style="{ width: genderPercents.male + '%' }" />
            <div class="bg-pink-400" :style="{ width: genderPercents.female + '%' }" />
          </div>
          <div class="mt-1 flex justify-between text-xs text-muted">
            <span>♂ {{ genderPercents.male.toFixed(1) }}%</span>
            <span>♀ {{ genderPercents.female.toFixed(1) }}%</span>
          </div>
        </div>
        <p v-else-if="species" class="mt-5 text-xs text-muted">Especie sin género definido.</p>

        <div class="mt-5">
          <p class="text-sm font-bold text-ink">Debilidades</p>
          <div v-if="weaknessSlugs.length" class="mt-2 flex flex-wrap gap-2">
            <TypeBadge v-for="w in weaknessSlugs" :key="w" :type="w" />
          </div>
          <p v-else class="mt-1 text-xs text-muted">Calculando...</p>
        </div>
      </div>
    </template>

    <BottomNav />
  </div>
</template>

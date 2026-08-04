import type {
  PokemonDetailRaw,
  PokemonListResponse,
  Pokemon,
  PokemonSpeciesRaw,
  PokemonSpecies,
  PokemonTypeRaw,
  PokemonType,
  TypeListResponse,
  AbilityRaw,
  PokemonAbility,
} from "~/types/pokemon";

/**
 * Capa de acceso a PokeAPI. Habla con el cliente inyectado por
 * plugins/pokeapi.ts ($pokeApi). Ningún método de acá traduce nada a
 * mano: si la respuesta de la API trae español (campo `names` /
 * `genera` / `flavor_text_entries` filtrado por language "es"), se usa;
 * si no está, se devuelve el dato tal cual vino (idioma original), nunca
 * un valor inventado por una tabla propia.
 */
export function usePokemonApi() {
  const { $pokeApi } = useNuxtApp();

  // ---------- Lista ----------
  async function fetchList(limit = 20, offset = 0) {
    return await $pokeApi<PokemonListResponse>("/pokemon", {
      params: { limit, offset },
    });
  }

  function idFromUrl(url: string): number {
    const match = url.match(/\/pokemon\/(\d+)\//);
    return match ? Number(match[1]) : 0;
  }

  // ---------- Detalle de pokémon ----------
  async function fetchDetail(name: string) {
    const raw = await $pokeApi<PokemonDetailRaw>(`/pokemon/${name}`);
    return normalizeDetail(raw);
  }

  function normalizeDetail(raw: PokemonDetailRaw): Pokemon {
    return {
      id: raw.id,
      name: raw.name,
      image:
        raw.sprites.other?.["official-artwork"]?.front_default ||
        raw.sprites.front_default ||
        "",
      types: raw.types.map((t) => t.type.name),
      heightM: raw.height / 10,
      weightKg: raw.weight / 10,
      stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      abilities: raw.abilities.map((a) => ({
        slug: a.ability.name,
        isHidden: a.is_hidden,
      })),
    };
  }

  // ---------- Especie (descripción, categoría, género) ----------
  async function fetchSpecies(name: string) {
    const raw = await $pokeApi<PokemonSpeciesRaw>(`/pokemon-species/${name}`);
    return normalizeSpecies(raw);
  }

  function normalizeSpecies(raw: PokemonSpeciesRaw): PokemonSpecies {
    const esGenus = raw.genera.find((g) => g.language.name === "es");
    const esFlavor = raw.flavor_text_entries.find(
      (f) => f.language.name === "es",
    );
    // Fallback: si no hay entrada en español, se toma la primera
    // disponible tal cual (idioma original), no se inventa.
    const genus = esGenus?.genus ?? raw.genera[0]?.genus ?? "";
    const rawFlavor =
      esFlavor?.flavor_text ?? raw.flavor_text_entries[0]?.flavor_text ?? "";
    return {
      genus,
      // Los textos de PokeAPI traen \n y \f (form feed) como saltos de
      // línea de la Pokédex original de los juegos; se limpian para un
      // párrafo normal en la UI.
      description: rawFlavor.replace(/[\n\f\r]+/g, " ").trim(),
      genderRate: raw.gender_rate,
    };
  }

  // ---------- Tipo (label localizado + relaciones de daño) ----------
  async function fetchType(slug: string) {
    const raw = await $pokeApi<PokemonTypeRaw>(`/type/${slug}`);
    return normalizeType(raw);
  }

  function normalizeType(raw: PokemonTypeRaw): PokemonType {
    const esName = raw.names.find((n) => n.language.name === "es");
    const iconUrl =
      raw.sprites["generation-ix"]?.["scarlet-violet"]?.symbol_icon ??
      raw.sprites["generation-viii"]?.["sword-shield"]?.symbol_icon ??
      null;
    return {
      slug: raw.name,
      label: esName?.name ?? raw.name,
      doubleDamageFrom: raw.damage_relations.double_damage_from.map(
        (t) => t.name,
      ),
      halfDamageFrom: raw.damage_relations.half_damage_from.map((t) => t.name),
      noDamageFrom: raw.damage_relations.no_damage_from.map((t) => t.name),
      iconUrl,
    };
  }

  // Lista completa de tipos (solo slugs), usada por el filtro para
  // saber qué existe sin hardcodear un array propio.
  // Se excluyen
  // "shadow", "unknown" y "stellar": son metadatos técnicos de PokeAPI (Pokémon
  // Sombra de Colosseum/XD y un placeholder), no tipos jugables reales
  const NON_GAMEPLAY_TYPES = new Set(["shadow", "unknown", "stellar"]);

  async function fetchTypeList() {
    const res = await $pokeApi<TypeListResponse>("/type");
    return res.results
      .map((t) => t.name)
      .filter((slug) => !NON_GAMEPLAY_TYPES.has(slug));
  }

  // ---------- Habilidad (label localizado) ----------
  async function fetchAbility(slug: string) {
    const raw = await $pokeApi<AbilityRaw>(`/ability/${slug}`);
    return normalizeAbility(raw);
  }

  function normalizeAbility(raw: AbilityRaw): PokemonAbility {
    const esName = raw.names.find((n) => n.language.name === "es");
    return { slug: raw.name, label: esName?.name ?? raw.name };
  }

  return {
    fetchList,
    idFromUrl,
    fetchDetail,
    fetchSpecies,
    fetchType,
    fetchTypeList,
    fetchAbility,
  };
}

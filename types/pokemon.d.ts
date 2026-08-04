// ---------- /pokemon (lista) ----------
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

// ---------- /pokemon/{name} ----------
export interface PokemonDetailRaw {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: { "official-artwork"?: { front_default: string | null } };
  };
  types: { slot: number; type: { name: string; url: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: {
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }[];
}

/** Modelo normalizado que consume la UI. Los campos de texto (types,
 * abilities) quedan como slugs en inglés: el label localizado se
 * resuelve aparte (useTypesStore / useAbilitiesStore), nunca con una
 * tabla propia de traducción. */
export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  heightM: number;
  weightKg: number;
  stats: { name: string; value: number }[];
  abilities: { slug: string; isHidden: boolean }[];
}

// ---------- /pokemon-species/{name} ----------
export interface PokemonSpeciesRaw {
  genera: { genus: string; language: { name: string } }[];
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  gender_rate: number;
}

export interface PokemonSpecies {
  genus: string;
  description: string;
  genderRate: number;
}

// ---------- /type/{name} ----------
export interface PokemonTypeRaw {
  id: number;
  name: string;
  names: { name: string; language: { name: string } }[];
  damage_relations: {
    double_damage_from: { name: string; url: string }[];
    half_damage_from: { name: string; url: string }[];
    no_damage_from: { name: string; url: string }[];
  };
  // Solo uso estas dos generaciones para el ícono de tipo,
  // generaciones más viejas no lo traen.
  sprites: {
    "generation-viii"?: {
      "sword-shield"?: {
        name_icon?: string | null;
        symbol_icon?: string | null;
      };
    };
    "generation-ix"?: {
      "scarlet-violet"?: {
        name_icon?: string | null;
        symbol_icon?: string | null;
      };
    };
  };
}

export interface PokemonType {
  slug: string;
  label: string; // localizado si la API lo trae, si no, el slug original
  doubleDamageFrom: string[];
  halfDamageFrom: string[];
  noDamageFrom: string[];
  iconUrl: string | null;
}

export interface TypeListResponse {
  results: { name: string; url: string }[];
}

// ---------- /ability/{name} ----------
export interface AbilityRaw {
  id: number;
  name: string;
  names: { name: string; language: { name: string } }[];
}

export interface PokemonAbility {
  slug: string;
  label: string;
}

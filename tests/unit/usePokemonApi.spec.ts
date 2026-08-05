import { describe, it, expect, beforeEach } from "vitest";
import { usePokemonApi } from "~/composables/usePokemonApi";
import { pokeApiMock } from "../setup";
import type {
  PokemonDetailRaw,
  PokemonSpeciesRaw,
  PokemonTypeRaw,
  TypeListResponse,
  AbilityRaw,
} from "~/types/pokemon";

describe("usePokemonApi", () => {
  beforeEach(() => {
    pokeApiMock.mockReset();
  });

  describe("idFromUrl", () => {
    it("extrae el id numérico de una url de detalle de PokeAPI", () => {
      const { idFromUrl } = usePokemonApi();
      expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
    });

    it("devuelve 0 si la url no matchea el patrón esperado", () => {
      const { idFromUrl } = usePokemonApi();
      expect(idFromUrl("https://pokeapi.co/api/v2/berry/1/")).toBe(0);
    });
  });

  describe("fetchList", () => {
    it("pide /pokemon con limit y offset como params", async () => {
      pokeApiMock.mockResolvedValueOnce({
        count: 1300,
        next: null,
        previous: null,
        results: [],
      });
      const { fetchList } = usePokemonApi();

      await fetchList(20, 40);

      expect(pokeApiMock).toHaveBeenCalledWith("/pokemon", {
        params: { limit: 20, offset: 40 },
      });
    });
  });

  describe("fetchDetail", () => {
    const raw: PokemonDetailRaw = {
      id: 1,
      name: "bulbasaur",
      height: 7,
      weight: 69,
      sprites: {
        front_default: "front.png",
        other: { "official-artwork": { front_default: "artwork.png" } },
      },
      types: [{ slot: 1, type: { name: "grass", url: "" } }],
      stats: [{ base_stat: 45, stat: { name: "hp" } }],
      abilities: [
        { ability: { name: "overgrow", url: "" }, is_hidden: false, slot: 1 },
        { ability: { name: "chlorophyll", url: "" }, is_hidden: true, slot: 3 },
      ],
    };

    it("normaliza el detalle: prefiere el artwork oficial sobre el front_default", async () => {
      pokeApiMock.mockResolvedValueOnce(raw);
      const { fetchDetail } = usePokemonApi();

      const detail = await fetchDetail("bulbasaur");

      expect(pokeApiMock).toHaveBeenCalledWith("/pokemon/bulbasaur");
      expect(detail).toEqual({
        id: 1,
        name: "bulbasaur",
        image: "artwork.png",
        types: ["grass"],
        heightM: 0.7,
        weightKg: 6.9,
        stats: [{ name: "hp", value: 45 }],
        abilities: [
          { slug: "overgrow", isHidden: false },
          { slug: "chlorophyll", isHidden: true },
        ],
      });
    });

    it("cae a front_default si no hay artwork oficial", async () => {
      pokeApiMock.mockResolvedValueOnce({
        ...raw,
        sprites: { front_default: "front.png" },
      });
      const { fetchDetail } = usePokemonApi();

      const detail = await fetchDetail("bulbasaur");
      expect(detail.image).toBe("front.png");
    });
  });

  describe("fetchSpecies", () => {
    const raw: PokemonSpeciesRaw = {
      genera: [
        { genus: "Seed Pokémon", language: { name: "en" } },
        { genus: "Pokémon Semilla", language: { name: "es" } },
      ],
      flavor_text_entries: [
        { flavor_text: "A strange seed.", language: { name: "en" }, version: { name: "red" } },
        { flavor_text: "Un\nextraño\fbicho.", language: { name: "es" }, version: { name: "red" } },
      ],
      gender_rate: 1,
    };

    it("prioriza el idioma español y limpia saltos de línea del flavor text", async () => {
      pokeApiMock.mockResolvedValueOnce(raw);
      const { fetchSpecies } = usePokemonApi();

      const species = await fetchSpecies("bulbasaur");

      expect(species).toEqual({
        genus: "Pokémon Semilla",
        description: "Un extraño bicho.",
        genderRate: 1,
      });
    });

    it("si no hay entrada en español, usa la primera disponible sin inventar nada", async () => {
      pokeApiMock.mockResolvedValueOnce({
        genera: [{ genus: "Seed Pokémon", language: { name: "en" } }],
        flavor_text_entries: [
          { flavor_text: "A strange seed.", language: { name: "en" }, version: { name: "red" } },
        ],
        gender_rate: 1,
      });
      const { fetchSpecies } = usePokemonApi();

      const species = await fetchSpecies("bulbasaur");

      expect(species.genus).toBe("Seed Pokémon");
      expect(species.description).toBe("A strange seed.");
    });
  });

  describe("fetchType", () => {
    const baseRaw: PokemonTypeRaw = {
      id: 12,
      name: "grass",
      names: [
        { name: "Grass", language: { name: "en" } },
        { name: "Planta", language: { name: "es" } },
      ],
      damage_relations: {
        double_damage_from: [{ name: "fire", url: "" }],
        half_damage_from: [{ name: "water", url: "" }],
        no_damage_from: [],
      },
      sprites: {},
    };

    it("usa el ícono de generation-ix si está disponible", async () => {
      pokeApiMock.mockResolvedValueOnce({
        ...baseRaw,
        sprites: {
          "generation-ix": { "scarlet-violet": { symbol_icon: "ix.svg" } },
          "generation-viii": { "sword-shield": { symbol_icon: "viii.svg" } },
        },
      });
      const { fetchType } = usePokemonApi();

      const type = await fetchType("grass");

      expect(type.label).toBe("Planta");
      expect(type.iconUrl).toBe("ix.svg");
      expect(type.doubleDamageFrom).toEqual(["fire"]);
      expect(type.halfDamageFrom).toEqual(["water"]);
    });

    it("cae a generation-viii si no hay ícono en generation-ix", async () => {
      pokeApiMock.mockResolvedValueOnce({
        ...baseRaw,
        sprites: {
          "generation-viii": { "sword-shield": { symbol_icon: "viii.svg" } },
        },
      });
      const { fetchType } = usePokemonApi();

      const type = await fetchType("grass");
      expect(type.iconUrl).toBe("viii.svg");
    });

    it("devuelve null si ninguna generación tiene ícono", async () => {
      pokeApiMock.mockResolvedValueOnce(baseRaw);
      const { fetchType } = usePokemonApi();

      const type = await fetchType("grass");
      expect(type.iconUrl).toBeNull();
    });
  });

  describe("fetchTypeList", () => {
    it("excluye los tipos que no son jugables (shadow, unknown, stellar)", async () => {
      const res: TypeListResponse = {
        results: [
          { name: "normal", url: "" },
          { name: "fire", url: "" },
          { name: "shadow", url: "" },
          { name: "unknown", url: "" },
          { name: "stellar", url: "" },
        ],
      };
      pokeApiMock.mockResolvedValueOnce(res);
      const { fetchTypeList } = usePokemonApi();

      const slugs = await fetchTypeList();
      expect(slugs).toEqual(["normal", "fire"]);
    });
  });

  describe("fetchAbility", () => {
    it("normaliza la habilidad con el label en español si existe", async () => {
      const raw: AbilityRaw = {
        id: 65,
        name: "overgrow",
        names: [
          { name: "Overgrow", language: { name: "en" } },
          { name: "Espesura", language: { name: "es" } },
        ],
      };
      pokeApiMock.mockResolvedValueOnce(raw);
      const { fetchAbility } = usePokemonApi();

      const ability = await fetchAbility("overgrow");
      expect(ability).toEqual({ slug: "overgrow", label: "Espesura" });
    });

    it("cae al slug si no hay label en español", async () => {
      const raw: AbilityRaw = {
        id: 65,
        name: "overgrow",
        names: [{ name: "Overgrow", language: { name: "en" } }],
      };
      pokeApiMock.mockResolvedValueOnce(raw);
      const { fetchAbility } = usePokemonApi();

      const ability = await fetchAbility("overgrow");
      expect(ability.label).toBe("overgrow");
    });
  });
});

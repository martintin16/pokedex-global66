import { describe, it, expect, vi, beforeEach } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { mountComponent } from "../../../helpers/mount";
import ShareButton from "~/components/pokemon/ShareButton.vue";
import { useTypesStore } from "~/stores/types";
import { useAbilitiesStore } from "~/stores/abilities";
import type { Pokemon, PokemonSpecies } from "~/types/pokemon";

const pokemon: Pokemon = {
  id: 1,
  name: "bulbasaur",
  image: "img.png",
  types: ["grass", "poison"],
  heightM: 0.7,
  weightKg: 6.9,
  stats: [],
  abilities: [
    { slug: "overgrow", isHidden: false },
    { slug: "chlorophyll", isHidden: true },
  ],
};

const species: PokemonSpecies = {
  genus: "Pokémon Semilla",
  description: "...",
  genderRate: 1,
};

describe("ShareButton", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
  });

  function seedStores() {
    const typesStore = useTypesStore();
    typesStore.cache.grass = {
      slug: "grass",
      label: "Planta",
      doubleDamageFrom: [],
      halfDamageFrom: [],
      noDamageFrom: [],
      iconUrl: null,
    };
    typesStore.cache.poison = {
      slug: "poison",
      label: "Veneno",
      doubleDamageFrom: [],
      halfDamageFrom: [],
      noDamageFrom: [],
      iconUrl: null,
    };
    typesStore.cache.fire = {
      slug: "fire",
      label: "Fuego",
      doubleDamageFrom: [],
      halfDamageFrom: [],
      noDamageFrom: [],
      iconUrl: null,
    };
    const abilitiesStore = useAbilitiesStore();
    abilitiesStore.cache.overgrow = { slug: "overgrow", label: "Espesura" };
    abilitiesStore.cache.chlorophyll = {
      slug: "chlorophyll",
      label: "Clorofila",
    };
  }

  it("copia al portapapeles un resumen del pokémon con sus habilidades y debilidades", async () => {
    const wrapper = mountComponent(ShareButton, {
      props: { pokemon, species, weaknesses: ["fire"] },
    });
    seedStores();

    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0][0] as string;
    expect(text).toContain("Nombre: Bulbasaur");
    expect(text).toContain("Nro pokédex: 001");
    expect(text).toContain("Tipo: Planta, Veneno");
    expect(text).toContain("Peso: 6.9 kg");
    expect(text).toContain("Altura: 0.7 m");
    expect(text).toContain("Categoría: Pokémon Semilla");
    expect(text).toContain("Habilidades: Espesura, Clorofila (oculta)");
    expect(text).toContain("Debilidades: Fuego");
  });

  it("omite la línea de categoría si no hay species", async () => {
    const wrapper = mountComponent(ShareButton, {
      props: { pokemon, species: null, weaknesses: [] },
    });
    seedStores();

    await wrapper.get("button").trigger("click");
    await flushPromises();

    const text = writeText.mock.calls[0][0] as string;
    expect(text).not.toContain("Categoría");
    expect(text).not.toContain("Debilidades");
  });

  it("muestra el ícono de check y el texto 'Copiado' tras compartir, y vuelve al estado inicial", async () => {
    vi.useFakeTimers();
    const wrapper = mountComponent(ShareButton, {
      props: { pokemon, species, weaknesses: [] },
    });
    seedStores();

    expect(wrapper.get("[data-icon]").attributes("data-icon")).toBe(
      "material-symbols:share-rounded",
    );

    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(wrapper.get("[data-icon]").attributes("data-icon")).toBe(
      "material-symbols:check-rounded",
    );
    expect(wrapper.text()).toContain("Copiado al portapapeles");

    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.get("[data-icon]").attributes("data-icon")).toBe(
      "material-symbols:share-rounded",
    );
    vi.useRealTimers();
  });
});

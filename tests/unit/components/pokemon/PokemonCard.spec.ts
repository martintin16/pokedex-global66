import { describe, it, expect, beforeEach, vi } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import PokemonCard from "~/components/pokemon/PokemonCard.vue";
import { usePokemonStore } from "~/stores/pokemon";
import { pokeApiMock, MockIntersectionObserver } from "../../../setup";
import type { Pokemon, PokemonTypeRaw } from "~/types/pokemon";

const fakePokemon: Pokemon = {
  id: 1,
  name: "bulbasaur",
  image: "bulbasaur.png",
  types: ["grass"],
  heightM: 0.7,
  weightKg: 6.9,
  stats: [],
  abilities: [],
};

const grassRaw: PokemonTypeRaw = {
  id: 12,
  name: "grass",
  names: [{ name: "Planta", language: { name: "es" } }],
  damage_relations: {
    double_damage_from: [],
    half_damage_from: [],
    no_damage_from: [],
  },
  sprites: {},
};

describe("PokemonCard", () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    pokeApiMock.mockReset();
    pokeApiMock.mockResolvedValue(grassRaw);
  });

  it("linkea al detalle y muestra nombre + número mientras carga (skeleton)", () => {
    const wrapper = mountComponent(PokemonCard, {
      props: { name: "bulbasaur", id: 1, isFavorite: false },
    });

    expect(wrapper.get("a").attributes("href")).toBe("/pokemon/bulbasaur");
    expect(wrapper.text()).toContain("bulbasaur");
    expect(wrapper.text()).toContain("Nº001");
    expect(wrapper.find("img[alt='bulbasaur']").exists()).toBe(false);
    expect(wrapper.findAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("una vez cargado el detalle, muestra el sprite y un TypeBadge por tipo", async () => {
    const wrapper = mountComponent(PokemonCard, {
      props: { name: "bulbasaur", id: 1, isFavorite: false },
    });
    const store = usePokemonStore();
    vi.spyOn(store, "getDetail").mockResolvedValue(fakePokemon);

    MockIntersectionObserver.instances[0].trigger(true);
    await new Promise((r) => setTimeout(r, 0));
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const img = wrapper.get("img[alt='bulbasaur']");
    expect(img.attributes("src")).toBe("bulbasaur.png");
    expect(wrapper.findAll(".animate-pulse")).toHaveLength(0);
  });

  it("botón de favorito: refleja isFavorite y emite toggleFavorite sin navegar", async () => {
    const wrapper = mountComponent(PokemonCard, {
      props: { name: "bulbasaur", id: 1, isFavorite: true },
    });

    const button = wrapper.get('button[aria-label="Quitar de favoritos"]');
    expect(button.get("[data-icon]").attributes("data-icon")).toBe(
      "material-symbols:favorite-rounded",
    );

    await button.trigger("click");
    expect(wrapper.emitted("toggleFavorite")).toHaveLength(1);
  });

  it("botón de favorito muestra el ícono outline cuando isFavorite=false", () => {
    const wrapper = mountComponent(PokemonCard, {
      props: { name: "bulbasaur", id: 1, isFavorite: false },
    });

    const button = wrapper.get('button[aria-label="Agregar a favoritos"]');
    expect(button.get("[data-icon]").attributes("data-icon")).toBe(
      "material-symbols:favorite-outline-rounded",
    );
  });
});

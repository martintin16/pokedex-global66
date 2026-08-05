import { describe, it, expect, beforeEach } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import TypeBadge from "~/components/global/TypeBadge.vue";
import { useTypesStore } from "~/stores/types";
import { pokeApiMock } from "../../../setup";
import type { PokemonTypeRaw } from "~/types/pokemon";

function rawType(name: string, esLabel: string): PokemonTypeRaw {
  return {
    id: 1,
    name,
    names: [{ name: esLabel, language: { name: "es" } }],
    damage_relations: {
      double_damage_from: [],
      half_damage_from: [],
      no_damage_from: [],
    },
    sprites: {},
  };
}

describe("TypeBadge", () => {
  beforeEach(() => {
    pokeApiMock.mockReset();
    pokeApiMock.mockResolvedValue(rawType("fire", "Fuego"));
  });

  it("muestra el slug como label mientras no llegó la respuesta de la API", () => {
    const wrapper = mountComponent(TypeBadge, { props: { type: "fire" } });
    expect(wrapper.text()).toContain("fire");
  });

  it("muestra el ícono conocido envuelto en un círculo blanco", () => {
    const wrapper = mountComponent(TypeBadge, { props: { type: "fire" } });
    const iconWrapper = wrapper.get(".rounded-full.bg-white");
    const img = iconWrapper.get("img");

    expect(img.attributes("src")).toBe("/type-icons/fire.svg");
  });

  it("aplica la clase de color del tipo", () => {
    const wrapper = mountComponent(TypeBadge, { props: { type: "fire" } });
    expect(wrapper.get("span").classes().join(" ")).toContain("bg-type-fire");
  });

  it("usa el label ya cacheado en useTypesStore en vez del slug", async () => {
    const wrapper = mountComponent(TypeBadge, { props: { type: "fire" } });
    const store = useTypesStore();
    store.cache["fire"] = {
      slug: "fire",
      label: "Fuego",
      doubleDamageFrom: [],
      halfDamageFrom: [],
      noDamageFrom: [],
      iconUrl: null,
    };

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Fuego");
  });

  it("para un tipo desconocido, no muestra img sino el placeholder circular", () => {
    const wrapper = mountComponent(TypeBadge, {
      props: { type: "made-up-type" },
    });

    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.find(".bg-white\\/30").exists()).toBe(true);
  });
});

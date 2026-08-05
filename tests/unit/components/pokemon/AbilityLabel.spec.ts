import { describe, it, expect, beforeEach } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import AbilityLabel from "~/components/pokemon/AbilityLabel.vue";
import { useAbilitiesStore } from "~/stores/abilities";
import { pokeApiMock } from "../../../setup";
import type { AbilityRaw } from "~/types/pokemon";

describe("AbilityLabel", () => {
  beforeEach(() => {
    pokeApiMock.mockReset();
    pokeApiMock.mockResolvedValue({
      id: 65,
      name: "overgrow",
      names: [{ name: "Espesura", language: { name: "es" } }],
    } satisfies AbilityRaw);
  });

  it("muestra el slug mientras no hay label cacheado", () => {
    const wrapper = mountComponent(AbilityLabel, {
      props: { slug: "overgrow" },
    });
    expect(wrapper.text()).toBe("overgrow");
  });

  it("muestra el label cacheado en useAbilitiesStore", async () => {
    const wrapper = mountComponent(AbilityLabel, {
      props: { slug: "overgrow" },
    });
    const store = useAbilitiesStore();
    store.cache["overgrow"] = { slug: "overgrow", label: "Espesura" };

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe("Espesura");
  });
});

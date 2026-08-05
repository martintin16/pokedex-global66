import { describe, it, expect, beforeEach, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { useLazyPokemonDetail } from "~/composables/useLazyPokemonDetail";
import { usePokemonStore } from "~/stores/pokemon";
import { MockIntersectionObserver } from "../setup";
import type { Pokemon } from "~/types/pokemon";

const fakePokemon: Pokemon = {
  id: 1,
  name: "bulbasaur",
  image: "img.png",
  types: ["grass"],
  heightM: 0.7,
  weightKg: 6.9,
  stats: [],
  abilities: [],
};

const Host = defineComponent({
  props: { name: { type: String, required: true } },
  setup(props, { expose }) {
    const { el, detail, loading } = useLazyPokemonDetail(props.name);
    expose({ detail, loading });
    return () => h("div", { ref: el });
  },
});

function mountHost(name = "bulbasaur") {
  return mount(Host, { props: { name } }) as unknown as ReturnType<
    typeof mount
  > & { vm: { detail: Pokemon | null; loading: boolean } };
}

describe("useLazyPokemonDetail", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    MockIntersectionObserver.instances = [];
  });

  it("no pide el detalle hasta que la card entra en viewport", () => {
    const store = usePokemonStore();
    const getDetail = vi.spyOn(store, "getDetail");

    const wrapper = mountHost();

    expect(wrapper.vm.detail).toBeNull();
    expect(getDetail).not.toHaveBeenCalled();
    expect(MockIntersectionObserver.instances[0].observe).toHaveBeenCalled();
  });

  it("pide el detalle apenas la card intersecta y para de observar", async () => {
    const store = usePokemonStore();
    vi.spyOn(store, "getDetail").mockResolvedValue(fakePokemon);

    const wrapper = mountHost();
    const observer = MockIntersectionObserver.instances[0];

    observer.trigger(true);
    await new Promise((r) => setTimeout(r, 0));
    await wrapper.vm.$nextTick();

    expect(store.getDetail).toHaveBeenCalledWith("bulbasaur");
    expect(wrapper.vm.detail).toEqual(fakePokemon);
    expect(wrapper.vm.loading).toBe(false);
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("no hace nada si la entrada reporta isIntersecting: false", async () => {
    const store = usePokemonStore();
    const getDetail = vi.spyOn(store, "getDetail").mockResolvedValue(fakePokemon);

    const wrapper = mountHost();
    const observer = MockIntersectionObserver.instances[0];

    observer.trigger(false);
    await wrapper.vm.$nextTick();

    expect(getDetail).not.toHaveBeenCalled();
    expect(wrapper.vm.detail).toBeNull();
  });

  it("si el detalle ya estaba en cache, no crea el observer", () => {
    const store = usePokemonStore();
    store.detailCache["bulbasaur"] = fakePokemon;

    const wrapper = mountHost();

    expect(wrapper.vm.detail).toEqual(fakePokemon);
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("desconecta el observer al desmontar", () => {
    mountHost().unmount();
    expect(MockIntersectionObserver.instances[0].disconnect).toHaveBeenCalled();
  });
});

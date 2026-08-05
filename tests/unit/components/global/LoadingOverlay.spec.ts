import { describe, it, expect } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import LoadingOverlay from "~/components/global/LoadingOverlay.vue";
import Loader from "~/components/global/Loader.vue";

describe("LoadingOverlay", () => {
  it("renderiza el Loader con el size por defecto (4rem)", () => {
    const wrapper = mountComponent(LoadingOverlay);
    const loader = wrapper.findComponent(Loader);

    expect(loader.exists()).toBe(true);
    expect(loader.props("size")).toBe("4rem");
  });

  it("propaga un size custom al Loader", () => {
    const wrapper = mountComponent(LoadingOverlay, {
      props: { size: "8rem" },
    });

    expect(wrapper.findComponent(Loader).props("size")).toBe("8rem");
  });
});

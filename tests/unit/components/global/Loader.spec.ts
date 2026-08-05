import { describe, it, expect } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import Loader from "~/components/global/Loader.vue";

describe("Loader", () => {
  it("usa los valores por defecto de src y size", () => {
    const wrapper = mountComponent(Loader);
    const img = wrapper.get("img");

    expect(img.attributes("src")).toBe("/illustrations/loader.svg");
    expect(img.attributes("alt")).toBe("Cargando");
    expect(img.attributes("style")).toContain("width: 6rem");
    expect(img.attributes("style")).toContain("height: 6rem");
  });

  it("acepta src y size custom", () => {
    const wrapper = mountComponent(Loader, {
      props: { src: "/custom.svg", size: "2rem" },
    });
    const img = wrapper.get("img");

    expect(img.attributes("src")).toBe("/custom.svg");
    expect(img.attributes("style")).toContain("width: 2rem");
    expect(img.attributes("style")).toContain("height: 2rem");
  });
});

import { describe, it, expect } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import TypeShape from "~/components/global/TypeShape.vue";

describe("TypeShape", () => {
  it("arma el mask-image con el svg del tipo y el gradiente como background", () => {
    const wrapper = mountComponent(TypeShape, { props: { type: "fire" } });
    const style = wrapper.get("div").attributes("style") ?? "";

    expect(style).toContain(
      "background: radial-gradient(circle at 35% 30%, #FFCC80, #FF9800)",
    );
    expect(style).toContain("mask-image: url(/type-icons/fire.svg)");
  });

  it("no aplica estilos si el tipo no tiene shape mapeado", () => {
    const wrapper = mountComponent(TypeShape, {
      props: { type: "made-up-type" },
    });
    const style = wrapper.get("div").attributes("style");

    expect(style ?? "").not.toContain("mask-image");
  });
});

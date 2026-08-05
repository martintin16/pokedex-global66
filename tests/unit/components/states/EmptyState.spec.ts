import { describe, it, expect } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import EmptyState from "~/components/states/EmptyState.vue";

describe("EmptyState", () => {
  it("muestra imagen, título y descripción", () => {
    const wrapper = mountComponent(EmptyState, {
      props: {
        image: "/illustrations/empty.svg",
        title: "Sin resultados",
        description: "No encontramos pokémons con ese filtro.",
      },
    });

    const img = wrapper.get("img");
    expect(img.attributes("src")).toBe("/illustrations/empty.svg");
    expect(wrapper.text()).toContain("Sin resultados");
    expect(wrapper.text()).toContain("No encontramos pokémons con ese filtro.");
  });

  it("no muestra el botón de acción si no se pasa ctaLabel", () => {
    const wrapper = mountComponent(EmptyState, {
      props: { image: "/x.svg", title: "t", description: "d" },
    });

    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("muestra el botón y emite 'cta' al hacer click cuando hay ctaLabel", async () => {
    const wrapper = mountComponent(EmptyState, {
      props: {
        image: "/x.svg",
        title: "t",
        description: "d",
        ctaLabel: "Reintentar",
      },
    });

    const button = wrapper.get("button");
    expect(button.text()).toBe("Reintentar");

    await button.trigger("click");
    expect(wrapper.emitted("cta")).toHaveLength(1);
  });
});

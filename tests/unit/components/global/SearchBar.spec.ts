import { describe, it, expect } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import SearchBar from "~/components/global/SearchBar.vue";

describe("SearchBar", () => {
  it("no muestra el botón de filtro por defecto", () => {
    const wrapper = mountComponent(SearchBar);
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("muestra el botón de filtro y emite openFilter al click", async () => {
    const wrapper = mountComponent(SearchBar, {
      props: { showFilter: true },
    });

    const button = wrapper.get("button");
    await button.trigger("click");

    expect(wrapper.emitted("openFilter")).toHaveLength(1);
  });

  it("v-model: refleja el valor inicial y emite update:modelValue al escribir", async () => {
    const wrapper = mountComponent(SearchBar, {
      props: { modelValue: "pika" },
    });

    const input = wrapper.get("input");
    expect((input.element as HTMLInputElement).value).toBe("pika");

    await input.setValue("pikachu");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["pikachu"]);
  });
});

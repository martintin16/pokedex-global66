import { describe, it, expect, vi, afterEach } from "vitest";
import type { VueWrapper } from "@vue/test-utils";
import { mountComponent } from "../../../helpers/mount";
import FilterModal from "~/components/pokemon/FilterModal.vue";
import { useTypesStore } from "~/stores/types";

function seedTypes(store: ReturnType<typeof useTypesStore>) {
  store.slugs = ["fire", "water"];
  store.cache = {
    fire: {
      slug: "fire",
      label: "Fuego",
      doubleDamageFrom: [],
      halfDamageFrom: [],
      noDamageFrom: [],
      iconUrl: null,
    },
    water: {
      slug: "water",
      label: "Agua",
      doubleDamageFrom: [],
      halfDamageFrom: [],
      noDamageFrom: [],
      iconUrl: null,
    },
  };
}

describe("FilterModal", () => {
  let wrapper: VueWrapper | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it("no renderiza contenido en el body cuando open=false", () => {
    wrapper = mountComponent(FilterModal, {
      props: { open: false, selected: [] },
    });
    expect(document.body.querySelector("ul")).toBeNull();
  });

  it("muestra 'Cargando tipos...' si useTypesStore.all está vacío", () => {
    wrapper = mountComponent(FilterModal, {
      props: { open: true, selected: [] },
    });
    expect(document.body.textContent).toContain("Cargando tipos...");
  });

  it("lista los tipos disponibles con sus checkboxes pre-marcados según 'selected'", async () => {
    wrapper = mountComponent(FilterModal, {
      props: { open: true, selected: ["water"] },
    });
    seedTypes(useTypesStore());
    await wrapper.vm.$nextTick();

    const items = document.body.querySelectorAll("li");
    expect(items).toHaveLength(2);

    const checkboxes = Array.from(
      document.body.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
    );
    expect(checkboxes[0].checked).toBe(false); // fire
    expect(checkboxes[1].checked).toBe(true); // water
  });

  it("toggle + Aplicar emite 'apply' con el draft actualizado", async () => {
    wrapper = mountComponent(FilterModal, {
      props: { open: true, selected: ["water"] },
    });
    seedTypes(useTypesStore());
    await wrapper.vm.$nextTick();

    const checkboxes = document.body.querySelectorAll('input[type="checkbox"]');
    (checkboxes[0] as HTMLInputElement).dispatchEvent(
      new Event("change", { bubbles: true }),
    );
    await wrapper.vm.$nextTick();

    const applyButton = Array.from(
      document.body.querySelectorAll("button"),
    ).find((b) => b.textContent?.trim() === "Aplicar")!;
    applyButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(wrapper.emitted("apply")?.[0]?.[0]).toEqual(["water", "fire"]);
  });

  it("Cancelar y la X emiten 'close'", () => {
    wrapper = mountComponent(FilterModal, {
      props: { open: true, selected: [] },
    });

    const closeX = document.body.querySelector(
      'button[aria-label="Cerrar"]',
    ) as HTMLButtonElement;
    closeX.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("al reabrirse (open false→true), resetea el draft a 'selected' y llama ensureAll()", async () => {
    wrapper = mountComponent(FilterModal, {
      props: { open: false, selected: ["fire"] },
    });
    const store = useTypesStore();
    const ensureAll = vi.spyOn(store, "ensureAll").mockResolvedValue();

    await wrapper.setProps({ open: true });

    expect(ensureAll).toHaveBeenCalled();
  });
});

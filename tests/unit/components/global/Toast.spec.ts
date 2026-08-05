import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { VueWrapper } from "@vue/test-utils";
import { mountComponent } from "../../../helpers/mount";
import Toast from "~/components/global/Toast.vue";
import { useToast } from "~/composables/useToast";

describe("Toast", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    useToast().toast.value = null;
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it("no renderiza nada si no hay toast activo", () => {
    wrapper = mountComponent(Toast);
    expect(document.body.querySelector('[role="status"]')).toBeNull();
  });

  it("teletransporta y muestra el mensaje cuando show() se dispara", async () => {
    wrapper = mountComponent(Toast);
    useToast().show("Bulbasaur agregado a favoritos");
    await wrapper.vm.$nextTick();

    const el = document.body.querySelector('[role="status"]');
    expect(el?.textContent?.trim()).toBe("Bulbasaur agregado a favoritos");
  });
});

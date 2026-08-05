import { describe, it, expect, beforeEach } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import Sidebar from "~/components/global/Sidebar.vue";
import { NAV_ITEMS } from "~/utils/navItems";
import { mockRoute } from "../../../setup";

describe("Sidebar", () => {
  beforeEach(() => {
    mockRoute.path = "/";
  });

  it("renderiza el logo y un link por cada item de navegación", () => {
    const wrapper = mountComponent(Sidebar);

    expect(wrapper.text()).toContain("Pokédex");
    const links = wrapper.findAll("a");
    expect(links).toHaveLength(NAV_ITEMS.length);
    NAV_ITEMS.forEach((item, i) => {
      expect(links[i].attributes("href")).toBe(item.to);
    });
  });

  it("resalta el link activo con fondo distinto", () => {
    mockRoute.path = "/list";
    const wrapper = mountComponent(Sidebar);
    const links = wrapper.findAll("a");

    const listIndex = NAV_ITEMS.findIndex((i) => i.to === "/list");
    links.forEach((link, i) => {
      if (i === listIndex) {
        expect(link.classes()).toContain("bg-gray-100");
      } else {
        expect(link.classes()).toContain("text-gray-500");
      }
    });
  });
});

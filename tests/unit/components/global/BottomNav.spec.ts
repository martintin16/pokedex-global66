import { describe, it, expect, beforeEach } from "vitest";
import { mountComponent } from "../../../helpers/mount";
import BottomNav from "~/components/global/BottomNav.vue";
import { NAV_ITEMS } from "~/utils/navItems";
import { mockRoute } from "../../../setup";

describe("BottomNav", () => {
  beforeEach(() => {
    mockRoute.path = "/";
  });

  it("renderiza un link por cada item de navegación con su href", () => {
    const wrapper = mountComponent(BottomNav);
    const links = wrapper.findAll("a");

    expect(links).toHaveLength(NAV_ITEMS.length);
    NAV_ITEMS.forEach((item, i) => {
      expect(links[i].attributes("href")).toBe(item.to);
      expect(links[i].text()).toContain(item.label);
    });
  });

  it("usa <img> para items type=image e <Icon> (stub) para items type=icon", () => {
    const wrapper = mountComponent(BottomNav);
    const links = wrapper.findAll("a");

    NAV_ITEMS.forEach((item, i) => {
      if (item.type === "image") {
        expect(links[i].find("img").exists()).toBe(true);
        expect(links[i].find("img").attributes("src")).toBe(item.src);
      } else {
        expect(links[i].find("[data-icon]").attributes("data-icon")).toBe(
          item.icon,
        );
      }
    });
  });

  it("resalta el link activo según la ruta actual", () => {
    mockRoute.path = "/favoritos";
    const wrapper = mountComponent(BottomNav);
    const links = wrapper.findAll("a");

    const favoritosIndex = NAV_ITEMS.findIndex((i) => i.to === "/favoritos");
    links.forEach((link, i) => {
      // El label siempre es el último <span> (el primero puede ser el
      // stub de <Icon>, que también renderiza un <span>).
      const spans = link.findAll("span");
      const span = spans[spans.length - 1];
      if (i === favoritosIndex) {
        expect(span.classes()).toContain("text-primary");
      } else {
        expect(span.classes()).toContain("text-gray-400");
      }
    });
  });
});

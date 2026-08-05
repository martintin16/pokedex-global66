import { vi } from "vitest";
import * as Vue from "vue";

/**
 * Nuxt auto-importa toda la Composition API de Vue y los composables/stores
 * propios (carpetas /composables y /stores) sin import explícito, vía un
 * unplugin en build time. Vitest no corre ese plugin, así que replicamos el
 * mismo efecto acá: exponemos esas funciones como globals, igual que lo hace
 * Nuxt. Sin esto, cualquier .vue o composable que use `ref()`, `computed()`,
 * `useState()`, etc. sin importarlos revienta con ReferenceError en los tests.
 */
for (const [key, value] of Object.entries(Vue)) {
  if (typeof value === "function" && /^[a-z]/.test(key)) {
    vi.stubGlobal(key, value);
  }
}

// ---------- useState (Nuxt) ----------
const stateRegistry = new Map<string, ReturnType<typeof Vue.ref>>();
vi.stubGlobal("useState", <T>(key: string, init?: () => T) => {
  if (!stateRegistry.has(key)) {
    stateRegistry.set(key, Vue.ref(init ? init() : undefined));
  }
  return stateRegistry.get(key);
});

// ---------- useRuntimeConfig / useNuxtApp (Nuxt) ----------
export const pokeApiMock = vi.fn();
vi.stubGlobal("useRuntimeConfig", () =>
  Vue.reactive({ public: { pokeApiBase: "https://pokeapi.co/api/v2" } }),
);
vi.stubGlobal("useNuxtApp", () => ({ $pokeApi: pokeApiMock }));

// ---------- useRoute / useRouter (vue-router, vía Nuxt) ----------
export const mockRoute = Vue.reactive({ path: "/" });
vi.stubGlobal("useRoute", () => mockRoute);
vi.stubGlobal("useRouter", () => ({ push: vi.fn(), replace: vi.fn() }));
vi.stubGlobal("navigateTo", vi.fn());

// ---------- @pinia-plugin-persistedstate/nuxt ----------
// El valor real no importa: en los tests nunca instalamos el plugin de
// persistencia (usamos pinia "pelado"), así que `persist` queda inerte.
// Solo necesitamos que el identificador exista para que `defineStore` no
// reviente al evaluar el objeto de opciones.
vi.stubGlobal("persistedState", {
  localStorage: { key: "localStorage" },
  sessionStorage: { key: "sessionStorage" },
  cookies: () => ({ key: "cookies" }),
});

// ---------- IntersectionObserver (jsdom no lo implementa) ----------
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

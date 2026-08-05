import { vi } from "vitest";

// Separado de tests/setup.ts a propósito: los `import` de un módulo se
// hoistean por encima de cualquier otro código DE ESE MISMO MÓDULO. Si estos
// imports vivieran en setup.ts, se evaluarían (y con ellos, el `persist:
// { storage: persistedState.localStorage }` de stores/favorites.ts) antes de
// que `vi.stubGlobal("persistedState", ...)` llegue a ejecutarse. Al vivir en
// un setupFile aparte que Vitest carga después, ya encuentran los globals
// listos.
import { usePokemonStore } from "~/stores/pokemon";
import { useFavoritesStore } from "~/stores/favorites";
import { useTypesStore } from "~/stores/types";
import { useAbilitiesStore } from "~/stores/abilities";
import { usePokemonApi } from "~/composables/usePokemonApi";
import { usePokemonType } from "~/composables/usePokemonType";
import { useToast } from "~/composables/useToast";
import { useLazyPokemonDetail } from "~/composables/useLazyPokemonDetail";
import { NAV_ITEMS } from "~/utils/navItems";

vi.stubGlobal("usePokemonStore", usePokemonStore);
vi.stubGlobal("useFavoritesStore", useFavoritesStore);
vi.stubGlobal("useTypesStore", useTypesStore);
vi.stubGlobal("useAbilitiesStore", useAbilitiesStore);
vi.stubGlobal("usePokemonApi", usePokemonApi);
vi.stubGlobal("usePokemonType", usePokemonType);
vi.stubGlobal("useToast", useToast);
vi.stubGlobal("useLazyPokemonDetail", useLazyPokemonDetail);
vi.stubGlobal("NAV_ITEMS", NAV_ITEMS);

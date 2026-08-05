import { mount, type ComponentMountingOptions } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { h, type Component } from "vue";

import BottomNav from "~/components/global/BottomNav.vue";
import Loader from "~/components/global/Loader.vue";
import LoadingOverlay from "~/components/global/LoadingOverlay.vue";
import SearchBar from "~/components/global/SearchBar.vue";
import Sidebar from "~/components/global/Sidebar.vue";
import Toast from "~/components/global/Toast.vue";
import TypeBadge from "~/components/global/TypeBadge.vue";
import TypeShape from "~/components/global/TypeShape.vue";
import AbilityLabel from "~/components/pokemon/AbilityLabel.vue";
import FilterModal from "~/components/pokemon/FilterModal.vue";
import PokemonCard from "~/components/pokemon/PokemonCard.vue";
import ShareButton from "~/components/pokemon/ShareButton.vue";
import EmptyState from "~/components/states/EmptyState.vue";

// Con `pathPrefix: false` Nuxt registra estos componentes de forma global
// (sin import) en toda la app. Replicamos eso acá para que, por ejemplo,
// <TypeBadge> dentro de PokemonCard.vue resuelva a la implementación real.
const GLOBAL_COMPONENTS = {
  BottomNav,
  Loader,
  LoadingOverlay,
  SearchBar,
  Sidebar,
  Toast,
  TypeBadge,
  TypeShape,
  AbilityLabel,
  FilterModal,
  PokemonCard,
  ShareButton,
  EmptyState,
};

const NuxtLinkStub = {
  name: "NuxtLink",
  props: ["to"],
  setup(props: { to: string }, { slots }: any) {
    return () => h("a", { href: props.to }, slots.default?.());
  },
};

const IconStub = {
  name: "Icon",
  props: ["name"],
  setup(props: { name: string }) {
    return () => h("span", { "data-icon": props.name });
  },
};

export function mountComponent<T extends Component>(
  component: T,
  options: ComponentMountingOptions<T> = {},
) {
  setActivePinia(createPinia());

  return mount(component, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        NuxtLink: NuxtLinkStub,
        Icon: IconStub,
        ...options.global?.stubs,
      },
      components: {
        ...GLOBAL_COMPONENTS,
        ...options.global?.components,
      },
    },
  });
}

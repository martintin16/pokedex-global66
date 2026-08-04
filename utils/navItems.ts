export interface NavItem {
  label: string;
  to: string;
  type: "image" | "icon";
  src?: string; // solo si type === 'image'
  icon?: string; // solo si type === 'icon'
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Pokédex", to: "/", type: "image", src: "/nav-icons/pokeball.svg" },
  {
    label: "Regiones",
    to: "/regiones",
    type: "image",
    src: "/nav-icons/pokeRadar.svg",
  },
  {
    label: "Favoritos",
    to: "/favoritos",
    type: "icon",
    icon: "material-symbols:favorite-outline-rounded",
  },
  {
    label: "Perfil",
    to: "/perfil",
    type: "icon",
    icon: "material-symbols:person-outline-rounded",
  },
];

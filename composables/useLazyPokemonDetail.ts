import type { Pokemon } from "~/types/pokemon";

/**
 * PokeAPI no da tipo/imagen en el endpoint de lista, solo nombre + url.
 * Para pintar cada card (color de tipo, sprite) hace falta el detalle.
 * En vez de pedir el detalle de TODOS los items apenas se cargan (out of
 * the question con ~1300 pokémons), cada card observa su propia
 * visibilidad y solo entonces dispara el fetch. El resultado queda en el
 * store (detailCache), así que si el usuario hace scroll de ida y vuelta
 * no se repite el llamado.
 */
export function useLazyPokemonDetail(name: string) {
  const store = usePokemonStore();
  const el = ref<HTMLElement | null>(null);
  const detail = ref<Pokemon | null>(store.detailCache[name] ?? null);
  const loading = ref(false);

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (detail.value || !el.value) return;
    observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loading.value || detail.value) return;
        loading.value = true;
        try {
          detail.value = await store.getDetail(name);
        } finally {
          loading.value = false;
          observer?.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el.value);
  });

  onUnmounted(() => observer?.disconnect());

  return { el, detail, loading };
}

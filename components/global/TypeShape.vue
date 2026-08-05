<script setup lang="ts">
/**
 * Renderiza la silueta grande de un tipo (la que va detrás del sprite
 * en la card y en el hero del detalle) con degradado real, aunque el
 * SVG exportado del Figma sea de un solo color sólido.
 *
 * Cómo funciona: `mask-image` recorta el elemento con la forma del
 * SVG (usa su canal alfa — parte pintada vs. transparente — e ignora
 * por completo su color de relleno). El color que se ve es el
 * `background` que le ponemos acá al lado, en CSS puro. Mismo SVG,
 * cualquier degradado, sin tener que editar el archivo original.
 */
const props = withDefaults(defineProps<{ type: string }>(), {});

const { shape, gradient } = usePokemonType();

const shapeUrl = computed(() => shape(props.type));

const style = computed(() => {
  if (!shapeUrl.value) return {};
  return {
    background: gradient(props.type),
    WebkitMaskImage: `url(${shapeUrl.value})`,
    maskImage: `url(${shapeUrl.value})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
});
</script>

<template>
  <div class="h-full w-full" :style="style" aria-hidden="true" />
</template>

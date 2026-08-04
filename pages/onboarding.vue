<script setup lang="ts">
definePageMeta({ layout: "blank" });

const step = ref(0);
const steps = [
  {
    image: "/illustrations/onboarding-trainers.png",
    title: "Todos los Pokémon en un solo lugar",
    description:
      "Accede a una amplia lista de Pokémon de todas las generaciones creadas por Nintendo",
    cta: "Continuar",
  },
  {
    image: "/illustrations/onboarding-trainer-girl.png",
    title: "Mantén tu Pokédex actualizada",
    description:
      "Registrate y guarda tu perfil, Pokémon favoritos, configuraciones y mucho más en la aplicación",
    cta: "Empecemos",
  },
];

const next = () => {
  if (step.value < steps.length - 1) {
    step.value++;
    return;
  }
  navigateTo("/list");
};
</script>

<template>
  <div
    class="mx-auto flex min-h-screen w-full flex-col items-center lg:justify-center justify-end gap-8 px-8 text-center lg:w-1/2 lg:flex-row-reverse lg:px-0"
  >
    <div class="mx-auto h-46 w-46 flex-none lg:h-full lg:w-full lg:flex-1">
      <img
        :src="steps[step].image"
        alt=""
        class="h-full w-full object-contain"
      />
    </div>
    <div class="flex lg:flex-1 flex-col items-center">
      <h1 class="mt-6 text-xl font-bold text-ink">{{ steps[step].title }}</h1>
      <p class="mt-3 text-sm text-muted">{{ steps[step].description }}</p>

      <div
        class="mt-5 flex items-center gap-1.5"
        role="tablist"
        aria-label="Progreso de onboarding"
      >
        <span
          v-for="(s, i) in steps"
          :key="i"
          class="h-2 rounded-pill transition-all"
          :class="i === step ? 'w-6 bg-primary' : 'w-2 bg-gray-200'"
        />
      </div>

      <button
        class="mt-6 w-full rounded-pill bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover"
        @click="next"
      >
        {{ steps[step].cta }}
      </button>
    </div>
  </div>
</template>

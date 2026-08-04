export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const pokeApi = $fetch.create({
    baseURL: config.public.pokeApiBase,
    onResponseError({ response }) {
      //Si quiero normalizar errores los pongo aca, por ahora solo console
      console.error(`[PokeAPI] ${response.status} ${response.url}`);
    },
  });

  return {
    provide: {
      pokeApi,
    },
  };
});

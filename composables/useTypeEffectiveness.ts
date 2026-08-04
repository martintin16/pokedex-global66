import type { PokemonType } from "~/types/pokemon";

/**
 * Un pokémon con 2 tipos no hereda simplemente la unión de debilidades
 * de cada tipo por separado: hay que multiplicar el efecto de cada
 * posible tipo atacante contra AMBOS tipos propios.
 *
 * Ejemplo real (Bulbasaur, Planta/Veneno): Veneno es 2x contra Planta,
 * pero Veneno se resiste a sí mismo (0.5x) — el resultado neto es 1x
 * (neutro), no debilidad. Sumar los double_damage_from de cada tipo sin
 * cruzarlos con los half/no_damage_from del otro da resultados
 * incorrectos (mostraría "Veneno" y "Bicho" como debilidad cuando en el
 * juego no lo son).
 */
export function useTypeEffectiveness() {
  function weaknessesFor(types: PokemonType[]): string[] {
    if (types.length === 0) return [];

    // Candidatos: cualquier tipo que sea 2x contra AL MENOS uno de los
    // tipos propios. Si no aparece ahí, nunca puede terminar en >1x.
    const candidates = new Set<string>();
    types.forEach((t) =>
      t.doubleDamageFrom.forEach((slug) => candidates.add(slug)),
    );

    return [...candidates].filter((candidateSlug) => {
      const multiplier = types.reduce((acc, t) => {
        if (t.doubleDamageFrom.includes(candidateSlug)) return acc * 2;
        if (t.halfDamageFrom.includes(candidateSlug)) return acc * 0.5;
        if (t.noDamageFrom.includes(candidateSlug)) return 0;
        return acc; // sin relación especial = neutro (x1)
      }, 1);
      return multiplier > 1;
    });
  }

  return { weaknessesFor };
}

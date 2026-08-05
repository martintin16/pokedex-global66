import type { PokemonType } from "~/types/pokemon";

export function useTypeEffectiveness() {
  function weaknessesFor(types: PokemonType[]): string[] {
    if (types.length === 0) return [];

    const candidates = new Set<string>();
    types.forEach((t) =>
      t.doubleDamageFrom.forEach((slug) => candidates.add(slug)),
    );

    return [...candidates].filter((candidateSlug) => {
      const multiplier = types.reduce((acc, t) => {
        if (t.doubleDamageFrom.includes(candidateSlug)) return acc * 2;
        if (t.halfDamageFrom.includes(candidateSlug)) return acc * 0.5;
        if (t.noDamageFrom.includes(candidateSlug)) return 0;
        return acc;
      }, 1);
      return multiplier > 1;
    });
  }

  return { weaknessesFor };
}

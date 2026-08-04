import { describe, it, expect } from 'vitest'
import { useTypeEffectiveness } from '~/composables/useTypeEffectiveness'
import type { PokemonType } from '~/types/pokemon'

// Datos reales recortados de /type/grass y /type/poison (solo los
// campos que usa el cálculo).
const grass: PokemonType = {
  slug: 'grass',
  label: 'Planta',
  doubleDamageFrom: ['fire', 'ice', 'poison', 'flying', 'bug'],
  halfDamageFrom: ['water', 'electric', 'grass', 'ground'],
  noDamageFrom: [],
}

const poison: PokemonType = {
  slug: 'poison',
  label: 'Veneno',
  doubleDamageFrom: ['ground', 'psychic'],
  halfDamageFrom: ['fighting', 'poison', 'bug', 'grass', 'fairy'],
  noDamageFrom: [],
}

describe('useTypeEffectiveness', () => {
  const { weaknessesFor } = useTypeEffectiveness()

  it('calcula las 4 debilidades reales de Bulbasaur (Planta + Veneno)', () => {
    const result = weaknessesFor([grass, poison]).sort()
    expect(result).toEqual(['fire', 'flying', 'ice', 'psychic'].sort())
  })

  it('NO incluye Veneno como debilidad (Veneno se resiste a sí mismo, neto 1x)', () => {
    const result = weaknessesFor([grass, poison])
    expect(result).not.toContain('poison')
  })

  it('NO incluye Bicho como debilidad (Poison resiste Bug, neto 1x)', () => {
    const result = weaknessesFor([grass, poison])
    expect(result).not.toContain('bug')
  })

  it('NO incluye Tierra como debilidad (Grass resiste Ground, neto 1x)', () => {
    const result = weaknessesFor([grass, poison])
    expect(result).not.toContain('ground')
  })

  it('un pokémon de un solo tipo hereda directo sus double_damage_from', () => {
    const onlyGrass = weaknessesFor([grass])
    expect(onlyGrass.sort()).toEqual(['fire', 'ice', 'poison', 'flying', 'bug'].sort())
  })

  it('devuelve vacío si no hay tipos', () => {
    expect(weaknessesFor([])).toEqual([])
  })
})

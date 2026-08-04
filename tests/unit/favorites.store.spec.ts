import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesStore } from '~/stores/favorites'

describe('useFavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('empieza vacío', () => {
    const store = useFavoritesStore()
    expect(store.count).toBe(0)
    expect(store.isFavorite('bulbasaur')).toBe(false)
  })

  it('agrega un pokémon a favoritos con toggle', () => {
    const store = useFavoritesStore()
    store.toggle('bulbasaur')
    expect(store.isFavorite('bulbasaur')).toBe(true)
    expect(store.count).toBe(1)
  })

  it('quita un pokémon de favoritos si se hace toggle de nuevo', () => {
    const store = useFavoritesStore()
    store.toggle('bulbasaur')
    store.toggle('bulbasaur')
    expect(store.isFavorite('bulbasaur')).toBe(false)
    expect(store.count).toBe(0)
  })

  it('mantiene varios favoritos independientes entre sí', () => {
    const store = useFavoritesStore()
    store.toggle('bulbasaur')
    store.toggle('charmander')
    store.toggle('bulbasaur') // saca solo bulbasaur

    expect(store.isFavorite('bulbasaur')).toBe(false)
    expect(store.isFavorite('charmander')).toBe(true)
    expect(store.count).toBe(1)
  })
})

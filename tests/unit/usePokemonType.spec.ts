import { describe, it, expect } from 'vitest'
import { usePokemonType } from '~/composables/usePokemonType'

// usePokemonType ya no resuelve labels (eso ahora vive en useTypesStore,
// respaldado por la API real). Acá solo se prueban los colores, que sí
// son una decisión de diseño propia del proyecto.
describe('usePokemonType (colores)', () => {
  const { classes } = usePokemonType()

  it('devuelve clases de Tailwind válidas para un tipo conocido', () => {
    const c = classes('fire')
    expect(c.badge).toContain('bg-type-fire')
    expect(c.soft).toContain('bg-type-fire-soft')
  })

  it('devuelve un fallback gris para un tipo no mapeado (nunca clases rotas)', () => {
    const c = classes('made-up-type')
    expect(c.badge).toContain('bg-gray-300')
    expect(c.soft).toContain('bg-gray-100')
  })
})

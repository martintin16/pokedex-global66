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

describe('usePokemonType (icon/shape)', () => {
  const { icon, shape } = usePokemonType()

  it('icon() devuelve la ruta del svg del tipo', () => {
    expect(icon('fire')).toBe('/type-icons/fire.svg')
  })

  it('icon() devuelve null para un tipo no mapeado', () => {
    expect(icon('made-up-type')).toBeNull()
  })

  it('shape() usa el mismo svg que icon()', () => {
    expect(shape('water')).toBe('/type-icons/water.svg')
    expect(shape('made-up-type')).toBeNull()
  })
})

describe('usePokemonType (gradient)', () => {
  const { gradient } = usePokemonType()

  it('arma un radial-gradient con los colores reales del tipo', () => {
    expect(gradient('fire')).toBe(
      'radial-gradient(circle at 35% 30%, #FFCC80, #FF9800)',
    )
  })

  it('devuelve un gradiente gris de fallback para un tipo no mapeado', () => {
    expect(gradient('made-up-type')).toBe(
      'radial-gradient(circle, #E5E7EB, #D1D5DB)',
    )
  })
})

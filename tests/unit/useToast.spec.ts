import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useToast } from "~/composables/useToast";

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // useState comparte estado por key ("toast") entre llamadas, como en
    // Nuxt real: limpiamos antes de cada test para que no se filtre entre sí.
    useToast().toast.value = null;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("empieza sin toast visible", () => {
    const { toast } = useToast();
    expect(toast.value).toBeNull();
  });

  it("show() setea el mensaje", () => {
    const { toast, show } = useToast();
    show("Bulbasaur agregado a favoritos");
    expect(toast.value?.message).toBe("Bulbasaur agregado a favoritos");
  });

  it("el toast desaparece solo pasada la duración por defecto", () => {
    const { toast, show } = useToast();
    show("hola");
    expect(toast.value).not.toBeNull();

    vi.advanceTimersByTime(2500);
    expect(toast.value).toBeNull();
  });

  it("respeta una duración custom", () => {
    const { toast, show } = useToast();
    show("hola", 500);

    vi.advanceTimersByTime(499);
    expect(toast.value).not.toBeNull();

    vi.advanceTimersByTime(1);
    expect(toast.value).toBeNull();
  });

  it("un show() posterior no lo borra un timeout viejo (compara por id)", () => {
    const { toast, show } = useToast();
    show("primero", 1000);
    const firstId = toast.value?.id;

    vi.advanceTimersByTime(500);
    show("segundo", 1000);

    // Vencería el timeout del primer toast, pero el toast visible ya es
    // otro (distinto id), así que no debería borrarse.
    vi.advanceTimersByTime(500);
    expect(toast.value?.message).toBe("segundo");
    expect(toast.value?.id).not.toBe(firstId);
  });

  it("comparte el mismo estado entre distintas llamadas a useToast()", () => {
    const a = useToast();
    const b = useToast();
    a.show("compartido");
    expect(b.toast.value?.message).toBe("compartido");
  });
});

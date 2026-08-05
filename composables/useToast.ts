export interface ToastState {
  message: string;
  id: number;
}

export function useToast() {
  const toast = useState<ToastState | null>("toast", () => null);

  function show(message: string, duration = 2500) {
    const id = Date.now();
    toast.value = { message, id };
    setTimeout(() => {
      if (toast.value?.id === id) toast.value = null;
    }, duration);
  }

  return { toast, show };
}

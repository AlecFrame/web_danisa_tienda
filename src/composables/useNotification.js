import { ref } from 'vue'

const visible = ref(false)
const mensaje = ref('')
const tipo = ref('success')

export function useNotification() {
  const mostrarNotificacion = (texto, tipoNotificacion = 'success') => {
      mensaje.value = texto
      tipo.value = tipoNotificacion
      visible.value = true

      setTimeout(() => {
          visible.value = false
      }, 3000)
  }

  const ocultarNotificacion = () => {
      visible.value = false
  }

  return {
      visible,
      mensaje,
      tipo,
      mostrarNotificacion,
      ocultarNotificacion
  }
}

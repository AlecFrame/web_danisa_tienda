<script setup>
  import { ref, onMounted, toRaw } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { Subtitles, DollarSign, CalendarDays, ChevronLeft } from 'lucide-vue-next'

  import { useNotification } from '@/composables/useNotification'
  import {
    obtenerGasto,
    actualizarGasto,
    desactivarGasto,
    activarGasto
  } from '@/services/gastos'

  import { getGastosList, formatearFechaDate } from '@/services/utils'

  import VueSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css'

  const route = useRoute()
  const router = useRouter()
  const { mostrarNotificacion } = useNotification()

  const gasto = ref(null)
  const gastoOriginal = ref(null)

  const categorias = ref(getGastosList())
  const modoEdicion = ref(false)
  const estadoItem = ref(1)

  const guardando = ref(false)
  const error = ref(null)

  const errores = ref({
    descripcion: '',
    fecha: '',
    categoria: ''
  })

  const validarGasto = () => {
    errores.value = {
      descripcion: '',
      fecha: '',
      categoria: ''
    }

    let valido = true

    if (!gasto.value.descripcion?.trim()) {
      errores.value.descripcion = 'La descripcion es obligatoria'
      valido = false
    }

    if (!gasto.value.fecha?.trim()) {
      errores.value.fecha = 'La fecha es obligatoria'
      valido = false
    }

    if (!gasto.value.categoria?.trim()) {
      errores.value.categoria = 'La categoria del gasto es obligatoria'
      valido = false
    }

    return valido
  }

  onMounted(async () => {
    const idGasto = Number(route.params.idGasto)

    try {
        gasto.value = await obtenerGasto(idGasto)
        gasto.value.fecha = formatearFechaDate(gasto.value.fecha)

        estadoItem.value = gasto.value.estado
        gastoOriginal.value =  structuredClone(toRaw(gasto.value))
    } catch (error) {
        console.error(error);
    }
  })

  const btnGuardar = async () => {
      if (!validarGasto()) {
          return
      }

      if (!comprobarCambios()) {
        modoEdicion.value = false
        return
      }

      try {
          guardando.value = true
          error.value = null

          await actualizarGasto(
              gasto.value.idGasto,
              gasto.value
          )

          gastoOriginal.value = structuredClone(toRaw(gasto.value))

          modoEdicion.value = false
          mostrarNotificacion('Gasto actualizado correctamente', 'success')
      } catch (err) {
          error.value = 'No se pudo actualizar el gasto'
          mostrarNotificacion('No se pudo actualizar el gasto', 'error')

          console.error('Error:', err)
          console.error('Respuesta API:', err.response?.data)
      } finally {
          guardando.value = false
      }
  }

  const btnCancelarEdicion = () => {
      gasto.value = structuredClone(toRaw(gastoOriginal.value))
      modoEdicion.value = false
  }

  const btnEditar = () => {
      modoEdicion.value = true
  }

  const btnDesactivar = async () => {
      try {
          await desactivarGasto(gasto.value.idGasto);
          console.log('Gasto desactivado');
          estadoItem.value = 0;
      } catch (err) {
          error.value = 'No se pudo desactivar el gasto';
          mostrarNotificacion('No se pudo desactivar el gasto', 'error')
          console.error(err);
      }
  }

  const btnActivar = async () => {
      try {
          await activarGasto(gasto.value.idGasto);
          console.log('Gasto activado');
          estadoItem.value = 1;
      } catch (err) {
          error.value = 'No se pudo activar el gasto';
          mostrarNotificacion('No se pudo activar el gasto', 'error')
          console.error(err);
      }
  }

  const comprobarCambios = () => {
    return !((gasto.value & gastoOriginal.value)
    & gasto.value.descripcion==gastoOriginal.value.descripcion
    & gasto.value.categoria==gastoOriginal.value.categoria
    & gasto.value.monto==gastoOriginal.value.monto
    & gasto.value.fecha==gastoOriginal.value.fecha
  )}

  const btnBack = () => {
    router.push('/gastos')
  }
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnBack()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Detalles del Gasto</h2>
  </header>

  <div class="view-body h-100 justify-content-h content-center">
    <form v-if="gasto" class="form-central-comun" @submit.prevent="btnGuardar"
    :class="{ 'inactivo': estadoItem==0 }">
      <br>
      <h3>Descripción del gasto:</h3>
      <div class="input-container">
        <Subtitles class="input-icon"/>
        <input type="text" placeholder="..." v-model="gasto.descripcion"
        :disabled="!modoEdicion"/>
      </div>
      <span v-if="errores.descripcion" class="error-input">
        {{ errores.descripcion }}
      </span>
      <br>
      <h3>Categoría del gasto:</h3>
      <VueSelect
        v-model="gasto.categoria"
        :options="categorias"
        style="background-color: white"
        :disabled="!modoEdicion"
      />
      <span v-if="errores.categoria" class="error-input">
        {{ errores.categoria }}
      </span>
      <br>
      <h3>Monto:</h3>
      <div class="input-container">
        <DollarSign class="input-icon"/>
        <input type="number" placeholder="..." v-model="gasto.monto"
        :disabled="!modoEdicion"/>
      </div>
      <br>
      <h3>Fecha del gasto:</h3>
      <div class="input-container">
        <CalendarDays class="input-icon"/>
        <input type="date" placeholder="..." v-model="gasto.fecha"
        :disabled="!modoEdicion"/>
      </div>
      <span v-if="errores.fecha" class="error-input">
        {{ errores.fecha }}
      </span>
      <br />
      <br />

      <footer class="f-h justify-right w-100" v-if="modoEdicion">
        <button type="submit" class="btn-green"
        :disabled="guardando"> {{ guardando ? 'GUARDANDO...' : 'GUARDAR' }} </button>
        <button type="button" class="btn-blue" @click="btnCancelarEdicion"
        :disabled="guardando"> CANCELAR </button>
      </footer>
    </form>
    <h3 id="alert-desactivado" class="alert-red absolute"
    v-if="estadoItem==0">Gasto Desactivado</h3>

    <footer class="f-h justify-right w-100" v-if="!modoEdicion">
      <button class="btn-green" @click="btnEditar()"> EDITAR </button>
      <button class="btn-red" @click="btnDesactivar()"
      v-if="estadoItem==1"> DESACTIVAR </button>
      <button class="btn-green" @click="btnActivar()"
      v-if="estadoItem==0"> ACTIVAR </button>
    </footer>
  </div>
</template>

<style>
.form-header {
  display: flex;
}

.form-header-inputs {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0 0 1.5rem;
  gap: 6px;
}
</style>

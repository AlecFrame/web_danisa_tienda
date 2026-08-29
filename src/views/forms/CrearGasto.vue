<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import 'vue-select/dist/vue-select.css'

  import { Subtitles, DollarSign, CalendarDays, ChevronLeft } from 'lucide-vue-next'

  import { useNotification } from '@/composables/useNotification'
  import { crearGasto } from '@/services/gastos'
  import { getGastosList, fechaHoy } from '@/services/utils'

  import VueSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css'

  const router = useRouter()
  const { mostrarNotificacion } = useNotification()

  const gasto = ref({
    descripcion: '',
    monto: 0,
    fecha: fechaHoy(),
    categoria: 'Otros',
    observacion: '',
    pagado: ''
  })
  const categorias = ref(getGastosList())

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

  const registrarGasto = async () => {
    if (!validarGasto()) {
      return
    }

    try {
      guardando.value = true
      error.value = null

      await crearGasto(gasto.value)

      mostrarNotificacion('Gasto creado correctamente', 'success')

      router.push('/gastos')
    } catch (err) {
      error.value = 'No se pudo crear el gasto'
      mostrarNotificacion('No se pudo crear el gasto', 'error')
      console.error(err)
    } finally {
      guardando.value = false
    }
  }

  const btnCancelar = () => {
    router.push('/gastos')
  }
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnCancelar()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Registrar Gasto</h2>
  </header>

  <div class="view-body h-100 justify-content-h content-center">
    <form v-if="gasto" class="form-central-comun" @submit.prevent="registrarGasto">
      <br>
      <h3>Descripción del gasto:</h3>
      <div class="input-container">
        <Subtitles class="input-icon"/>
        <input type="text" placeholder="..." v-model="gasto.descripcion" />
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
      />
      <span v-if="errores.categoria" class="error-input">
        {{ errores.categoria }}
      </span>
      <br>
      <h3>Monto:</h3>
      <div class="input-container">
        <DollarSign class="input-icon"/>
        <input type="number" placeholder="..." v-model="gasto.monto" />
      </div>
      <br>
      <h3>Fecha del gasto:</h3>
      <div class="input-container">
        <CalendarDays class="input-icon"/>
        <input type="date" placeholder="..." v-model="gasto.fecha" />
      </div>
      <span v-if="errores.fecha" class="error-input">
        {{ errores.fecha }}
      </span>
      <br />
      <br />

      <footer class="f-h justify-right w-100">
        <button type="submit" class="btn-green" :disabled="guardando">
          {{ guardando ? 'REGISTRANDO...' : 'REGISTRAR' }}
        </button>

        <button type="button" class="btn-blue" @click="btnCancelar" :disabled="guardando">
          CANCELAR
        </button>
      </footer>
    </form>
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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import 'vue-select/dist/vue-select.css'

import { Landmark, IdCard, User, ChevronLeft } from 'lucide-vue-next'

import { useNotification } from '@/composables/useNotification'
import { crearAlias } from '@/services/alias'

const router = useRouter()
const { mostrarNotificacion } = useNotification()

const alias = ref({
  valor: '',
  banco: '',
  propietario: ''
})

const guardando = ref(false)
const error = ref(null)

const errores = ref({
  valor: '',
  banco: '',
  propietario: ''
})

const validarAlias = () => {
  errores.value = {
    valor: '',
    banco: '',
    propietario: ''
  }

  let valido = true

  if (!alias.value.valor?.trim()) {
    errores.value.valor = 'El alias es obligatorio'
    valido = false
  }

  if (!alias.value.banco?.trim()) {
    errores.value.banco = 'El banco es obligatorio'
    valido = false
  }

  if (!alias.value.propietario?.trim()) {
    errores.value.propietario = 'El propietario es obligatorio'
    valido = false
  }

  return valido
}

const registrarAlias = async () => {
  if (!validarAlias()) {
    return
  }

  try {
    guardando.value = true
    error.value = null

    await crearAlias(alias.value)

    mostrarNotificacion('Alias creado correctamente', 'success')

    router.push('/alias')
  } catch (err) {
    error.value = 'No se pudo crear el alias'
    mostrarNotificacion('No se pudo crear el alias', 'error')
    console.error(err)
  } finally {
    guardando.value = false
  }
}

const btnCancelar = () => {
  router.push('/alias')
}
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnCancelar()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Registrar Alias</h2>
  </header>

  <div class="view-body h-100 justify-content-h content-center">
    <form v-if="alias" class="form-central-comun" @submit.prevent="registrarAlias">
      <br>
      <h3>Nombre del banco:</h3>
      <div class="input-container">
        <Landmark class="input-icon"/>
        <input type="text" placeholder="..." v-model="alias.banco" />
      </div>
      <span v-if="errores.banco" class="error-input">
        {{ errores.banco }}
      </span>

      <h3>Alias:</h3>
      <div class="input-container">
        <IdCard class="input-icon"/>
        <input type="text" placeholder="..." v-model="alias.valor" />
      </div>
      <span v-if="errores.valor" class="error-input">
        {{ errores.valor }}
      </span>

      <h3>Propietario:</h3>
      <div class="input-container">
        <User class="input-icon"/>
        <input type="text" placeholder="..." v-model="alias.propietario" />
      </div>
      <span v-if="errores.propietario" class="error-input">
        {{ errores.propietario }}
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

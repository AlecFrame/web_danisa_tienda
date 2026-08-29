<script setup>
  import { ref, onMounted, toRaw } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { Landmark, IdCard, User, ChevronLeft } from 'lucide-vue-next'

  import { useNotification } from '@/composables/useNotification'
  import {
    obtenerAlias,
    actualizarAlias,
    desactivarAlias,
    activarAlias
  } from '@/services/alias'

  const route = useRoute()
  const router = useRouter()
  const { mostrarNotificacion } = useNotification()

  const alias = ref(null)
  const aliasOriginal = ref(null)

  const modoEdicion = ref(false)
  const estadoItem = ref(1)

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

  onMounted(async () => {
      const idAlias = Number(route.params.idAlias)

      try {
          alias.value = await obtenerAlias(idAlias)
          estadoItem.value = alias.value.estado
          aliasOriginal.value =  structuredClone(toRaw(alias.value))
      } catch (error) {
          console.error(error);
      }
  })

  const btnGuardar = async () => {
      if (!validarAlias()) {
          return
      }

      if (!comprobarCambios()) {
        modoEdicion.value = false
        return
      }

      try {
          guardando.value = true
          error.value = null

          await actualizarAlias(
              alias.value.idAlias,
              alias.value
          )

          aliasOriginal.value = structuredClone(toRaw(alias.value))

          modoEdicion.value = false
          mostrarNotificacion('Alias actualizado correctamente', 'success')
      } catch (err) {
          error.value = 'No se pudo actualizar el alias'
          mostrarNotificacion('No se pudo actualizar el alias', 'error')

          console.error('Error:', err)
          console.error('Respuesta API:', err.response?.data)
      } finally {
          guardando.value = false
      }
  }

  const btnCancelarEdicion = () => {
      alias.value = structuredClone(toRaw(aliasOriginal.value))
      modoEdicion.value = false
  }

  const btnEditar = () => {
      modoEdicion.value = true
  }

  const btnDesactivar = async () => {
      try {
          await desactivarAlias(alias.value.idAlias);
          console.log('Alias desactivado');
          estadoItem.value = 0;
      } catch (err) {
          error.value = 'No se pudo desactivar el alias';
          mostrarNotificacion('No se pudo desactivar el alias', 'error')
          console.error(err);
      }
  }

  const btnActivar = async () => {
      try {
          await activarAlias(alias.value.idAlias);
          console.log('Alias activado');
          estadoItem.value = 1;
      } catch (err) {
          error.value = 'No se pudo activar el alias';
          mostrarNotificacion('No se pudo activar el alias', 'error')
          console.error(err);
      }
  }

  const comprobarCambios = () => {
    return !((alias.value & aliasOriginal.value)
    & alias.value.valor==aliasOriginal.value.valor
    & alias.value.banco==aliasOriginal.value.banco
    & alias.value.propietario==aliasOriginal.value.propietario)
  }

  const btnBack = () => {
    router.push('/alias')
  }
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnBack()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Detalles del Alias</h2>
  </header>

  <div class="view-body h-100 justify-content-h content-center">
    <form v-if="alias" class="form-central-comun" @submit.prevent="btnGuardar"
    :class="{ 'inactivo': estadoItem==0 }">
      <br>
      <h3>Nombre del banco:</h3>
      <div class="input-container">
        <Landmark class="input-icon"/>
        <input type="text" placeholder="..." v-model="alias.banco"
        :disabled="!modoEdicion"/>
      </div>
      <span v-if="errores.banco" class="error-input">
        {{ errores.banco }}
      </span>

      <h3>Alias:</h3>
      <div class="input-container">
        <IdCard class="input-icon"/>
        <input type="text" placeholder="..." v-model="alias.valor"
        :disabled="!modoEdicion"/>
      </div>
      <span v-if="errores.valor" class="error-input">
        {{ errores.valor }}
      </span>

      <h3>Propietario:</h3>
      <div class="input-container">
        <User class="input-icon"/>
        <input type="text" placeholder="..." v-model="alias.propietario"
        :disabled="!modoEdicion"/>
      </div>
      <span v-if="errores.propietario" class="error-input">
        {{ errores.propietario }}
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
    v-if="estadoItem==0">Alias Desactivado</h3>

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

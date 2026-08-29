<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getIcon, getIconsOptions, androidColorToInt } from '@/services/utils'

import { crearCategoriaConFoto } from '@/services/categorias'

import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { Tag, Palette, Subtitles, ChevronLeft } from 'lucide-vue-next'

import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { mostrarNotificacion } = useNotification()

const categoria = ref({
  drawable: 'remove_24px',
  color: '#ffffff',
  nombre: '',
  ejemplos: '',
  foto: null,
})

const fotoSeleccionada = ref(null)
const fotoPreview = ref(null)
const formColor = ref('#ffffff')

const iconsOptions = getIconsOptions()

const guardando = ref(false)
const error = ref(null)

const errores = ref({
  drawable: '',
  color: '',
  nombre: '',
})

const seleccionarFoto = (event) => {
  const archivo = event.target.files[0]

  if (!archivo) return

  fotoSeleccionada.value = archivo
  fotoPreview.value = URL.createObjectURL(archivo)
}

const validarCategoria = () => {
  errores.value = {
    drawable: '',
    color: '',
    nombre: '',
  }

  let valido = true

  if (!categoria.value.nombre?.trim()) {
    errores.value.nombre = 'El nombre es obligatorio'
    valido = false
  }

  return valido
}

const registrarCategoria = async () => {
  if (!validarCategoria()) {
    return
  }

  try {
    guardando.value = true
    error.value = null

    categoria.value.color = androidColorToInt(formColor.value)

    await crearCategoriaConFoto(categoria.value, fotoSeleccionada.value)

    mostrarNotificacion('Categoría creada correctamente', 'success')

    router.push('/categorias')
  } catch (err) {
    error.value = 'No se pudo crear la categoría'
    mostrarNotificacion('No se pudo crear la categoría', 'error')
    console.error(err)
  } finally {
    guardando.value = false
  }
}

const btnCancelar = () => {
  router.push('/categorias')
}

const btnEliminar = () => {
  fotoPreview.value = false
}
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnCancelar()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Registrar Categoría</h2>
  </header>

  <div class="view-body h-100 justify-content-h content-center">
    <form v-if="categoria" class="form-central-comun" @submit.prevent="registrarCategoria">
      <div class="form-header">
        <div class="foto-form-container">
          <label for="fotoForm" class="foto-form">
            <img v-if="fotoPreview" :src="fotoPreview" alt="Vista previa" />

            <div v-else class="h-100" :style="{ backgroundColor: formColor }">
              <component class="icon-drawable" :is="getIcon(categoria.drawable)" />

              <div class="foto-form-placeholder">Seleccionar foto</div>
            </div>
          </label>
          <input id="fotoForm" type="file" accept="image/*" @change="seleccionarFoto" hidden />
        </div>
        <div class="form-header-inputs w-100">
          <h3>Nombre de la Categoría:</h3>
          <div class="input-container">
            <Tag class="input-icon" />
            <input type="text" placeholder="..." v-model="categoria.nombre" />
          </div>
          <span v-if="errores.nombre" class="error-input">
            {{ errores.nombre }}
          </span>
          <h3>Icono:</h3>
          <VueSelect
            v-model="categoria.drawable"
            :options="iconsOptions"
            label="nombre"
            :reduce="(option) => option.name"
            style="background-color: white"
          >
            <template #option="{ component }">
              <div class="categoria-option f-h fondo-categoria">
                <component :is="component" :size="16" />
              </div>
            </template>

            <template #selected-option="{ component }">
              <div class="categoria-option f-h fondo-categoria">
                <component :is="component" :size="16" />
              </div>
            </template>
          </VueSelect>
          <button type="button" style="margin-top: 12px;"
          class="btn-red-small" @click="btnEliminar" v-if="fotoPreview"
          :disabled="guardando"> Eliminar foto </button>
        </div>
      </div>

      <h3>Color:</h3>
      <div class="input-container mb-n">
        <Palette class="input-icon form-icon-palette" :style="{backgroundColor:formColor}" />
        <input type="color" class="input-color" v-model="formColor" />
      </div>
      <h3>Ejemplos:</h3>
      <div class="input-container mb-n">
        <Subtitles class="input-icon" />
        <input type="text" placeholder="..." v-model="categoria.ejemplos" />
      </div>
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

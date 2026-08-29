<script setup>
import { ref, onMounted, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFotoUrl } from '@/services/api'

import { getIcon, getIconsOptions, androidColorToInt, androidColorToHex } from '@/services/utils'

import {
  obtenerCategoria,
  actualizarCategoriaConFoto,
  desactivarCategoria,
  activarCategoria,
  eliminarFotoCategoria
} from '@/services/categorias'

import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { Tag, Palette, Subtitles, ChevronLeft } from 'lucide-vue-next'

import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const { mostrarNotificacion } = useNotification()

const categoria = ref(null)
const categoriaOriginal = ref(null)

const modoEdicion = ref(false)
const flagEliminarFoto = ref(false)
const estadoItem = ref(1)

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

onMounted(async () => {
    const idCategoria = Number(route.params.idCategoria)

    try {
        categoria.value = await obtenerCategoria(idCategoria)
        formColor.value = androidColorToHex(categoria.value.color)
        estadoItem.value = categoria.value.estado
        categoriaOriginal.value =  structuredClone(toRaw(categoria.value))
    } catch (error) {
        console.error(error);
    }
})

const btnGuardar = async () => {
    if (!validarCategoria()) {
        return
    }

    if (!comprobarCambios()) {
      modoEdicion.value = false
      console.log("comprobar cambios")
      return
    }

    try {
        guardando.value = true
        error.value = null

        categoria.value.color = androidColorToInt(formColor.value)

        if (flagEliminarFoto.value) {
          await eliminarFotoCategoria(
            categoria.value.idCategoria
          )
          categoria.value.foto = null
        }

        await actualizarCategoriaConFoto(
            categoria.value.idCategoria,
            categoria.value,
            fotoSeleccionada.value
        )

        categoriaOriginal.value = structuredClone(toRaw(categoria.value))

        modoEdicion.value = false
        mostrarNotificacion('Categoría actualizada correctamente', 'success')
    } catch (err) {
        error.value = 'No se pudo actualizar la categoría'
        mostrarNotificacion('No se pudo actualizar la categoría', 'error')

        console.error('Error:', err)
        console.error('Respuesta API:', err.response?.data)
    } finally {
        guardando.value = false
    }
}

const btnCancelarEdicion = () => {
    categoria.value = structuredClone(toRaw(categoriaOriginal.value))
    formColor.value = androidColorToHex(categoriaOriginal.value.color)
    modoEdicion.value = false
    flagEliminarFoto.value = false
}
const btnEditar = () => {
    modoEdicion.value = true
    flagEliminarFoto.value = false
}

const btnDesactivar = async () => {
    try {
        await desactivarCategoria(categoria.value.idCategoria);
        console.log('Categoria desactivada');
        estadoItem.value = 0;
    } catch (err) {
        error.value = 'No se pudo desactivar la categoría';
        mostrarNotificacion('No se pudo desactivar la categoría', 'error')
        console.error(err);
    }
}

const btnActivar = async () => {
    try {
        await activarCategoria(categoria.value.idCategoria);
        console.log('Categoría activada');
        estadoItem.value = 1;
    } catch (err) {
        error.value = 'No se pudo activar la categoría';
        mostrarNotificacion('No se pudo activar la categoría', 'error')
        console.error(err);
    }
}

const btnEliminarFoto = () => {
  flagEliminarFoto.value = true
}

const comprobarCambios = () => {
  return !((categoria.value & categoriaOriginal.value)
  & categoria.value.nombre==categoriaOriginal.value.nombre
  & categoria.value.ejemplos==categoriaOriginal.value.ejemplos
  & categoria.value.drawable==categoriaOriginal.value.drawable
  & formColor.value==androidColorToHex(categoriaOriginal.value.color)
  & fotoSeleccionada.value==null)
}

const btnBack = () => {
  router.push('/categorias')
}
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnBack()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Detalles de la Categoría</h2>
  </header>

  <div class="view-body h-100 justify-content-h content-center">
    <form v-if="categoria" class="form-central-comun" @submit.prevent="btnGuardar"
    :class="{ 'inactivo': estadoItem==0 }">
      <div class="form-header">
        <div class="foto-form-container">
            <label for="fotoForm" class="foto-form">
                <img v-if="!flagEliminarFoto && (categoria.foto || fotoPreview)"
                    :src="fotoPreview || getFotoUrl('categorias', categoria.foto)"
                    alt="Foto de la categoría"
                >
                <div v-else class="h-100" :style="{ backgroundColor: formColor }">
                  <component class="icon-drawable" :is="getIcon(categoria.drawable)" />
                </div>
                <div class="foto-form-placeholder" v-if="modoEdicion">
                    Subir foto
                </div>
            </label>
            <input
                id="fotoForm"
                type="file"
                accept="image/*"
                @change="seleccionarFoto"
                :disabled="!modoEdicion"
                hidden
            >
        </div>
        <div class="form-header-inputs w-100">
          <h3>Nombre de la Categoría:</h3>
          <div class="input-container">
            <Tag class="input-icon" />
            <input type="text" placeholder="..." v-model="categoria.nombre"
            :disabled="!modoEdicion"/>
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
            :disabled="!modoEdicion"
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
          class="btn-red-small" @click="btnEliminarFoto" v-if="modoEdicion"
          :disabled="guardando"> Eliminar foto </button>
        </div>
      </div>

      <h3>Color:</h3>
      <div class="input-container mb-n">
        <Palette class="input-icon form-icon-palette" :style="{backgroundColor:formColor}" />
        <input type="color" class="input-color" v-model="formColor"
        :disabled="!modoEdicion"/>
      </div>
      <h3>Ejemplos:</h3>
      <div class="input-container mb-n">
        <Subtitles class="input-icon" />
        <input type="text" placeholder="..." v-model="categoria.ejemplos"
        :disabled="!modoEdicion"/>
      </div>
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
    v-if="estadoItem==0">Categoría Desactivada</h3>


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

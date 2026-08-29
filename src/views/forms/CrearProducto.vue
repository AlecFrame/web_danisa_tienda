<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { filtrarCategorias } from '@/services/categorias'
import {
  getIconsList,
  androidColorToHex,
  getCategoriaL,
  getIcon
} from '@/services/utils'

import { crearProductoConFoto } from '@/services/productos'

import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { DollarSign, Tag, Package, AlertCircle, ChevronLeft } from 'lucide-vue-next'

import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { mostrarNotificacion } = useNotification()

const categorias = ref([])

const producto = ref({
  nombre: '',
  idCategoria: 1,
  precio: '',
  costoCompra: '',
  unidad: 'Unidad',
  stock: 0,
  stockBajo: 0,
  foto: null,
})

const fotoSeleccionada = ref(null)
const fotoPreview = ref(null)

const iconos = getIconsList()

const guardando = ref(false)
const error = ref(null)

const errores = ref({
  nombre: '',
  idCategoria: '',
  precio: '',
  costoCompra: '',
  unidad: '',
  stock: '',
  stockBajo: '',
})

onMounted(async () => {
  try {
    categorias.value = await filtrarCategorias(1)

    console.log("categoria 1: "+getCategoriaL(producto.value.idCategoria, categorias))
  } catch (err) {
    console.error(err)
  }
})

const seleccionarFoto = (event) => {
  const archivo = event.target.files[0]

  if (!archivo) return

  fotoSeleccionada.value = archivo
  fotoPreview.value = URL.createObjectURL(archivo)
}

const validarProducto = () => {
  errores.value = {
    nombre: '',
    idCategoria: '',
    precio: '',
    costoCompra: '',
    unidad: '',
    stock: '',
    stockBajo: '',
  }

  let valido = true

  if (!producto.value.nombre?.trim()) {
    errores.value.nombre = 'El nombre es obligatorio'
    valido = false
  }

  if (!producto.value.idCategoria) {
    errores.value.idCategoria = 'Selecciona una categoría'
    valido = false
  }

  if (
    producto.value.precio === '' ||
    producto.value.precio == null ||
    Number(producto.value.precio) <= 0
  ) {
    errores.value.precio = 'El precio debe ser mayor a 0'
    valido = false
  }

  if (
    producto.value.costoCompra === '' ||
    producto.value.costoCompra == null ||
    Number(producto.value.costoCompra) < 0
  ) {
    errores.value.costoCompra = 'El costo no puede ser negativo'
    valido = false
  }

  if (
    producto.value.stock == null ||
    producto.value.stock === '' ||
    Number(producto.value.stock) < 0
  ) {
    errores.value.stock = 'El stock no puede ser negativo'
    valido = false
  }

  if (
    producto.value.stockBajo == null ||
    producto.value.stockBajo === '' ||
    Number(producto.value.stockBajo) < 0
  ) {
    errores.value.stockBajo = 'El stock bajo no puede ser negativo'
    valido = false
  }

  return valido
}

const registrarProducto = async () => {
  if (!validarProducto()) {
    return
  }

  try {
    guardando.value = true
    error.value = null

    await crearProductoConFoto(producto.value, fotoSeleccionada.value)
    mostrarNotificacion('Producto creado correctamente', 'success')

    router.push('/inventario')
  } catch (err) {
    error.value = 'No se pudo crear el producto'
    mostrarNotificacion('No se pudo crear el producto', 'error')
    console.error(err)
  } finally {
    guardando.value = false
  }
}

const btnCancelar = () => {
  router.push('/inventario')
}

function getSelectColor() {
  const categoriaColor = getCategoriaL(producto.value.idCategoria, categorias.value)

  return categoriaColor? categoriaColor.color: null
}

function getSelectDrawable() {
  const categoriaColor = getCategoriaL(producto.value.idCategoria, categorias.value)

  return categoriaColor? categoriaColor.drawable: null
}
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnCancelar()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Registrar Producto</h2>
  </header>

  <div class="view-body h-100 justify-content-h content-center">
    <form v-if="producto" class="form-producto" @submit.prevent="registrarProducto">
      <div class="form-header">
        <div class="foto-container">
          <label for="fotoProducto" class="foto">
            <img v-if="fotoPreview" :src="fotoPreview" alt="Vista previa" />

            <div v-else class="h-100">
              <div class="h-100" :style="{
                backgroundColor:androidColorToHex(getSelectColor())}" v-if="categorias">
                <component class="icon-drawable" :is="getIcon(getSelectDrawable())" />
              </div>

              <div class="foto-form-placeholder">Subir foto</div>
            </div>
          </label>
          <input id="fotoProducto" type="file" accept="image/*" @change="seleccionarFoto" hidden />
        </div>
        <div class="form-header-inputs w-100">
          <h3>Nombre del Producto:</h3>
          <div class="input-container">
            <Tag class="input-icon" />
            <input type="text" placeholder="Nombre del producto..." v-model="producto.nombre" />
          </div>
          <span v-if="errores.nombre" class="error-input">
            {{ errores.nombre }}
          </span>
          <h3>Categoría:</h3>
          <VueSelect
            v-model="producto.idCategoria"
            :options="categorias"
            label="nombre"
            :reduce="(categoria) => categoria.idCategoria"
            style="background-color: white"
          >
            <template #option="{ nombre, drawable, color }">
              <div
                class="f-h fondo-categoria"
                :style="{ backgroundColor: androidColorToHex(color) }"
              >
                <component :is="iconos.get(drawable)" :size="16" />
                <span class="font-500">{{ nombre }}</span>
              </div>
            </template>

            <template #selected-option="{ nombre, drawable, color }">
              <div
                class="f-h fondo-categoria"
                :style="{ backgroundColor: androidColorToHex(color) }"
              >
                <component :is="iconos.get(drawable)" :size="16" />
                <span class="font-500">{{ nombre }}</span>
              </div>
            </template>
          </VueSelect>
          <span v-if="errores.idCategoria" class="error-input">
            {{ errores.idCategoria }}
          </span>
        </div>
      </div>

      <h3>Precio de venta:</h3>
      <div class="input-container mb-n">
        <DollarSign class="input-icon" />
        <input type="number" placeholder="Precio de venta..." v-model="producto.precio" />
      </div>
      <span v-if="errores.precio" class="error-input">
        {{ errores.precio }}
      </span>
      <h3>Costo de compra:</h3>
      <div class="input-container mb-n">
        <DollarSign class="input-icon" />
        <input type="number" placeholder="Costo de compra..." v-model="producto.costoCompra" />
      </div>
      <span v-if="errores.costoCompra" class="error-input">
        {{ errores.costoCompra }}
      </span>
      <h3>Stock contado por:</h3>
      <select name="" class="select-blue w-100 mb-n" v-model="producto.unidad">
        <option value="Unidad">Unidad</option>
        <option value="Gramo">Gramo</option>
      </select>
      <span v-if="errores.unidad" class="error-input">
        {{ errores.unidad }}
      </span>
      <section class="justify-content mb-n">
        <div class="w-100">
          <h3>Stock almacenado:</h3>
          <div class="input-container">
            <Package class="input-icon" />
            <input type="number" placeholder="Stock almacenado..." v-model="producto.stock" />
          </div>
        </div>
        <div class="w-100">
          <h3>Stock bajo:</h3>
          <div class="input-container">
            <AlertCircle class="input-icon" />
            <input type="number" placeholder="Stock bajo..." v-model="producto.stockBajo" />
          </div>
        </div>
      </section>
      <span v-if="errores.stock" class="error-input">
        {{ errores.stock }}
      </span>
      <span v-if="errores.stockBajo" class="error-input">
        {{ errores.stockBajo }}
      </span>

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
.form-producto {
  border: 1px solid #d1d5db;
  border-radius: 16px;
  padding: 1rem 2rem 1.5rem 2rem;
  width: 750px;
}

.form-producto.inactivo {
  border: 2px solid red;
}

@media (max-width: 1000px) {
  .form-producto {
    width: 100%;
  }
}

.form-header {
  display: flex;
}

.form-header-inputs {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0 0 1.5rem;
  gap: 6px;
}

.foto-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.foto {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px dashed #d1d5db;
}

.foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cambiar-foto {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 10px;
  text-align: center;

  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 14px;
}
</style>

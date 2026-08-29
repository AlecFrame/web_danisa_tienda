<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFotoUrl } from '@/services/api';
import { filtrarCategorias } from '@/services/categorias';
import {
  getIconsList,
  androidColorToHex,
  getCategoriaL,
  getIcon
} from '@/services/utils'

import {
  obtenerProducto,
  actualizarProductoConFoto,
  desactivarProducto,
  activarProducto,
  eliminarFotoProducto
} from '@/services/productos'

import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const { mostrarNotificacion } = useNotification()

const categorias = ref([])
const producto = ref(null)
const productoOriginal = ref(null)

const fotoSeleccionada = ref(null)
const fotoPreview = ref(null)

const iconos = getIconsList()

const modoEdicion = ref(false)
const flagEliminarFoto = ref(false)
const estadoProducto = ref(1)

const guardando = ref(false)
const error = ref(null)

const errores = ref({
    nombre: '',
    idCategoria: '',
    precio: '',
    costoCompra: '',
    unidad: '',
    stock: '',
    stockBajo: ''
})

const seleccionarFoto = (event) => {
    const archivo = event.target.files[0];

    if (!archivo) return;

    fotoSeleccionada.value = archivo;

    // Mostrar una vista previa
    fotoPreview.value = URL.createObjectURL(archivo);
}

onMounted(async () => {
    const idProducto = Number(route.params.idProducto);

    try {
        categorias.value = await filtrarCategorias(1);
    } catch (error) {
        console.error(error);
    }

    producto.value = await obtenerProducto(idProducto);
    estadoProducto.value = producto.value.estado;
    productoOriginal.value = producto.value;
})

import {
  DollarSign,
  Tag,
  Package,
  AlertCircle,
  ChevronLeft
} from 'lucide-vue-next'

const guardarProducto = async () => {
    if (!validarProducto()) {
        return
    }

    if (!comprobarCambios()) {
      modoEdicion.value = false
      console.log('Producto no es necesario actualizar')
      return
    }

    try {
        guardando.value = true
        error.value = null

        if (flagEliminarFoto.value) {
          await eliminarFotoProducto(
            producto.value.idProducto
          )
          producto.value.foto = null
        }

        await actualizarProductoConFoto(
            producto.value.idProducto,
            producto.value,
            fotoSeleccionada.value
        )

        productoOriginal.value = structuredClone(toRaw(producto.value))

        modoEdicion.value = false
        mostrarNotificacion('Producto actualizado correctamente', 'success')
    } catch (err) {
        error.value = 'No se pudo actualizar el producto'
        mostrarNotificacion('No se pudo actualizar el producto', 'error')
        console.error(err)
    } finally {
        guardando.value = false
    }
}

const btnCancelarEdicion = () => {
    producto.value = structuredClone(toRaw(productoOriginal.value))
    modoEdicion.value = false
    flagEliminarFoto.value = false
}

const btnEditar = () => {
    modoEdicion.value = true
    flagEliminarFoto.value = false
}

const btnEliminarFoto = () => {
  flagEliminarFoto.value = true
}

const btnDesactivarProducto = async () => {
    try {
        await desactivarProducto(producto.value.idProducto);
        console.log('Producto desactivado');
        estadoProducto.value = 0;
    } catch (err) {
        error.value = 'No se pudo desactivar el producto';
        mostrarNotificacion('No se pudo desactivar el producto', 'error')
        console.error(err);
    }
}

const btnActivarProducto = async () => {
    try {
        await activarProducto(producto.value.idProducto);
        console.log('Producto activado');
        estadoProducto.value = 1;
    } catch (err) {
        error.value = 'No se pudo activar el producto';
        mostrarNotificacion('No se pudo activar el producto', 'error')
        console.error(err);
    }
}

const validarProducto = () => {
    errores.value = {
        nombre: '',
        idCategoria: '',
        precio: '',
        costoCompra: '',
        unidad: '',
        stock: '',
        stockBajo: ''
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

    if (producto.value.precio === '' || producto.value.precio == null) {
        errores.value.precio = 'El precio es obligatorio'
        valido = false
    }

    if (producto.value.costoCompra === '' || producto.value.costoCompra == null) {
        errores.value.costoCompra = 'El costo de compra es obligatorio'
        valido = false
    }

    if (producto.value.stock == null || producto.value.stock < 0) {
        errores.value.stock = 'El stock no puede ser negativo'
        valido = false
    }

    if (producto.value.stockBajo == null || producto.value.stockBajo < 0) {
        errores.value.stockBajo = 'El stock bajo no puede ser negativo'
        valido = false
    }

    return valido
}

const comprobarCambios = () => {
  return !((producto.value & productoOriginal.value)
  & producto.value.nombre==productoOriginal.value.nombre
  & producto.value.idCategoria==productoOriginal.value.idCategoria
  & producto.value.precio==productoOriginal.value.precio
  & producto.value.costoCompra==productoOriginal.value.costoCompra
  & producto.value.unidad==productoOriginal.value.unidad
  & producto.value.stock==productoOriginal.value.stock
  & producto.value.stockBajo==productoOriginal.value.stockBajo
  & fotoSeleccionada.value==null)
}

function getSelectColor() {
  const categoriaColor = getCategoriaL(producto.value.idCategoria, categorias.value)

  return categoriaColor? categoriaColor.color: null
}

function getSelectDrawable() {
  const categoriaColor = getCategoriaL(producto.value.idCategoria, categorias.value)

  return categoriaColor? categoriaColor.drawable: null
}

const btnBack = () => {
  router.push('/inventario')
}

</script>

<template>
    <header class="view-header">
      <button class="btn-back" @click="btnBack()">
      <ChevronLeft class="btn-back-icon"/></button>
      <h2>{{(modoEdicion)? "Editando Producto":"Detalles del Producto"}}</h2>
    </header>

    <div class="view-body h-100 justify-content-h content-center">
      <form v-if="producto" class="form-producto" @submit.prevent="guardarProducto"
      :class="{ 'inactivo': estadoProducto==0 }">
        <div class="form-header">
          <div class="foto-container">
              <label for="fotoProducto" class="foto">
                  <img v-if="!flagEliminarFoto && (producto.foto || fotoPreview)"
                      :src="fotoPreview || getFotoUrl('productos', producto.foto)"
                      alt="Foto del producto"
                  >

                  <div v-else class="h-100">
                    <div class="h-100" :style="{ backgroundColor:
                    androidColorToHex(getSelectColor())}" v-if="categorias">
                      <component class="icon-drawable" :is="getIcon(getSelectDrawable())" />
                    </div>
                  </div>
                  <div class="foto-form-placeholder" v-if="modoEdicion">
                    Subir foto
                  </div>
              </label>
              <input
                  id="fotoProducto"
                  type="file"
                  accept="image/*"
                  @change="seleccionarFoto"
                  :disabled="!modoEdicion"
                  hidden
              >
          </div>
          <div class="form-header-inputs w-100">
            <h3> Nombre del Producto: </h3>
            <div class="input-container">
              <Tag class="input-icon" />
              <input type="text"
                  placeholder="Nombre del producto..."
                  v-model="producto.nombre"
                  :disabled="!modoEdicion"
                  >
            </div>
            <span v-if="errores.nombre" class="error-input" >
                {{ errores.nombre }}
            </span>
            <h3> Categoría: </h3>
            <VueSelect
              v-model="producto.idCategoria"
              :options="categorias"
              label="nombre"
              :reduce="categoria => categoria.idCategoria"
              style="background-color: white;"
              :disabled="!modoEdicion"
            >
              <template #option="{ nombre, drawable, color }">
                <div class="categoria-option f-h fondo-categoria"
                :style="{ backgroundColor: androidColorToHex(color)}">
                  <component
                  :is="iconos.get(drawable)"
                  :size="16"
                  />
                  <span class="font-500">{{ nombre }}</span>
                </div>
              </template>

              <template #selected-option="{ nombre, drawable, color }">
                <div class="categoria-option f-h fondo-categoria"
                :style="{ backgroundColor: androidColorToHex(color)}">
                  <component :is="iconos.get(drawable)" :size="16" />
                  <span class="font-500">{{ nombre }}</span>
                </div>
              </template>
            </VueSelect>
            <span v-if="errores.idCategoria" class="error-input" >
                {{ errores.idCategoria }}
            </span>
            <button type="button" style="margin-top: 12px;"
            class="btn-red-small" @click="btnEliminarFoto" v-if="modoEdicion"
            :disabled="guardando"> Eliminar foto </button>
          </div>
        </div>

        <h3> Precio de venta: </h3>
        <div class="input-container mb-n">
          <DollarSign class="input-icon" />
          <input type="number"
              placeholder="Precio de venta..."
              v-model="producto.precio"
              :disabled="!modoEdicion">
        </div>
        <span v-if="errores.precio" class="error-input" >
            {{ errores.precio }}
        </span>
        <h3> Costo de compra: </h3>
        <div class="input-container mb-n">
          <DollarSign class="input-icon" />
          <input type="number"
              placeholder="Costo de compra..."
              v-model="producto.costoCompra"
              :disabled="!modoEdicion">
        </div>
        <span v-if="errores.costoCompra" class="error-input" >
            {{ errores.costoCompra }}
        </span>
        <h3> Stock contado por: </h3>
        <select name="" class="select-blue w-100 mb-n"
          v-model="producto.unidad"
          :disabled="!modoEdicion">
          <option value="Unidad">Unidad</option>
          <option value="Gramo">Gramo</option>
        </select>
        <span v-if="errores.unidad" class="error-input" >
            {{ errores.unidad }}
        </span>
        <section class="justify-content mb-n">
          <div class="w-100">
            <h3> Stock almacenado: </h3>
            <div class="input-container">
              <Package class="input-icon" />
              <input type="number"
                  placeholder="Stock almacenado..."
                  v-model="producto.stock"
                  :disabled="!modoEdicion">
            </div>
          </div>
          <div class="w-100">
            <h3> Stock bajo: </h3>
            <div class="input-container">
              <AlertCircle class="input-icon" />
              <input type="number"
                  placeholder="Stock bajo..."
                  v-model="producto.stockBajo"
                  :disabled="!modoEdicion">
            </div>
          </div>
        </section>
        <span v-if="errores.stock" class="error-input" >
            {{ errores.stock }}
        </span>
        <span v-if="errores.stockBajo" class="error-input" >
            {{ errores.stockBajo }}
        </span>

        <footer class="f-h justify-right w-100" v-if="modoEdicion">
          <button type="submit" class="btn-green"
          :disabled="guardando"> {{ guardando ? 'GUARDANDO...' : 'GUARDAR' }} </button>
          <button type="button" class="btn-blue" @click="btnCancelarEdicion()"
          :disabled="guardando"> CANCELAR </button>
        </footer>
      </form>
      <h3 id="alert-desactivado" class="alert-red absolute"
      v-if="estadoProducto==0">Producto Desactivado</h3>


      <footer class="f-h justify-right w-100" v-if="!modoEdicion">
        <button type="button" class="btn-green" @click="btnEditar()"> EDITAR </button>
        <button type="button" class="btn-red" @click="btnDesactivarProducto()"
        v-if="estadoProducto==1"> DESACTIVAR </button>
        <button type="button" class="btn-green" @click="btnActivarProducto()"
        v-if="estadoProducto==0"> ACTIVAR </button>
      </footer>
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

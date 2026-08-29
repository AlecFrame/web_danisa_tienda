<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  import {
    DollarSign,
    Plus,
    Trash2,
    Banknote,
    ChevronLeft
  } from 'lucide-vue-next'

  import { useNotification } from '@/composables/useNotification'

  import { crearVenta } from '@/services/ventas'
  import { filtrarAlias } from '@/services/alias'
  import { filtrarCategorias } from '@/services/categorias'
  import { filtrarProductos } from '@/services/productos'

  import { getFotoUrl } from '@/services/api'
  import {
    getTipoPagoList,
    androidColorToHex,
    getIcon
  } from '@/services/utils'

  import VueSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css'

  const router = useRouter()
  const { mostrarNotificacion } = useNotification()

  const montoTotal = ref(0)
  const venta = ref({
    tipoPago: 'Efectivo',
    idAlias: 1,
    montoTotal,
    detalles: []
  })
  const detalles = ref([])
  const aliasList = ref([])
  const categorias = ref([])
  const productos = ref([])
  const procesos = ref(false)

  const efectivoCliente = ref(0)

  const vuelto = computed(() => {
    return efectivoCliente.value - montoTotal.value
  })

  const filtros = ref({
      nombre: '',
      idCategoria: null,
      estado: '1',
      ordenStock: ''
  });

  const calcularTotal = () => {
    montoTotal.value = 0

    detalles.value.forEach((detalle) => {
      montoTotal.value += Number(detalle.subtotal)
    });
  };

  async function cargarProductos() {
    const resultado = await filtrarProductos(
        filtros
    );

    if (resultado) {
        productos.value = resultado;
    }

    if (detalles.value) {
      productos.value = productos.value.filter(producto =>
      !detalles.value.some(detalle =>
          detalle.idProducto === producto.idProducto
      ));

      calcularTotal()
    }

    procesos.value = false
  }

  const tipoPagos = ref(getTipoPagoList())

  const guardando = ref(false)
  const error = ref(null)

  const errores = ref({
    montoTotal: '',
    idAlias: ''
  })

  const validarVenta = () => {
    errores.value = {
      montoTotal: '',
      idAlias: ''
    }

    let valido = true

    if (venta.value.montoTotal <= 0) {
      errores.value.montoTotal = 'El monto total no es válido'
      valido = false
    }

    if (venta.value.tipoPago=='Transferencia' &&
      !venta.value.idAlias) {
      errores.value.idAlias = 'El alias es obligatorio'
      valido = false
    }

    return valido
  }

  const registrarVenta = async () => {
    if (!validarVenta()) {
      return
    }

    try {
      guardando.value = true
      error.value = null

      venta.value.detalles = detalles.value

      await crearVenta(venta.value)

      mostrarNotificacion('Venta creado correctamente', 'success')

      router.push('/ventas')
    } catch (err) {
      error.value = 'No se pudo crear el venta'
      mostrarNotificacion('No se pudo crear el venta', 'error')
      console.error(err)
    } finally {
      guardando.value = false
    }
  }

  const btnCancelar = () => {
    router.push('/ventas')
  }

  onMounted(async () => {
    try {
        categorias.value = await filtrarCategorias(1);
        aliasList.value = await filtrarAlias(1);
        await cargarProductos();
    } catch (error) {
        console.error(error);
    }
  });

  const btnAgregarProducto = async (producto) => {
    procesos.value = true

    detalles.value.push(
      {
        idProducto: producto.idProducto,
        producto,
        cantidad: (producto.unidad=='Unidad')? 1:250,
        precioUnitario: producto.precio,
        costoUnitario: producto.costoCompra,
        subtotal: (producto.unidad=='Unidad')?
        1*Number(producto.precio):250*Number(producto.precio)/1000,
      }
    )

    await cargarProductos();
  }

  const btnEliminarProducto = async (idProducto) => {
    procesos.value = true

    detalles.value = detalles.value.filter(
        detalle => detalle.idProducto !== idProducto
    );

    await cargarProductos()
  }

  const aumentarCantidad = (detalle) => {
    const suma = (detalle.producto.unidad=='Unidad')? 1:250

    if (detalle.cantidad < detalle.producto.stock) {
        detalle.cantidad+=suma;
    }

    calcularSubTotal(detalle)
  };

  const disminuirCantidad = (detalle) => {
    const resta = (detalle.producto.unidad=='Unidad')? 1:250

    if (detalle.cantidad > 1) {
        detalle.cantidad-=resta;
    }

    calcularSubTotal(detalle)
  };

  const calcularSubTotal = (detalle) => {
    detalle.subtotal = (detalle.producto.unidad=='Unidad')?
    detalle.cantidad * detalle.precioUnitario
    :detalle.cantidad/1000 * detalle.precioUnitario

    calcularTotal()
  }
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnCancelar()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Registrar Venta</h2>
  </header>

  <div class="view-body h-100 content-center venta-container"
  style="gap: 10px;">
    <form v-if="venta" class="form-central-comun form-doble h-100"
      style="display: flex; flex-direction: column;"
      @submit.prevent="registrarVenta">

      <div class="justify-content-h h-100 mb-n">
        <div class="justify-content">
          <div class="w-100">
            <h3>Monto total de la venta:</h3>
            <div class="input-container">
              <DollarSign class="input-icon"/>
              <input type="number" placeholder="..." v-model="venta.montoTotal" />
            </div>
            <span v-if="errores.montoTotal" class="error-input">
              {{ errores.montoTotal }}
            </span>
          </div>
          <div class="w-100">
            <h3>Tipo de pago:</h3>
            <VueSelect
              v-model="venta.tipoPago"
              :options="tipoPagos"
              style="background-color: white"/>
          </div>
        </div>


        <div v-if="venta.tipoPago=='Efectivo'"  class="justify-content">
          <div class="w-100">
            <h3>Efectivo del cliente:</h3>
            <div class="input-container">
              <DollarSign class="input-icon"/>
              <input type="number" placeholder="0" v-model="efectivoCliente"/>
            </div>
          </div>
          <div class="w-100">
            <h3>Vuelto a dar:</h3>
            <div class="input-container">
              <Banknote class="input-icon"/>
              <input type="number" placeholder="0" disabled
              :value="vuelto"/>
            </div>
          </div>
        </div>
        <div v-else>
          <h3>Transferencia al alias:</h3>
          <VueSelect
            v-model="venta.idAlias"
            :options="aliasList"
            label="valor"
            :reduce="alias => alias.idAlias"
            style="background-color: white;"
          >
            <template #option="{ valor, propietario }">
              <div class="categoria-option f-h fondo-categoria">
                <span class="font-500">{{ valor }} - {{ propietario }}</span>
              </div>
            </template>

            <template #selected-option="{ valor, propietario }">
              <div class="categoria-option f-h fondo-categoria">
                <span class="font-500">{{ valor }} - {{ propietario }}</span>
              </div>
            </template>
          </VueSelect>
            <span v-if="errores.idAlias" class="error-input">
              {{ errores.idAlias }}
            </span>
        </div>


        <div class="h-100 justify-content-h">
          <h3>Productos en el carrito:</h3>
          <div class="table-container table-scroll w-100 h-100 justify-content-h">
          <table>
              <thead>
                  <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>SubTotal</th>
                      <th>Acciones</th>
                  </tr>
              </thead>
              <tbody>
                <tr v-for="detalle in detalles" :key="detalle.idProducto">
                  <td><div class="celda-horizontal">
                      <img :src="getFotoUrl('productos', detalle.producto.foto)"
                      alt="Imagen del producto"
                      v-if="detalle.producto.foto"
                      class="producto-imagen"/>

                      <div class="row-list-imagen" v-else
                      :style="{ backgroundColor: androidColorToHex(detalle.producto.categoria.color)}">
                        <component class="icon-drawable"
                        :is="getIcon(detalle.producto.categoria.drawable)"/>
                      </div>

                      <div>
                        {{ detalle.producto.nombre }}
                      </div>
                  </div></td>
                  <td>${{ detalle.producto.precio }}</td>
                  <td class="justify-content">
                     <button type="button" class="btn-small"
                      @click="disminuirCantidad(detalle)"
                      :disabled="detalle.cantidad<=1">
                      −
                    </button>

                    <span>{{ detalle.cantidad }}{{ (detalle.producto.unidad=='Gramo')? 'g':'' }}</span>

                    <button type="button" class="btn-small"
                      @click="aumentarCantidad(detalle)"
                      :disabled="detalle.cantidad >= detalle.producto.stock">
                      +
                    </button>
                  </td>
                  <td>${{ detalle.subtotal }}</td>
                  <td class="content-center">
                    <button @click="btnEliminarProducto(detalle.idProducto)"
                    class="btn-red btn-simple" :disabled="procesos"
                    > <Trash2/>
                    </button>
                  </td>
                </tr>
              </tbody>
          </table>
        </div>
        </div>
      </div>
      <hr class="mb-n">
      <footer class="f-h justify-right w-100">
        <button type="submit" class="btn-green" :disabled="guardando">
          {{ guardando ? 'REGISTRANDO...' : 'REGISTRAR' }}
        </button>

        <button type="button" class="btn-blue" @click="btnCancelar" :disabled="guardando">
          CANCELAR
        </button>
      </footer>
    </form>





    <section class="form-central-comun form-doble h-100 h-gap10">
      <form @submit.prevent="cargarProductos" class="form-filtro h-gap10">
        <h3>Gestiona y consulta los productos</h3>
        <div class="justify-content">
          <input
          type="text"
          class="input-blue w-100"
          placeholder="Buscar por nombre del producto"
          v-model="filtros.nombre">

          <button class="btn-blue" type="submit">
            FILTRAR
        </button>
        </div>

        <div class="justify-content">
          <select class="select-blue w-100" v-model="filtros.idCategoria">
            <option :value="null">Todas las categorías</option>
            <option
              v-for="categoria in categorias"
              :key="categoria.idCategoria"
              :value="categoria.idCategoria"
            >
              {{ categoria.nombre }}
            </option>
          </select>
          <select class="select-blue w-100" v-model="filtros.ordenStock">
            <option value="">Orden de creación</option>
            <option value="DESC">Stock más alto</option>
            <option value="ASC">Stock más bajo</option>
          </select>
        </div>
      </form>
      <div class="table-container table-scroll w-100 h-100 justify-content-h">
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productos" :key="producto.idProducto">
                <td><div class="celda-horizontal">
                    <img :src="getFotoUrl('productos', producto.foto)"
                    alt="Imagen del producto"
                    v-if="producto.foto"
                    class="producto-imagen"/>
                    <div class="row-list-imagen" v-else
                    :style="{ backgroundColor: androidColorToHex(producto.categoria.color)}">
                      <component class="icon-drawable"
                      :is="getIcon(producto.categoria.drawable)"/>
                    </div>
                    {{ producto.nombre }}
                </div></td>
                <td>{{ producto.categoria.nombre }}</td>
                <td>${{ producto.precio }}</td>
                <td v-if="producto.unidad=='Gramo'">{{ producto.stock}}g</td>
                <td v-if="producto.unidad=='Unidad'">{{ producto.stock }}</td>
                <td class="content-center">
                  <button @click="btnAgregarProducto(producto)"
                  class="btn-green-solid btn-simple" :disabled="procesos"
                  > <Plus/>
                  </button>
                </td>
              </tr>
            </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style>
.btn-small {
  height: 25px;
  width: 25px;
  color: var(--vt-c-blue);
  font-weight: bold;
  border: 1px solid var(--vt-c-blue);
  border-radius: 50%;
  background-color: var(--vt-c-blue_very_light);
}.btn-small:hover {
  background-color: var(--vt-c-blue_light);
}.btn-small:active {
  color: white;
  background-color: var(--vt-c-blue);
}.btn-small:disabled {
  color: white;
  border: 1px solid var(--vt-c-gray);
  background-color: var(--vt-c-gray2);
}

.btn-simple {
  padding: 5px 9px;
}

.h-gap10 {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 1200px) {
  .venta-container {
    display: flex;
    flex-direction: column;
  }

  .form-doble {
    height: 700px;
  }
}
</style>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import {
    DollarSign,
    PiggyBank,
    CreditCard,
    ChevronLeft
  } from 'lucide-vue-next'

  import { useNotification } from '@/composables/useNotification'

  import {
    obtenerVenta,
    activarVenta,
    desactivarVenta,
    obtenerDetallesDeCarrito
  } from '@/services/ventas'

  import { getFotoUrl } from '@/services/api'
  import {
    androidColorToHex,
    getIcon,
    formatearFecha,
    formatearHora
  } from '@/services/utils'

  const route = useRoute()
  const router = useRouter()
  const { mostrarNotificacion } = useNotification()

  const venta = ref(null)
  const detalles = ref([])
  const error = ref(null)
  const estadoItem = ref(1)


  const btnBack = () => {
    router.push('/ventas')
  }

  onMounted(async () => {
    const idVenta = Number(route.params.idVenta)

    try {
        venta.value = await obtenerVenta(idVenta)

        if (venta.value) {
          detalles.value = await obtenerDetallesDeCarrito(venta.value.carrito.idCarrito)
        }

        estadoItem.value = venta.value.estado
    } catch (error) {
        console.error(error);
    }
  })

  const btnDesactivar = async () => {
      try {
          await desactivarVenta(venta.value.idVenta);
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
          await activarVenta(venta.value.idVenta);
          console.log('Gasto activado');
          estadoItem.value = 1;
      } catch (err) {
          error.value = 'No se pudo activar el gasto';
          mostrarNotificacion('No se pudo activar el gasto', 'error')
          console.error(err);
      }
  }

</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnBack()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Detalles de la Venta</h2>
  </header>

  <div class="view-body h-100 content-center venta-container"
  style="gap: 10px;">
    <form v-if="venta" class="form-central-normal form-doble h-100"
      style="display: flex; flex-direction: column;" @submit.prevent=""
      :class="{ 'inactivo': estadoItem==0 }">
      <h3 id="alert-desactivado" class="alert-red mb-n"
      v-if="estadoItem==0">Venta Desactivada</h3>

      <h3 class="mb-n">ID: #{{ venta.idVenta }} -
        {{ formatearFecha(venta.fecha) }} -
        {{ formatearHora(venta.fecha) }}
      </h3>
      <hr class="mb-n">

      <div class="justify-content-h h-100 mb-n">
        <div class="justify-content">
          <div class="w-100">
            <h3>Monto total de la venta:</h3>
            <div class="input-container">
              <DollarSign class="input-icon"/>
              <input type="number" v-model="venta.carrito.montoTotal"
              disabled/>
            </div>
          </div>
          <div class="w-100">
            <h3>Tipo de pago:</h3>
            <div class="input-container">
              <DollarSign class="input-icon"/>
              <input type="text" v-model="venta.tipoPago" disabled>
            </div>
          </div>
        </div>
        <div class="justify-content">
          <div class="w-100">
            <h3>Ganancia</h3>
            <div class="input-container">
              <PiggyBank class="input-icon"/>
              <input type="text" v-model="venta.ganancia" disabled>
            </div>
          </div>
          <div class="w-100" v-if="venta.tipoPago=='Transferencia'">
            <h3>Alias:</h3>
              <div class="input-container">
                <CreditCard class="input-icon"/>
                <input type="text" v-model="venta.alias.valor" disabled>
              </div>
          </div>

        </div>


        <div class="h-100 justify-content-h">
          <h3>Productos en el carrito:</h3>
          <div class="table-container table-scroll w-100 h-100 justify-content-h">
          <table>
              <thead>
                  <tr>
                      <th>Producto</th>
                      <th>Precio Unitario</th>
                      <th>Cantidad</th>
                      <th>SubTotal</th>
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
                  <td>{{ detalle.cantidad }}</td>
                  <td>${{ detalle.subtotal }}</td>
                </tr>
              </tbody>
          </table>
        </div>
        </div>
      </div>
      <hr class="mb-n">
      <footer class="f-h justify-right w-100">
        <button class="btn-red" @click="btnDesactivar()"
        v-if="estadoItem==1"> DESACTIVAR </button>
        <button class="btn-green" @click="btnActivar()"
        v-if="estadoItem==0"> ACTIVAR </button>
      </footer>
    </form>
  </div>
</template>

<style>
.btn-simple {
  padding: 5px 9px;
}

.h-gap10 {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-central-normal {
  border: 1px solid #d1d5db;
  border-radius: 16px;
  padding: 1rem 2rem 1.5rem 2rem;
  width: 750px;
  height: 750px;
}

.form-central-normal.inactivo {
  border: 2px solid red;
}
</style>

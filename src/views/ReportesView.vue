<script setup>
  import { ref, onMounted } from 'vue'
  import { getFotoUrl } from '@/services/api'
  import { obtenerReporte } from '@/services/ventas'
  import {
    androidColorToHex,
    getIcon,
    formatearFechaDate
  } from '@/services/utils'

  import { ShoppingCart } from 'lucide-vue-next'

  const resumen = ref(null)
  const productosMasVendidos = ref([])
  const fechaSeleccionada = ref('TODOS')

  const filtros = ref({
      estado: '1',
      fechaDesde: '',
      fechaHasta: ''
  });

  async function cargarItemList() {
    const resultado = await obtenerReporte(
        filtros,
    )

    if (resultado) {
      resumen.value = resultado.resumen;
      productosMasVendidos.value = resultado.productosMasVendidos;
    }
  }

  async function filtrarItemListSubmit() {
    fechaSeleccionada.value = '';

    await cargarItemList();
  }

  async function btnHoy() {
    fechaSeleccionada.value = 'HOY'
    const hoy = new Date()
    const desde = new Date(hoy)

    desde.setHours(0, 0, 0, 0)
    const hasta = new Date(desde)
    hasta.setDate(hasta.getDate() + 1)

    filtros.value.fechaDesde = formatearFechaDate(desde)
    filtros.value.fechaHasta = formatearFechaDate(hasta)
    await cargarItemList()
  }

  async function btnSemana() {
    fechaSeleccionada.value = 'SEMANA'
    const hoy = new Date()
    // Lunes de esta semana
    const desde = new Date(hoy)
    const dia = desde.getDay() // Domingo = 0, Lunes = 1...
    const diferencia = dia === 0 ? 6 : dia - 1

    desde.setDate(desde.getDate() - diferencia)
    desde.setHours(0, 0, 0, 0) // Primer día de la semana siguiente
    const hasta = new Date(desde)
    hasta.setDate(hasta.getDate() + 7)

    filtros.value.fechaDesde = formatearFechaDate(desde)
    filtros.value.fechaHasta = formatearFechaDate(hasta)
    await cargarItemList()
  }

  async function btnMes() {
    fechaSeleccionada.value = 'MES'
    const hoy = new Date() // Primer día del mes
    const desde = new Date( hoy.getFullYear(), hoy.getMonth(), 1 ) // Primer día del mes siguiente
    const hasta = new Date( hoy.getFullYear(), hoy.getMonth() + 1, 1 )

    filtros.value.fechaDesde = formatearFechaDate(desde)
    filtros.value.fechaHasta = formatearFechaDate(hasta)
    await cargarItemList()
  }

  async function btnTodos() {
    fechaSeleccionada.value = 'TODOS'

    filtros.value.fechaDesde = ''
    filtros.value.fechaHasta = ''
    await cargarItemList()
  }

  onMounted(async () => {
    try {
        await cargarItemList();
    } catch (error) {
        console.error(error);
    }
  })
</script>

<template>
  <header class="view-header">
      <h2>Reportes</h2>
  </header>
  <div class="view-body content-center">
    <main class="reportes form-central-comun">
    <form @submit.prevent="filtrarItemListSubmit" class="form-filtro mb-n">
      <h3>Gestiona y consulta las ventas</h3>
      <div class="justify-content mb-n">
        <div class="w-100">
          Fecha desde:
          <input type="date" class="input-blue w-100" v-model="filtros.fechaDesde">
        </div>
        <div class="w-100">
          Fecha hasta:
          <input type="date" class="input-blue w-100" v-model="filtros.fechaHasta">
        </div>
      </div>
      <div class="justify-content mb-n">
        <div class="w-100">
          <button type="button" class="w-100"
          :class="fechaSeleccionada=='HOY'? 'btn-blue-solid':'btn-blue'"
          :disabled="fechaSeleccionada=='HOY'"
          @click="btnHoy">HOY</button>
        </div>
        <div class="w-100">
          <button type="button" class="w-100"
          :class="fechaSeleccionada=='SEMANA'? 'btn-blue-solid':'btn-blue'"
          :disabled="fechaSeleccionada=='SEMANA'"
          @click="btnSemana">SEMANA</button>
        </div>
        <div class="w-100">
          <button type="button" class="w-100"
          :class="fechaSeleccionada=='MES'? 'btn-blue-solid':'btn-blue'"
          :disabled="fechaSeleccionada=='MES'"
          @click="btnMes">MES</button>
        </div>
        <div class="w-100">
          <button type="button" class="w-100"
          :class="fechaSeleccionada=='TODOS'? 'btn-blue-solid':'btn-blue'"
          :disabled="fechaSeleccionada=='TODOS'"
          @click="btnTodos">TODOS</button>
        </div>
      </div>

      <button class="btn-blue w-100" type="submit">
        FILTRAR </button>
    </form>
    <hr class="mb-n">

    <div v-if="resumen" class="cartas-container2 mb-n">
      <section class="cartas-container">
        <div class="card card-ventas">
          <div class="card-header">
            <div class="icono-card-container">
              <ShoppingCart class="icono-card"></ShoppingCart>
            </div>
            <h3> VENTAS </h3>
          </div>

          <div class="precio">
            $ {{ resumen.totalVentas }}
          </div>
        </div>

        <div class="card card-gastos">
          <div class="card-header">
            <div class="icono-card-container">
              <ShoppingCart class="icono-card"></ShoppingCart>
            </div>
            <h3> GASTOS </h3>
          </div>

          <div class="precio">
            $ {{ resumen.totalGastos }}
          </div>
        </div>

        <div class="card card-ganancias">
          <div class="card-header">
            <div class="icono-card-container">
              <ShoppingCart class="icono-card"></ShoppingCart>
            </div>
            <h3> GANANCIAS </h3>
          </div>

          <div class="precio">
            $ {{ resumen.ganancia }}
          </div>
        </div>

        <div class="card card-numeroVentas">
          <div class="card-header">
            <div class="icono-card-container">
              <ShoppingCart class="icono-card"></ShoppingCart>
            </div>
            <h3> NUMERO DE VENTAS </h3>
          </div>

          <div class="precio">
            {{ resumen.cantidadVentas }}
          </div>
        </div>
      </section>
    </div>

    <hr class="mb-n">

    <div v-if="resumen" class="table-container table-scroll w-100 h-100 justify-content-h">
      <table>
          <thead>
              <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Unidades vendidas</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="item in productosMasVendidos" :key="item.producto.idProducto">
              <td><div class="celda-horizontal">
                  <img :src="getFotoUrl('productos', item.producto.foto)"
                  alt="Imagen del producto"
                  v-if="item.producto.foto"
                  class="producto-imagen"/>
                  <div class="row-list-imagen" v-else
                  :style="{ backgroundColor: androidColorToHex(item.producto.categoria.color)}">
                    <component class="icon-drawable"
                    :is="getIcon(item.producto.categoria.drawable)"/>
                  </div>
                  {{ item.producto.nombre }}
              </div></td>
              <td>{{ item.producto.categoria.nombre }}</td>
              <td>${{ item.producto.precio }}</td>
              <td>
                {{ item.cantidadVendida }}
                {{ (item.producto.unidad=='Gramo')? 'Kg':'Unidades' }}
              </td>
            </tr>
          </tbody>
      </table>
    </div>

    </main>
  </div>
</template>

<style scoped>
.icono-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 55px;
  width: 55px;
  background-color: rgba(254, 255, 254, 0.199);
}

.card-header {
  display: flex;
  gap: 10px;
}

.card-header h3 {
  font-weight: 500;
}

.icono-card {
  height: 32px;
  width: 32px;
}

.cartas-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  justify-content: center;
}

.cartas-container2 {
  display: flex;
}

@media (max-width: 800px) {
  .cartas-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.card {
  display: flex;
  flex-direction: column;
  justify-self: center;
  width: 100%;
  gap: 20px;

  padding: 20px 30px;
  border-radius: 12px;
  color: white;
}

.card-ventas {
  background: #2FD37C;
}

.card-gastos {
  background: #D32F5D;
}

.card-ganancias {
  background: #2FD0D3;
}

.card-numeroVentas {
  background: #D3AD2F;
}

.precio {
  background-color: rgba(0, 0, 0, 0.123);
  border-radius: 15px;
  width: 100%;
  padding: 5px 15px;
  font-size: large;
  font-weight: 500;
}
</style>

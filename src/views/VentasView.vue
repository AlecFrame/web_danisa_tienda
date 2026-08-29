<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { FileText } from 'lucide-vue-next'
  import { filtrarVentasPaginados } from '@/services/ventas'
  import { filtrarAlias } from '@/services/alias'
  import { getTipoPagoList, formatearFecha, formatearHora } from '@/services/utils'

  import { ShoppingCart } from 'lucide-vue-next'

  const router = useRouter()

  function crearItem() {
      router.push(`/ventas/registrar`)
  }

  function editarItem(idVenta) {
      router.push(`/ventas/detalle/${idVenta}`)
  }

  const ventas = ref([])
  const aliasList = ref([])
  const tipoPagos = ref(getTipoPagoList())

  const filtros = ref({
      tipoPago: '',
      idAlias: null,
      estado: '1',
      fechaDesde: '',
      fechaHasta: ''
  });

  const paginaActual = ref(1)
  const limite = ref(10)
  const totalItems = ref(0)
  const totalPaginas = ref(0)

  async function cargarItemList() {
    const resultado = await filtrarVentasPaginados(
        filtros,
        paginaActual.value,
        limite.value
    )

    if (resultado) {
        ventas.value = resultado.ventas;
        totalItems.value = resultado.total;
        totalPaginas.value = resultado.totalPaginas;
    }
  }

  async function filtrarItemListSubmit() {
    paginaActual.value = 1;
    await cargarItemList();
  }

  async function cambiarPagina(pagina) {
    if (pagina < 1 || pagina > totalPaginas.value) {
        return;
    }

    paginaActual.value = pagina;

    await cargarItemList();
  }

  onMounted(async () => {
    try {
        await cargarItemList();

        aliasList.value = await filtrarAlias(1)
    } catch (error) {
        console.error(error);
    }
  })
</script>

<template>
  <section class="h-h">
  <header class="view-header">
      <h2>Ventas</h2>
  </header>

  <div class="view-body-inventario">
    <form @submit.prevent="filtrarItemListSubmit" class="form-filtro">
      <h3>Gestiona y consulta las ventas</h3>
      <div class="justify-content">
        <select class="select-blue w-100" v-model="filtros.tipoPago">
          <option value="">Todos tipos de pago</option>
          <option
            v-for="tipoPago in tipoPagos"
            :key="tipoPago"
            :value="tipoPago"
          >
            {{ tipoPago }}
          </option>
        </select>

        <select class="select-blue w-100" v-model="filtros.idAlias"
        :disabled="filtros.tipoPago=='Transferencia'">
          <option :value="null">Todos los alias</option>
          <option
            v-for="alias in aliasList"
            :key="alias.idAlias"
            :value="alias.idAlias"
          >
            {{ alias.valor }}
          </option>
        </select>

        <select class="select-blue w-100" v-model="filtros.estado">
          <option value="1">Habilitados</option>
          <option value="0">Deshabilitados</option>
        </select>
      </div>

      <div class="justify-content">
        <div class="w-100">
          Fecha desde:
          <input type="date" class="input-blue w-100" v-model="filtros.fechaDesde">
        </div>
        <div class="w-100">
          Fecha hasta:
          <input type="date" class="input-blue w-100" v-model="filtros.fechaHasta">
        </div>
      </div>

      <button class="btn-blue" type="submit">
        FILTRAR
      </button>
    </form>

    <div class="table-container w-100 h-100 justify-content-h">
      <table>
          <thead>
              <tr>
                  <th>Venta</th>
                  <th>Tipo Pago</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="venta in ventas" :key="venta.idVenta">
              <td><div class="celda-horizontal">
                  <div class="light-green-circle">
                    <ShoppingCart/>
                  </div>
                  #{{ venta.idVenta }}
              </div></td>
              <td>
                <p>{{ venta.tipoPago }}</p>
                <p v-if="venta.alias">{{ venta.alias.valor }}</p>
              </td>
              <td>${{ venta.carrito.montoTotal }}</td>
              <td>{{ formatearFecha(venta.fecha)  }}</td>
              <td>{{ formatearHora(venta.fecha)  }}</td>
              <td class="content-center">
                <button @click="editarItem(venta.idVenta)"
                class="btn-blue btn-edit">
                <FileText/>
                </button>
              </td>
            </tr>
          </tbody>
      </table>
    </div>

    <footer class="justify-content" style="gap:36px">
      <div class="f-v content-center"
      v-if="totalPaginas!=0">
        <div class="f-h">
          <button
            @click="cambiarPagina(paginaActual - 1)"
            :disabled="paginaActual === 1"
          > &lt; Anterior
          </button>

          <button
            v-for="pagina in totalPaginas"
            :key="pagina"
            @click="cambiarPagina(pagina)"
            :class="{ activa: pagina === paginaActual }"
          > {{ pagina }}
          </button>

          <button
            @click="cambiarPagina(paginaActual + 1)"
            :disabled="paginaActual === totalPaginas"
          > Siguiente &gt;
          </button>
        </div>

        <span>
          Mostrando
          {{ (paginaActual - 1) * limite + 1 }} -
          {{ Math.min(paginaActual * limite, totalItems) }} de
          {{ totalItems }}
        </span>
      </div>

      <button class="btn-green"
      @click="crearItem()">
        Agregar Venta
      </button>
    </footer>
  </div>
  </section>
</template>

<style>
.view-body-inventario {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  padding-top: 4.5rem;
  height: 100%;
  gap: 20px;
}

.h-h {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.btn-edit {
  padding: 5px 9px;
}

.form-filtro {
  display: flex;
  flex-direction: column;
  justify-self: center;
  width: 650px;
  gap: 16px;
}

@media (max-width: 900px) {
  .form-filtro {
    width: 100%;
  }
}
</style>

<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { Pencil } from 'lucide-vue-next'
  import { filtrarGastosPaginados } from '@/services/gastos'
  import { getGastosList, formatearFecha } from '@/services/utils'

  import { DollarSign } from 'lucide-vue-next'

  const router = useRouter()

  function crearItem() {
      router.push(`/gastos/registrar`)
  }

  function editarItem(idGasto) {
      router.push(`/gastos/detalle/${idGasto}`)
  }

  const gastos = ref([])
  const categorias = ref(getGastosList())

  const filtros = ref({
      descripcion: '',
      categoria: '',
      pagado: '',
      estado: '1',
      fechaDesde: '',
      fechaHasta: ''
  });

  const paginaActual = ref(1)
  const limite = ref(10)
  const totalItems = ref(0)
  const totalPaginas = ref(0)

  async function cargarItemList() {
    const resultado = await filtrarGastosPaginados(
        filtros,
        paginaActual.value,
        limite.value
    )

    if (resultado) {
        gastos.value = resultado.gastos;
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
    } catch (error) {
        console.error(error);
    }
  })
</script>

<template>
  <section class="h-h">
  <header class="view-header">
      <h2>Gastos</h2>
  </header>

  <div class="view-body-inventario">
    <form @submit.prevent="filtrarItemListSubmit" class="form-filtro">
      <h3>Gestiona y consulta los gastos</h3>
      <div class="justify-content">
        <input
        type="text"
        class="input-blue w-100"
        placeholder="Buscar por descripcion del gasto"
        v-model="filtros.descripcion">

        <button class="btn-blue" type="submit">
          FILTRAR
      </button>
      </div>

      <div class="justify-content">
        <select class="select-blue w-100" v-model="filtros.categoria">
          <option value="">Todos</option>
          <option
            v-for="categoria in categorias"
            :key="categoria"
            :value="categoria"
          >
            {{ categoria }}
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
    </form>

    <div class="table-container w-100 h-100 justify-content-h">
      <table>
          <thead>
              <tr>
                  <th>Gasto</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="gasto in gastos" :key="gasto.idGasto">
              <td><div class="celda-horizontal">
                  <div class="light-red-circle">
                    <DollarSign/>
                  </div>
                  {{ gasto.descripcion }}
              </div></td>
              <td>{{ gasto.categoria }}</td>
              <td>{{ gasto.monto }}</td>
              <td>{{ formatearFecha(gasto.fecha)  }}</td>
              <td class="content-center">
                <button @click="editarItem(gasto.idGasto)"
                class="btn-green-solid btn-edit">
                <Pencil/>
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
        Agregar Gasto
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

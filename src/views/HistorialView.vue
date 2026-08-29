<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { Pencil } from 'lucide-vue-next'
  import { filtrarAuditoriasPaginados } from '@/services/auditorias'
  import {
    getEntidadesList,
    getAccionesList,
    formatearFecha,
    formatearHora
  } from '@/services/utils'

  import { History } from 'lucide-vue-next'

  const router = useRouter()

  function editarItem(idAuditoria) {
      router.push(`/registro/detalle/${idAuditoria}`)
  }

  const registros = ref([])
  const entidades = ref(getEntidadesList())
  const acciones = ref(getAccionesList())

  const filtros = ref({
      usuario: '',
      entidad: '',
      accion: '',
      fechaDesde: '',
      fechaHasta: ''
  });

  const paginaActual = ref(1)
  const limite = ref(10)
  const totalItems = ref(0)
  const totalPaginas = ref(0)

  async function cargarItemList() {
    const resultado = await filtrarAuditoriasPaginados(
        filtros,
        paginaActual.value,
        limite.value
    )

    if (resultado) {
        registros.value = resultado.registros;
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
      <h2>Historial</h2>
  </header>

  <div class="view-body-inventario">
    <form @submit.prevent="filtrarItemListSubmit" class="form-filtro">
      <h3>Consulta el historial de acciones en la aplicación</h3>
      <div class="justify-content">
        <input
        type="text"
        class="input-blue w-100"
        placeholder="Buscar registros por usuario"
        v-model="filtros.usuario">

        <button class="btn-blue" type="submit">
          FILTRAR
      </button>
      </div>

      <div class="justify-content">
        <select class="select-blue w-100" v-model="filtros.entidad">
          <option value="">Todas</option>
          <option
            v-for="entidad in entidades"
            :key="entidad"
            :value="entidad"
          >
            {{ entidad }}
          </option>
        </select>
        <select class="select-blue w-100" v-model="filtros.accion">
          <option value="">TODAS</option>
          <option
            v-for="accion in acciones"
            :key="accion"
            :value="accion"
          >
            {{ accion }}
          </option>
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
                  <th>Registro</th>
                  <th>Entidad</th>
                  <th>Accion</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registros" :key="registro.idAuditoria">
              <td><div class="celda-horizontal">
                  <div class="light-blue-circle">
                    <History/>
                  </div>
                  #{{ registro.idAuditoria }}
              </div></td>
              <td>{{ registro.entidad }}#{{ registro.idEntidad }}</td>
              <td>{{ registro.accion }}</td>
              <td>{{ formatearFecha(registro.fecha)  }}</td>
              <td>{{ formatearHora(registro.fecha)  }}</td>
              <td>{{ registro.usuario.nombre }}</td>
              <td class="content-center">
                <button @click="editarItem(registro.idAuditoria)"
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

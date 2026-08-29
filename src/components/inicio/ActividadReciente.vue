<script setup>
  import { ref, onMounted } from 'vue'
  import { listarRecientes } from '@/services/auditorias'
  import {
    formatearFecha,
    formatearHora
  } from '@/services/utils'

  import { History } from 'lucide-vue-next'

  const registros = ref([])

  async function cargarItemList() {
    const resultado = await listarRecientes()

    if (resultado) {
        registros.value = resultado;
    }
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
  <section class="ActividadReciente">

    <div class="table-container table-scroll w-100 h-500 justify-content-h">
      <table>
          <thead>
              <tr>
                  <th>Registro</th>
                  <th>Entidad</th>
                  <th>Accion</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Responsable</th>
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
            </tr>
          </tbody>
      </table>
    </div>
  </section>
</template>

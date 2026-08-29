<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { Subtitles, User, ChevronLeft } from 'lucide-vue-next'

  import {
    obtenerAuditoria
  } from '@/services/auditorias'

  import { formatearFecha, formatearHora } from '@/services/utils'

  const route = useRoute()
  const router = useRouter()

  const registro = ref(null)

  onMounted(async () => {
    const idAuditoria = Number(route.params.idAuditoria)

    try {
        registro.value = await obtenerAuditoria(idAuditoria)
    } catch (error) {
        console.error(error);
    }
  })

  const btnBack = () => {
    router.push('/historial')
  }
</script>

<template>
  <header class="view-header">
    <button class="btn-back" @click="btnBack()">
    <ChevronLeft class="btn-back-icon"/></button>
    <h2>Detalles del Registro</h2>
  </header>

  <div class="view-body h-100 justify-content-h content-center">
    <div v-if="registro" class="form-central-comun">
      <h2>#{{ registro.idAuditoria }}</h2>
      <hr>
      <br>
      <div class="f-h">
        <div class="light-blue-circle">
          <User/>
        </div>
        <h3>{{ registro.usuario.nombre }} :
          {{ registro.usuario.email }}</h3>
      </div>
      <br>
      <div class="f-h">
        <div class="light-blue-circle">
          <Subtitles/>
        </div>
        <h3>{{ registro.entidad }} #{{ registro.idEntidad }}:
        {{ registro.accion }}</h3>
      </div>
      <br>
      <h3>{{ registro.descripcion }}</h3>
      <br>
      <hr>
      <div class="w-100" style="text-align: right;">
        {{ formatearFecha(registro.fecha) }} {{ formatearHora(registro.fecha) }}
      </div>
    </div>
  </div>
</template>

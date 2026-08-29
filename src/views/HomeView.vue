<script setup>
import ResumenVentas from '@/components/inicio/ResumenVentas.vue'
import StockBajo from '@/components/inicio/StockBajo.vue'
import ActividadReciente from '@/components/inicio/ActividadReciente.vue'

import { useNotification } from '@/composables/useNotification'
const { mostrarNotificacion } = useNotification()

import { ref } from 'vue'

const usuario = ref(JSON.parse(localStorage.getItem('usuario')))
</script>

<template>
  <header class="view-header">
    <h2>Inicio</h2>
  </header>
  <div class="view-body">
    <h2 class="w-100 content-center mb-n">¡Bienvenido, {{ usuario?.nombre }}!</h2>
    <p>RESUMEN RÁPIDO:</p>

    <ResumenVentas class="inicio-section" />

    <p>STOCK BAJO:</p>

    <StockBajo class="inicio-section" />

    <p>ACCIONES RECIENTES:</p>

    <ActividadReciente class="inicio-section" />
  </div>
</template>

<style>
.view-body {
  padding: 1rem;
  padding-top: 5rem;
}

.inicio-section {
  margin: 18px 10px;
}

p {
  color: rgba(0, 0, 0, 0.658);
  font-weight: 700;
}
</style>

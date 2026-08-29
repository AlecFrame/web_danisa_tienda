<script setup>
import { ref } from 'vue'

const configuraciones = ref({
      server_url: ''
  });
</script>

<template>
  <header class="view-header">
      <h2>Configuración</h2>
  </header>
  <div class="view-body">
    <form class="form-central-comun justify-content-h">
      <h3 class="c-blue">
        Configuración del servidor:
      </h3>
      <input type="text" class="input-blue"
      name="nombre"
      v-model="configuraciones.server_url"
      placeholder="http://192.168.00.0:0000">
      <button class="btn-blue">
        GUARDAR CAMBIOS
      </button>
    </form>
  </div>
</template>

<style>

</style>

<script setup>
  import { ref, onMounted } from 'vue'
  import { obtenerVentasRecientes } from '@/services/ventas'
  import {
    ShoppingCart
  } from 'lucide-vue-next'

  const ventasHoy = ref(0)
  const ventasSemana = ref(0)

  onMounted(async () => {
    try {
        const resultado = await obtenerVentasRecientes();

        if (resultado) {
          ventasHoy.value = resultado.totalVentasHoy
          ventasSemana.value = resultado.totalVentasSemana
        }
    } catch (error) {
        console.error(error);
    }
  })
</script>

<template>
  <section class="resumen">
    <div class="card ventas-hoy">
      <div class="card-header">
        <div class="icono-card-container">
          <ShoppingCart class="icono-card"></ShoppingCart>
        </div>
        <h3>INGRESOS DE
          <span style="font-weight: 500; color: yellow;"> HOY</span> </h3>
      </div>

      <div class="precio">
        $ {{ ventasHoy }}
      </div>
    </div>

    <div class="card ventas-semana">
      <div class="card-header">
        <div class="icono-card-container">
          <ShoppingCart class="icono-card"></ShoppingCart>
        </div>
        <h3>INGRESOS DE LA
          <span style="font-weight: 500; color: yellow;"> SEMANA</span> </h3>
      </div>

      <div class="precio">
        $ {{ ventasSemana }}
      </div>
    </div>
  </section>
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

.resumen {
  display: flex;
  justify-content: center;
  row-gap: 20px;
  column-gap: 5%;
}

@media (max-width: 850px) {
  .resumen {
    align-items: center;
    flex-direction: column;
  }

  .card {
    width: 100% !important;
  }
}

.card {
  display: flex;
  flex-direction: column;
  justify-self: center;
  width: 400px;
  gap: 20px;

  padding: 20px 30px;
  border-radius: 12px;
  color: white;
}

.ventas-hoy {
  background: var(--vt-c-green);
}

.ventas-semana {
  background: var(--vt-c-blue);
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

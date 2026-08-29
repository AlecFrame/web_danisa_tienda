<script setup>
  import { ref, onMounted } from 'vue'
  import { getFotoUrl } from '@/services/api'
  import { listarStockBajo } from '@/services/productos';
  import {
    androidColorToHex,
    getIcon
  } from '@/services/utils'

  const productos = ref([]);

  onMounted(async () => {
    try {
        productos.value = await listarStockBajo();
    } catch (error) {
        console.error(error);
    }
  });
</script>

<template>
  <section class="stockBajo">

    <div class="table-container w-100 h-500 justify-content-h">
      <table>
          <thead>
              <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productos" :key="producto.idProducto">
              <td><div class="celda-horizontal">
                  <img :src="getFotoUrl('productos', producto.foto)"
                  alt="Imagen del producto"
                  v-if="producto.foto"
                  class="producto-imagen"/>

                  <div class="row-list-imagen" v-else
                  :style="{ backgroundColor: androidColorToHex(producto.categoria.color)}">
                    <component class="icon-drawable"
                    :is="getIcon(producto.categoria.drawable)"/>
                  </div>

                  {{ producto.nombre }}
              </div></td>
              <td>{{ producto.categoria.nombre }}</td>
              <td>${{ producto.precio }}</td>
              <td v-if="producto.unidad=='Gramo'">{{ producto.stock}}g</td>
              <td v-if="producto.unidad=='Unidad'">{{ producto.stock }}</td>
            </tr>
          </tbody>
      </table>
    </div>

  </section>
</template>

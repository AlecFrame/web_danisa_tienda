<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { getFotoUrl } from '@/services/api'
  import { Pencil } from 'lucide-vue-next'
  import { filtrarProductosPaginados } from '@/services/productos';
  import { filtrarCategorias } from '@/services/categorias';
  import {
    androidColorToHex,
    getIcon
  } from '@/services/utils'

  const router = useRouter()

  function crearProducto() {
      router.push(`/productos/registrar`);
  }

  function editarProducto(idProducto) {
      router.push(`/productos/detalle/${idProducto}`);
  }

  const categorias = ref([]);
  const productos = ref([]);

  const filtros = ref({
      nombre: '',
      idCategoria: null,
      estado: '1',
      ordenStock: ''
  });

  const paginaActual = ref(1);
  const limite = ref(10);
  const totalProductos = ref(0);
  const totalPaginas = ref(0);

  async function cargarProductos() {
    const resultado = await filtrarProductosPaginados(
        filtros,
        paginaActual.value,
        limite.value
    );

    if (resultado) {
        productos.value = resultado.productos;
        totalProductos.value = resultado.total;
        totalPaginas.value = resultado.totalPaginas;
    }
  }

  async function filtrarProductosSubmit() {
    paginaActual.value = 1;
    await cargarProductos();
  }

  async function cambiarPagina(pagina) {
    if (pagina < 1 || pagina > totalPaginas.value) {
        return;
    }

    paginaActual.value = pagina;

    await cargarProductos();
  }

  onMounted(async () => {
    try {
        categorias.value = await filtrarCategorias(1);
        await cargarProductos();
    } catch (error) {
        console.error(error);
    }
  });
</script>

<template>
  <section class="h-h">
  <header class="view-header">
      <h2>Inventario</h2>
  </header>

  <div class="view-body-inventario">
    <form @submit.prevent="filtrarProductosSubmit" class="form-filtro">
      <h3>Gestiona y consulta los productos</h3>
      <div class="justify-content">
        <input
        type="text"
        class="input-blue w-100"
        placeholder="Buscar por nombre del producto"
        v-model="filtros.nombre">

        <button class="btn-blue" type="submit">
          FILTRAR
      </button>
      </div>

      <div class="justify-content">
        <select class="select-blue w-100" v-model="filtros.idCategoria">
          <option :value="null">Todas las categorías</option>
          <option
            v-for="categoria in categorias"
            :key="categoria.idCategoria"
            :value="categoria.idCategoria"
          >
            {{ categoria.nombre }}
          </option>
        </select>
        <select class="select-blue w-100" v-model="filtros.estado">
          <option value="1">Habilitados</option>
          <option value="0">Deshabilitados</option>
        </select>
        <select class="select-blue w-100" v-model="filtros.ordenStock">
          <option value="">Orden de creación</option>
          <option value="DESC">Stock más alto</option>
          <option value="ASC">Stock más bajo</option>
        </select>
      </div>
    </form>

    <div class="table-container w-100 h-100 justify-content-h">
      <table>
          <thead>
              <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
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
              <td class="content-center">
                <button @click="editarProducto(producto.idProducto)"
                class="btn-green-solid btn-edit"
                > <Pencil></Pencil>
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
          {{ Math.min(paginaActual * limite, totalProductos) }} de
          {{ totalProductos }}
        </span>
      </div>

      <button class="btn-green"
      @click="crearProducto()">
        Agregar Producto
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

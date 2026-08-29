<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { getFotoUrl } from '@/services/api'
  import { Pencil } from 'lucide-vue-next'
  import { filtrarCategoriasPaginados } from '@/services/categorias';
  import { getIcon, androidColorToHex } from '@/services/utils';

  const router = useRouter()

  function crearCategoria() {
      router.push(`/categorias/registrar`);
  }

  function editarCategoria(idCategoria) {
      router.push(`/categorias/detalle/${idCategoria}`);
  }

  const categorias = ref([]);

  const filtros = ref({
      nombre: '',
      estado: '1'
  });

  const paginaActual = ref(1);
  const limite = ref(10);
  const totalCategorias = ref(0);
  const totalPaginas = ref(0);

  async function cargarCategorias() {
    const resultado = await filtrarCategoriasPaginados(
        filtros,
        paginaActual.value,
        limite.value
    );

    if (resultado) {
        categorias.value = resultado.categorias;
        totalCategorias.value = resultado.total;
        totalPaginas.value = resultado.totalPaginas;
    }
  }

  async function filtrarCategoriasSubmit() {
    paginaActual.value = 1;
    await cargarCategorias();
  }

  async function cambiarPagina(pagina) {
    if (pagina < 1 || pagina > totalPaginas.value) {
        return;
    }

    paginaActual.value = pagina;

    await cargarCategorias();
  }

  onMounted(async () => {
    try {
        await cargarCategorias();
    } catch (error) {
        console.error(error);
    }
  });
</script>

<template>
  <section class="h-h">
  <header class="view-header">
      <h2>Categorias</h2>
  </header>

  <div class="view-body-inventario">
    <form @submit.prevent="filtrarCategoriasSubmit" class="form-filtro">
      <h3>Gestiona y consulta las categorias</h3>
      <div class="justify-content">
        <input
        type="text"
        class="input-blue w-100"
        placeholder="Buscar por nombre de la categoria"
        v-model="filtros.nombre">

        <button class="btn-blue" type="submit">
          FILTRAR
      </button>
      </div>

      <div class="justify-content">
        <select class="select-blue w-100" v-model="filtros.estado">
          <option value="1">Habilitados</option>
          <option value="0">Deshabilitados</option>
        </select>
      </div>
    </form>

    <div class="table-container w-100 h-100 justify-content-h">
      <table>
          <thead>
              <tr>
                  <th>Categoría</th>
                  <th>Ejemplos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="categoria in categorias" :key="categoria.idCategoria">
              <td><div class="celda-horizontal">
                  <img :src="getFotoUrl('categorias', categoria.foto)"
                  alt="Imagen de la categoria"
                  v-if="categoria.foto"
                  class="row-list-imagen"/>

                  <div class="row-list-imagen" v-else
                  :style="{ backgroundColor: androidColorToHex(categoria.color)}">
                    <component class="icon-drawable"
                    :is="getIcon(categoria.drawable)"/>
                  </div>

                  {{ categoria.nombre }}
              </div></td>
              <td>{{ (categoria.ejemplos)? categoria.ejemplos:'...' }}</td>
              <td>{{ (categoria.estado==1)? 'Activado':'Desactivado'  }}</td>
              <td class="content-center">
                <button @click="editarCategoria(categoria.idCategoria)"
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
          {{ Math.min(paginaActual * limite, totalCategorias) }} de
          {{ totalCategorias }}
        </span>
      </div>

      <button class="btn-green"
      @click="crearCategoria()">
        Agregar Categoría
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

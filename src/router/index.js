import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { publico: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { publico: true }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: () => import('../views/InventarioView.vue'),
    },
    {
      path: '/productos/detalle/:idProducto',
      name: 'DetalleProducto',
      component: () => import('@/views/forms/DetalleProducto.vue'),
    },
    {
      path: '/productos/registrar',
      name: 'CrearProducto',
      component: () => import('@/views/forms/CrearProducto.vue'),
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentasView.vue'),
    },
    {
      path: '/ventas/detalle/:idVenta',
      name: 'ventasDetalle',
      component: () => import('../views/forms/DetalleVenta.vue'),
    },
    {
      path: '/ventas/registrar',
      name: 'ventasCrear',
      component: () => import('../views/forms/CrearVenta.vue'),
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriasView.vue'),
    },
    {
      path: '/categorias/detalle/:idCategoria',
      name: 'categoriasDetalle',
      component: () => import('../views/forms/DetalleCategoria.vue'),
    },
    {
      path: '/categorias/registrar',
      name: 'categoriasCrear',
      component: () => import('../views/forms/CrearCategoria.vue'),
    },
    {
      path: '/alias',
      name: 'alias',
      component: () => import('../views/AliasView.vue'),
    },
    {
      path: '/alias/detalle/:idAlias',
      name: 'aliasDetalle',
      component: () => import('../views/forms/DetalleAlias.vue'),
    },
    {
      path: '/alias/registrar',
      name: 'aliasCrear',
      component: () => import('../views/forms/CrearAlias.vue'),
    },
    {
      path: '/gastos',
      name: 'gastos',
      component: () => import('../views/GastosView.vue'),
    },
    {
      path: '/gastos/detalle/:idGasto',
      name: 'gastosDetalle',
      component: () => import('../views/forms/DetalleGasto.vue'),
    },
    {
      path: '/gastos/registrar',
      name: 'gastosCrear',
      component: () => import('../views/forms/CrearGasto.vue'),
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/ReportesView.vue'),
    },
    {
      path: '/historial',
      name: 'historial',
      component: () => import('../views/HistorialView.vue'),
    },
    {
      path: '/registro/detalle/:idAuditoria',
      name: 'registroDetalle',
      component: () => import('../views/forms/DetalleRegistro.vue'),
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: () => import('../views/ConfiguracionView.vue'),
    },
  ],
})

router.beforeEach((to) => {
    const token = localStorage.getItem('token')

    if (!to.meta.publico && !token) {
        return '/login'
    }

    if ((to.path === '/login' || to.path === '/register') && token) {
        return '/'
    }
})

export default router

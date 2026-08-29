<script setup>
  import { logout } from '@/services/auth'
  import { useRouter } from 'vue-router'
  import {
    Home,
    Package,
    ShoppingCart,
    Tag,
    CreditCard,
    DollarSign,
    ScrollText,
    ClockFading,
    Settings,
    LogOut
  } from 'lucide-vue-next'
  import { obtenerAlias } from '@/services/alias'
  import { ref, onMounted } from 'vue'

  const router = useRouter()
  const alias = ref('-')

  function logoutApp() {
    logout()
    router.push('/login')
  }

  onMounted(async () => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
          alias.value = await obtenerAlias(1)
      } catch (error) {
          console.error(error);
      }
    }
  })
</script>

<template>
  <aside class="sidebar">

    <div class="app-header">
      <img
        src="/src/assets/images/danisa_tienda_foto.jpg"
        alt="Logo"
        class="app-logo"
      >

      <h2 class="sidebar-nombre-tienda">Danisa Tienda</h2>
      <h4 class="sidebar-alias">Alias: {{ alias? alias.valor:'-' }}</h4>
    </div>

    <nav class="navigation">

      <RouterLink to="/" class="menu-item">
        <Home class="icon"></Home>
        <span>Inicio</span>
      </RouterLink>

      <RouterLink to="/inventario" class="menu-item">
        <Package class="icon"></Package>
        <span>Inventario</span>
      </RouterLink>

      <RouterLink to="/ventas" class="menu-item">
        <ShoppingCart class="icon"></ShoppingCart>
        <span>Ventas</span>
      </RouterLink>

      <RouterLink to="/categorias" class="menu-item">
        <Tag class="icon"></Tag>
        <span>Categorias</span>
      </RouterLink>

      <RouterLink to="/alias" class="menu-item">
        <CreditCard class="icon"></CreditCard>
        <span>Alias</span>
      </RouterLink>

      <RouterLink to="/gastos" class="menu-item">
        <DollarSign class="icon"></DollarSign>
        <span>Gastos</span>
      </RouterLink>

      <RouterLink to="/reportes" class="menu-item">
        <ScrollText class="icon"></ScrollText>
        <span>Reportes</span>
      </RouterLink>

      <RouterLink to="/historial" class="menu-item">
        <ClockFading class="icon"></ClockFading>
        <span>Historial</span>
      </RouterLink>

      <RouterLink to="/configuracion" class="menu-item">
        <Settings class="icon"></Settings>
        <span>Configuración</span>
      </RouterLink>

    </nav>

    <div class="menu-item sidebar-footer">
      <button class="btn-blue btn-logout"
      @click="logoutApp">
        <LogOut class="icon"></LogOut>
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>

<style>
.btn-logout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 100%;
  font-size: medium;
  padding: 6px 4px !important;
  border-radius: 16px;
  border: 0px solid;
}

.sidebar-nombre-tienda {
  color: var(--vt-c-black_blue);
  font-weight: 600;
}

.sidebar-alias {
  color: var(--vt-c-blue_light);
  font-weight: 500;
}

.menu-item {
    display: flex;
    padding: 6px 15px !important;
    align-items: center;
    gap: 12px;
    color: #666;
}

.icon {
    width: 20px;
    height: 20px;
}

.sidebar {
  width: 210px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;

  background: var(--color-surface);

  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 25px 10px;
}

.app-logo {
  width: 50px;
  height: 50px;

  border-radius: 50%;

  object-fit: cover;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}

.navigation a {
  padding: 12px 15px;

  text-decoration: none;
  color: var(--color-text);

  border-radius: var(--radius);
}

.navigation a.router-link-active {
  background: var(--color-primary);
  color: var(--vt-c-blue);
}

.sidebar-footer {
  margin-top: auto;
  padding: 15px;
}
</style>

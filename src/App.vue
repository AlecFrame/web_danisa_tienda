<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'

import { useNotification } from './composables/useNotification'

const {
    visible,
    mensaje,
    tipo,
    ocultarNotificacion
} = useNotification()

const route = useRoute()

function getTokenBoolean() {
  return localStorage.getItem('token');
}
</script>

<template>
  <div class="app-layout">

    <AppSidebar v-if="!route.meta.publico && getTokenBoolean()" />

    <main
      class="content"
      :class="{ 'sin-sidebar': route.meta.publico }"
    >
      <RouterView />
    </main>

    <Transition name="notificacion">
      <div
        v-if="visible"
        class="notificacion"
        :class="tipo"
        @click="ocultarNotificacion"
      >
        {{ mensaje }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.content {
  flex: 1;
  background-color: var(--color-background-dark) !important;
  margin-left: 210px;
  min-width: 0;
  min-height: 100vh;
}

.content.sin-sidebar {
    margin-left: 0;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

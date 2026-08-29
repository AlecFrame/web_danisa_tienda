<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/auth'

const router = useRouter()

const email = ref('')
const clave = ref('')

const error = ref('')
const cargando = ref(false)

const iniciarSesion = async () => {
    error.value = ''

    if (!email.value || !clave.value) {
        error.value = 'Completa todos los campos'
        return
    }

    try {
        cargando.value = true

        const result = await login(
            email.value,
            clave.value
        )

        if (result) {
          router.push('/')
        }
    } catch (err) {
        if (err.response?.status === 401) {
            error.value = 'Email o contraseña incorrectos'
        } else {
            error.value = 'No se pudo iniciar sesión'
        }

        console.error(err)
    } finally {
        cargando.value = false
    }
}

const registrarse = () => {
  router.push('/register')
}

import {
  Mail,
  KeyRound,
} from 'lucide-vue-next'
</script>

<template>
  <header class="view-header">
      <h2>Danisa Tienda</h2>
  </header>
  <div class="view-body content-center">
    <main class="login">

        <form @submit.prevent="iniciarSesion" class="form-central-comun justify-content-h">

            <h1>Iniciar sesión</h1>
            <hr>
            <div style="height: 26px;">
              <span class="error-input" v-if="error">
                  {{ error }}
              </span>
            </div>
            <div class="mb-n">
              <h3> Correo electrónico: </h3>
              <div class="input-container">
                <Mail class="input-icon" />
                <input type="email"
                    placeholder="Correo electrónico.."
                    v-model="email"
                    >
              </div>
            </div>

            <div class="mb-n">
              <h3> Correo electrónico: </h3>
              <div class="input-container">
                <KeyRound class="input-icon" />
                <input type="password"
                    placeholder="Contraseña.."
                    v-model="clave"
                    >
              </div>
            </div>

            <br>

            <footer class="justify-content">
              <button
                  type="submit"
                  class="btn-green w-100"
                  :disabled="cargando">
                  {{ cargando ? 'Iniciando sesión...' : 'INICIAR SESIÓN' }}
              </button>

              <button
                  type="button"
                  @click="registrarse()"
                  class="btn-blue w-100"
                  :disabled="cargando">
                  REGISTRARSE
              </button>
            </footer>
        </form>
    </main>
  </div>
</template>

<style>

</style>

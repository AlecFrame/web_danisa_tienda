<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/auth'

const router = useRouter()

const nombre = ref('')
const email = ref('')
const clave = ref('')

const error = ref('')
const cargando = ref(false)

const registrar = async () => {
    error.value = ''

    if (!nombre.value || !email.value || !clave.value) {
        error.value = 'Completa todos los campos'
        return
    }

    try {
        cargando.value = true

        await register({
            nombre: nombre.value,
            email: email.value,
            clave: clave.value
        })

        router.push('/')

    } catch (err) {

        if (err.response?.status === 409) {
            error.value = 'El email ya está registrado'
        } else {
            error.value = 'No se pudo crear la cuenta'
        }

    } finally {
        cargando.value = false
    }
}

const volver = () => {
  router.push('/login')
}

import {
  User,
  Mail,
  KeyRound,
} from 'lucide-vue-next'
</script>

<template>
  <header class="view-header">
      <h2>Danisa Tienda</h2>
  </header>
  <div class="view-body content-center">
    <main class="register">

        <form @submit.prevent="registrar" class="form-central-comun justify-content-h">

            <h1>Registrarse</h1>
            <hr>
            <div style="height: 26px;">
              <span class="error-input" v-if="error">
                  {{ error }}
              </span>
            </div>
            <div class="mb-n">
              <h3> Nombre de usuario: </h3>
              <div class="input-container">
                <User class="input-icon" />
                <input type="text"
                    placeholder="Nombre de usuario.."
                    v-model="nombre"
                    >
              </div>
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
                  {{ cargando ? 'Registrandose...' : 'REGISTRARSE' }}
              </button>

              <button
                  @click="volver()"
                  class="btn-blue w-100"
                  :disabled="cargando">
                  VOLVER
              </button>
            </footer>
        </form>
    </main>
  </div>
</template>

<style>

</style>

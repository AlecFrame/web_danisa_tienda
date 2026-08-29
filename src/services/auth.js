import api from './api'

export async function login(email, clave) {
    const response = await api.post('/auth/login', {
        email,
        clave
    })

    if (response) {
      const { token, usuario } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('usuario', JSON.stringify(usuario))

      return response.data
    }else {
      return null
    }
}

export async function register(datos) {
    const response = await api.post('/auth/register', datos)

    const { token, usuario } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
    )

    return response.data
}

export function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
}

export function estaAutenticado() {
    return !!localStorage.getItem('token')
}

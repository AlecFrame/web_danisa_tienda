import api from './api'

export async function listarCategorias() {
    const response = await api.get('/categorias')
    return response.data
}

export async function filtrarCategorias(estado) {
    try {
        const params = {}

        if (estado !== '') {
            params.estado = estado
        }

        const response = await api.get('/categorias', {
            params
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function filtrarCategoriasPaginados(filtros, pagina = 1, limite = 20) {
    try {
        const params = {};

        if (filtros.value.nombre) {
            params.nombre = filtros.value.nombre;
        }

        if (filtros.value.estado !== '') {
            params.estado = filtros.value.estado;
        }

        params.pagina = pagina;
        params.limite = limite;

        const response = await api.get('/categorias/paginado/', {
            params
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function obtenerCategoria(idCategoria) {
    const response = await api.get(`/categorias/${idCategoria}`)
    return response.data
}

export async function crearCategoria(categoria) {
    const response = await api.post(`/categorias`, categoria)
    return response.data
}

export async function crearCategoriaConFoto(categoria, foto) {
    const formData = new FormData()

    formData.append('drawable', categoria.drawable)
    formData.append('color', categoria.color)
    formData.append('nombre', categoria.nombre)
    formData.append('ejemplos', categoria.ejemplos)

    if (foto) {
        formData.append('foto', foto)
    }

    const response = await api.post(
        `/categorias`,
        formData
    )

    console.log()

    return response.data
}

export async function actualizarCategoria(idCategoria, datos) {
    const response = await api.put(`/categorias/${idCategoria}`, datos)
    return response.data
}

export async function actualizarCategoriaConFoto(idCategoria, datos, foto) {
    const formData = new FormData()

    formData.append('drawable', datos.drawable)
    formData.append('color', datos.color)
    formData.append('nombre', datos.nombre)
    formData.append('ejemplos', datos.ejemplos)

    if (foto) {
        formData.append('foto', foto)
    }

    const response = await api.put(
        `/categorias/${idCategoria}`,
        formData
    )

    return response.data
}

export async function desactivarCategoria(idCategoria) {
    const response = await api.patch(`/categorias/${idCategoria}/desactivar`);
    return response.data
}

export async function activarCategoria(idCategoria) {
    const response = await api.patch(`/categorias/${idCategoria}/activar`);
    return response.data
}

export async function eliminarFotoCategoria(idCategoria) {
    const response = await api.delete(
        `/categorias/${idCategoria}/foto`
    )

    return response.data
}

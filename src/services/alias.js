import api from './api'

export async function filtrarAlias(estado) {
    try {
        const params = {}

        if (estado !== '') {
            params.estado = estado
        }

        const response = await api.get('/alias', {
            params
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function filtrarAliasPaginados(filtros, pagina = 1, limite = 20) {
    try {
        const params = {};

        if (filtros.value.propietario !== '') {
            params.propietario = filtros.value.propietario;
        }

        if (filtros.value.estado !== '') {
            params.estado = filtros.value.estado;
        }

        params.pagina = pagina;
        params.limite = limite;

        const response = await api.get('/alias/paginado/', {
            params
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function obtenerAlias(idAlias) {
    const response = await api.get(`/alias/${idAlias}`)
    return response.data
}

export async function crearAlias(alias) {
    const response = await api.post(`/alias`, alias)
    return response.data
}

export async function actualizarAlias(idAlias, datos) {
    const response = await api.put(`/alias/${idAlias}`, datos)
    return response.data
}

export async function desactivarAlias(idAlias) {
    const response = await api.patch(`/alias/${idAlias}/desactivar`);
    return response.data
}

export async function activarAlias(idAlias) {
    const response = await api.patch(`/alias/${idAlias}/activar`);
    return response.data
}

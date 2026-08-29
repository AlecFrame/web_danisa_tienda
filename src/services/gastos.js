import api from './api'

export async function filtrarGastos(filtros) {
    try {
        const params = {}

        if (filtros.value.descripcion !== '') {
            params.descripcion = filtros.value.descripcion;
        }

        if (filtros.value.categoria !== '') {
            params.categoria = filtros.value.categoria;
        }

        if (filtros.value.pagado !== '') {
            params.pagado = filtros.value.pagado;
        }

        if (filtros.value.estado !== '') {
            params.estado = filtros.value.estado
        }

        if (filtros.value.fechaDesde !== '') {
            params.fechaDesde = filtros.value.fechaDesde;
        }

        if (filtros.value.fechaHasta !== '') {
            params.fechaHasta = filtros.value.fechaHasta;
        }

        const response = await api.get('/gastos', {
            params
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function filtrarGastosPaginados(filtros, pagina = 1, limite = 20) {
    try {
        const params = {};

        if (filtros.value.descripcion) {
            params.descripcion = filtros.value.descripcion;
        }

        if (filtros.value.categoria) {
            params.categoria = filtros.value.categoria;
        }

        if (filtros.value.pagado) {
            params.pagado = filtros.value.pagado;
        }

        if (filtros.value.estado !== '') {
            params.estado = filtros.value.estado
        }

        if (filtros.value.fechaDesde) {
            params.fechaDesde = filtros.value.fechaDesde;
        }

        if (filtros.value.fechaHasta) {
            params.fechaHasta = filtros.value.fechaHasta;
        }

        params.pagina = pagina;
        params.limite = limite;

        const response = await api.get('/gastos/paginado/', {
            params
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function obtenerGasto(idGasto) {
    const response = await api.get(`/gastos/${idGasto}`)
    return response.data
}

export async function crearGasto(gasto) {
    const response = await api.post(`/gastos`, gasto)
    return response.data
}

export async function actualizarGasto(idGasto, datos) {
    const response = await api.put(`/gastos/${idGasto}`, datos)
    return response.data
}

export async function desactivarGasto(idGasto) {
    const response = await api.patch(`/gastos/${idGasto}/desactivar`);
    return response.data
}

export async function activarGasto(idGasto) {
    const response = await api.patch(`/gastos/${idGasto}/activar`);
    return response.data
}

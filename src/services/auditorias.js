import api from './api'

export async function listarRecientes() {
    const response = await api.get('/auditorias/recientes')
    return response.data
}

export async function filtrarAuditorias(filtros) {
    try {
        const params = {}

        if (filtros.value.entidad) {
            params.descripcion = filtros.value.entidad;
        }

        if (filtros.value.accion) {
            params.categoria = filtros.value.accion;
        }

        if (filtros.value.usuario) {
            params.estado = filtros.value.usuario
        }

        if (filtros.value.fechaDesde) {
            params.fechaDesde = filtros.value.fechaDesde;
        }

        if (filtros.value.fechaHasta) {
            params.fechaHasta = filtros.value.fechaHasta;
        }

        const response = await api.get('/auditorias', {
            params
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function filtrarAuditoriasPaginados(filtros, pagina = 1, limite = 20) {
    try {
        const params = {};

        if (filtros.value.entidad) {
            params.descripcion = filtros.value.entidad;
        }

        if (filtros.value.accion) {
            params.categoria = filtros.value.accion;
        }

        if (filtros.value.usuario) {
            params.estado = filtros.value.usuario
        }

        if (filtros.value.fechaDesde) {
            params.fechaDesde = filtros.value.fechaDesde;
        }

        if (filtros.value.fechaHasta) {
            params.fechaHasta = filtros.value.fechaHasta;
        }

        params.pagina = pagina;
        params.limite = limite;

        console.log("limite: "+JSON.stringify(params, false))

        const response = await api.get('/auditorias/paginado/', {
            params
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function obtenerAuditoria(idAuditoria) {
    const response = await api.get(`/auditorias/${idAuditoria}`)
    return response.data
}

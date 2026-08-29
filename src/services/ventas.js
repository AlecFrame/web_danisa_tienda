import api from './api'

export async function filtrarVentas(filtros) {
    try {
        const params = {}

        if (filtros.value.tipoPago) {
            params.tipoPago = filtros.value.tipoPago;
        }

        if (params.tipoPago=='Transferencia') {
          if (filtros.value.idAlias) {
            params.idAlias = filtros.value.idAlias;
          }
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

        const response = await api.get('/ventas', {
            params
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function filtrarVentasPaginados(filtros, pagina = 1, limite = 20) {
    try {
        const params = {};

        if (filtros.value.tipoPago) {
            params.tipoPago = filtros.value.tipoPago;
        }

        if (params.tipoPago=='Transferencia') {
          if (filtros.value.idAlias) {
            params.idAlias = filtros.value.idAlias;
          }
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

        const response = await api.get('/ventas/paginado/', {
            params
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function obtenerVenta(idVenta) {
    const response = await api.get(`/ventas/${idVenta}`)
    return response.data
}

export async function crearVenta(venta) {
  console.log("ventas: "+JSON.stringify(venta, false))

  const response = await api.post(`/ventas`, venta)
  return response.data
}

export async function desactivarVenta(idVenta) {
    const response = await api.patch(`/ventas/${idVenta}/desactivar`);
    return response.data
}

export async function activarVenta(idVenta) {
    const response = await api.patch(`/ventas/${idVenta}/activar`);
    return response.data
}

export async function obtenerVentasRecientes() {
    try {
        const response = await api.get('/ventas/resumen')

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function obtenerReporte(filtros) {
    try {
        const params = {}

        if (filtros.value.fechaDesde !== '') {
            params.fechaDesde = filtros.value.fechaDesde;
        }

        if (filtros.value.fechaHasta !== '') {
            params.fechaHasta = filtros.value.fechaHasta;
        }

        const response = await api.get('/ventas/reporte', {
            params
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function obtenerDetallesDeCarrito(idCarrito) {
    const response = await api.get(`/ventas/detalles/${idCarrito}`)
    return response.data
}

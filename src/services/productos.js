import api from './api'

export async function listarProductos() {
    const response = await api.get('/productos')
    return response.data
}

export async function filtrarProductos(filtros) {
    try {
        const params = {}

        if (filtros.value.nombre) {
            params.nombre = filtros.value.nombre
        }

        if (filtros.value.idCategoria) {
          params.idCategoria = filtros.value.idCategoria
        }

        if (filtros.value.estado !== '') {
            params.estado = filtros.value.estado
        }

        if (filtros.value.ordenStock) {
            params.ordenStock = filtros.value.ordenStock
        }

        const response = await api.get('/productos', {
            params
        })

        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function filtrarProductosPaginados(filtros, pagina = 1, limite = 20) {
    try {
        const params = {};

        if (filtros.value.nombre) {
            params.nombre = filtros.value.nombre;
        }

        if (filtros.value.idCategoria) {
            params.idCategoria = filtros.value.idCategoria;
        }

        if (filtros.value.estado !== '') {
            params.estado = filtros.value.estado;
        }

        if (filtros.value.ordenStock) {
            params.ordenStock = filtros.value.ordenStock;
        }

        params.pagina = pagina;
        params.limite = limite;

        const response = await api.get('/productos/paginado/', {
            params
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function obtenerProducto(idProducto) {
    const response = await api.get(`/productos/${idProducto}`)
    return response.data
}

export async function crearProducto(producto) {
    const response = await api.post(`/productos`, producto)
    return response.data
}

export async function crearProductoConFoto(producto, foto) {
    const formData = new FormData()

    formData.append('nombre', producto.nombre)
    formData.append('descripcion', producto.descripcion)
    formData.append('idCategoria', producto.idCategoria)
    formData.append('precio', producto.precio)
    formData.append('costoCompra', producto.costoCompra)
    formData.append('unidad', producto.unidad)
    formData.append('stock', producto.stock)
    formData.append('stockBajo', producto.stockBajo)

    if (foto) {
        formData.append('foto', foto)
    }

    const response = await api.post(
        `/productos`,
        formData
    )

    return response.data
}

export async function actualizarProducto(idProducto, datos) {
    const response = await api.put(`/productos/${idProducto}`, datos)
    return response.data
}

export async function actualizarProductoConFoto(idProducto, datos, foto) {
    const formData = new FormData()

    formData.append('nombre', datos.nombre)
    formData.append('descripcion', datos.descripcion)
    formData.append('idCategoria', datos.idCategoria)
    formData.append('precio', datos.precio)
    formData.append('costoCompra', datos.costoCompra)
    formData.append('unidad', datos.unidad)
    formData.append('stock', datos.stock)
    formData.append('stockBajo', datos.stockBajo)

    if (foto) {
        formData.append('foto', foto)
    }

    const response = await api.put(
        `/productos/${idProducto}`,
        formData
    )

    return response.data
}

export async function desactivarProducto(idProducto) {
    const response = await api.patch(`/productos/${idProducto}/desactivar`);
    return response.data
}

export async function activarProducto(idProducto) {
    const response = await api.patch(`/productos/${idProducto}/activar`);
    return response.data
}

export async function eliminarFotoProducto(idProducto) {
    const response = await api.delete(
        `/productos/${idProducto}/foto`
    )

    return response.data
}

export async function listarStockBajo() {
    const response = await api.get('/productos/stock_bajos')
    return response.data
}

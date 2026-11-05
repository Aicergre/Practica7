import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000
});

export const obtenerProductos = () =>
  api.get('/productos');

export const crearProducto = (datos) =>
  api.post('/productos', datos);

export const actualizarProducto = (id, datos) =>
  api.put(`/productos/${id}`, datos);

export const eliminarProducto = (id) =>
  api.delete(`/productos/${id}`);

export const obtenerCategorias = () =>
  api.get('/categorias');

export const crearCategoria = (datos) =>
  api.post('/categorias', datos);

export const actualizarCategoria = (id, datos) =>
  api.put(`/categorias/${id}`, datos);

export const eliminarCategoria = (id) =>
  api.delete(`/categorias/${id}`);

export default api;
import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { useFerreteria } from '../context/FerreteriaContext';

const inicial = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  id_categoria: ''
};

function Productos() {
  const { productos, setProductos, categorias } = useFerreteria();

  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(inicial);

  // Abrir formulario para registrar un producto
  const abrirNuevo = () => {
    setEditando(null);
    setForm({ ...inicial });
    setModal(true);
  };

  // Abrir formulario con los datos del producto seleccionado
  const abrirEditar = (producto) => {
    setEditando(producto.id_producto);
    setForm({ ...producto });
    setModal(true);
  };

  // Registrar o actualizar un producto
  const guardar = (e) => {
    e.preventDefault();

    const datos = {
      ...form,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      id_categoria: Number(form.id_categoria)
    };

    // Validar los datos
    if (!datos.nombre) {
      alert('Ingrese el nombre del producto.');
      return;
    }

    if (!Number.isFinite(datos.precio) || datos.precio < 0) {
      alert('Ingrese un precio válido.');
      return;
    }

    if (!Number.isInteger(datos.stock) || datos.stock < 0) {
      alert('Ingrese un stock válido.');
      return;
    }

    const categoriaExiste = categorias.some(
      (c) => Number(c.id_categoria) === datos.id_categoria
    );

    if (!categoriaExiste) {
      alert('Seleccione una categoría válida.');
      return;
    }

    if (editando !== null) {
      // Actualizar producto existente
      setProductos((anteriores) =>
        anteriores.map((p) =>
          p.id_producto === editando
            ? { ...datos, id_producto: editando }
            : p
        )
      );
    } else {
      // Registrar nuevo producto
      setProductos((anteriores) => {
        const nuevoId =
          Math.max(
            0,
            ...anteriores.map((p) => Number(p.id_producto))
          ) + 1;

        return [
          ...anteriores,
          { ...datos, id_producto: nuevoId }
        ];
      });
    }

    setModal(false);
    setEditando(null);
    setForm({ ...inicial });
  };

  // Eliminar producto
  const eliminar = (id) => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este producto?'
    );

    if (confirmar) {
      setProductos((anteriores) =>
        anteriores.filter((p) => p.id_producto !== id)
      );
    }
  };

  // Filtrar productos por nombre
  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Obtener el nombre de la categoría desde el contexto
  const nombreCategoria = (id) => {
    const categoria = categorias.find(
      (c) => Number(c.id_categoria) === Number(id)
    );

    return categoria ? categoria.nombre : 'Sin categoría';
  };

  return (
    <div>
      <div className="page-heading">
        <h1>Gestión de Productos</h1>
        <p>Administra el inventario de tu ferretería</p>
      </div>

      <div className="content-card products-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={20} />

            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={abrirNuevo}
          >
            <Plus size={18} />
            Nuevo Producto
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id_producto}>
                  <td>{p.id_producto}</td>

                  <td>
                    <strong>{p.nombre}</strong>
                  </td>

                  <td>{p.descripcion}</td>

                  <td>
                    {nombreCategoria(p.id_categoria)}
                  </td>

                  <td>
                    Bs {Number(p.precio).toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={
                        Number(p.stock) < 10
                          ? 'stock-low'
                          : 'stock-ok'
                      }
                    >
                      {p.stock}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        title="Editar producto"
                        onClick={() => abrirEditar(p)}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        title="Eliminar producto"
                        onClick={() => eliminar(p.id_producto)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="empty-table"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>
                {editando !== null
                  ? 'Editar Producto'
                  : 'Nuevo Producto'}
              </h2>

              <button
                type="button"
                onClick={() => setModal(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={guardar}
              className="modal-form"
            >
              <label>Nombre</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nombre: e.target.value
                  })
                }
              />

              <label>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) =>
                  setForm({
                    ...form,
                    descripcion: e.target.value
                  })
                }
              />

              <label>Precio (Bs)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.precio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    precio: e.target.value
                  })
                }
              />

              <label>Stock</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={form.stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: e.target.value
                  })
                }
              />

              <label>Categoría</label>
              <select
                required
                value={form.id_categoria}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id_categoria: e.target.value
                  })
                }
              >
                <option value="">
                  Seleccione una categoría
                </option>

                {categorias.map((c) => (
                  <option
                    key={c.id_categoria}
                    value={c.id_categoria}
                  >
                    {c.nombre}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setModal(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editando !== null
                    ? 'Actualizar Producto'
                    : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
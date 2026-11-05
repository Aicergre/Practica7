import { useState } from 'react';

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Tags
} from 'lucide-react';

import { useFerreteria } from '../context/FerreteriaContext';

const formularioInicial = {
  nombre: '',
  descripcion: ''
};

function Categorias() {
  const {
    categorias,
    setCategorias,
    productos
  } = useFerreteria();

  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(formularioInicial);
  const [mensaje, setMensaje] = useState('');

  // Abrir formulario para nueva categoría
  const abrirNuevo = () => {
    setEditando(null);
    setForm({ ...formularioInicial });
    setMensaje('');
    setModal(true);
  };

  // Abrir formulario para editar categoría
  const abrirEditar = (categoria) => {
    setEditando(categoria.id_categoria);

    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    });

    setMensaje('');
    setModal(true);
  };

  // Guardar o actualizar una categoría
  const guardar = (e) => {
    e.preventDefault();

    const nombre = form.nombre.trim();
    const descripcion = form.descripcion.trim();

    if (!nombre) {
      setMensaje('El nombre de la categoría es obligatorio.');
      return;
    }

    // Evitar categorías duplicadas
    const existe = categorias.some(
      (c) =>
        c.nombre.toLowerCase() === nombre.toLowerCase() &&
        Number(c.id_categoria) !== Number(editando)
    );

    if (existe) {
      setMensaje('Ya existe una categoría con ese nombre.');
      return;
    }

    if (editando !== null) {
      // Actualizar categoría existente
      setCategorias((anteriores) =>
        anteriores.map((c) =>
          Number(c.id_categoria) === Number(editando)
            ? { ...c, nombre, descripcion }
            : c
        )
      );
    } else {
      // Crear nueva categoría
      setCategorias((anteriores) => {
        const nuevoId =
          Math.max(
            0,
            ...anteriores.map(
              (c) => Number(c.id_categoria)
            )
          ) + 1;

        return [
          ...anteriores,
          {
            id_categoria: nuevoId,
            nombre,
            descripcion
          }
        ];
      });
    }

    setModal(false);
    setEditando(null);
    setForm({ ...formularioInicial });
    setMensaje('');
  };

  // Eliminar categoría
  const eliminar = (categoria) => {
    // Comprobar si tiene productos asociados
    const tieneProductos = productos.some(
      (p) =>
        Number(p.id_categoria) ===
        Number(categoria.id_categoria)
    );

    if (tieneProductos) {
      window.alert(
        'No se puede eliminar esta categoría porque tiene productos asociados.'
      );
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la categoría "${categoria.nombre}"?`
    );

    if (confirmar) {
      setCategorias((anteriores) =>
        anteriores.filter(
          (c) =>
            Number(c.id_categoria) !==
            Number(categoria.id_categoria)
        )
      );
    }
  };

  // Buscar categorías
  const categoriasFiltradas = categorias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(
        busqueda.toLowerCase()
      ) ||
      (c.descripcion || '').toLowerCase().includes(
        busqueda.toLowerCase()
      )
  );

  // Contar productos de cada categoría
  const contarProductos = (id) => {
    return productos.filter(
      (p) =>
        Number(p.id_categoria) === Number(id)
    ).length;
  };

  return (
    <div>
      <div className="page-heading">
        <h1>Gestión de Categorías</h1>
        <p>
          Organiza y administra las categorías
          de tu ferretería
        </p>
      </div>

      <div className="content-card products-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={20} />

            <input
              type="text"
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={abrirNuevo}
          >
            <Plus size={18} />
            Nueva Categoría
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categoriasFiltradas.map((categoria) => (
                <tr key={categoria.id_categoria}>
                  <td>
                    {categoria.id_categoria}
                  </td>

                  <td>
                    <div className="category-name">
                      <Tags
                        size={18}
                        color="#2563eb"
                      />

                      <strong>
                        {categoria.nombre}
                      </strong>
                    </div>
                  </td>

                  <td>
                    {categoria.descripcion || 'Sin descripción'}
                  </td>

                  <td>
                    <span className="category-count">
                      {contarProductos(
                        categoria.id_categoria
                      )}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        title="Editar categoría"
                        onClick={() =>
                          abrirEditar(categoria)
                        }
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        title="Eliminar categoría"
                        onClick={() =>
                          eliminar(categoria)
                        }
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categoriasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="empty-table"
                  >
                    No se encontraron categorías.
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
                  ? 'Editar Categoría'
                  : 'Nueva Categoría'}
              </h2>

              <button
                type="button"
                onClick={() => setModal(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={guardar}
            >
              <label>
                Nombre de la categoría
              </label>

              <input
                type="text"
                placeholder="Ej. Pinturas"
                maxLength={100}
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
                placeholder="Descripción de la categoría"
                rows={4}
                value={form.descripcion}
                onChange={(e) =>
                  setForm({
                    ...form,
                    descripcion: e.target.value
                  })
                }
              />

              {mensaje && (
                <p className="form-error">
                  {mensaje}
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setModal(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editando !== null
                    ? 'Guardar Cambios'
                    : 'Guardar Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categorias;
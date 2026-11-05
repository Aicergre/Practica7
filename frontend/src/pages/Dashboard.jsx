import {
  Package,
  Tags,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

import { useFerreteria } from '../context/FerreteriaContext';

function Dashboard() {
  const { productos, categorias } = useFerreteria();

  // Calcular los datos del inventario
  const totalProductos = productos.length;
  const totalCategorias = categorias.length;

  const stockBajo = productos.filter(
    (producto) => Number(producto.stock) < 10
  ).length;

  const valorInventario = productos.reduce(
    (total, producto) => {
      const precio = Number(producto.precio) || 0;
      const stock = Number(producto.stock) || 0;

      return total + precio * stock;
    },
    0
  );

  // Información que aparecerá en las tarjetas
  const estadisticas = [
    {
      titulo: 'Total de Productos',
      valor: totalProductos,
      icono: <Package size={28} />,
      color: 'blue'
    },
    {
      titulo: 'Categorías',
      valor: totalCategorias,
      icono: <Tags size={28} />,
      color: 'green'
    },
    {
      titulo: 'Stock Bajo',
      valor: stockBajo,
      icono: <AlertTriangle size={28} />,
      color: 'orange'
    },
    {
      titulo: 'Valor del Inventario',
      valor: `Bs ${valorInventario.toFixed(2)}`,
      icono: <DollarSign size={28} />,
      color: 'purple'
    }
  ];

  return (
    <div>
      <div className="page-heading">
        <h1>Dashboard</h1>
        <p>Resumen general de tu ferretería</p>
      </div>

      <div className="stats-grid">
        {estadisticas.map((item) => (
          <div
            className="stat-card"
            key={item.titulo}
          >
            <div className={`stat-icon ${item.color}`}>
              {item.icono}
            </div>

            <div>
              <p>{item.titulo}</p>
              <h2>{item.valor}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="content-card">
        <h2>Bienvenido al sistema</h2>

        <p>
          Desde este panel podrás administrar los
          productos y categorías de tu ferretería.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
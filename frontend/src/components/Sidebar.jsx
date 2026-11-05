import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  Wrench
} from 'lucide-react';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Wrench size={28} />
        <div>
          <h2>FERRETERÍA</h2>
          <span>Sistema de Gestión</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/productos">
          <Package size={20} />
          Productos
        </NavLink>

        <NavLink to="/categorias">
          <Tags size={20} />
          Categorías
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        Sistema de Ferretería v1.0
      </div>
    </aside>
  );
}

export default Sidebar;
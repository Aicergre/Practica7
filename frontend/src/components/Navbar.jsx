import { UserCircle } from 'lucide-react';

function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h3>Panel de Administración</h3>
        <p>Gestión de productos e inventario</p>
      </div>

      <div className="navbar-user">
        <UserCircle size={30} />
        <span>Administrador</span>
      </div>
    </header>
  );
}

export default Navbar;
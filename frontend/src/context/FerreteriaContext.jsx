import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  productosIniciales,
  categoriasIniciales
} from '../data/mockData';

const FerreteriaContext = createContext(null);

function cargarDatos(clave, datosIniciales) {
  try {
    const guardados = localStorage.getItem(clave);
    return guardados ? JSON.parse(guardados) : datosIniciales;
  } catch {
    return datosIniciales;
  }
}

export function FerreteriaProvider({ children }) {
  const [productos, setProductos] = useState(() =>
    cargarDatos('ferreteria_productos', productosIniciales)
  );

  const [categorias, setCategorias] = useState(() =>
    cargarDatos('ferreteria_categorias', categoriasIniciales)
  );

  useEffect(() => {
    localStorage.setItem(
      'ferreteria_productos',
      JSON.stringify(productos)
    );
  }, [productos]);

  useEffect(() => {
    localStorage.setItem(
      'ferreteria_categorias',
      JSON.stringify(categorias)
    );
  }, [categorias]);

  return (
    <FerreteriaContext.Provider
      value={{
        productos,
        setProductos,
        categorias,
        setCategorias
      }}
    >
      {children}
    </FerreteriaContext.Provider>
  );
}

export function useFerreteria() {
  const context = useContext(FerreteriaContext);

  if (!context) {
    throw new Error(
      'useFerreteria debe utilizarse dentro de FerreteriaProvider'
    );
  }

  return context;
}
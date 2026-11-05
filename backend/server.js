
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const app = express();

app.use(cors());
app.use(express.json());

// Manejo de errores
function manejarError(res, error) {
  console.error("Error:", error.message);

  if (error.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({
      mensaje: "No se puede eliminar la categoria porque tiene productos asociados"
    });
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      mensaje: "La categoria indicada no existe"
    });
  }

  return res.status(500).json({
    mensaje: "Error interno del servidor"
  });
}

function idValido(id) {
  return /^[1-9]\d*$/.test(String(id)) &&
    Number.isSafeInteger(Number(id));
}

function validarProducto(datos) {
  const { nombre, precio, stock, id_categoria } = datos;

  if (typeof nombre !== "string" ||
      !nombre.trim() ||
      nombre.length > 150) {
    return "El nombre del producto es obligatorio y debe tener maximo 150 caracteres";
  }

  if (precio === "" || precio === null ||
      precio === undefined ||
      !Number.isFinite(Number(precio)) ||
      Number(precio) < 0 ||
      Number(precio) > 99999999.99 ||
      !/^\d+(\.\d{1,2})?$/.test(String(precio))) {
    return "El precio debe ser un numero valido, no negativo y con maximo dos decimales";
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return "El stock debe ser un numero entero no negativo";
  }

  if (!idValido(id_categoria)) {
    return "Debes indicar una categoria valida";
  }

  if (datos.descripcion !== undefined &&
      datos.descripcion !== null &&
      typeof datos.descripcion !== "string") {
    return "La descripcion debe ser un texto";
  }

  return null;
}

// ===================================
// RUTA PRINCIPAL
// ===================================

app.get("/", (req, res) => {
  res.json({
    mensaje: "API RESTful de Ferreteria funcionando correctamente",
    estado: "activo"
  });
});

// ===================================
// VERIFICAR BASE DE DATOS
// ===================================

app.get("/api/salud", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      mensaje: "Servidor y MySQL funcionando correctamente",
      base_de_datos: "conectada"
    });
  } catch (error) {
    manejarError(res, error);
  }
});

// ===================================
// CATEGORIAS
// ===================================

// Obtener todas las categorias
app.get("/api/categorias", async (req, res) => {
  try {
    const [categorias] = await db.query(
      "SELECT * FROM categorias ORDER BY id_categoria"
    );

    res.json(categorias);
  } catch (error) {
    manejarError(res, error);
  }
});

// Obtener categoria por ID
app.get("/api/categorias/:id", async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: "ID invalido" });
    }

    const [resultado] = await db.execute(
      "SELECT * FROM categorias WHERE id_categoria = ?",
      [req.params.id]
    );

    if (resultado.length === 0) {
      return res.status(404).json({
        mensaje: "Categoria no encontrada"
      });
    }

    res.json(resultado[0]);
  } catch (error) {
    manejarError(res, error);
  }
});

// Registrar categoria
app.post("/api/categorias", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (typeof nombre !== "string" ||
        !nombre.trim() || nombre.length > 100) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio y debe tener maximo 100 caracteres"
      });
    }

    if (descripcion != null && typeof descripcion !== "string") {
      return res.status(400).json({
        mensaje: "La descripcion debe ser un texto"
      });
    }

    const [resultado] = await db.execute(
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre.trim(), descripcion ?? null]
    );

    res.status(201).json({
      mensaje: "Categoria registrada correctamente",
      id_categoria: resultado.insertId
    });
  } catch (error) {
    manejarError(res, error);
  }
});

// Actualizar categoria
app.put("/api/categorias/:id", async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: "ID invalido" });
    }

    const { nombre, descripcion } = req.body;

    if (typeof nombre !== "string" ||
        !nombre.trim() || nombre.length > 100) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio y debe tener maximo 100 caracteres"
      });
    }

    if (descripcion != null && typeof descripcion !== "string") {
      return res.status(400).json({
        mensaje: "La descripcion debe ser un texto"
      });
    }

    const [resultado] = await db.execute(
      `UPDATE categorias
       SET nombre = ?, descripcion = ?
       WHERE id_categoria = ?`,
      [nombre.trim(), descripcion ?? null, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Categoria no encontrada"
      });
    }

    res.json({ mensaje: "Categoria actualizada correctamente" });
  } catch (error) {
    manejarError(res, error);
  }
});

// Eliminar categoria
app.delete("/api/categorias/:id", async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: "ID invalido" });
    }

    const [resultado] = await db.execute(
      "DELETE FROM categorias WHERE id_categoria = ?",
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Categoria no encontrada"
      });
    }

    res.json({ mensaje: "Categoria eliminada correctamente" });
  } catch (error) {
    manejarError(res, error);
  }
});

// ===================================
// PRODUCTOS
// ===================================

// Obtener todos los productos
app.get("/api/productos", async (req, res) => {
  try {
    const [productos] = await db.query(`
      SELECT
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.id_categoria,
        c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c
      ON p.id_categoria = c.id_categoria
      ORDER BY p.id_producto
    `);

    res.json(productos);
  } catch (error) {
    manejarError(res, error);
  }
});

// Obtener producto por ID
app.get("/api/productos/:id", async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: "ID invalido" });
    }

    const [resultado] = await db.execute(
      `SELECT p.*, c.nombre AS categoria
       FROM productos p
       INNER JOIN categorias c
       ON p.id_categoria = c.id_categoria
       WHERE p.id_producto = ?`,
      [req.params.id]
    );

    if (resultado.length === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json(resultado[0]);
  } catch (error) {
    manejarError(res, error);
  }
});

// Registrar producto
app.post("/api/productos", async (req, res) => {
  try {
    const error = validarProducto(req.body);

    if (error) {
      return res.status(400).json({ mensaje: error });
    }

    const { nombre, descripcion, precio, stock, id_categoria } = req.body;

    const [resultado] = await db.execute(
      `INSERT INTO productos
       (nombre, descripcion, precio, stock, id_categoria)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre.trim(), descripcion ?? null, precio, stock, id_categoria]
    );

    res.status(201).json({
      mensaje: "Producto registrado correctamente",
      id_producto: resultado.insertId
    });
  } catch (error) {
    manejarError(res, error);
  }
});

// Actualizar producto
app.put("/api/productos/:id", async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: "ID invalido" });
    }

    const error = validarProducto(req.body);

    if (error) {
      return res.status(400).json({ mensaje: error });
    }

    const { nombre, descripcion, precio, stock, id_categoria } = req.body;

    const [resultado] = await db.execute(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio = ?,
           stock = ?, id_categoria = ?
       WHERE id_producto = ?`,
      [
        nombre.trim(), descripcion ?? null, precio,
        stock, id_categoria, req.params.id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json({ mensaje: "Producto actualizado correctamente" });
  } catch (error) {
    manejarError(res, error);
  }
});

// Eliminar producto
app.delete("/api/productos/:id", async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: "ID invalido" });
    }

    const [resultado] = await db.execute(
      "DELETE FROM productos WHERE id_producto = ?",
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    manejarError(res, error);
  }
});

// ===================================
// INICIAR SERVIDOR
// ===================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("==================================");
  console.log(" SERVIDOR DE FERRETERIA INICIADO");
  console.log(` Puerto: ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log("==================================");
});

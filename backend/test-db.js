
const db = require("./config/db");

async function probarConexion() {
  try {
    const [resultado] = await db.query(
      "SELECT DATABASE() AS base_de_datos"
    );

    console.log("CONEXION EXITOSA CON MYSQL");
    console.log("Base de datos:", resultado[0].base_de_datos);

  } catch (error) {
    console.log("ERROR DE CONEXION");
    console.log("Codigo:", error.code);
    console.log("Mensaje:", error.message);
  } finally {
    await db.end();
  }
}

probarConexion();

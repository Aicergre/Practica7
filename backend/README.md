
# API RESTful - Sistema de Ferretería

Backend desarrollado con Node.js, Express.js y una base de datos relacional compatible con MySQL.

## 1. Tecnologías utilizadas

- Node.js
- Express.js
- MySQL2
- CORS
- Dotenv
- MySQL / MariaDB
- Postman

## 2. Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Aicergre/Practica7.git
```

Entrar al backend:

```bash
cd Practica7/backend
```

Instalar las dependencias:

```bash
npm install
```

## 3. Configuración de la base de datos

Crear la base de datos ejecutando:

database/schema.sql

Copiar el archivo .env.example y renombrar la copia a .env.

Configurar los valores:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=ferreteria_db
DB_PORT=3307
PORT=3000
```

El puerto, usuario y contraseña deben ajustarse a la instalación local.

## 4. Iniciar el servidor

```bash
npm start
```

La API se ejecutará en:

http://localhost:3000

## 5. Endpoints de categorías

GET /api/categorias
GET /api/categorias/:id
POST /api/categorias
PUT /api/categorias/:id
DELETE /api/categorias/:id

Ejemplo para registrar una categoría:

```json
{
  "nombre": "Herramientas",
  "descripcion": "Herramientas para construcción"
}
```

## 6. Endpoints de productos

GET /api/productos
GET /api/productos/:id
POST /api/productos
PUT /api/productos/:id
DELETE /api/productos/:id

Ejemplo para registrar o actualizar un producto:

```json
{
  "nombre": "Martillo",
  "descripcion": "Martillo de acero",
  "precio": 45.50,
  "stock": 20,
  "id_categoria": 1
}
```

El identificador de categoría debe existir en la base de datos.

## 7. Códigos de respuesta

- 200: operación correcta.
- 201: registro creado correctamente.
- 400: datos incorrectos.
- 404: registro no encontrado.
- 409: conflicto de integridad referencial.
- 500: error del servidor.

## 8. Conexión desde React y la aplicación móvil

Las aplicaciones deben enviar solicitudes HTTP a la API.

Ejemplo desde React:

```javascript
fetch("http://localhost:3000/api/productos")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

Cuando el frontend y el backend se ejecutan en dispositivos diferentes, se debe utilizar una dirección accesible desde el dispositivo cliente.

Para acceder desde otro dispositivo en la misma red:

http://IP_DEL_SERVIDOR:3000/api/productos

El servidor debe estar encendido y el puerto 3000 debe permitir las conexiones entrantes.

## 9. Pruebas

Los endpoints pueden probarse mediante Postman.

Se implementaron las operaciones CRUD de productos y categorías.

# Documentación de la API Kiora

Esta API está construida utilizando **Node.js** y **Express.js**, siguiendo una arquitectura **MVC (Modelo-Vista-Controlador)** y conectándose a una base de datos **PostgreSQL**.

## 🏗 Arquitectura y Estructura

La estructura del proyecto sigue las mejores prácticas para mantener el código modular y escalable.

```
backend/
├── src/
│   ├── config/         # Configuración de la base de datos y variables de entorno
│   ├── controllers/    # Lógica de negocio y manejo de peticiones HTTP
│   ├── middlewares/    # Middlewares globales y específicos (CORS, JSON, etc.)
│   ├── models/         # Interacción directa con la base de datos (Consultas SQL)
│   ├── routes/         # Definición de rutas y mapeo a controladores
│   └── app.js          # Configuración principal de la aplicación Express
├── docs/               # Documentación del proyecto
├── index.js            # Punto de entrada del servidor
├── .env                # Variables de entorno (No incluido en el repo)
└── package.json        # Dependencias y scripts
```

### Componentes Principales

1.  **Modelos (`src/models/`)**:
    *   Encapsulan las consultas SQL directas a la base de datos.
    *   Archivos: `blocModel.js`, `tagModel.js`, `taskModel.js`, `workDayModel.js`.

2.  **Controladores (`src/controllers/`)**:
    *   Reciben la petición (`req`), llaman al modelo correspondiente y envían la respuesta (`res`).
    *   Manejan errores y códigos de estado HTTP (200, 201, 404, 500).

3.  **Rutas (`src/routes/`)**:
    *   Definen los endpoints disponibles (`GET`, `POST`, `PUT`, `DELETE`).
    *   `src/routes/index.js` agrupa todas las rutas bajo el prefijo `/api`.

4.  **Configuración (`src/config/`)**:
    *   `db.js`: Gestiona el pool de conexiones a PostgreSQL usando la librería `pg`.

## ⚙️ Configuración e Instalación

### Prerrequisitos
*   Node.js instalado.
*   Una base de datos PostgreSQL (local o en la nube como Supabase).

### Pasos
1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Variables de Entorno**:
    Crea un archivo `.env` en la raíz (`backend/.env`) con el siguiente contenido:
    ```env
    PORT=3000
    DATABASE_URL=postgresql://usuario:password@host:5432/nombre_base_datos
    ```

3.  **Ejecutar en desarrollo**:
    ```bash
    npm run dev
    ```

## 🔌 Endpoints de la API

La URL base es `http://localhost:3000/api`.

### Blocs
*   `GET /api/blocs` - Obtener todos los blocs.
*   `GET /api/blocs/:id` - Obtener un bloc por ID.
*   `POST /api/blocs` - Crear un bloc.
*   `PUT /api/blocs/:id` - Actualizar un bloc.
*   `DELETE /api/blocs/:id` - Eliminar un bloc.

### Tags
*   `GET /api/tags` - Obtener todos los tags.
*   `POST /api/tags` - Crear un tag.
*   ... (CRUD completo)

### Tasks
*   `GET /api/tasks` - Obtener todas las tareas.
*   `POST /api/tasks` - Crear una tarea.
*   ... (CRUD completo)

### WorkDays
*   `GET /api/workdays` - Obtener días de trabajo.
*   ... (CRUD completo)

## 🛠 Tecnologías
*   **Express**: Framework web.
*   **pg (node-postgres)**: Driver de cliente PostgreSQL.
*   **cors**: Middleware para permitir peticiones cross-origin.
*   **dotenv**: Gestión de variables de entorno.
*   **nodemon**: Reinicio automático en desarrollo.

# Backend — Kiora Initiative

Este documento describe la arquitectura, flujo de peticiones, lógica de ejecución y reglas principales del backend ubicado en este repositorio.

**Estructura principal**
- **`src/config`**: configuración del cliente de base de datos (`supabase.js`).
- **`src/routes`**: definición de rutas y agrupación por recursos (`blocRoutes`, `tagRoutes`, `taskRoutes`, `workDayRoutes`).
- **`src/controllers`**: controladores que reciben la petición, aplican lógica mínima y delegan en los modelos.
- **`src/models`**: acceso a datos; contienen las consultas SQL y devuelven resultados.
- **`index.js`**: servidor Express principal que monta middleware y las rutas en `/api`.

**Resumen del flujo de ejecución (orden de llamadas)**
1. Cliente realiza una petición HTTP al servidor Express (`index.js`).
2. Middleware globales se ejecutan: `express.json()`, CORS y cualquier otro middleware registrado.
3. La petición llega a `/api` y se enruta a través de `src/routes/index.js` hacia la ruta específica (por ejemplo `/api/tasks`).
4. El archivo de rutas específico (por ejemplo `taskRoutes.js`) llama al método correspondiente del controlador (`TaskController`).
5. El controlador recibe `req`/`res`, ejecuta validaciones/checados mínimos (si los hay), y llama al método del modelo apropiado (`TaskModel`).
6. El modelo usa `src/config/supabase.js` para ejecutar consultas parametrizadas contra la base de datos (Postgres via `pg` Pool).
7. El resultado del modelo se devuelve al controlador, que construye la respuesta HTTP y la envía al cliente.

**Reglas y convenciones importantes**
- **Conexión DB**: `src/config/supabase.js` exporta una función `query(text, params)` que encapsula `pg` Pool. La conexión utiliza `process.env.DATABASE_URL`.
- **Consultas seguras**: las consultas usan placeholders parametrizados (`$1`, `$2`, ...) y pasan valores como array para evitar inyección SQL.
- **Manejo de errores**: los controladores capturan excepciones con `try/catch`. Errores inesperados devuelven `500` con `{ error: error.message }`.
- **Códigos de estado**: creación retorna `201` (por ejemplo `TaskController.create`), recursos no encontrados retornan `404`.
- **Responsabilidad por capa**: controllers => lógica de petición/estado HTTP; models => consultas SQL y formato de datos; config => conexión DB.
- **Validación**: actualmente la validación es mínima dentro de controladores/models — se recomienda añadir validación explícita (ej. `Joi`, `express-validator`) si se requiere.

**Puntos de entrada y despliegue**
- Local: `index.js` inicia `app.listen(PORT)` cuando `process.env.NODE_ENV !== 'production'`.
- Producción/Vercel: `index.js` exporta `module.exports = app` para integrarse con la plataforma serverless.

**Ejemplo de flujo — Crear una tarea (POST /api/tasks)**
1. Petición: `POST /api/tasks` con body JSON `{ title, due_date, completed, estimated_hours, bloc_id, tag_id }`.
2. `taskRoutes` enruta a `TaskController.create(req, res)`.
3. `TaskController.create` invoca `TaskModel.create(req.body)`.
4. `TaskModel.create` ejecuta consulta INSERT parametrizada y retorna la fila creada.
5. `TaskController` responde `201` con el objeto creado.

**Buenas prácticas y recomendaciones (siguientes pasos sugeridos)**
- Añadir validación de entrada en los controladores o middleware antes de llamar a los modelos.
- Implementar transacciones si una operación afecta múltiples tablas en el mismo flujo.
- Añadir logs estructurados y manejo de errores centralizado (middleware) para trazabilidad.
- Documentar endpoints con OpenAPI/Swagger y añadir tests de integración para las rutas.

**Variables de entorno relevantes**
- `DATABASE_URL`: cadena de conexión Postgres (Supabase).
- `PORT`: puerto local para desarrollo.
- `FRONTEND_URL`: origen permitido para CORS.
- `NODE_ENV`: controla si `listen()` se ejecuta localmente.

**Archivos de interés**
- [src/config/supabase.js](src/config/supabase.js) — wrapper `pg` Pool y `query`.
- [src/routes/index.js](src/routes/index.js) — agrupador de rutas montadas en `/api`.
- [src/controllers/taskController.js](src/controllers/taskController.js) — ejemplo de controlador con try/catch y códigos HTTP.
- [src/models/taskModel.js](src/models/taskModel.js) — ejemplo de consultas parametrizadas.

---
Si quieres, puedo: (a) añadir ejemplos curl concretos para cada endpoint, (b) incluir validaciones con `express-validator`, o (c) generar un archivo OpenAPI mínimo. ¿Cuál prefieres?

# Frontend — Conexión y consultas al backend

Este documento explica cómo el frontend se comunica con el backend, qué endpoints utiliza, la configuración de la URL base y ejemplos de uso (axios y curl).

**Dónde está la configuración de la API**
- [src/services/api.js](src/services/api.js) crea una instancia de `axios` con `baseURL`.
- La URL base proviene de `import.meta.env.VITE_API_URL` o por defecto `http://localhost:3000/api`.

**Endpoints disponibles (resumen)**
- Tasks: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`.
- Blocs: `GET /blocs`, `GET /blocs/:id`, `POST /blocs`, `PUT /blocs/:id`, `DELETE /blocs/:id`.
- Tags: `GET /tags`, `GET /tags/:id`, `POST /tags`, `PUT /tags/:id`, `DELETE /tags/:id`.
- WorkDays: `GET /workdays`, `GET /workdays/:id`, `POST /workdays`, `PUT /workdays/:id`, `DELETE /workdays/:id`.

Estos endpoints se mapean directamente con las funciones exportadas en `src/services/api.js` (por ejemplo `getTasks()`, `createTask(datos)`, `createBloc(datos)`, etc.).

**Flujo de llamadas desde componentes**
- Un componente (por ejemplo `src/components/TaskManager.jsx`) importa funciones desde `src/services/api.js`.
- Cuando el usuario realiza una acción (crear, editar, borrar), el componente llama la función correspondiente (ej. `createBloc({ name })`).
- La función del servicio hace una petición HTTP a `baseURL + '/blocs'` y devuelve `response.data`.
- Tras la respuesta, el componente actualiza su estado (por ejemplo recarga la lista con `getBlocs()`).

**Ejemplo (axios en el código)**
En `src/services/api.js`:

- `createBloc(datos)` hace `api.post('/blocs', datos)` y retorna `response.data`.

Ejemplo de uso en un componente React:

```javascript
import { createBloc, getBlocs } from './services/api'

await createBloc({ name: 'Mi Bloc' })
const blocs = await getBlocs()
```

**Ejemplos curl**
- Crear un bloc:

```bash
curl -X POST "http://localhost:3000/api/blocs" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi Bloc"}'
```

- Obtener tareas:

```bash
curl "http://localhost:3000/api/tasks"
```

Nota: si defines `VITE_API_URL` en el frontend (por ejemplo en `.env.local`), reemplaza `http://localhost:3000/api` por esa URL.

**CORS y configuración cruzada**
- El backend configura CORS con `FRONTEND_URL` (ver `backend/index.js`). Asegúrate de que `FRONTEND_URL` incluya el origen desde donde corre tu frontend (ej. `http://localhost:5173`).

**Buenas prácticas y recomendaciones**
- Manejar errores en los servicios: envolver llamadas `axios` con `try/catch` y devolver errores amigables al componente.
- Centralizar token/headers (si se añade autenticación) en la instancia `api` de `axios`.
- Validar datos en el frontend antes de enviarlos (evitar requests inválidos).
- Añadir indicadores de carga y manejo de estados de error en los componentes.

**Comandos rápidos**
- Instalar dependencias y levantar el frontend:

```bash
npm install
npm run dev
```

---
He creado este README para que quede claro cómo se hacen las consultas y la relación directa con los endpoints del backend. ¿Quieres que agregue ejemplos curl/axios para todos los endpoints o que genere un pequeño OpenAPI/Swagger con los endpoints listados? 
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

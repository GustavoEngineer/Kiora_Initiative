# Variables de Entorno para Vercel - Frontend

Este documento describe las variables de entorno que deben configurarse en Vercel para el despliegue del frontend.

## Configuración en Vercel

Para configurar las variables de entorno en Vercel:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto del frontend
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada una de las siguientes variables

---

## Variables Requeridas

### `VITE_API_URL`
**Descripción:** URL del backend API para las peticiones del frontend

**Valor para Producción:**
```
https://tu-backend.vercel.app/api
```

**Entorno:** Production, Preview

> [!IMPORTANT]
> - Reemplaza `tu-backend.vercel.app` con la URL real de tu backend desplegado en Vercel
> - **NO olvides** incluir `/api` al final de la URL
> - Asegúrate de que el backend tenga configurado CORS para permitir peticiones desde `https://kiora-frontend.vercel.app`

---

## Verificación

Después de configurar las variables:

1. Haz un nuevo despliegue (o redeploy)
2. Abre la consola del navegador (F12) en tu frontend desplegado
3. Verifica que las peticiones se hagan a la URL correcta del backend
4. Confirma que no haya errores de CORS en la consola

## Desarrollo Local

Para desarrollo local, crea un archivo `.env.local` en la raíz del proyecto frontend con:

```env
VITE_API_URL=http://localhost:3000/api
```

> [!NOTE]
> En Vite, las variables de entorno deben comenzar con `VITE_` para estar disponibles en el código del cliente.

---

## Configuración del Backend

Para que el frontend funcione correctamente, asegúrate de que el backend tenga:

1. **CORS configurado** para permitir peticiones desde:
   - Producción: `https://kiora-frontend.vercel.app`
   - Local: `http://localhost:5173`

2. **Variables de entorno del backend** (en `backend/docs/vercel-environment-variables.md`):
   - `FRONTEND_URL=https://kiora-frontend.vercel.app`

---

## Archivos de Entorno en el Proyecto

- **`.env.local`** - Para desarrollo local (no se sube a Git)
- **`.env.production`** - Para builds de producción locales (opcional)
- **Vercel Environment Variables** - Para producción en Vercel (configuradas en el dashboard)

> [!WARNING]
> **NUNCA** subas archivos `.env*` a Git. Están protegidos por `.gitignore` por seguridad.

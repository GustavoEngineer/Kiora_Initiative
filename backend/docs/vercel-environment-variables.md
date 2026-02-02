# Variables de Entorno para Vercel

Este documento describe las variables de entorno que deben configurarse en Vercel para el despliegue del backend.

## Configuración en Vercel

Para configurar las variables de entorno en Vercel:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto del backend
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada una de las siguientes variables

---

## Variables Requeridas

### `DATABASE_URL`
**Descripción:** URL de conexión directa a PostgreSQL de Supabase

**Valor:**
```
postgresql://postgres:Pirixito%4027@db.pfchghiqgyfukyaysllo.supabase.co:5432/postgres
```

**Entorno:** Production, Preview (opcional)

---

### `FRONTEND_URL`
**Descripción:** URL del frontend para configuración de CORS

**Valor:**
```
https://kiora-frontend.vercel.app
```

**Entorno:** Production, Preview (opcional)

> [!IMPORTANT]
> Asegúrate de que esta URL coincida exactamente con la URL de tu frontend desplegado en Vercel.

---

### `NODE_ENV`
**Descripción:** Entorno de Node.js

**Valor:**
```
production
```

**Entorno:** Production, Preview

> [!NOTE]
> Vercel normalmente establece esta variable automáticamente, pero es recomendable configurarla explícitamente.

---

## Verificación

Después de configurar las variables:

1. Haz un nuevo despliegue (o redeploy)
2. Verifica los logs de despliegue en Vercel
3. Prueba el endpoint de salud: `https://tu-backend.vercel.app/`
4. Verifica que CORS funcione correctamente desde el frontend

## Desarrollo Local

Para desarrollo local, usa el archivo `.env` en la raíz del proyecto backend con los siguientes valores:

```env
DATABASE_URL=postgresql://postgres:Pirixito%4027@db.pfchghiqgyfukyaysllo.supabase.co:5432/postgres
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> [!WARNING]
> **NUNCA** subas el archivo `.env` a Git. Está protegido por `.gitignore` por seguridad.

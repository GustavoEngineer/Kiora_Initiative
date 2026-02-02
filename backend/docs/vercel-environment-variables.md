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
> Vercel establece esta variable automáticamente a `production`. No necesitas configurarla explícitamente, pero si tienes problemas, confírmala manualmente.

---

## Verificación

Después de configurar las variables:

1. Haz un nuevo despliegue (o redeploy)
2. Verifica los logs de despliegue en Vercel
3. Prueba el endpoint de salud: `https://tu-backend.vercel.app/`
4. Verifica que CORS funcione correctamente desde el frontend

---

## Troubleshooting

### Error 500 al crear/actualizar datos

Si recibes errores 500 al hacer peticiones POST/PUT:

1. **Verifica los logs en Vercel:**
   - Ve a tu proyecto → **Deployments** → Click en el deployment actual
   - Ve a la pestaña **Functions** → Selecciona la función `/api`
   - Revisa los logs para ver el error exacto

2. **Errores comunes:**
   - `no pg_hba.conf entry` → Verifica que `DATABASE_URL` esté correctamente configurada
   - `SSL required` → Asegúrate de que el código tenga configuración SSL (ya incluida en `src/config/supabase.js`)
   - `relation "tabla" does not exist` → La tabla no existe en Supabase, verifica tu esquema de base de datos

3. **Verifica la configuración SSL:**
   - El archivo `src/config/supabase.js` debe tener `ssl: { rejectUnauthorized: false }` en producción

### CORS Errors

Si recibes errores de CORS:
- Verifica que `FRONTEND_URL` en Vercel sea exactamente igual a la URL del frontend
- No incluyas `/` al final de `FRONTEND_URL`

## Desarrollo Local

Para desarrollo local, usa el archivo `.env` en la raíz del proyecto backend con los siguientes valores:

```env
DATABASE_URL=postgresql://postgres:Pirixito%4027@db.pfchghiqgyfukyaysllo.supabase.co:5432/postgres
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> [!WARNING]
> **NUNCA** subas el archivo `.env` a Git. Está protegido por `.gitignore` por seguridad.

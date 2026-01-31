{
    "guia_tecnica": {
        "framework": "Express.js",
            "filosofia": "Minimalista y flexible basado en Middleware",
                "arquitectura": {
            "patron": "Modelo-Vista-Controlador (MVC)",
                "capas": [
                    {
                        "nombre": "Rutas (Routing)",
                        "responsabilidad": "Definir puntos de entrada HTTP y dirigir al controlador."
                    },
                    {
                        "nombre": "Controlador (Controller)",
                        "responsabilidad": "Lógica de petición, validación de entrada y gestión del flujo de respuesta."
                    },
                    {
                        "nombre": "Modelo (Model)",
                        "responsabilidad": "Interacción exclusiva con la base de datos y abstracción de consultas."
                    },
                    {
                        "nombre": "Vista (View)",
                        "implementacion": "Respuestas directas en formato JSON/XML."
                    }
                ]
        },
        "estructura_carpetas": {
            "raiz": "project-name/",
                "folders": {
                "src/config": "Configuración de BD y variables de entorno",
                    "src/controllers": "Lógica principal por entidad (ej: userController.js)",
                        "src/models": "Lógica de interacción con BD (ej: userModel.js)",
                            "src/routes": "Mapeo de rutas a controladores (ej: userRoutes.js)",
                                "src/middlewares": "Funciones de autenticación y validación",
                                    "src/app.js": "Configuración de Express y middlewares globales"
            },
            "archivos_raiz": [".env", "index.js", "package.json"]
        },
        "conceptos_fundamentales": {
            "app": "Contenedor principal de la API",
                "request_req": {
                "params": "Parámetros de ruta (/users/:id)",
                    "query": "Parámetros de consulta (?status=active)",
                        "body": "Datos en el cuerpo de la solicitud",
                            "headers": "Encabezados y tokens"
            },
            "response_res": "Métodos para enviar respuesta (res.status().json())",
                "router": "Instancia aislada para modularizar rutas por entidad",
                    "middleware": "Funciones con acceso a req, res y next() para ejecutar código intermedio"
        },
        "flujo_peticion_http": {
            "tipo": "Lineal y secuencial",
                "pasos": [
                    "1. Recepción de la Petición",
                    "2. Middlewares Globales (ej: express.json)",
                    "3. Coincidencia de la Ruta",
                    "4. Middlewares Específicos (ej: Autenticación con next())",
                    "5. Lógica del Controlador (Invocación al Modelo)",
                    "6. Envío de Respuesta (Fin del ciclo)",
                    "7. Manejo de Errores (Middleware especializado mediante next(error))"
                ]
        }
    }
}
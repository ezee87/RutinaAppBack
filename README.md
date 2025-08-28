# rutina-app-backend

Backend profesional para la app de gestión de metas y hábitos. Express + MongoDB.

## Estructura

- **src/models/**: Modelos Mongoose (User, Meta, Progreso, Nota)
- **src/controllers/**: Lógica de endpoints
- **src/routes/**: Rutas Express
- **src/middlewares/**: Middlewares (auth, validación)
- **src/utils/**: Utilidades
- **src/app.js**: Configuración principal

## Modelos

- **User**: nombre, email, passwordHash, fechaRegistro
- **Meta**: usuario, nombre, tipo (numerica/binaria), frecuencia (diaria/semanal), objetivoDiario, objetivoSemanal, diasSeleccionados, fechaCreacion
- **Progreso**: usuario, meta, fecha, valor (number o boolean), nota
- **Nota**: usuario, fecha, texto

## Endpoints principales

- **Auth**: /api/auth/register, /api/auth/login
- **Metas**: /api/metas (GET, POST, PUT, DELETE)
- **Progresos**: /api/progresos (GET, POST, PUT, DELETE)
- **Notas**: /api/notas (GET, POST, PUT, DELETE)

## Instalación

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` con tu URI de MongoDB y secret JWT.
3. Ejecuta el servidor:
   ```bash
   npm run dev
   ```

## Requisitos
- Node.js >= 18
- MongoDB

## Autor
- Proyecto generado por GitHub Copilot para rutina-app

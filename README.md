# Luxury Resort — Sistema de Reservas

Aplicación full stack de reservas para un resort de lujo, con autenticación de usuarios, catálogo de habitaciones/suites y gestión de reservas con control de disponibilidad por fechas.

## Demo

- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Autenticación: JWT + bcrypt

## Funcionalidades

- Registro e inicio de sesión de usuarios con JWT
- Catálogo de habitaciones con filtro por capacidad
- Detalle de habitación con formulario de reserva
- Validación de disponibilidad (evita reservas superpuestas en la misma habitación)
- Cálculo automático del precio total según noches
- Panel "Mis reservas" con opción de cancelar
- Diseño responsive con paleta e identidad visual propia

## Stack técnico

| Capa | Tecnologías |
|------|-------------|
| Frontend | React, React Router, Axios, CSS |
| Backend | Node.js, Express, JWT, bcryptjs |
| Base de datos | PostgreSQL |

## Estructura del proyecto

```
luxury-resort/
├── backend/          # API REST (Express + PostgreSQL)
│   ├── src/
│   │   ├── config/       # Conexión a la base de datos
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/   # Autenticación JWT
│   │   └── routes/       # Endpoints de la API
│   └── database/         # Esquema SQL y datos de ejemplo
└── frontend/         # Frontend (React + Vite)
    └── src/
        ├── api/          # Cliente HTTP
        ├── components/   # Componentes reutilizables
        ├── context/      # Autenticación global
        └── pages/        # Vistas de la aplicación
```

## Cómo ejecutar el proyecto

### 1. Base de datos

Crea una base de datos PostgreSQL y ejecuta los scripts:

```bash
psql -U postgres -c "CREATE DATABASE luxury_resort;"
psql -U postgres -d luxury_resort -f backend/database/schema.sql
psql -U postgres -d luxury_resort -f backend/database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Configura `backend/.env` con tus credenciales de PostgreSQL.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

## Despliegue en producción

- **Backend + base de datos:** en [Render](https://render.com), usando el Blueprint `backend/render.yaml` (New → Blueprint, seleccionar este repo). Crea automáticamente el servicio web y la base PostgreSQL, y conecta las variables de entorno entre ambos. Después hay que ejecutar `schema.sql` y `seed.sql` contra la base creada.
- **Frontend:** en [Vercel](https://vercel.com), importando este repo con *Root Directory* = `frontend`. Configurar la variable `VITE_API_URL` apuntando a la URL pública del backend en Render (por ejemplo `https://luxury-resort-backend.onrender.com/api`).

## Endpoints principales de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/rooms` | Listar habitaciones |
| GET | `/api/rooms/:id` | Detalle de habitación |
| POST | `/api/reservations` | Crear reserva (requiere token) |
| GET | `/api/reservations/me` | Ver mis reservas (requiere token) |
| DELETE | `/api/reservations/:id` | Cancelar reserva (requiere token) |

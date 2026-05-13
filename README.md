# Monitor de Fermentación Cervecera

Sistema IoT de monitoreo en tiempo real para el proceso de fermentación de cerveza artesanal.

## Stack tecnológico

| Capa            | Tecnología                                     |
| --------------- | ---------------------------------------------- |
| Hardware        | ESP32 + DS18B20 + LED IR/Fotodiodo + Módulo pH |
| Backend         | Node.js + Express + Socket.io                  |
| Base de datos   | PostgreSQL 16                                  |
| Frontend        | Vue.js 3 + Vite + Chart.js                     |
| Infraestructura | Docker + Nginx                                 |

## Requisitos

- Docker y Docker Compose instalados en el servidor
- Git

## Configuración inicial (una sola vez)

```bash
git clone https://github.com/tu-usuario/fermentacion-monitor.git
cd fermentacion-monitor

cp .env.example .env
# Editar .env con tus contraseñas reales
nano .env
```

## Levantar el sistema

```bash
docker compose up -d
```

Servicios disponibles:

| Servicio     | URL                         |
| ------------ | --------------------------- |
| Dashboard    | http://localhost            |
| Adminer (DB) | http://localhost:8080       |
| API health   | http://localhost/api/health |

## Actualizar después de un git push

```bash
git pull origin main
docker compose up -d --build
```

## Endpoints principales de la API

```
GET    /api/fermentaciones           — Listar todos los lotes
POST   /api/fermentaciones           — Crear nuevo lote
GET    /api/fermentaciones/:id       — Detalle de un lote
PATCH  /api/fermentaciones/:id       — Actualizar lote

POST   /api/lecturas                 — Recibir lectura del ESP32
GET    /api/lecturas/:id             — Historial de lecturas

GET    /api/alertas/config/:id       — Configuración de umbrales
PATCH  /api/alertas/config/:id       — Actualizar umbrales
GET    /api/alertas/log/:id          — Log de alertas disparadas
```

## Formato de lectura del ESP32 (POST /api/lecturas)

```json
{
  "fermentacion_id": 1,
  "temperatura_mosto": 19.5,
  "burbujas_por_minuto": 12,
  "ph": 4.2
}
```

## Estructura del proyecto

```
fermentacion-monitor/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── nginx/
│   └── nginx.conf
├── api/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── db/
│       │   ├── index.js
│       │   └── schema.sql
│       └── routes/
│           ├── fermentaciones.js
│           ├── lecturas.js
│           └── alertas.js
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.js
        ├── App.vue
        ├── views/
        │   ├── Fermentaciones.vue
        │   └── Dashboard.vue
        └── components/
            └── GraficaLinea.vue
```

## Integrantes

- Ruben Valenzuela 1 — Hardware (ESP32) y sensores
- Ruben Caballero 2 — Backend (API + DB)
- Eleazar — Frontend (Vue.js)

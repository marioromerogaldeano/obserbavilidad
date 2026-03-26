# Observabilidad API

Este proyecto implementa un sistema básico de observabilidad para una API desarrollada en Node.js y ejecutada con Docker.

## Tecnologías utilizadas

- Node.js
- Express
- Docker
- Prometheus
- Grafana
- Morgan
- Winston
- prom-client

## Servicios

- API: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

## Funcionalidades implementadas

- API con varios endpoints:
  - `/`
  - `/health`
  - `/users`
  - `/error`
  - `/metrics`

- Registro de logs en archivo `app.log`
- Exposición de métricas para Prometheus
- Monitorización con Prometheus
- Visualización en Grafana mediante dashboard

## Paneles del dashboard

1. Total Requests
2. Requests per second
3. Memory usage
4. CPU usage

## Cómo ejecutar el proyecto

Desde la carpeta raíz del proyecto:

```bash
docker compose up --build
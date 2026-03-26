# Observabilidad API

Este proyecto implementa un sistema basico de observabilidad para una API desarrollada en Node.js y ejecutada con Docker.

## Tecnologias utilizadas

- Node.js
- Express
- Docker
- Prometheus
- Grafana
- Elasticsearch
- Logstash
- Kibana
- Morgan
- Winston
- prom-client

## Servicios

- API: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- Kibana: http://localhost:5601

## Funcionalidades implementadas

- API con varios endpoints:
  - `/`
  - `/health`
  - `/users`
  - `/error`
  - `/metrics`

- Registro de logs en archivo `app.log`
- Centralizacion de logs con ELK Stack:
  - Logstash
  - Elasticsearch
  - Kibana
- Exposicion de metricas para Prometheus
- Monitorizacion con Prometheus
- Visualizacion de metricas en Grafana mediante dashboard
- Visualizacion de logs en Kibana mediante dashboard

## Paneles del dashboard de Grafana

1. Total Requests
2. Requests per second
3. Memory usage
4. CPU usage

## Visualizacion en Kibana

- Logs por tiempo
- Logs centralizados desde la API
- Consulta y analisis de eventos registrados

## Como ejecutar el proyecto

Desde la carpeta raiz del proyecto:

```bash
docker compose up --build
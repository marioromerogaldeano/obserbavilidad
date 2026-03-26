const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const client = require('prom-client');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const logDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'app.log')
        }),
        new winston.transports.Console()
    ]
});

app.use(morgan('combined', {
    stream: {
        write: (message) => {
            logger.info(message.trim());
        }
    }
}));

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total de peticiones HTTP'
});

app.use((req, res, next) => {
    httpRequestCounter.inc();
    next();
});

app.get('/', (req, res) => {
    logger.info('Acceso a /');
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Observabilidad API</title>
      <style>
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: #e2e8f0;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 20px 60px;
        }

        h1 {
          margin: 0 0 10px;
          font-size: 2.8rem;
          color: #38bdf8;
        }

        .subtitle {
          margin: 0 0 20px;
          color: #cbd5e1;
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .status {
          display: inline-block;
          margin-bottom: 30px;
          padding: 10px 16px;
          border-radius: 999px;
          background: #16a34a;
          color: white;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .card {
          background: rgba(30, 41, 59, 0.95);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(148, 163, 184, 0.15);
        }

        .card h2 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 1.2rem;
          color: #f8fafc;
        }

        .card p {
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .links,
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        a.button,
        button.button {
          border: none;
          cursor: pointer;
          text-decoration: none;
          padding: 11px 15px;
          border-radius: 10px;
          font-weight: bold;
          font-size: 0.95rem;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        a.button:hover,
        button.button:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .primary {
          background: #38bdf8;
          color: #0f172a;
        }

        .warning {
          background: #f59e0b;
          color: #111827;
        }

        .danger {
          background: #ef4444;
          color: white;
        }

        .dark {
          background: #334155;
          color: white;
        }

        code {
          display: inline-block;
          background: #334155;
          color: #f8fafc;
          padding: 4px 8px;
          border-radius: 8px;
          margin: 4px 0;
        }

        ul {
          padding-left: 18px;
          color: #cbd5e1;
          line-height: 1.7;
        }

        .footer {
          margin-top: 35px;
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .note {
          margin-top: 12px;
          color: #93c5fd;
          font-size: 0.95rem;
        }

        #traffic-status {
          margin-top: 12px;
          color: #f8fafc;
          font-size: 0.95rem;
          min-height: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Observabilidad API</h1>
        <p class="subtitle">
          Proyecto de observabilidad con Node.js, Docker, Prometheus, Grafana y ELK Stack.
          Esta interfaz sirve para demostrar en directo el funcionamiento de la API
          y generar trafico real para los dashboards.
        </p>

        <div class="status">API funcionando correctamente</div>

        <div class="grid">
          <div class="card">
            <h2>Endpoints de la API</h2>
            <p>Accesos directos para probar la aplicacion.</p>
            <div class="links">
              <a class="button primary" href="/health">/health</a>
              <a class="button primary" href="/users">/users</a>
              <a class="button primary" href="/metrics">/metrics</a>
            </div>
          </div>

          <div class="card">
            <h2>Herramientas</h2>
            <p>Enlaces rapidos a la monitorizacion.</p>
            <div class="links">
              <a class="button dark" href="http://localhost:9090" target="_blank">Prometheus</a>
              <a class="button dark" href="http://localhost:3001" target="_blank">Grafana</a>
              <a class="button dark" href="http://localhost:5601" target="_blank">Kibana</a>
            </div>
          </div>

          <div class="card">
            <h2>Pruebas en directo</h2>
            <p>Puedes generar trafico y errores para que se reflejen en los dashboards.</p>
            <div class="actions">
              <button class="button warning" onclick="generateTraffic()">Generar trafico</button>
              <a class="button danger" href="/error">Generar error</a>
            </div>
            <div id="traffic-status"></div>
          </div>

          <div class="card">
            <h2>Metricas monitorizadas</h2>
            <p>Las principales consultas del dashboard son estas:</p>
            <div><code>http_requests_total</code></div>
            <div><code>rate(http_requests_total[1m])</code></div>
            <div><code>process_resident_memory_bytes</code></div>
            <div><code>rate(process_cpu_seconds_total[1m])</code></div>
          </div>

          <div class="card">
            <h2>Logs y visualizacion</h2>
            <p>Los logs de la API se almacenan en <code>app.log</code> y se centralizan con ELK Stack.</p>
            <div><code>Logstash → Elasticsearch → Kibana</code></div>
          </div>

          <div class="card">
            <h2>Puertos del proyecto</h2>
            <ul>
              <li>API: <strong>3000</strong></li>
              <li>Prometheus: <strong>9090</strong></li>
              <li>Grafana: <strong>3001</strong></li>
              <li>Kibana: <strong>5601</strong></li>
            </ul>
          </div>

          <div class="card">
            <h2>Que ensenar en clase</h2>
            <ul>
              <li>La API funcionando</li>
              <li>Los endpoints principales</li>
              <li>Prometheus recogiendo metricas</li>
              <li>Grafana visualizando trafico, CPU y memoria</li>
              <li>Kibana visualizando logs centralizados</li>
              <li>Generacion de trafico y errores en directo</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          Preparado para demo en clase.
          <div class="note">Consejo: abre esta pagina, Grafana y Kibana a la vez para ensenar metricas y logs en directo.</div>
        </div>
      </div>

      <script>
        async function generateTraffic() {
          const status = document.getElementById('traffic-status');
          status.textContent = 'Generando trafico...';

          try {
            const requests = [];
            for (let i = 0; i < 8; i++) {
              requests.push(fetch('/users'));
              requests.push(fetch('/health'));
            }

            await Promise.all(requests);
            status.textContent = 'Trafico generado correctamente.';
          } catch (error) {
            status.textContent = 'Error al generar trafico.';
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
    logger.info('Acceso a /health');
    res.json({
        status: 'ok',
        service: 'observabilidad-api',
        timestamp: new Date().toISOString()
    });
});

app.get('/users', (req, res) => {
    logger.info('Acceso a /users');
    res.json([
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
        { id: 3, name: 'User3' }
    ]);
});

app.get('/error', (req, res) => {
    logger.error('Error simulado en /error');
    res.status(500).json({ error: 'Error de prueba' });
});

app.get('/metrics', async (req, res) => {
    logger.info('Acceso a /metrics');
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(PORT, () => {
    logger.info(`Servidor escuchando en puerto ${PORT}`);
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
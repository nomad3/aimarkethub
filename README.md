# AIMarketHub - Plataforma de Análisis de Investigación Científica

![AIMarketHub Architecture](docs/architecture.png)

Plataforma para descubrir y evaluar el potencial comercial de investigaciones científicas mediante IA avanzada.

## 📌 Tabla de Contenidos
- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación Local](#-instalación-local)
- [Configuración](#-configuración)
- [Documentación de la API](#-documentación-de-la-api)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🚀 Descripción del Proyecto
AIMarketHub es una plataforma B2B/B2C que automatiza la evaluación del potencial comercial de papers científicos usando LLMs. El sistema:

1. **Recolecta** investigaciones de fuentes académicas
2. **Analiza** contenido con GPT-4 para extraer insights clave
3. **Clasifica** papers por potencial de mercado (0-10)
4. **Ofrece** herramientas para comercialización de investigación

**Casos de Uso:**
- Investigadores: Monetizar hallazgos científicos
- Inversores: Identificar tecnologías prometedoras
- Universidades: Gestionar propiedad intelectual
- Empresas: Descubrir innovaciones tempranas

## 🌟 Características Principales
| Módulo | Funcionalidades |
|--------|-----------------|
| **Scraper** | Recolección multi-fuente, Rate limiting, Validación de datos |
| **Procesamiento** | Colas prioritarias, Retry automático, Cache Redis |
| **API** | Autenticación JWT, Rate limiting, Paginación inteligente |
| **Frontend** | Búsqueda en tiempo real, Dark mode, Dashboard admin |
| **Admin** | Metricas en vivo, Gestión de usuarios, Logs de procesamiento |

## 🛠 Tecnologías Utilizadas
**Backend:**
- **API**: FastAPI + Uvicorn + JWT
- **Procesamiento**: Celery + Redis
- **Base de Datos**: PostgreSQL + Redis
- **Scraping**: ArXiv API + BeautifulSoup

**Frontend:**
- **Core**: React 18 + Vite
- **Estilos**: Tailwind CSS + Framer Motion
- **Estado**: React Query + Zustand
- **Visualización**: Recharts + Heroicons

**Infraestructura:**
- **Contenedores**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## 💻 Instalación Local

### Prerrequisitos
- Docker 20.10+
- Docker Compose 2.20+
- OpenAI API Key

### Pasos Rápidos (Docker)
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/aimarkethub.git
cd aimarkethub

# 2. Crear archivo de entorno
echo "OPENAI_KEY=tu-api-key-aqui" > .env

# 3. Iniciar servicios
docker-compose up --build

# 4. Acceder a:
# - API: http://localhost:8000/docs
# - Frontend: http://localhost:3000
# - PGAdmin: http://localhost:5050 (admin@admin.com / admin)
```

### Instalación Manual (Desarrollo)
```bash
# Backend
cd api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Worker
cd processing
celery -A worker.app worker --loglevel=info
```

## ⚙ Configuración
Archivo `.env` principal:
```ini
# API
DATABASE_URL=postgresql://admin:secret@postgres:5432/aimarkethub
REDIS_URL=redis://redis:6379/0

# OpenAI
OPENAI_KEY=sk-tu-api-key

# Frontend
VITE_API_URL=http://localhost:8000
```

## 📚 Documentación de la API

### Endpoints Principales
**GET /api/v1/papers**
```bash
curl -X 'GET' \
  'http://localhost:8000/api/v1/papers?page=1&min_score=7.5' \
  -H 'Authorization: Bearer <JWT>'
```

**POST /api/v1/process**
```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/process' \
  -H 'Content-Type: application/json' \
  -d '{"paper_id": 123}'
```

**GET /api/v1/papers/{id}**
```bash
curl -X 'GET' \
  'http://localhost:8000/api/v1/papers/123' \
  -H 'Authorization: Bearer <JWT>'
```

## 🤝 Contribución
1. Reportar bugs via GitHub Issues
2. Clonar repositorio
```bash
git clone https://github.com/nomad3/aimarkethub.git
```
3. Crear rama de feature
```bash
git checkout -b feature/nueva-funcionalidad
```
4. Seguir estándares de código:

- Backend: PEP8 + type hints
- Frontend: ESLint + Prettier
5. Abrir Pull Request con descripción detallada

## 📄 Licencia
Distribuido bajo licencia MIT. Ver `LICENSE` para más detalles.

---

**AIMarketHub** © 2025 - Transformando investigación científica en impacto social y comercial 🚀  
[Reportar Bug](https://github.com/nomad3/aimarkethub/issues) | [Solicitar Feature](https://github.com/nomad3/aimarkethub/discussions)

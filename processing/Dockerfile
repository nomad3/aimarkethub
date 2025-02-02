FROM python:3.11-slim

# Crear directorio primero
RUN mkdir -p /app && useradd -m appuser && chown -R appuser /app
WORKDIR /app
USER appuser

# Añadir PATH para usuario no-root
ENV PATH="/home/appuser/.local/bin:${PATH}"

# Copiar estructura completa
COPY api /app/api
COPY processing /app/processing

# Instalar dependencias de ambos módulos
RUN pip install --no-cache-dir -r api/requirements.txt
RUN pip install --no-cache-dir -r processing/requirements.txt

WORKDIR /app/processing

ENV PYTHONPATH="/app"

CMD ["celery", "-A", "worker.app", "worker", "--loglevel=info"] 
# syntax=docker/dockerfile:1

FROM python:3.11-slim AS runtime

# Prevent Python from creating .pyc files and ensure logs appear immediately.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install only the operating-system libraries required at runtime.
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root application user.
RUN groupadd --system appgroup \
    && useradd --system --gid appgroup --create-home appuser

# Copy dependency file first to preserve Docker build caching.
COPY backend/requirements.txt ./requirements.txt

# Install CPU-only PyTorch for an EC2 instance without an NVIDIA GPU.
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install \
        --index-url https://download.pytorch.org/whl/cpu \
        torch torchvision

# Install the remaining Python dependencies.
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Copy application code.
COPY --chown=appuser:appgroup backend ./backend

# Models are mounted through Docker Compose in production.
# Do not copy them into the image.

# Create writable runtime directories.
RUN mkdir -p /app/uploads /app/logs /app/models \
    && chown -R appuser:appgroup /app/uploads /app/logs /app/models

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl --fail http://localhost:8000/api/dashboard || exit 1

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
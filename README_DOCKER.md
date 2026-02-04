# Buskalo Docker Configuration (Windows/Linux/Mac)

This project has been containerized using Docker and Docker Compose to facilitate deployment and development across different operating systems.

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine (Linux).
- Docker Compose (Included with Docker Desktop).

## Container Structure

1. **Backend (Django)**:
   - Port: `8000`
   - Base: Python 3.12-slim
   - Includes: Automatic migrations on startup.
   - Volume: Synchronized with `./backend` for live development.

2. **Frontend (Next.js)**:
   - Port: `3000`
   - Base: Node 20-slim (using pnpm)
   - Volume: Synchronized with `./frontend`.

## How to Run

To start the entire project for the first time or after changing dependencies:

```bash
docker-compose up --build
```

If you want to run it in the background:

```bash
docker-compose up -d
```

## Useful Commands

- **View logs**: `docker-compose logs -f`
- **Stop services**: `docker-compose down`
- **Run commands in the backend** (e.g., create superuser):
  ```bash
  docker-compose exec backend python manage.py createsuperuser
  ```
- **Reinstall dependencies (backend)**:
  ```bash
  docker-compose build backend
  ```
- **Reinstall dependencies (frontend)**:
  ```bash
  docker-compose build frontend
  ```

## Windows Specific Notes (Important)

1. **WSL2**: It is highly recommended to use the **WSL 2 backend** in Docker Desktop settings for much better performance.
2. **Line Endings (CRLF vs LF)**: If you experience errors like `\r: command not found` when starting the containers, it's likely due to Windows line endings. Ensure your files use `LF` (Unix line endings). You can configure Git to handle this automatically:
   ```bash
   git config --global core.autocrlf input
   ```
3. **Paths**: Docker Compose handles paths correctly across platforms, but always run commands from the project root directory (`buskalo/`).

---

## Notes
- The frontend is configured by default to communicate with `http://localhost:8000/api`.
- R2 credentials will be automatically loaded from `backend/.env`.
# Buskalo Project

A modern full-stack boilerplate with Next.js and Django.

## Project Structure

- `/frontend`: Next.js 16 application.
  - **Logic**: React 19, App Router.
  - **Styling**: Tailwind CSS 4.
  - **Linting/Formatting**: Biome.
  - **Package Manager**: pnpm.
- `/backend`: Django + Django Rest Framework.
  - **API**: Django Rest Framework (DRF).
  - **CORS**: django-cors-headers.
  - **Virtual Env**: Python 3 venv.

## How to Run

### 1. Backend

```bash
cd backend
source venv/bin/activate
# (Optional) Run migrations if you add models
# python manage.py migrate
python manage.py runserver
```
The backend will be available at `http://localhost:8000/`.

### 2. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```
The frontend will be available at `http://localhost:3000/`.

## Biome Commands

Biome is used for both linting and formatting.

```bash
cd frontend
pnpm lint      # Check for linting issues
pnpm format    # Format the code
```

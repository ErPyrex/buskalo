# 🚀 Buskalo! - Modern Commerce Platform

Buskalo! is a state-of-the-art full-stack platform designed for modern local commerce, built with a performance-first mindset and premium aesthetics.

## 🏗️ Project Architecture

The project is split into two main directories:

### 🎨 Frontend (`/frontend`)

Powered by the latest **Next.js 15+** (App Router) and **React 19**.

- **Styling**: Tailwind CSS 4 with custom glassmorphism and premium design tokens.
- **Optimization**: Precision image pipeline using `browser-image-compression` and `native Next.js Image`.
- **Quality Control**: **Biome** for blazing fast linting and formatting.
- **State Management**: React Context for Auth and global state.
- **Package Manager**: `pnpm`.

### ⚙️ Backend (`/backend`)

A robust **Django 6.0+** REST API.

- **Framework**: Django Rest Framework (DRF) with JWT Authentication.
- **Storage**: **Cloudflare R2** integration for globally distributed media assets.
- **API**: Full CRUD for Shops, Products, and Categories.
- **Database**: **PostgreSQL** (Production and Docker), SQLite (Minimal fallback).

---

## ✨ Key Features & Advanced Optimization

### 🖼️ Premium Image Pipeline

Buskalo! implements a dual-sided image optimization strategy to ensure maximum speed and minimum storage costs:

1. **Precision Cropping**: Interactive UI to frame and rotate images (Shops, Products, Avatars) before upload.
2. **Client-Side Processing**: Before upload, images are compressed and converted to **WebP** directly in the user's browser (max 1MB).
3. **Persistent Caching**: Cloudflare R2 is configured with `Cache-Control` headers.

### 📍 Local Commerce & Maps

- **OpenStreetMap Integration**: Interactive map for selecting shop locations with reverse geocoding.
- **Shop Types**: Support for both **Physical Establishment** (with map location) and **Online Only** stores.
- **Profile Management**: Full user profile customization including bio and avatars.

---

## 🛠️ How to Run

### 1. Environment Setup

We provide `.env.example` files in both `/backend` and `/frontend` directories. Copy them to `.env`:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Backend Configuration requirements:**

- **Cloudflare R2**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc.
- **Database**: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`.

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

---

### Alternative: Docker

Read the [README_DOCKER.md](README_DOCKER.md) file for more information.

## 🧹 Code Quality

We use **Biome** for all formatting and linting needs. It's significantly faster than Prettier/ESLint.

```bash
cd frontend
pnpm biome check --write . # Check and fix issues
pnpm biome format --write . # Format code
```

---

## 📡 API Endpoints

### Auth

- `POST /api/v1/auth/register/`: New account.
- `POST /api/v1/auth/login/`: JWT tokens.
- `GET /api/v1/auth/profile/`: User details.

### Business Logic

- `GET /api/v1/market/shops/`: List all active shops.
- `GET /api/v1/market/products/`: Global catalog with shop details.
- `POST /api/v1/market/products/`: Create item.

---

## 🚀 Deployment Notes

- Media files are served via a **Public Cloudflare R2 Bucket** for extreme performance.
- Ensure `AWS_QUERYSTRING_AUTH = False` in production for persistent caching.

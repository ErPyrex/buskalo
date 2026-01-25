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
- **Database**: SQLite (Local development), ready for PostgreSQL.

---

## ✨ Key Features & Advanced Optimization

### 🖼️ Premium Image Pipeline

Buskalo! implements a dual-sided image optimization strategy to ensure maximum speed and minimum storage costs:

1. **Precision Cropping**: Interactive UI to frame and rotate images before upload.
2. **Client-Side Processing**: Before upload, images are compressed and converted to **WebP** directly in the user's browser (max 1MB, 1200px max width/height).
3. **Persistent Caching**: Cloudflare R2 is configured with `Cache-Control` headers and **Clean URLs** (no query signatures) to allow permanent browser caching.
4. **Skeleton Blur Transitions**: Custom `PremiumImage` component provides a smooth transition from a blurred placeholder to a sharp high-quality image with a "glass" shimmer effect.

### 📍 Local Commerce Logic

- **Global Catalog**: Explore products from all stores in one place.
- **Shop Hierarchy**: Each product belongs to a specific shop with its own location and status.
- **Dashboard**: Professional management dashboard for shop owners to track inventory and drafts.

---

## 🛠️ How to Run

### 1. Environment Setup

Create a `.env` file in `/backend` with:

```env
# Cloudflare R2 Configuration
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
AWS_STORAGE_BUCKET_NAME=XXX
AWS_S3_ENDPOINT_URL=https://XXX.r2.cloudflarestorage.com
AWS_S3_CUSTOM_DOMAIN=pub-XXX.r2.dev
```

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

- `POST /api/auth/register/`: New account.
- `POST /api/auth/login/`: JWT tokens.
- `GET /api/auth/profile/`: User details.

### Business Logic

- `GET /api/shops/`: List all active shops.
- `GET /api/products/`: Global catalog with shop details (name & location).
- `POST /api/products/`: Create item (requires shop ownership).

---

## 🚀 Deployment Notes

- Media files are served via a **Public Cloudflare R2 Bucket** for extreme performance.
- Ensure `AWS_QUERYSTRING_AUTH = False` in production for persistent caching.

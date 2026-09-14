# Modern Landing Page Template

A production-ready Landing Page Template featuring a React frontend with a Laravel API backend.

![Dashboard Preview](docs/assets/dashboard-preview.png)

## 🚀 Features

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Laravel 11 API + Sanctum Auth
- **Admin Dashboard**: Content Management for Blog, Jobs, and Settings
- **Block System**: Dynamic page building with reusable blocks (Hero, Features, Testimonials, etc.)
- **Performance**: Optimized images (WebP), Lazy Loading, Scroll Reveal animations
- **Theming**: Dark Mode support (System/Light/Dark)

## 🛠 Prerequisites

- Docker Desktop (for Laravel Sail)
- Node.js 18+
- Composer

## 📦 Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd landing-page-template
```

### 2. Backend Setup (Laravel Sail)

The backend is containerized using Laravel Sail (Docker).

```bash
cd backend

# Install PHP dependencies (using a small temporary container if you don't have PHP local)
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs

# Copy environment file
cp .env.example .env

# Start Docker containers
./vendor/bin/sail up -d

# Run migrations and seeders
./vendor/bin/sail artisan migrate --seed

# Create storage link (Important for images!)
./vendor/bin/sail artisan storage:link

# Create Admin User
./vendor/bin/sail artisan tinker
# >>> User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'password'])
```

> **Note**: This project requires `intervention/image` for image processing, which is pre-installed in `composer.json`. The Docker image handles the necessary PHP extensions (GD).

### 3. Frontend Setup

```bash
# In the root directory
npm install

# Copy environment file
cp .env.example .env

# Start Development Server
npm run dev
```

Visit `http://localhost:5173` for the frontend and `http://localhost:5173/admin` for the admin panel.

## 🏗 Architecture

- **Frontend**: `src/` - React components, pages, and config.
- **Backend**: `backend/` - Laravel API.
- **Config**: `src/config/website.config.ts` - Static site configuration.
- **Documentation**: `docs/` - Detailed guides and implementation plans.

## 🧱 Key Libraries

- **UI**: [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS](https://tailwindcss.com), [Lucide React](https://lucide.dev)
- **State/Data**: [TanStack Query](https://tanstack.com/query) v5, [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com), [Zod](https://zod.dev)
- **Backend**: [Laravel 11](https://laravel.com), [Sanctum](https://laravel.com/docs/sanctum)
- **Image Processing**: [Intervention Image](https://image.intervention.io) (v3)

## 📚 Documentation

For more detailed information, check the `docs/` folder:

- [Template Guide](docs/TEMPLATE_GUIDE.md) - How to use and customize the template
- [Phase 13 Enhancements](docs/PHASE_13_ENHANCEMENTS.md) - Latest features (Dark Mode, Analytics, etc.)
- [Improvement Plan](docs/IMPROVEMENT_PLAN.md) - Rückführung der Bugfixes/Verbesserungen aus Kundenprojekten (Phasen 14–19)

## 📝 License

MIT

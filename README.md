# Sparkle Daycare CMS

A complete daycare website and content-management system.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Images:** Sharp (resize + WebP conversion)
- **Notifications:** Telegram Bot API

---

## 1. Project Structure

```
sparkle day care/
├── frontend/   ← React + Vite app
├── backend/    ← Express API server
└── README.md
```

---

## 2. Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Telegram bot](https://t.me/BotFather) (optional, for contact notifications)

---

## 3. Supabase Setup

### Step 1 — Create Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### Step 2 — Create database tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL:

```sql
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Admins (linked to Supabase Auth)
create table admins (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  created_at timestamptz default now()
);

-- Weekly programs
create table weekly_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  week_start date not null,
  week_end date not null,
  description text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activities (belong to a weekly program)
create table activities (
  id uuid primary key default gen_random_uuid(),
  weekly_program_id uuid references weekly_programs(id) on delete cascade,
  day text not null,
  title text not null,
  description text,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Gallery images
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  image_url text not null,
  thumb_url text,
  storage_path text not null,
  thumb_path text,
  category text not null,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contact messages
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  telegram_sent boolean default false,
  created_at timestamptz default now()
);

-- Site settings (single row)
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  daycare_name text,
  phone text,
  email text,
  address text,
  description text,
  logo_url text,
  hero_image_url text,
  playground_title text,
  playground_description text,
  playground_image_url text,
  learning_area_title text,
  learning_area_description text,
  learning_area_image_url text,
  classroom_title text,
  classroom_description text,
  classroom_image_url text,
  outdoor_title text,
  outdoor_description text,
  outdoor_image_url text,
  updated_at timestamptz default now()
);
```

### Step 3 — Enable Row Level Security

Run this SQL to allow public read access and restrict writes to authenticated users:

```sql
-- Enable RLS on all tables
alter table weekly_programs enable row level security;
alter table activities enable row level security;
alter table gallery_images enable row level security;
alter table site_settings enable row level security;
alter table contact_messages enable row level security;

-- Allow public SELECT on public content
create policy "Public read weekly_programs" on weekly_programs
  for select using (true);

create policy "Public read activities" on activities
  for select using (true);

create policy "Public read gallery_images" on gallery_images
  for select using (true);

create policy "Public read site_settings" on site_settings
  for select using (true);

-- Allow authenticated users full access (backend uses service role key, bypasses RLS)
-- The above policies are for direct Supabase client access if needed.
-- The Express backend uses the service role key, which bypasses RLS entirely.
```

### Step 4 — Create Storage bucket

Go to **Storage** in Supabase dashboard:

1. Click **New bucket**
2. Name it: `daycare-images`
3. Set to **Public bucket**
4. Click **Create bucket**

### Step 5 — Create admin user

Go to **Authentication → Users** in Supabase dashboard:

1. Click **Add user**
2. Enter: `admin@sparkledaycare.com` and a strong password
3. Click **Create user**

### Step 6 — Get your credentials

Go to **Project Settings → API**:

- Copy **Project URL** → `SUPABASE_URL`
- Copy **anon/public** key → `SUPABASE_ANON_KEY`
- Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 4. Telegram Bot Setup (optional)

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow prompts
3. Copy the bot token → `TELEGRAM_BOT_TOKEN`
4. Get your Chat ID:
   - Add your bot to your group or start a chat
   - Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Find your chat `id` value → `TELEGRAM_CHAT_ID`

---

## 5. Backend Setup

```bash
cd backend

# Copy and fill in .env
copy .env.example .env
# Edit .env with your values

# Install dependencies
npm install

# Start development server
npm run dev
```

The API runs on: `http://localhost:5000`

---

## 6. Frontend Setup

```bash
cd frontend

# Copy and fill in .env
copy .env.example .env
# Edit .env with your Supabase URL and anon key

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on: `http://localhost:5173`

---

## 7. Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

TELEGRAM_BOT_TOKEN=123456789:AAH...
TELEGRAM_CHAT_ID=-100123456789

FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

> **Never** put `SUPABASE_SERVICE_ROLE_KEY` or `TELEGRAM_BOT_TOKEN` in the frontend `.env`.

---

## 8. Public API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/settings` | Site settings |
| GET | `/api/programs` | All published programs |
| GET | `/api/programs/current` | Current week's program |
| GET | `/api/gallery` | Gallery images (paginated) |
| GET | `/api/gallery?category=playground` | Filter by category |
| GET | `/api/gallery?page=2&limit=12` | Paginated |
| POST | `/api/contact` | Submit contact form |

## 9. Admin API Endpoints (require auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Stats |
| GET | `/api/admin/messages` | Contact messages |
| POST | `/api/admin/gallery` | Upload image |
| PATCH | `/api/admin/gallery/:id` | Update image |
| DELETE | `/api/admin/gallery/:id` | Delete image |
| POST | `/api/admin/programs` | Create program |
| PATCH | `/api/admin/programs/:id` | Update program |
| DELETE | `/api/admin/programs/:id` | Delete program |
| POST | `/api/admin/activities` | Create activity |
| PATCH | `/api/admin/activities/:id` | Update activity |
| DELETE | `/api/admin/activities/:id` | Delete activity |
| PATCH | `/api/admin/settings` | Update settings |
| POST | `/api/admin/settings/upload-image` | Upload hero/logo |

---

## 10. Admin Dashboard

Visit: `http://localhost:5173/admin/login`

Log in with the email and password you created in Supabase Auth.

---

## 11. Production Deployment

### Backend

Deploy to any Node.js host (Railway, Render, Heroku, VPS):

```bash
npm start
```

Set environment variables on your host.

### Frontend

Build and deploy to any static host (Vercel, Netlify, Cloudflare Pages):

```bash
npm run build
```

#### Deploy the frontend to Vercel

1. Import the repository in Vercel and set **Root Directory** to `frontend`.
2. Use the Vite defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
3. Add these environment variables in the Vercel project settings for every environment you deploy (Production, Preview, and Development):
   - `VITE_API_URL`: production backend origin, for example `https://your-api.onrender.com` (no trailing slash)
   - `VITE_SUPABASE_URL`: Supabase project URL, for example `https://your-project-ref.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: Supabase publishable/anon key
4. In the backend host settings, set `FRONTEND_URL` to the exact deployed Vercel origin, such as `https://your-project.vercel.app`. The backend CORS configuration allows this origin.
5. In Supabase **Authentication → URL Configuration**, set **Site URL** to the production frontend origin and add it to the allowed redirect URLs. Add any Vercel preview origins that need to use email-based auth flows.
6. Redeploy after changing environment variables; Vite embeds `VITE_` values at build time.

`frontend/vercel.json` rewrites application paths to the SPA entry point so refreshing or opening a direct URL works on Vercel. React Router keeps the requested path, and the app enforces these admin routes:

- `/admin/login` is the sign-in page.
- `/admin`, `/admin/programs`, `/admin/gallery`, `/admin/facilities`, `/admin/messages`, and `/admin/settings` require a Supabase-authenticated user. Unauthenticated visits redirect to `/admin/login`; backend admin API endpoints separately validate the Supabase access token.

Never add the backend `SUPABASE_SERVICE_ROLE_KEY` or `TELEGRAM_BOT_TOKEN` to Vercel frontend environment variables. Keep those secrets only on the backend host.

---

## 12. Image Processing

Uploaded images are automatically:
- Validated (JPEG/PNG/WebP only, max 10 MB)
- Resized to max 1600px wide
- Converted to WebP
- Compressed (quality ~82%)
- Thumbnails generated at 600px wide (quality ~75%)

Original files are never stored — only the optimized WebP versions.

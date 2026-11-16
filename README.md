<h1 align="center">Barber Plus</h1>
<p align="center"><b>Website and booking platform for a barbershop: online appointments for clients, a full admin dashboard for the owner.</b></p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

## Features

**Public site**
- Home, services, gallery and contact pages
- Online booking flow with date and time selection
- Smooth scroll-reveal animations, responsive on mobile

**Admin dashboard**
- Overview with key figures and charts
- Appointments list and calendar view
- Client management
- Shop settings

## Tech stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, TypeScript, Vite, React Router |
| UI | Tailwind CSS, shadcn/ui, Framer Motion, Recharts |
| Forms | React Hook Form, Zod |
| Backend | Supabase (database and API) |
| Hosting | Vercel |

## Getting started

```bash
npm install
cp .env.example .env   # add your own Supabase URL and anon key
npm run dev
```

Create a `.env` file with:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Author

**Adam Ezziyara**, full-stack developer and founder of [AEAgency](https://ae-agency.vercel.app).

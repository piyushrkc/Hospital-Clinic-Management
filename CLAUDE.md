# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands
- Frontend (Next.js)
  - `cd frontend && npm run dev` - Start Next.js development server
  - `cd frontend && npm run build` - Create production build
  - `cd frontend && npm run lint` - Run ESLint

- Backend (Express.js)
  - `cd backend && npm run dev` - Start development server with nodemon
  - `cd backend && npm start` - Start production server
  - `cd backend && npm run seed` - Seed database with initial data

## Code Style Guidelines
- TypeScript strict mode enabled with ES2017 target
- ESLint extends Next.js core web vitals and TypeScript rules
- Use 2 space indentation throughout the codebase
- Frontend uses path aliasing: import from `@/components/...` not `../../components/...`

### Naming Conventions
- React components: PascalCase (AppointmentForm.tsx)
- Variables/functions: camelCase
- Files: camelCase for services/utilities, PascalCase for React components

### Error Handling
- Backend: Try/catch with appropriate HTTP status codes (400, 401, 403, 404, 500)
- Frontend: Try/catch with user-friendly error messages
- Consistent error response format for APIs

### Backend Pattern
- Use CommonJS syntax for imports
- Form validation with middleware
- Controller functions with try/catch and error response standardization
# Customer Manager App

Customer Manager is a React + TypeScript single-page application for managing
customer records with list, add, edit, and delete workflows.

## Live Demo

- GitHub Pages: https://iltstudent05.github.io/capstone2/

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Context API + reducer pattern
- JSON Server (development API)
- Vitest + React Testing Library

## Features

### Core

- Customer table with edit/delete actions
- Add customer form and edit customer form
- Validation for name, email, phone, state, zip
- Loading/error states for async operations
- Error boundary fallback UI

### Bonus

- Real-time search/filter (name, email, city)
- Sortable columns (name, email, city, state)
- Sort preference persistence in `localStorage`
- Pagination with rows-per-page selector (10, 25, 50)
- Dark mode toggle with theme persistence
- Expanded tests (routing, hook, error boundary)

## Validation Rules

- Name: required, minimum letter-based format
- Email: required, valid email format
- Phone: required, valid format (example: `555-123-4567`)
- State: required, 2-letter code
- ZIP: required, `12345` or `12345-6789`

## Routing

- `/` - customer list
- `/add` - add customer
- `/edit/:id` - edit customer

Router strategy:

- Development: `BrowserRouter`
- Production: `HashRouter` (for GitHub Pages compatibility)

## Data Behavior by Environment

- **Development** (`npm run dev` + `npm run api`): full CRUD through JSON Server
  using `/api/customers` proxy.
- **Production / GitHub Pages**: demo-mode CRUD using browser `localStorage`
  (seeded from fallback data), because GitHub Pages is static and cannot host
  JSON Server endpoints.

## Scripts

- `npm run dev` - start Vite dev server
- `npm run api` - start JSON Server on `http://localhost:3001`
- `npm run build` - type-check and production build
- `npm run preview` - preview production build
- `npm run test` - watch tests
- `npm run test:run` - run tests once
- `npm run test:coverage` - run tests with coverage report
- `npm run deploy` - deploy `dist` to GitHub Pages

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start API server (terminal 1):

   ```bash
   npm run api
   ```

3. Start app (terminal 2):

   ```bash
   npm run dev
   ```

4. Open the app at the Vite URL (usually `http://localhost:5173`).

## Testing

Run:

```bash
npm run test:run
```

Coverage:

```bash
npm run test:coverage
```

## Deployment Notes

`npm run deploy` publishes to `gh-pages`.

Because JSON Server is local-only, the deployed site uses demo persistence in
`localStorage` so add/edit/delete still function in the browser.

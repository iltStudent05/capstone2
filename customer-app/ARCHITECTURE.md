# Customer Manager Architecture

## Component Tree

App
└── Router (BrowserRouter in development, HashRouter in production)
    └── ErrorBoundary
        └── Layout
            ├── Header
            │   ├── Navigation links (Customers, Add Customer)
            │   └── Theme toggle (Dark Mode)
            └── Routes
                ├── CustomerListPage
                │   ├── Search/filter controls
                │   ├── Sort + pagination controls
                │   └── CustomerList (table)
                ├── AddCustomerPage
                │   └── CustomerForm (add mode)
                └── EditCustomerPage
                    └── CustomerForm (edit mode, prefilled)

## State and Data Flow

### 1) Shared customer state

Shared state lives in `CustomerProvider` (`src/context/CustomerContext.tsx`),
which exposes:

- `customers`
- `loading`
- `error`
- `addCustomer`, `updateCustomer`, `deleteCustomer`

`CustomerProvider` syncs context state from `useCustomerApi()` via
`SET_CUSTOMERS`.

### 2) API + demo-mode strategy

`useCustomerApi` (`src/hooks/useCustomerApi.ts`) is the single data access
layer.

- **Development**: Uses JSON Server endpoints under `/api/customers`.
- **Production (GitHub Pages)**: Uses browser `localStorage` demo persistence,
  seeded from `public/customers-fallback.json` or embedded fallback data.

This avoids CORS/405 issues on static hosting while preserving CRUD behavior in
the deployed UI.

### 3) CRUD updates

- `fetchCustomers` initializes data.
- `addCustomer`, `updateCustomer`, and `deleteCustomer` update hook state and
  persistence layer.
- Context methods return success/failure booleans to page components.

## Form Behavior and Validation

`CustomerForm` (`src/components/CustomerForm.tsx`) is reusable for add/edit via
optional `initialData`.

Validation on submit:

- `name`: required, letter-based minimum format
- `email`: required, valid email format
- `phone`: required, valid US-style format (e.g., `555-123-4567`)
- `state`: required, 2-letter code
- `zip`: required, `12345` or `12345-6789`

Errors are field-scoped, rendered with accessible labels/ARIA, and cleared on
field edit.

## List UX Features (Bonus)

`CustomerListPage` implements:

- real-time search filter by name/email/city
- result count (`Showing X of Y customers`)
- clear search button (`×`)
- sortable columns (name, email, city, state) with indicator
- persisted sort preference in `localStorage`
- pagination with Previous/Next and rows-per-page options (10/25/50)

## Theming (Bonus)

Theme is controlled in `Layout` using CSS custom properties and persisted via
`localStorage` (`customer-manager-theme`).

- light and dark color tokens are defined in `src/index.css`
- all major surfaces/components use theme variables

## Testing Strategy

Vitest + React Testing Library cover:

- `CustomerList` behaviors
- `CustomerForm` validation and submit behavior
- routing to `/add`
- `ErrorBoundary` fallback rendering
- `useCustomerApi` fetch/add logic with mocked `fetch`

Coverage is enabled via `@vitest/coverage-v8`.
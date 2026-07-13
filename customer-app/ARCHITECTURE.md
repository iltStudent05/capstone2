# Customer Manager Architecture

## Component Tree

App
└── BrowserRouter
    └── Layout
        ├── Header (nav links)
        └── Routes
            ├── CustomerListPage
            │   └── CustomerList
            │       └── CustomerRow (one per customer)
            ├── AddCustomerPage
            │   └── CustomerForm (mode: "add")
            └── EditCustomerPage
                └── CustomerForm (mode: "edit", prefilled)

## Architecture Decisions

### 1) Where customer state will live

Customer state will live in a `CustomersProvider` context that wraps the routed
application. This keeps list data, loading state, and errors available to list,
add, edit, and future detail views without prop drilling.

### 2) How CRUD operations will be managed

CRUD state transitions will use `useReducer` with typed actions (`LOAD_START`,
`LOAD_SUCCESS`, `ADD_SUCCESS`, `UPDATE_SUCCESS`, `DELETE_SUCCESS`,
`REQUEST_ERROR`). API requests will be handled by async functions in a custom
hook/provider layer, then reducer actions will update state predictably.

### 3) Custom hooks needed

- `useCustomers()` to expose context state + CRUD actions
- `useCustomersApi()` to isolate fetch logic against `/api/customers`
- `useCustomerForm()` to centralize controlled form state + validation behavior

### 4) How add/edit form modes will work

Use one reusable `CustomerForm` component with a `mode` prop (`"add" | "edit"`)
and `initialValues`. In add mode, the form starts empty and sends `POST`. In
edit mode, it receives prefilled values and sends `PUT`/`PATCH`.
import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="layout">
      <header className="site-header">
        <div className="container header-inner">
          <h1 className="site-title">Customer Manager</h1>
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink
              to="."
              end
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Customers
            </NavLink>
            <NavLink
              to="add"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Add Customer
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
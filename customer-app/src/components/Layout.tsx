import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'customer-manager-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function Layout() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const isDarkTheme = theme === 'dark'

  return (
    <div className="layout">
      <header className="site-header">
        <div className="container header-inner">
          <div className="header-left">
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

          <button
            type="button"
            className="button button-secondary theme-toggle"
            onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')}
            aria-label={
              isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            {isDarkTheme ? 'Dark Mode: On' : 'Dark Mode: Off'}
          </button>
        </div>
      </header>

      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
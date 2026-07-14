import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import AddCustomerPage from './pages/AddCustomerPage'
import CustomerListPage from './pages/CustomerListPage'
import EditCustomerPage from './pages/EditCustomerPage'
import './App.css'

function App() {
  const Router = import.meta.env.PROD ? HashRouter : BrowserRouter

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<CustomerListPage />} />
            <Route path="/add" element={<AddCustomerPage />} />
            <Route path="/edit/:id" element={<EditCustomerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  )
}

export default App

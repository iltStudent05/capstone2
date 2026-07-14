import { useEffect, useMemo, useState } from 'react'
import CustomerList from '../components/CustomerList'
import type { SortDirection, SortField } from '../components/CustomerList'
import { useCustomerContext } from '../context/CustomerContext'

const SORT_STORAGE_KEY = 'customer-manager-sort'

function getInitialSortState(): { field: SortField; direction: SortDirection } {
  if (typeof window === 'undefined') {
    return { field: 'name', direction: 'asc' }
  }

  const rawSortState = window.localStorage.getItem(SORT_STORAGE_KEY)
  if (!rawSortState) {
    return { field: 'name', direction: 'asc' }
  }

  try {
    const parsed = JSON.parse(rawSortState) as {
      field?: SortField
      direction?: SortDirection
    }

    if (
      (parsed.field === 'name' ||
        parsed.field === 'email' ||
        parsed.field === 'city' ||
        parsed.field === 'state') &&
      (parsed.direction === 'asc' || parsed.direction === 'desc')
    ) {
      return { field: parsed.field, direction: parsed.direction }
    }
  } catch {
    return { field: 'name', direction: 'asc' }
  }

  return { field: 'name', direction: 'asc' }
}

function CustomerListPage() {
  const { customers, loading, error, deleteCustomer } = useCustomerContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortState, setSortState] = useState(getInitialSortState)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    window.localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sortState))
  }, [sortState])

  const filteredCustomers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    if (!normalizedTerm) {
      return customers
    }

    return customers.filter((customer) =>
      [customer.name, customer.email, customer.city].some((value) =>
        value.toLowerCase().includes(normalizedTerm),
      ),
    )
  }, [customers, searchTerm])

  const sortedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers]
    sorted.sort((leftCustomer, rightCustomer) => {
      const left = leftCustomer[sortState.field].toLowerCase()
      const right = rightCustomer[sortState.field].toLowerCase()

      if (left === right) {
        return 0
      }

      if (sortState.direction === 'asc') {
        return left.localeCompare(right)
      }

      return right.localeCompare(left)
    })

    return sorted
  }, [filteredCustomers, sortState])

  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / rowsPerPage))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, rowsPerPage])

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return sortedCustomers.slice(startIndex, endIndex)
  }, [currentPage, rowsPerPage, sortedCustomers])

  const handleSort = (field: SortField) => {
    setSortState((previousSortState) => {
      if (previousSortState.field === field) {
        return {
          ...previousSortState,
          direction: previousSortState.direction === 'asc' ? 'desc' : 'asc',
        }
      }

      return { field, direction: 'asc' }
    })
  }

  const handleDelete = async (customerId: number) => {
    await deleteCustomer(customerId)
  }

  return (
    <section>
      <h2>Customers</h2>
      <div className="list-controls">
        <label htmlFor="customer-search" className="search-label">
          Search
        </label>
        <div className="search-row">
          <input
            id="customer-search"
            type="text"
            className="input search-input"
            placeholder="Search by name, email, or city"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setSearchTerm('')}
            disabled={!searchTerm}
            aria-label="Clear search"
          >
            ×
          </button>
        </div>

        <div className="list-meta-row">
          <p className="results-count">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
          <label className="rows-control" htmlFor="rows-per-page">
            Rows per page
            <select
              id="rows-per-page"
              className="input rows-select"
              value={rowsPerPage}
              onChange={(event) => setRowsPerPage(Number(event.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      {loading && <p className="status-message">Loading customers...</p>}
      {error && <p className="status-error">{error}</p>}
      <CustomerList
        customers={paginatedCustomers}
        onDelete={handleDelete}
        sortField={sortState.field}
        sortDirection={sortState.direction}
        onSort={handleSort}
      />

      <div className="pagination">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <p className="page-indicator">
          Page {currentPage} of {totalPages}
        </p>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  )
}

export default CustomerListPage
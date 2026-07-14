import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

export type SortField = 'name' | 'email' | 'city' | 'state'
export type SortDirection = 'asc' | 'desc'

type Props = {
  customers: Customer[]
  onDelete: (customerId: number) => void | Promise<void>
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

function CustomerList({
  customers,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}: Props) {
  const handleDelete = (customerId: number, customerName: string) => {
    const confirmed = window.confirm(
      `Delete customer ${customerName}? This action cannot be undone.`,
    )
    if (confirmed) {
      void onDelete(customerId)
    }
  }

  if (customers.length === 0) {
    return <p className="empty-state">No customers found.</p>
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return '↕'
    }

    return sortDirection === 'asc' ? '▲' : '▼'
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>
            <button
              type="button"
              className="sort-header"
              onClick={() => onSort('name')}
            >
              Name <span aria-hidden>{getSortIndicator('name')}</span>
            </button>
          </th>
          <th>
            <button
              type="button"
              className="sort-header"
              onClick={() => onSort('email')}
            >
              Email <span aria-hidden>{getSortIndicator('email')}</span>
            </button>
          </th>
          <th>Phone</th>
          <th>
            <button
              type="button"
              className="sort-header"
              onClick={() => onSort('city')}
            >
              City <span aria-hidden>{getSortIndicator('city')}</span>
            </button>
          </th>
          <th>
            <button
              type="button"
              className="sort-header"
              onClick={() => onSort('state')}
            >
              State <span aria-hidden>{getSortIndicator('state')}</span>
            </button>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.phone}</td>
            <td>{customer.city}</td>
            <td>{customer.state}</td>
            <td className="actions-cell">
              <Link
                to={`/edit/${customer.id}`}
                className="button button-secondary"
                aria-label={`Edit ${customer.name}`}
              >
                Edit
              </Link>
              <button
                type="button"
                className="button button-danger"
                aria-label={`Delete ${customer.name}`}
                onClick={() => handleDelete(customer.id, customer.name)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList

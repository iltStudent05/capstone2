import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

type Props = {
  customers: Customer[]
  onDelete: (customerId: number) => void | Promise<void>
}

function CustomerList({ customers, onDelete }: Props) {
  if (customers.length === 0) {
    return <p className="empty-state">No customers found.</p>
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>City</th>
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
            <td className="actions-cell">
              <Link to={`/edit/${customer.id}`} className="button button-secondary">
                Edit
              </Link>
              <button
                type="button"
                className="button button-danger"
                onClick={() => void onDelete(customer.id)}
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

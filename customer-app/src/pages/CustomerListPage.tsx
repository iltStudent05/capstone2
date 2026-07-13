import CustomerList from '../components/CustomerList'
import { useCustomerContext } from '../context/CustomerContext'

function CustomerListPage() {
  const { customers, loading, error, deleteCustomer } = useCustomerContext()

  const handleDelete = async (customerId: number) => {
    await deleteCustomer(customerId)
  }

  return (
    <section>
      <h2>Customers</h2>
      {loading && <p className="status-message">Loading customers...</p>}
      {error && <p className="status-error">{error}</p>}
      <CustomerList customers={customers} onDelete={handleDelete} />
    </section>
  )
}

export default CustomerListPage
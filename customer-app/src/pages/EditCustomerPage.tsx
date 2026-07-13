import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomerContext } from '../context/CustomerContext'
import type { CustomerFormData } from '../types/customer'

function EditCustomerPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { customers, updateCustomer, loading, error } = useCustomerContext()

  const parsedId = Number(id)
  const selectedCustomer = customers.find((customer) => customer.id === parsedId)

  const initialData = useMemo<CustomerFormData | undefined>(() => {
    if (!selectedCustomer) {
      return undefined
    }

    const { id: _customerId, ...customerFormData } = selectedCustomer
    return customerFormData
  }, [selectedCustomer])

  const handleSubmit = async (formData: CustomerFormData) => {
    if (!selectedCustomer) {
      return
    }

    const updated = await updateCustomer({ id: selectedCustomer.id, ...formData })
    if (updated) {
      navigate('/')
    }
  }

  if (Number.isNaN(parsedId)) {
    return (
      <section>
        <h2>Edit Customer</h2>
        <p className="status-error">Invalid customer ID.</p>
      </section>
    )
  }

  if (loading && customers.length === 0) {
    return (
      <section>
        <h2>Edit Customer</h2>
        <p className="status-message">Loading customer...</p>
      </section>
    )
  }

  if (!selectedCustomer) {
    return (
      <section>
        <h2>Edit Customer</h2>
        <p className="status-message">Customer not found.</p>
      </section>
    )
  }

  return (
    <section>
      <h2>Edit Customer</h2>
      {loading && <p className="status-message">Updating customer...</p>}
      {error && <p className="status-error">{error}</p>}
      <CustomerForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </section>
  )
}

export default EditCustomerPage
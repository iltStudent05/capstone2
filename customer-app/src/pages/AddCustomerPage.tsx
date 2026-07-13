import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomerContext } from '../context/CustomerContext'
import type { CustomerFormData } from '../types/customer'

function AddCustomerPage() {
  const navigate = useNavigate()
  const { addCustomer, loading, error } = useCustomerContext()

  const handleSubmit = async (formData: CustomerFormData) => {
    const created = await addCustomer(formData)
    if (created) {
      navigate('/')
    }
  }

  return (
    <section>
      <h2>Add Customer</h2>
      {loading && <p className="status-message">Saving customer...</p>}
      {error && <p className="status-error">{error}</p>}
      <CustomerForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
    </section>
  )
}

export default AddCustomerPage
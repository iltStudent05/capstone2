import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerForm from '../components/CustomerForm'
import type { CustomerFormData } from '../types/customer'

describe('CustomerForm', () => {
  it('shows validation errors when required fields are empty', async () => {
    const user = userEvent.setup()

    render(<CustomerForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
  })

  it('calls onSubmit with valid form data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CustomerForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Name'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Phone'), '555-123-4567')
    await user.type(screen.getByLabelText('Address'), '123 Test St')
    await user.type(screen.getByLabelText('City'), 'Testville')
    await user.type(screen.getByLabelText('State'), 'TX')
    await user.type(screen.getByLabelText('ZIP'), '75001')

    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-123-4567',
      address: '123 Test St',
      city: 'Testville',
      state: 'TX',
      zip: '75001',
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(<CustomerForm onSubmit={vi.fn()} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('pre-fills form in edit mode and shows update button text', () => {
    const initialData: CustomerFormData = {
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '555-0101',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
    }

    render(
      <CustomerForm initialData={initialData} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    )

    expect(screen.getByLabelText('Name')).toHaveValue('Maria Garcia')
    expect(screen.getByLabelText('Email')).toHaveValue('maria.garcia@example.com')
    expect(screen.getByRole('button', { name: 'Update Customer' })).toBeInTheDocument()
  })
})

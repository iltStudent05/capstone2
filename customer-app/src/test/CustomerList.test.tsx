import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CustomerList from '../components/CustomerList'
import type { Customer } from '../types/customer'

const customers: Customer[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '555-0101',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@example.com',
    phone: '555-0102',
    address: '1600 Pennsylvania Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
  },
]

describe('CustomerList', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders customer names', () => {
    render(
      <MemoryRouter>
        <CustomerList
          customers={customers}
          onDelete={vi.fn()}
          sortField="name"
          sortDirection="asc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Maria Garcia')).toBeInTheDocument()
    expect(screen.getByText('James Chen')).toBeInTheDocument()
  })

  it('shows empty state when there are no customers', () => {
    render(
      <MemoryRouter>
        <CustomerList
          customers={[]}
          onDelete={vi.fn()}
          sortField="name"
          sortDirection="asc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('No customers found.')).toBeInTheDocument()
  })

  it('calls onDelete with the selected customer id', () => {
    const onDelete = vi.fn()

    render(
      <MemoryRouter>
        <CustomerList
          customers={customers}
          onDelete={onDelete}
          sortField="name"
          sortDirection="asc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    )

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[0])

    expect(onDelete).toHaveBeenCalledWith(1)
    expect(window.confirm).toHaveBeenCalledTimes(1)
  })

  it('renders edit links with the correct routes', () => {
    render(
      <MemoryRouter>
        <CustomerList
          customers={customers}
          onDelete={vi.fn()}
          sortField="name"
          sortDirection="asc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    )

    const editLinks = screen.getAllByRole('link', { name: /edit/i })
    expect(editLinks[0]).toHaveAttribute('href', '/edit/1')
    expect(editLinks[1]).toHaveAttribute('href', '/edit/2')
  })
})

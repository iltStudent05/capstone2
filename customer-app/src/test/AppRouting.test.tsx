import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import { CustomerProvider } from '../context/CustomerContext'

describe('App routing', () => {
  it('renders add customer page at /add', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('[]', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    window.history.pushState({}, '', '/add')

    render(
      <CustomerProvider>
        <App />
      </CustomerProvider>,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Customer' })).toBeInTheDocument()
    })
  })
})

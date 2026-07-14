import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary'

function ThrowingComponent(): null {
  throw new Error('Boundary test failure')
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child throws', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
    expect(screen.getByText(/Boundary test failure/i)).toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })
})

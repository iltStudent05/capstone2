import { act, renderHook, waitFor } from '@testing-library/react'
import { useCustomerApi } from '../hooks/useCustomerApi'

describe('useCustomerApi', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads customers on mount', async () => {
    const customersResponse = [
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
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(customersResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const { result } = renderHook(() => useCustomerApi())

    await waitFor(() => {
      expect(result.current.customers).toHaveLength(1)
    })

    expect(result.current.customers[0].name).toBe('Maria Garcia')
  })

  it('adds a customer and refreshes customers', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock
      .mockResolvedValueOnce(
        new Response('[]', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 2,
            name: 'New User',
            email: 'new@example.com',
            phone: '555-1000',
            address: '123 Main St',
            city: 'Austin',
            state: 'TX',
            zip: '75001',
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: 2,
              name: 'New User',
              email: 'new@example.com',
              phone: '555-1000',
              address: '123 Main St',
              city: 'Austin',
              state: 'TX',
              zip: '75001',
            },
          ]),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )

    const { result } = renderHook(() => useCustomerApi())

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      await result.current.addCustomer({
        name: 'New User',
        email: 'new@example.com',
        phone: '555-1000',
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '75001',
      })
    })

    await waitFor(() => {
      expect(result.current.customers).toHaveLength(1)
    })

    expect(result.current.customers[0].email).toBe('new@example.com')
  })
})

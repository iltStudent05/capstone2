import { useCallback, useEffect, useState } from 'react'
import type { Customer, CustomerFormData } from '../types/customer'

const API_BASE_URL = '/api/customers'

export function useCustomerApi() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async (): Promise<Customer[]> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_BASE_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch customers.')
      }

      const data: Customer[] = await response.json()
      setCustomers(data)
      return data
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while fetching customers.',
      )
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const addCustomer = useCallback(
    async (formData: CustomerFormData): Promise<Customer | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to add customer.')
        }

        const createdCustomer: Customer = await response.json()
        await fetchCustomers()
        return createdCustomer
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Something went wrong while adding a customer.',
        )
        return null
      } finally {
        setLoading(false)
      }
    },
    [fetchCustomers],
  )

  const updateCustomer = useCallback(
    async (customer: Customer): Promise<Customer | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/${customer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer),
        })

        if (!response.ok) {
          throw new Error('Failed to update customer.')
        }

        const updatedCustomer: Customer = await response.json()
        await fetchCustomers()
        return updatedCustomer
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Something went wrong while updating a customer.',
        )
        return null
      } finally {
        setLoading(false)
      }
    },
    [fetchCustomers],
  )

  const deleteCustomer = useCallback(
    async (customerId: number): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/${customerId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete customer.')
        }

        await fetchCustomers()
        return true
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Something went wrong while deleting a customer.',
        )
        return false
      } finally {
        setLoading(false)
      }
    },
    [fetchCustomers],
  )

  useEffect(() => {
    void fetchCustomers()
  }, [fetchCustomers])

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  }
}

import { useCallback, useEffect, useState } from 'react'
import { fallbackCustomers } from '../data/fallbackCustomers'
import type { Customer, CustomerFormData } from '../types/customer'

const API_BASE_URL = '/api/customers'
const FALLBACK_DATA_URL = `${import.meta.env.BASE_URL}customers-fallback.json`
const DEMO_STORAGE_KEY = 'customer-manager-demo-customers'

function readDemoCustomersFromStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawData = window.localStorage.getItem(DEMO_STORAGE_KEY)
  if (!rawData) {
    return null
  }

  try {
    const parsedData: unknown = JSON.parse(rawData)
    if (Array.isArray(parsedData)) {
      return parsedData as Customer[]
    }
  } catch {
    return null
  }

  return null
}

function saveDemoCustomersToStorage(customers: Customer[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(customers))
}

export function useCustomerApi() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async (): Promise<Customer[]> => {
    setLoading(true)
    setError(null)

    if (import.meta.env.PROD) {
      const storedCustomers = readDemoCustomersFromStorage()
      if (storedCustomers && storedCustomers.length > 0) {
        setCustomers(storedCustomers)
        setLoading(false)
        return storedCustomers
      }

      try {
        const fallbackResponse = await fetch(FALLBACK_DATA_URL)
        if (fallbackResponse.ok) {
          const fallbackData: Customer[] = await fallbackResponse.json()
          setCustomers(fallbackData)
          saveDemoCustomersToStorage(fallbackData)
          setLoading(false)
          return fallbackData
        }
      } catch {
        // fall through to embedded fallback
      }

      setCustomers(fallbackCustomers)
      saveDemoCustomersToStorage(fallbackCustomers)
      setLoading(false)
      return fallbackCustomers
    }

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

      if (import.meta.env.PROD) {
        const highestId = customers.reduce(
          (maxId, customer) => Math.max(maxId, customer.id),
          0,
        )
        const createdCustomer: Customer = {
          id: highestId + 1,
          ...formData,
        }
        const nextCustomers = [...customers, createdCustomer]
        setCustomers(nextCustomers)
        saveDemoCustomersToStorage(nextCustomers)
        setLoading(false)
        return createdCustomer
      }

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
    [fetchCustomers, customers],
  )

  const updateCustomer = useCallback(
    async (customer: Customer): Promise<Customer | null> => {
      setLoading(true)
      setError(null)

      if (import.meta.env.PROD) {
        const customerExists = customers.some(
          (existingCustomer) => existingCustomer.id === customer.id,
        )
        if (!customerExists) {
          setLoading(false)
          return null
        }

        const nextCustomers = customers.map((existingCustomer) =>
          existingCustomer.id === customer.id ? customer : existingCustomer,
        )

        setCustomers(nextCustomers)
        saveDemoCustomersToStorage(nextCustomers)
        setLoading(false)
        return customer
      }

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
    [fetchCustomers, customers],
  )

  const deleteCustomer = useCallback(
    async (customerId: number): Promise<boolean> => {
      setLoading(true)
      setError(null)

      if (import.meta.env.PROD) {
        const customerExists = customers.some(
          (existingCustomer) => existingCustomer.id === customerId,
        )
        if (!customerExists) {
          setLoading(false)
          return false
        }

        const nextCustomers = customers.filter(
          (customer) => customer.id !== customerId,
        )

        setCustomers(nextCustomers)
        saveDemoCustomersToStorage(nextCustomers)
        setLoading(false)
        return true
      }

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
    [fetchCustomers, customers],
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

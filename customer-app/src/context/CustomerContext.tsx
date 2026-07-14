import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { Customer, CustomerFormData } from '../types/customer'

type CustomerState = {
  customers: Customer[]
}

type CustomerAction =
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: number }

type CustomerContextValue = {
  customers: Customer[]
  loading: boolean
  error: string | null
  addCustomer: (formData: CustomerFormData) => Promise<boolean>
  updateCustomer: (customer: Customer) => Promise<boolean>
  deleteCustomer: (customerId: number) => Promise<boolean>
}

const initialState: CustomerState = {
  customers: [],
}

function customerReducer(
  state: CustomerState,
  action: CustomerAction,
): CustomerState {
  switch (action.type) {
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload }
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] }
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer,
        ),
      }
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer.id !== action.payload,
        ),
      }
    default:
      return state
  }
}

const CustomerContext = createContext<CustomerContextValue | undefined>(
  undefined,
)

type CustomerProviderProps = {
  children: ReactNode
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [state, dispatch] = useReducer(customerReducer, initialState)
  const api = useCustomerApi()

  useEffect(() => {
    dispatch({ type: 'SET_CUSTOMERS', payload: api.customers })
  }, [api.customers])

  const addCustomer = async (formData: CustomerFormData) => {
    const createdCustomer = await api.addCustomer(formData)
    if (!createdCustomer) {
      return false
    }
    return true
  }

  const updateCustomer = async (customer: Customer) => {
    const updatedCustomer = await api.updateCustomer(customer)
    if (!updatedCustomer) {
      return false
    }
    return true
  }

  const deleteCustomer = async (customerId: number) => {
    const deleted = await api.deleteCustomer(customerId)
    if (!deleted) {
      return false
    }
    return true
  }

  const value = useMemo(
    () => ({
      customers: state.customers,
      loading: api.loading,
      error: api.error,
      addCustomer,
      updateCustomer,
      deleteCustomer,
    }),
    [state.customers, api.loading, api.error],
  )

  return (
    <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
  )
}

export function useCustomerContext() {
  const context = useContext(CustomerContext)
  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider.')
  }
  return context
}

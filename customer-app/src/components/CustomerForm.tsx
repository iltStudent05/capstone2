import { useEffect, useMemo, useState } from 'react'
import type { CustomerFormData } from '../types/customer'

type Props = {
  initialData?: CustomerFormData
  onSubmit: (data: CustomerFormData) => void | Promise<void>
  onCancel: () => void
}

const EMPTY_FORM: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function CustomerForm({ initialData, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<CustomerFormData>(
    initialData ?? EMPTY_FORM,
  )
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setFormData(initialData ?? EMPTY_FORM)
    setErrors({})
  }, [initialData])

  const isEditMode = useMemo(() => Boolean(initialData), [initialData])

  const validate = () => {
    const nextErrors: Partial<Record<keyof CustomerFormData, string>> = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = 'Email format is invalid.'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (
    field: keyof CustomerFormData,
    value: CustomerFormData[keyof CustomerFormData],
  ) => {
    setFormData((previousData) => ({ ...previousData, [field]: value }))
    setErrors((previousErrors) => {
      if (!previousErrors[field]) {
        return previousErrors
      }

      const nextErrors = { ...previousErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip: formData.zip.trim(),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="form-field">
          <span>Name</span>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className={errors.name ? 'input invalid' : 'input'}
          />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </label>

        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className={errors.email ? 'input invalid' : 'input'}
          />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>

        <label className="form-field">
          <span>Phone</span>
          <input
            type="text"
            value={formData.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            className={errors.phone ? 'input invalid' : 'input'}
          />
          {errors.phone && <small className="field-error">{errors.phone}</small>}
        </label>

        <label className="form-field">
          <span>Address</span>
          <input
            type="text"
            value={formData.address}
            onChange={(event) => handleChange('address', event.target.value)}
            className="input"
          />
        </label>

        <label className="form-field">
          <span>City</span>
          <input
            type="text"
            value={formData.city}
            onChange={(event) => handleChange('city', event.target.value)}
            className="input"
          />
        </label>

        <label className="form-field">
          <span>State</span>
          <input
            type="text"
            value={formData.state}
            onChange={(event) => handleChange('state', event.target.value)}
            className="input"
          />
        </label>

        <label className="form-field">
          <span>ZIP</span>
          <input
            type="text"
            value={formData.zip}
            onChange={(event) => handleChange('zip', event.target.value)}
            className="input"
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={submitting}>
          {isEditMode ? 'Update Customer' : 'Add Customer'}
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CustomerForm

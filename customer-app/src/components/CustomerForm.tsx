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
const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'.-]{1,}$/
const PHONE_PATTERN = /^(?:\d{3}-?\d{3}-?\d{4}|\(\d{3}\)\s?\d{3}-?\d{4})$/
const STATE_PATTERN = /^[A-Za-z]{2}$/
const ZIP_PATTERN = /^\d{5}(?:-\d{4})?$/

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
    } else if (!NAME_PATTERN.test(formData.name.trim())) {
      nextErrors.name = 'Name must be at least 2 characters and use letters.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = 'Email format is invalid.'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone is required.'
    } else if (!PHONE_PATTERN.test(formData.phone.trim())) {
      nextErrors.phone = 'Phone must be valid (e.g., 555-123-4567).'
    }

    if (!formData.state.trim()) {
      nextErrors.state = 'State is required.'
    } else if (!STATE_PATTERN.test(formData.state.trim())) {
      nextErrors.state = 'State must be a 2-letter code.'
    }

    if (!formData.zip.trim()) {
      nextErrors.zip = 'ZIP is required.'
    } else if (!ZIP_PATTERN.test(formData.zip.trim())) {
      nextErrors.zip = 'ZIP must be 5 digits or ZIP+4 format.'
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
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className={errors.name ? 'input invalid' : 'input'}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <small id="name-error" className="field-error" role="alert">
              Error: {errors.name}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className={errors.email ? 'input invalid' : 'input'}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <small id="email-error" className="field-error" role="alert">
              Error: {errors.email}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="text"
            value={formData.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            className={errors.phone ? 'input invalid' : 'input'}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <small id="phone-error" className="field-error" role="alert">
              Error: {errors.phone}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(event) => handleChange('address', event.target.value)}
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={(event) => handleChange('city', event.target.value)}
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            value={formData.state}
            onChange={(event) => handleChange('state', event.target.value)}
            className={errors.state ? 'input invalid' : 'input'}
            aria-invalid={Boolean(errors.state)}
            aria-describedby={errors.state ? 'state-error' : undefined}
          />
          {errors.state && (
            <small id="state-error" className="field-error" role="alert">
              Error: {errors.state}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="zip">ZIP</label>
          <input
            id="zip"
            type="text"
            value={formData.zip}
            onChange={(event) => handleChange('zip', event.target.value)}
            className={errors.zip ? 'input invalid' : 'input'}
            aria-invalid={Boolean(errors.zip)}
            aria-describedby={errors.zip ? 'zip-error' : undefined}
          />
          {errors.zip && (
            <small id="zip-error" className="field-error" role="alert">
              Error: {errors.zip}
            </small>
          )}
        </div>
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

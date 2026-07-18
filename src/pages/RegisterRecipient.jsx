import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRecipient } from '../api/client.js'
import { Notice } from '../components/Ui.jsx'

export default function RegisterRecipient() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const recipient = await createRecipient(form)
      localStorage.setItem('sw_recipient', JSON.stringify(recipient))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1>Register as an NGO</h1>
      <p className="page-intro">So you can claim available food and track pickups.</p>
      <Notice type="error">{error}</Notice>
      <form onSubmit={handleSubmit}>
        <label>
          Organization name
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </label>
        <label>
          Phone
          <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </label>
        <label>
          Address
          <input required value={form.address} onChange={(e) => update('address', e.target.value)} />
        </label>
        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  )
}

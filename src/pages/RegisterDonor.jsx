import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDonor } from '../api/client.js'
import { Notice } from '../components/Ui.jsx'
import FindAccount from '../components/FindAccount.jsx'

const DONOR_TYPES = ['Restaurant', 'Household', 'Caterer', 'Grocery Store']

export default function RegisterDonor() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', donorType: DONOR_TYPES[0], address: '',
  })
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
      const donor = await createDonor(form)
      localStorage.setItem('sw_donor', JSON.stringify(donor))
      navigate('/donate')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1>Register as a donor</h1>
      <p className="page-intro">Restaurants, households, caterers, and stores with surplus food.</p>
      <FindAccount type="donor" />
      <Notice type="error">{error}</Notice>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </label>
        <label>
          Phone
          <input required type="tel" pattern="[6-9][0-9]{9}" title="Enter a valid 10-digit Indian mobile number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </label>
        <label>
          Donor type
          <select value={form.donorType} onChange={(e) => update('donorType', e.target.value)}>
            {DONOR_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
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

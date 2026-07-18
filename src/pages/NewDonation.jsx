import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createDonation } from '../api/client.js'
import { Notice } from '../components/Ui.jsx'

const UNITS = ['kg', 'g', 'liters', 'plates', 'packets', 'boxes']

export default function NewDonation() {
  const navigate = useNavigate()
  const storedDonor = JSON.parse(localStorage.getItem('sw_donor') || 'null')

  const [form, setForm] = useState({
    foodType: '', description: '', quantity: '', unit: UNITS[0],
    pickupLocation: storedDonor?.address || '', expiryTime: '',
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
      await createDonation({
        donorId: storedDonor.id,
        foodType: form.foodType,
        description: form.description,
        quantity: Number(form.quantity),
        unit: form.unit,
        pickupLocation: form.pickupLocation,
        expiryTime: form.expiryTime, // datetime-local gives e.g. 2026-07-18T20:00
      })
      navigate('/my-donations')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!storedDonor) {
    return (
      <div>
        <h1>Donate food</h1>
        <p className="page-intro">
          You need to register as a donor first.{' '}
          <Link to="/register/donor">Register here</Link>.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1>List food to donate</h1>
      <p className="page-intro">Listing as {storedDonor.name}.</p>
      <Notice type="error">{error}</Notice>
      <form onSubmit={handleSubmit}>
        <label>
          Food type
          <input
            required
            placeholder="e.g. Cooked Rice & Curry"
            value={form.foodType}
            onChange={(e) => update('foodType', e.target.value)}
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Prepared for an event, unused, still hot…"
          />
        </label>
        <div className="row">
          <label style={{ flex: 1 }}>
            Quantity
            <input
              required
              type="number"
              min="0"
              step="0.1"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
            />
          </label>
          <label style={{ flex: 1 }}>
            Unit
            <select value={form.unit} onChange={(e) => update('unit', e.target.value)}>
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Pickup location
          <input
            required
            value={form.pickupLocation}
            onChange={(e) => update('pickupLocation', e.target.value)}
          />
        </label>
        <label>
          Expires at
          <input
            required
            type="datetime-local"
            value={form.expiryTime}
            onChange={(e) => update('expiryTime', e.target.value)}
          />
        </label>
        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? 'Listing…' : 'List this food'}
        </button>
      </form>
    </div>
  )
}

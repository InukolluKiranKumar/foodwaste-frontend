import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listDonors, listRecipients } from '../api/client.js'
import { Notice } from './Ui.jsx'

export default function FindAccount({ type }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFind(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const list = type === 'donor' ? await listDonors() : await listRecipients()
      const match = (list || []).find(
        (p) => p.email.toLowerCase() === email.trim().toLowerCase()
      )
      if (!match) {
        setError('No account found with that email. Register below instead.')
        return
      }
      localStorage.setItem(type === 'donor' ? 'sw_donor' : 'sw_recipient', JSON.stringify(match))
      navigate(type === 'donor' ? '/donate' : '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: 24, maxWidth: 480 }}>
      <h2 style={{ marginBottom: 10 }}>Already registered?</h2>
      <Notice type="error">{error}</Notice>
      <form onSubmit={handleFind} style={{ flexDirection: 'row', gap: 8, maxWidth: 'none' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Looking…' : "That's me"}
        </button>
      </form>
    </div>
  )
}

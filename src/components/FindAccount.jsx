import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  loginDonor, loginRecipient,
  listDonors, listRecipients,
  setDonorPassword, setRecipientPassword,
} from '../api/client.js'
import { Notice } from './Ui.jsx'

export default function FindAccount({ type }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false)

  const storageKey = type === 'donor' ? 'sw_donor' : 'sw_recipient'
  const login = type === 'donor' ? loginDonor : loginRecipient

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const account = await login({ email: email.trim(), password })
      localStorage.setItem(storageKey, JSON.stringify(account))
      navigate(type === 'donor' ? '/donate' : '/')
    } catch (err) {
      if (err.message.includes("doesn't have a password yet")) {
        setNeedsPasswordSetup(true)
        setError('')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // For accounts created before login existed — look them up by email, then let them set a password.
  async function handleSetPassword(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const list = type === 'donor' ? await listDonors() : await listRecipients()
      const match = (list || []).find(
        (p) => p.email.toLowerCase() === email.trim().toLowerCase()
      )
      if (!match) {
        setError('No account found with that email.')
        return
      }
      const setPw = type === 'donor' ? setDonorPassword : setRecipientPassword
      const account = await setPw(match.id, password)
      localStorage.setItem(storageKey, JSON.stringify(account))
      navigate(type === 'donor' ? '/donate' : '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: 24, maxWidth: 480 }}>
      <h2 style={{ marginBottom: 10 }}>Already registered? Log in</h2>
      <Notice type="error">{error}</Notice>
      {needsPasswordSetup && (
        <Notice type="success">
          This account doesn't have a password yet. Set one below to finish logging in.
        </Notice>
      )}
      <form onSubmit={needsPasswordSetup ? handleSetPassword : handleLogin}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          {needsPasswordSetup ? 'Choose a password' : 'Password'}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Please wait…' : needsPasswordSetup ? 'Set password & log in' : 'Log in'}
        </button>
      </form>
    </div>
  )
}

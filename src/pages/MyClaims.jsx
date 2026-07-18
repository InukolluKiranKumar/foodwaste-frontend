import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listRecipientDistributions, completeDistribution, cancelDistribution } from '../api/client.js'
import { StatusBadge, Loader, Notice, EmptyState, formatDate } from '../components/Ui.jsx'

export default function MyClaims() {
  const storedRecipient = JSON.parse(localStorage.getItem('sw_recipient') || 'null')
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    if (!storedRecipient) return
    setLoading(true)
    setError('')
    try {
      const data = await listRecipientDistributions(storedRecipient.id)
      setClaims(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAction(id, action) {
    setBusyId(id)
    setError('')
    try {
      if (action === 'complete') await completeDistribution(id)
      else await cancelDistribution(id)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (!storedRecipient) {
    return (
      <div>
        <h1>My claims</h1>
        <p className="page-intro">
          Register as an NGO first. <Link to="/register/ngo">Register here</Link>.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1>My claims</h1>
      <p className="page-intro">Pickups claimed by {storedRecipient.name}.</p>
      <Notice type="error">{error}</Notice>
      {loading && <Loader />}
      {!loading && claims.length === 0 && (
        <EmptyState>
          No claims yet. <Link to="/">Browse available food</Link>.
        </EmptyState>
      )}
      <div className="stack" style={{ marginTop: 16 }}>
        {claims.map((c) => (
          <div key={c.id} className="card row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="row" style={{ gap: 8 }}>
                <strong>{c.donation?.foodType || `Claim #${c.id}`}</strong>
                <StatusBadge status={c.status} />
              </div>
              <p className="meta">
                {c.donation?.quantity} {c.donation?.unit} · Pickup at {c.donation?.pickupLocation}
              </p>
              <p className="meta">
                From {c.donation?.donor?.name} · Claimed {formatDate(c.claimedAt)}
              </p>
              {c.distributedAt && (
                <p className="meta">Completed {formatDate(c.distributedAt)}</p>
              )}
            </div>
            {c.status === 'PENDING_PICKUP' && (
              <div className="row">
                <button
                  className="btn primary"
                  disabled={busyId === c.id}
                  onClick={() => handleAction(c.id, 'complete')}
                >
                  Mark picked up
                </button>
                <button
                  className="btn danger"
                  disabled={busyId === c.id}
                  onClick={() => handleAction(c.id, 'cancel')}
                >
                  Cancel claim
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

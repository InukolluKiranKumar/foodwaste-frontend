import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listDonorDonations, cancelDonation } from '../api/client.js'
import DonationCard from '../components/DonationCard.jsx'
import { Loader, Notice, EmptyState } from '../components/Ui.jsx'

export default function MyDonations() {
  const storedDonor = JSON.parse(localStorage.getItem('sw_donor') || 'null')
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    if (!storedDonor) return
    setLoading(true)
    setError('')
    try {
      const data = await listDonorDonations(storedDonor.id)
      setDonations(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCancel(id) {
    setBusyId(id)
    setError('')
    try {
      await cancelDonation(id)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (!storedDonor) {
    return (
      <div>
        <h1>My donations</h1>
        <p className="page-intro">
          Register as a donor first to see your listings. <Link to="/register/donor">Register here</Link>.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1>My donations</h1>
      <p className="page-intro">Listings from {storedDonor.name}.</p>
      <Notice type="error">{error}</Notice>
      {loading && <Loader />}
      {!loading && donations.length === 0 && (
        <EmptyState>
          You haven't listed anything yet. <Link to="/donate">List your first donation</Link>.
        </EmptyState>
      )}
      <div className="grid" style={{ marginTop: 16 }}>
        {donations.map((d) => (
          <DonationCard
            key={d.id}
            donation={d}
            action={
              d.status === 'AVAILABLE' && (
                <button
                  className="btn danger"
                  disabled={busyId === d.id}
                  onClick={() => handleCancel(d.id)}
                >
                  {busyId === d.id ? 'Cancelling…' : 'Cancel listing'}
                </button>
              )
            }
          />
        ))}
      </div>
    </div>
  )
}

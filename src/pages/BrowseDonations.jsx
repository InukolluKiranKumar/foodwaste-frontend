import { useEffect, useState } from 'react'
import { listAvailableDonations, claimDonation } from '../api/client.js'
import DonationCard from '../components/DonationCard.jsx'
import { Loader, Notice, EmptyState } from '../components/Ui.jsx'

export default function BrowseDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [claimingId, setClaimingId] = useState(null)
  const [message, setMessage] = useState('')

  const storedRecipient = JSON.parse(localStorage.getItem('sw_recipient') || 'null')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await listAvailableDonations()
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

  async function handleClaim(donationId) {
    if (!storedRecipient) {
      setError('Register as an NGO first so we know who is claiming this.')
      return
    }
    setClaimingId(donationId)
    setError('')
    setMessage('')
    try {
      await claimDonation(donationId, storedRecipient.id)
      setMessage('Donation claimed. Find it under "My Claims".')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setClaimingId(null)
    }
  }

  return (
    <div>
      <h1>Available food</h1>
      <p className="page-intro">
        {storedRecipient
          ? `Browsing as ${storedRecipient.name}. Claim anything you can pick up.`
          : 'Register as an NGO to claim listings.'}
      </p>

      <Notice type="error">{error}</Notice>
      {message && <Notice type="success">{message}</Notice>}

      {loading && <Loader text="Loading available donations…" />}

      {!loading && donations.length === 0 && (
        <EmptyState>No food is currently listed as available. Check back soon.</EmptyState>
      )}

      <div className="grid" style={{ marginTop: 16 }}>
        {donations.map((d) => (
          <DonationCard
            key={d.id}
            donation={d}
            action={
              <button
                className="btn primary"
                disabled={claimingId === d.id}
                onClick={() => handleClaim(d.id)}
              >
                {claimingId === d.id ? 'Claiming…' : 'Claim this'}
              </button>
            }
          />
        ))}
      </div>
    </div>
  )
}

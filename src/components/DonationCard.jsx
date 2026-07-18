import { StatusBadge, formatDate } from './Ui.jsx'

export default function DonationCard({ donation, action }) {
  return (
    <div className="card donation-card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>{donation.foodType}</h3>
        <StatusBadge status={donation.status} />
      </div>
      {donation.description && <p className="desc">{donation.description}</p>}
      <p className="meta">
        {donation.quantity} {donation.unit} · Pickup at {donation.pickupLocation}
      </p>
      <p className="meta">Expires {formatDate(donation.expiryTime)}</p>
      {action}
    </div>
  )
}

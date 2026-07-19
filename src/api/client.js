const BASE_URL = import.meta.env.VITE_API_BASE_URL

class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.status = status
    this.body = body
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // Some endpoints (DELETE, complete, cancel) may return no body
  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`
    throw new ApiError(message, res.status, data)
  }

  return data
}

// ---------- Donors ----------
export const createDonor = (donor) =>
  request('/api/donors', { method: 'POST', body: JSON.stringify(donor) })

export const listDonors = () => request('/api/donors')

export const getDonor = (id) => request(`/api/donors/${id}`)

export const updateDonor = (id, donor) =>
  request(`/api/donors/${id}`, { method: 'PUT', body: JSON.stringify(donor) })

export const deleteDonor = (id) => request(`/api/donors/${id}`, { method: 'DELETE' })

// ---------- Recipients (NGOs) ----------
export const createRecipient = (recipient) =>
  request('/api/recipients', { method: 'POST', body: JSON.stringify(recipient) })

export const listRecipients = () => request('/api/recipients')

export const getRecipient = (id) => request(`/api/recipients/${id}`)

export const updateRecipient = (id, recipient) =>
  request(`/api/recipients/${id}`, { method: 'PUT', body: JSON.stringify(recipient) })

export const deleteRecipient = (id) => request(`/api/recipients/${id}`, { method: 'DELETE' })

export const listRecipientDistributions = (recipientId) =>
  request(`/api/recipients/${recipientId}/distributions`)

// ---------- Food Donations ----------
export const createDonation = (donation) =>
  request('/api/donations', { method: 'POST', body: JSON.stringify(donation) })

export const listDonations = () => request('/api/donations')

export const listAvailableDonations = () => request('/api/donations/available')

export const getDonation = (id) => request(`/api/donations/${id}`)

export const listDonorDonations = (donorId) => request(`/api/donations/donor/${donorId}`)

export const updateDonation = (id, donation) =>
  request(`/api/donations/${id}`, { method: 'PUT', body: JSON.stringify(donation) })

export const cancelDonation = (id) => request(`/api/donations/${id}`, { method: 'DELETE' })

// ---------- Claims / Distributions ----------
export const claimDonation = (donationId, recipientId) =>
  request(`/api/donations/${donationId}/claim`, {
    method: 'POST',
    body: JSON.stringify({ recipientId }),
  })

export const completeDistribution = (id) =>
  request(`/api/distributions/${id}/complete`, { method: 'PUT' })

export const cancelDistribution = (id) =>
  request(`/api/distributions/${id}/cancel`, { method: 'PUT' })

export const listDistributions = () => request('/api/distributions')

export const getDistribution = (id) => request(`/api/distributions/${id}`)

export const loginDonor = (credentials) =>
  request('/api/donors/login', { method: 'POST', body: JSON.stringify(credentials) })

export const setDonorPassword = (id, password) =>
  request(`/api/donors/${id}/set-password`, { method: 'PUT', body: JSON.stringify({ password }) })

export const loginRecipient = (credentials) =>
  request('/api/recipients/login', { method: 'POST', body: JSON.stringify(credentials) })

export const setRecipientPassword = (id, password) =>
  request(`/api/recipients/${id}/set-password`, { method: 'PUT', body: JSON.stringify({ password }) })

export { ApiError }

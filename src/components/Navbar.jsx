import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const donor = JSON.parse(localStorage.getItem('sw_donor') || 'null')
  const recipient = JSON.parse(localStorage.getItem('sw_recipient') || 'null')

  function logout(key) {
    localStorage.removeItem(key)
    setOpen(false)
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand-block" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="brand">Food<span>ForAll</span></div>
        <div className="brand-tag">By Kiran Inukollu</div>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Browse Food
        </NavLink>
        <NavLink to="/donate" className={({ isActive }) => (isActive ? 'active' : '')}>
          Donate Food
        </NavLink>
        <NavLink to="/register/donor" className={({ isActive }) => (isActive ? 'active' : '')}>
          Register as Donor
        </NavLink>
        <NavLink to="/register/ngo" className={({ isActive }) => (isActive ? 'active' : '')}>
          Register as NGO
        </NavLink>
        <NavLink to="/my-claims" className={({ isActive }) => (isActive ? 'active' : '')}>
          My Claims
        </NavLink>
        <NavLink to="/my-donations" className={({ isActive }) => (isActive ? 'active' : '')}>
          My Donations
        </NavLink>

        <div className="menu-wrap">
          <button className="btn menu-dots" onClick={() => setOpen((o) => !o)} aria-label="Account menu">
            ⋮
          </button>
          {open && (
            <div className="menu-dropdown">
              {!donor && !recipient && (
                <div className="menu-empty">Not logged in anywhere yet.</div>
              )}
              {donor && (
                <div className="menu-row">
                  <span>Donor: {donor.name}</span>
                  <button className="btn danger" onClick={() => logout('sw_donor')}>Log out</button>
                </div>
              )}
              {recipient && (
                <div className="menu-row">
                  <span>NGO: {recipient.name}</span>
                  <button className="btn danger" onClick={() => logout('sw_recipient')}>Log out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

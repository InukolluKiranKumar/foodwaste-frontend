import { NavLink } from 'react-router-dom'

export default function Navbar() {
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
      </div>
    </nav>
  )
}

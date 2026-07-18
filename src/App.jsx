import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import BrowseDonations from './pages/BrowseDonations.jsx'
import NewDonation from './pages/NewDonation.jsx'
import RegisterDonor from './pages/RegisterDonor.jsx'
import RegisterRecipient from './pages/RegisterRecipient.jsx'
import MyDonations from './pages/MyDonations.jsx'
import MyClaims from './pages/MyClaims.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<BrowseDonations />} />
        <Route path="/donate" element={<NewDonation />} />
        <Route path="/register/donor" element={<RegisterDonor />} />
        <Route path="/register/ngo" element={<RegisterRecipient />} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/my-claims" element={<MyClaims />} />
      </Routes>
    </div>
  )
}

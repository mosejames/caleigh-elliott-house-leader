import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import Logo from './components/Logo.jsx'
import Bio from './components/Bio.jsx'
import ActionHub from './components/ActionHub.jsx'
import CommunityFeed from './components/CommunityFeed.jsx'
import Footer from './components/Footer.jsx'
import FloatingShare from './components/FloatingShare.jsx'
import AdminPanel from './components/AdminPanel.jsx'

function HomePage() {
  return (
    <>
      <Hero />
      <Logo />
      <Bio />
      <ActionHub />
      <CommunityFeed />
      <Footer />
      <FloatingShare />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  )
}

import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import Logo from './components/Logo.jsx'
import ElectionBanner from './components/ElectionBanner.jsx'
import PhotoCarousel from './components/PhotoCarousel.jsx'
import WhyCaleigh from './components/WhyCaleigh.jsx'
import ActionHub from './components/ActionHub.jsx'
import CommunityFeed from './components/CommunityFeed.jsx'
import Footer from './components/Footer.jsx'
import FloatingShare from './components/FloatingShare.jsx'
import MemoryPopup from './components/MemoryPopup.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import WallPage from './components/WallPage.jsx'

function HomePage() {
  return (
    <>
      <Hero />
      <Logo />
      <ElectionBanner />
      <PhotoCarousel />
      <WhyCaleigh />
      <ActionHub />
      <CommunityFeed />
      <Footer />
      <FloatingShare />
      <MemoryPopup />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/wall" element={<WallPage />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  )
}

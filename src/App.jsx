import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import Video from './components/Video.jsx'
import Bio from './components/Bio.jsx'
import PledgeWall from './components/PledgeWall.jsx'
import ShoutoutBoard from './components/ShoutoutBoard.jsx'
import PhotoWall from './components/PhotoWall.jsx'
import AskCaleigh from './components/AskCaleigh.jsx'
import Footer from './components/Footer.jsx'
import FloatingShare from './components/FloatingShare.jsx'
import AdminPanel from './components/AdminPanel.jsx'

function HomePage() {
  return (
    <>
      <Hero />
      <Video />
      <Bio />
      <PledgeWall />
      <ShoutoutBoard />
      <PhotoWall />
      <AskCaleigh />
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

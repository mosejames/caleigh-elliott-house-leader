import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { doc, collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore'

export default function CommunityFeed() {
  const [pledgeCount, setPledgeCount] = useState(0)
  const [shoutouts, setShoutouts] = useState([])
  const [answered, setAnswered] = useState([])
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    const unsubs = []
    unsubs.push(onSnapshot(doc(db, 'pledges', 'counter'), (snap) => setPledgeCount(snap.data()?.count || 0)))
    unsubs.push(onSnapshot(query(collection(db, 'shoutouts'), orderBy('timestamp', 'desc'), limit(6)), (snap) => setShoutouts(snap.docs.map(d => ({ id: d.id, ...d.data() })))))
    unsubs.push(onSnapshot(query(collection(db, 'questions'), where('status', '==', 'answered'), orderBy('timestamp', 'desc'), limit(3)), (snap) => setAnswered(snap.docs.map(d => ({ id: d.id, ...d.data() })))))
    unsubs.push(onSnapshot(query(collection(db, 'photos'), orderBy('timestamp', 'desc'), limit(6)), (snap) => setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() })))))
    return () => unsubs.forEach(u => u())
  }, [])

  const hasContent = pledgeCount > 0 || shoutouts.length > 0 || answered.length > 0 || photos.length > 0

  if (!hasContent) return null

  return (
    <section className="section section-white">
      <div className="contain">
        <h2 className="heading-section" style={{ color: 'var(--red)' }}>The Wall</h2>

        {/* Pledge count banner */}
        {pledgeCount > 0 && (
          <div className="center-text" style={{ marginTop: '32px', background: 'var(--red)', padding: '24px', color: 'var(--white)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 4rem)' }}>{pledgeCount}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', marginLeft: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {pledgeCount === 1 ? 'person stands' : 'people stand'} with Caleigh
            </span>
          </div>
        )}

        {/* Shoutouts */}
        {shoutouts.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '16px' }}>
              Shoutouts
            </h3>
            <div className="grid-2">
              {shoutouts.map((s) => (
                <div key={s.id} style={{ borderLeft: '4px solid var(--red)', padding: '16px 20px', background: 'var(--gray-100)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red)', fontSize: '0.95rem' }}>{s.name}</p>
                  <p style={{ color: 'var(--gray-600)', marginTop: '4px', fontSize: '0.9rem', lineHeight: 1.5 }}>{s.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '16px' }}>
              On The Wall
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {photos.map((p) => (
                <div key={p.id} style={{ position: 'relative' }}>
                  <img src={p.storageUrl} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(204,0,0,0.85)', color: '#fff', textAlign: 'center', padding: '4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.7rem' }}>
                    {p.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answered Q&A */}
        {answered.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '16px' }}>
              Caleigh Answers
            </h3>
            <div className="space-y">
              {answered.map((item) => (
                <div key={item.id} style={{ borderLeft: '4px solid var(--gold)', padding: '16px 20px', background: 'var(--gray-100)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gray-800)', fontSize: '0.95rem' }}>Q: {item.question}</p>
                  <p style={{ color: 'var(--red)', fontStyle: 'italic', marginTop: '8px', lineHeight: 1.5, fontSize: '0.9rem' }}>A: {item.answer}</p>
                  <p style={{ color: 'var(--gray-400)', fontSize: '0.75rem', marginTop: '8px' }}>Asked by {item.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

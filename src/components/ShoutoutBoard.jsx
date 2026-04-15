import { useState, useEffect, useRef, useCallback } from 'react'
import { db } from '../firebase.js'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { shareImage } from '../utils/share.js'
import html2canvas from 'html2canvas'

export default function ShoutoutBoard() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [shoutouts, setShoutouts] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const shareRefs = useRef({})

  useEffect(() => {
    const q = query(collection(db, 'shoutouts'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => setShoutouts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || submitting) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'shoutouts'), { name: name.trim(), message: message.trim(), timestamp: serverTimestamp() })
      setName(''); setMessage('')
    } catch (err) { console.error('Error posting shoutout:', err) }
    finally { setSubmitting(false) }
  }

  const handleShare = useCallback(async (id) => {
    const el = shareRefs.current[id]
    if (!el) return
    try {
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 })
      canvas.toBlob(async (blob) => { if (blob) await shareImage(blob, 'shoutout.png') }, 'image/png')
    } catch (err) { console.error('Error sharing shoutout:', err) }
  }, [])

  return (
    <section className="section section-red grain" style={{ position: 'relative' }}>
      <div className="contain center-text">
        <h2 className="heading-section" style={{ color: 'var(--white)' }}>Show Love</h2>

        <form onSubmit={handleSubmit} className="contain-sm space-y" style={{ marginTop: '40px' }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input-dark" />
          <div>
            <textarea value={message} onChange={(e) => { if (e.target.value.length <= 140) setMessage(e.target.value) }} placeholder="Show some love (140 chars max)" rows={3} className="input-dark" style={{ resize: 'none' }} />
            <p style={{ color: 'var(--white-muted)', fontSize: '0.8rem', textAlign: 'right', marginTop: '4px' }}>{message.length}/140</p>
          </div>
          <button type="submit" disabled={submitting || !name.trim() || !message.trim()} className="btn btn-white btn-full">
            {submitting ? 'Posting...' : 'Post Your Shoutout'}
          </button>
        </form>

        {shoutouts.length > 0 && (
          <div className="grid-3" style={{ marginTop: '56px' }}>
            {shoutouts.map((s) => (
              <div key={s.id}>
                <div className="card" style={{ textAlign: 'left' }}>
                  <p style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>{s.name}</p>
                  <p style={{ color: 'var(--gray-600)', marginTop: '8px', lineHeight: 1.5 }}>{s.message}</p>
                  <button onClick={() => handleShare(s.id)} style={{ color: 'var(--red)', fontWeight: 700, fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', marginTop: '12px', padding: 0 }}>
                    Share this &rarr;
                  </button>
                </div>
                <div ref={(el) => { if (el) shareRefs.current[s.id] = el; else delete shareRefs.current[s.id] }} style={{ position: 'absolute', left: '-9999px', width: '600px' }}>
                  <div style={{ backgroundColor: '#CC0000', padding: '40px' }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#fff', fontWeight: 700, fontSize: '24px' }}>{s.name}</p>
                    <div style={{ height: '4px', width: '48px', backgroundColor: '#FFD700', margin: '16px 0' }} />
                    <p style={{ fontFamily: "'Inter', sans-serif", color: '#fff', fontSize: '18px', lineHeight: 1.5 }}>{s.message}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '32px' }}>House of Amistad | Caleigh Elliott 2026-2027</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

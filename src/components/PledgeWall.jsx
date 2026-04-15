import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase.js'
import { doc, setDoc, collection, addDoc, onSnapshot, query, orderBy, increment, serverTimestamp, limit } from 'firebase/firestore'
import { triggerShare } from '../utils/share.js'
import confetti from 'canvas-confetti'

function fireConfetti() { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }) }
function fireGoldConfetti() { confetti({ particleCount: 200, spread: 100, colors: ['#FFD700', '#CC0000', '#FFFFFF'] }) }

export default function PledgeWall() {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [pledgeCount, setPledgeCount] = useState(0)
  const [pledges, setPledges] = useState([])
  const [hasVoted, setHasVoted] = useState(() => localStorage.getItem('caleigh-pledged') === 'true')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const previousCount = useRef(0)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'pledges', 'counter'), (snap) => {
      const newCount = snap.data()?.count || 0
      if (previousCount.current < 50 && newCount >= 50) fireGoldConfetti()
      previousCount.current = newCount
      setPledgeCount(newCount)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'pledges', 'submissions', 'entries'), orderBy('timestamp', 'desc'), limit(50))
    const unsubscribe = onSnapshot(q, (snap) => setPledges(snap.docs.map((d) => d.data().name).filter(Boolean)))
    return () => unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'pledges', 'submissions', 'entries'), { name: trimmed, timestamp: serverTimestamp() })
      await setDoc(doc(db, 'pledges', 'counter'), { count: increment(1) }, { merge: true })
      localStorage.setItem('caleigh-pledged', 'true')
      setHasVoted(true)
      fireConfetti()
      setShowConfirmation(true)
      setName('')
    } catch (err) { console.error('Pledge failed:', err) }
    finally { setSubmitting(false) }
  }

  function handleShare() {
    triggerShare(`I just pledged my support for Caleigh Elliott as House Leader! Stand with her too. We are that house. \u{1F534}\u{26AA} ${window.location.origin}`)
  }

  const displayed = pledges.slice(0, 3)
  const others = pledgeCount - displayed.length
  const tickerText = displayed.length > 0 ? displayed.join(', ') + (others > 0 ? `, and ${others} others stand with Caleigh` : ' stand with Caleigh') : ''

  return (
    <section className="section section-white">
      <div className="contain center-text">
        <h2 className="heading-section" style={{ color: 'var(--red)' }}>Stand With Caleigh</h2>

        <div style={{ marginTop: '32px', marginBottom: '24px' }}>
          <div className="animate-pulse-glow" style={{ display: 'inline-block', padding: '16px 32px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(5rem, 15vw, 10rem)', lineHeight: 0.9, color: 'var(--red)' }}>
              {pledgeCount}
            </p>
          </div>
          <p style={{ color: 'var(--gray-400)', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '8px' }}>Pledges</p>
        </div>

        <div style={{ marginBottom: '48px' }}>
          {hasVoted ? (
            <button onClick={handleShare} className="btn btn-primary">Share the Movement {'\u{1F534}'}</button>
          ) : (
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '20px 48px' }}>
              I Stand With Caleigh {'\u{1F534}'}
            </button>
          )}
        </div>

        {pledgeCount >= 10 && (
          <div className="card-glass" style={{ maxWidth: '480px', margin: '0 auto 24px', background: 'var(--gold-dim)', border: 'none' }}>
            <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>The house is waking up.</p>
          </div>
        )}
        {pledgeCount >= 25 && (
          <p style={{ color: 'var(--red)', fontStyle: 'italic', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 24px' }}>
            &ldquo;Y&rsquo;all are showing out. This is exactly why I&rsquo;m fighting for this. Thank you.&rdquo; &mdash; Caleigh
          </p>
        )}
        {pledgeCount >= 50 && (
          <div style={{ background: 'var(--gold)', color: 'var(--red)', padding: '24px', marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>THE HOUSE IS UNITED.</p>
          </div>
        )}

        {pledges.length > 0 && (
          <div style={{ overflow: 'hidden', maxWidth: '600px', margin: '24px auto 0' }}>
            <div className="animate-ticker" style={{ whiteSpace: 'nowrap' }}>
              <span style={{ display: 'inline-block', padding: '0 16px', color: 'var(--gray-400)', fontSize: '0.95rem' }}>{tickerText}</span>
              <span style={{ display: 'inline-block', padding: '0 16px', color: 'var(--gray-400)', fontSize: '0.95rem' }}>{tickerText}</span>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setShowConfirmation(false) } }}
        >
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
            {showConfirmation ? (
              <div className="center-text">
                <p style={{ fontSize: '3rem', marginBottom: '12px' }}>{'\u{1F534}'}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)' }}>You&rsquo;re on the wall.</h3>
                <p style={{ color: 'var(--gray-400)', marginTop: '8px', marginBottom: '24px' }}>Now bring someone else.</p>
                <button onClick={() => { handleShare(); setShowModal(false); setShowConfirmation(false) }} className="btn btn-primary btn-full">Share With Your People</button>
                <button onClick={() => { setShowModal(false); setShowConfirmation(false) }} style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: 'var(--gray-400)', fontSize: '0.875rem', cursor: 'pointer' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="center-text">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)' }}>Add Your Name</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '4px', marginBottom: '20px' }}>Let Caleigh know you&rsquo;ve got her back.</p>
                <input type="text" placeholder="Your first name" value={name} onChange={(e) => setName(e.target.value)} className="input-light" autoFocus maxLength={30} />
                <button type="submit" disabled={!name.trim() || submitting} className="btn btn-primary btn-full" style={{ marginTop: '16px' }}>
                  {submitting ? 'Adding...' : 'I Stand With Caleigh \u{1F534}'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: 'var(--gray-400)', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

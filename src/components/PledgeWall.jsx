import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase.js'
import {
  doc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  increment,
  serverTimestamp,
  limit,
} from 'firebase/firestore'
import { triggerShare } from '../utils/share.js'
import confetti from 'canvas-confetti'

function fireConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
}

function fireGoldConfetti() {
  confetti({ particleCount: 200, spread: 100, colors: ['#FFD700', '#CC0000', '#FFFFFF'] })
}

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
    const counterRef = doc(db, 'pledges', 'counter')
    const unsubscribe = onSnapshot(counterRef, (snap) => {
      const data = snap.data()
      const newCount = data?.count || 0
      if (previousCount.current < 50 && newCount >= 50) fireGoldConfetti()
      previousCount.current = newCount
      setPledgeCount(newCount)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const submissionsRef = collection(db, 'pledges', 'submissions', 'entries')
    const q = query(submissionsRef, orderBy('timestamp', 'desc'), limit(50))
    const unsubscribe = onSnapshot(q, (snap) => {
      setPledges(snap.docs.map((d) => d.data().name).filter(Boolean))
    })
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
    } catch (err) {
      console.error('Pledge failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleShare() {
    triggerShare(`I just pledged my support for Caleigh Elliott as House Leader! Stand with her too. We are that house. \u{1F534}\u{26AA} ${window.location.origin}`)
  }

  const displayed = pledges.slice(0, 3)
  const others = pledgeCount - displayed.length
  const tickerText = displayed.length > 0
    ? displayed.join(', ') + (others > 0 ? `, and ${others} others stand with Caleigh` : ' stand with Caleigh')
    : ''

  return (
    <section className="section section-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="heading-section" style={{ color: 'var(--red)' }}>
          Stand With Caleigh
        </h2>

        {/* Counter */}
        <div className="mt-8 mb-6">
          <div className="animate-pulse-glow inline-block rounded-2xl px-8 py-4">
            <p
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(5rem, 15vw, 10rem)',
                lineHeight: 0.9,
                color: 'var(--red)',
              }}
            >
              {pledgeCount}
            </p>
          </div>
          <p style={{ color: 'var(--gray-400)', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '8px' }}>
            Pledges
          </p>
        </div>

        {/* CTA */}
        <div className="mb-12">
          {hasVoted ? (
            <button onClick={handleShare} className="btn btn-primary">Share the Movement {'\u{1F534}'}</button>
          ) : (
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '20px 48px' }}>
              I Stand With Caleigh {'\u{1F534}'}
            </button>
          )}
        </div>

        {/* Milestones */}
        {pledgeCount >= 10 && (
          <div className="card-glass max-w-md mx-auto mb-6" style={{ background: 'var(--gold-dim)', border: 'none' }}>
            <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>
              The house is waking up.
            </p>
          </div>
        )}
        {pledgeCount >= 25 && (
          <p className="max-w-md mx-auto mb-6" style={{ color: 'var(--red)', fontStyle: 'italic', fontSize: '1.125rem', lineHeight: 1.6 }}>
            &ldquo;Y&rsquo;all are showing out. This is exactly why I&rsquo;m fighting for this. Thank you.&rdquo; &mdash; Caleigh
          </p>
        )}
        {pledgeCount >= 50 && (
          <div className="mb-8" style={{ background: 'var(--gold)', color: 'var(--red)', padding: '24px', borderRadius: '16px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              THE HOUSE IS UNITED.
            </p>
          </div>
        )}

        {/* Ticker */}
        {pledges.length > 0 && (
          <div className="overflow-hidden max-w-2xl mx-auto mt-6">
            <div className="whitespace-nowrap animate-ticker">
              <span className="inline-block px-4" style={{ color: 'var(--gray-400)', fontSize: '0.95rem' }}>
                {tickerText}
              </span>
              <span className="inline-block px-4" style={{ color: 'var(--gray-400)', fontSize: '0.95rem' }}>
                {tickerText}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setShowConfirmation(false) } }}
        >
          <div className="card w-full max-w-sm animate-scale-in" style={{ padding: '32px' }}>
            {showConfirmation ? (
              <div className="text-center">
                <p style={{ fontSize: '3rem', marginBottom: '12px' }}>{'\u{1F534}'}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)' }}>
                  You&rsquo;re on the wall.
                </h3>
                <p style={{ color: 'var(--gray-400)', marginTop: '8px', marginBottom: '24px' }}>Now bring someone else.</p>
                <button onClick={() => { handleShare(); setShowModal(false); setShowConfirmation(false) }} className="btn btn-primary btn-full">
                  Share With Your People
                </button>
                <button onClick={() => { setShowModal(false); setShowConfirmation(false) }} className="block mx-auto mt-3 text-sm cursor-pointer" style={{ color: 'var(--gray-400)', background: 'none', border: 'none' }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-center" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)' }}>
                  Add Your Name
                </h3>
                <p className="text-center" style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '4px', marginBottom: '20px' }}>
                  Let Caleigh know you&rsquo;ve got her back.
                </p>
                <input
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-light"
                  autoFocus
                  maxLength={30}
                />
                <button type="submit" disabled={!name.trim() || submitting} className="btn btn-primary btn-full" style={{ marginTop: '16px' }}>
                  {submitting ? 'Adding...' : 'I Stand With Caleigh \u{1F534}'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="block mx-auto mt-3 text-sm cursor-pointer" style={{ color: 'var(--gray-400)', background: 'none', border: 'none' }}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

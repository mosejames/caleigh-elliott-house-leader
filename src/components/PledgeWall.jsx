import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase.js'
import {
  doc,
  getDoc,
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
  confetti({
    particleCount: 200,
    spread: 100,
    colors: ['#FFD700', '#CC0000', '#FFFFFF'],
  })
}

export default function PledgeWall() {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [pledgeCount, setPledgeCount] = useState(0)
  const [pledges, setPledges] = useState([])
  const [hasVoted, setHasVoted] = useState(
    () => localStorage.getItem('caleigh-pledged') === 'true'
  )
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const previousCount = useRef(0)

  // Real-time listener for pledge count
  useEffect(() => {
    const counterRef = doc(db, 'pledges', 'counter')
    const unsubscribe = onSnapshot(counterRef, (snap) => {
      const data = snap.data()
      const newCount = data?.count || 0
      // Fire gold confetti when crossing the 50 milestone
      if (previousCount.current < 50 && newCount >= 50) {
        fireGoldConfetti()
      }
      previousCount.current = newCount
      setPledgeCount(newCount)
    })
    return () => unsubscribe()
  }, [])

  // Real-time listener for pledge submissions
  useEffect(() => {
    const submissionsRef = collection(db, 'pledges', 'submissions', 'entries')
    const q = query(submissionsRef, orderBy('timestamp', 'desc'), limit(50))
    const unsubscribe = onSnapshot(q, (snap) => {
      const names = snap.docs.map((d) => d.data().name).filter(Boolean)
      setPledges(names)
    })
    return () => unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      // Add the pledge entry
      const submissionsRef = collection(db, 'pledges', 'submissions', 'entries')
      await addDoc(submissionsRef, {
        name: trimmed,
        timestamp: serverTimestamp(),
      })

      // Increment the counter (creates doc if it doesn't exist)
      const counterRef = doc(db, 'pledges', 'counter')
      await setDoc(counterRef, { count: increment(1) }, { merge: true })

      // Mark as voted
      localStorage.setItem('caleigh-pledged', 'true')
      setHasVoted(true)

      // Fire confetti
      fireConfetti()

      // Show confirmation
      setShowConfirmation(true)
      setName('')
    } catch (err) {
      console.error('Pledge failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleShare() {
    triggerShare(
      `I just pledged my support for Caleigh Elliott as House Leader! Stand with her too. We are that house. 🔴⚪ ${window.location.origin}`
    )
  }

  // Build the ticker text
  const displayedNames = pledges.slice(0, 3)
  const othersCount = pledgeCount - displayedNames.length
  let tickerText = ''
  if (displayedNames.length > 0) {
    tickerText =
      displayedNames.join(', ') +
      (othersCount > 0
        ? `, and ${othersCount} others stand with Caleigh`
        : ' stand with Caleigh')
  }

  // Shared inline style objects
  const primaryButtonStyle = {
    backgroundColor: '#CC0000',
    color: '#fff',
    padding: '16px 32px',
    borderRadius: '9999px',
    fontWeight: 700,
    fontSize: '18px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  }

  const inputStyle = {
    border: inputFocused ? '2px solid #CC0000' : '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '14px 18px',
    width: '100%',
    fontSize: '18px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  }

  return (
    <section
      className="px-8 py-24"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Section Header */}
      <h2
        className="text-4xl md:text-5xl font-bold text-center mb-8"
        style={{ color: '#CC0000', fontFamily: "'Montserrat', sans-serif" }}
      >
        Stand With Caleigh
      </h2>

      {/* Animated Counter */}
      <div className="flex justify-center mb-10">
        <div className="animate-pulse-glow rounded-2xl px-10 py-6 inline-block">
          <p
            className="text-center tabular-nums"
            style={{
              color: '#CC0000',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(4rem, 10vw, 8rem)',
              lineHeight: 1,
            }}
          >
            {pledgeCount}
          </p>
          <p
            className="text-center mt-2"
            style={{
              color: '#9ca3af',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
            }}
          >
            PLEDGES
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mb-12">
        {hasVoted ? (
          <button
            onClick={handleShare}
            className="hover:scale-105 transition-transform"
            style={primaryButtonStyle}
          >
            Share the Movement 🔴
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="hover:scale-105 transition-transform"
            style={primaryButtonStyle}
          >
            I Stand With Caleigh 🔴
          </button>
        )}
      </div>

      {/* Milestone Banners */}
      {pledgeCount >= 10 && (
        <div className="max-w-xl mx-auto mb-6 animate-fade-in-up">
          <div
            className="text-xl font-bold text-center"
            style={{
              backgroundColor: 'rgba(255, 215, 0, 0.15)',
              color: '#FFD700',
              padding: '16px',
              borderRadius: '12px',
            }}
          >
            The house is waking up.
          </div>
        </div>
      )}

      {pledgeCount >= 25 && (
        <div className="max-w-xl mx-auto mb-6 animate-fade-in-up">
          <p
            className="text-center text-lg px-4"
            style={{ color: '#CC0000', fontStyle: 'italic', fontFamily: "'Inter', sans-serif" }}
          >
            &ldquo;Y&rsquo;all are showing out. This is exactly why I&rsquo;m
            fighting for this. Thank you.&rdquo; &mdash; Caleigh
          </p>
        </div>
      )}

      {pledgeCount >= 50 && (
        <div className="w-full mb-8 animate-fade-in-up">
          <div
            className="text-3xl font-black text-center"
            style={{
              backgroundColor: '#FFD700',
              color: '#CC0000',
              padding: '24px',
              borderRadius: '12px',
            }}
          >
            THE HOUSE IS UNITED.
          </div>
        </div>
      )}

      {/* Live Scrolling Ticker */}
      {pledges.length > 0 && (
        <div className="overflow-hidden max-w-3xl mx-auto mt-8">
          <div className="whitespace-nowrap animate-ticker">
            <span
              className="inline-block text-lg px-4"
              style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}
            >
              {tickerText}
            </span>
            {/* Duplicate for seamless loop */}
            <span
              className="inline-block text-lg px-4"
              style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}
            >
              {tickerText}
            </span>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
              setShowConfirmation(false)
            }
          }}
        >
          <div
            className="rounded-2xl p-8 max-w-sm mx-4 animate-fade-in-up"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {showConfirmation ? (
              <div className="text-center">
                <p className="text-4xl mb-4">🔴</p>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: '#CC0000', fontFamily: "'Montserrat', sans-serif" }}
                >
                  You&rsquo;re on the wall.
                </h3>
                <p
                  className="mb-6"
                  style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}
                >
                  Now bring someone else.
                </p>
                <button
                  onClick={() => {
                    handleShare()
                    setShowModal(false)
                    setShowConfirmation(false)
                  }}
                  className="w-full hover:scale-105 transition-transform"
                  style={{
                    ...primaryButtonStyle,
                    width: '100%',
                  }}
                >
                  Share With Your People
                </button>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setShowConfirmation(false)
                  }}
                  className="mt-3 text-gray-400 text-sm cursor-pointer hover:text-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  className="text-2xl font-bold mb-2 text-center"
                  style={{ color: '#CC0000', fontFamily: "'Montserrat', sans-serif" }}
                >
                  Add Your Name
                </h3>
                <p
                  className="text-center mb-6"
                  style={{ color: '#9ca3af', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem' }}
                >
                  Let Caleigh know you&rsquo;ve got her back.
                </p>
                <input
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  style={inputStyle}
                  autoFocus
                  maxLength={30}
                />
                <button
                  type="submit"
                  disabled={!name.trim() || submitting}
                  className="mt-4 w-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    ...primaryButtonStyle,
                    width: '100%',
                    opacity: (!name.trim() || submitting) ? 0.5 : 1,
                  }}
                >
                  {submitting ? 'Adding...' : 'I Stand With Caleigh 🔴'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 text-gray-400 text-sm cursor-pointer hover:text-gray-600 transition-colors w-full text-center"
                >
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

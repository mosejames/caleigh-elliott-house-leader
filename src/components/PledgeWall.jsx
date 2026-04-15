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

  return (
    <section className="bg-white px-6 py-20">
      {/* Section Header */}
      <h2 className="text-red-brand font-heading text-3xl md:text-4xl font-bold text-center mb-8">
        Stand With Caleigh
      </h2>

      {/* Animated Counter */}
      <div className="flex justify-center mb-10">
        <div className="animate-pulse-glow rounded-2xl px-10 py-6 inline-block">
          <p className="text-6xl md:text-8xl font-heading font-black text-red-brand text-center tabular-nums">
            {pledgeCount}
          </p>
          <p className="text-center text-gray-500 font-body text-sm mt-2 uppercase tracking-widest">
            Pledges
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mb-12">
        {hasVoted ? (
          <button
            onClick={handleShare}
            className="bg-red-brand text-white px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform cursor-pointer"
          >
            Share the Movement 🔴
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-brand text-white px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform cursor-pointer"
          >
            I Stand With Caleigh 🔴
          </button>
        )}
      </div>

      {/* Milestone Banners */}
      {pledgeCount >= 10 && (
        <div className="max-w-xl mx-auto mb-6 animate-fade-in-up">
          <div className="bg-gold-accent/20 text-gold-accent p-4 rounded-xl text-xl font-bold text-center">
            The house is waking up.
          </div>
        </div>
      )}

      {pledgeCount >= 25 && (
        <div className="max-w-xl mx-auto mb-6 animate-fade-in-up">
          <p className="italic text-red-brand text-center text-lg px-4">
            &ldquo;Y&rsquo;all are showing out. This is exactly why I&rsquo;m
            fighting for this. Thank you.&rdquo; &mdash; Caleigh
          </p>
        </div>
      )}

      {pledgeCount >= 50 && (
        <div className="w-full mb-8 animate-fade-in-up">
          <div className="bg-gold-accent text-red-brand p-6 text-3xl font-black text-center rounded-xl">
            THE HOUSE IS UNITED.
          </div>
        </div>
      )}

      {/* Live Scrolling Ticker */}
      {pledges.length > 0 && (
        <div className="overflow-hidden max-w-3xl mx-auto mt-8">
          <div className="whitespace-nowrap animate-ticker">
            <span className="inline-block text-gray-600 font-body text-lg px-4">
              {tickerText}
            </span>
            {/* Duplicate for seamless loop */}
            <span className="inline-block text-gray-600 font-body text-lg px-4">
              {tickerText}
            </span>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
              setShowConfirmation(false)
            }
          }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 animate-fade-in-up">
            {showConfirmation ? (
              <div className="text-center">
                <p className="text-4xl mb-4">🔴</p>
                <h3 className="font-heading text-2xl font-bold text-red-brand mb-2">
                  You&rsquo;re on the wall.
                </h3>
                <p className="text-gray-600 font-body mb-6">
                  Now bring someone else.
                </p>
                <button
                  onClick={() => {
                    handleShare()
                    setShowModal(false)
                    setShowConfirmation(false)
                  }}
                  className="bg-red-brand text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform w-full cursor-pointer"
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
                <h3 className="font-heading text-2xl font-bold text-red-brand mb-2 text-center">
                  Add Your Name
                </h3>
                <p className="text-gray-500 font-body text-center mb-6 text-sm">
                  Let Caleigh know you&rsquo;ve got her back.
                </p>
                <input
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-gray-200 focus:border-red-brand rounded-xl px-4 py-3 w-full text-lg outline-none transition-colors font-body"
                  autoFocus
                  maxLength={30}
                />
                <button
                  type="submit"
                  disabled={!name.trim() || submitting}
                  className="mt-4 bg-red-brand text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform w-full disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
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

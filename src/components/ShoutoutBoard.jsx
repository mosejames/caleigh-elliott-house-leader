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
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setShoutouts(docs)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || submitting) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'shoutouts'), {
        name: name.trim(),
        message: message.trim(),
        timestamp: serverTimestamp(),
      })
      setName('')
      setMessage('')
    } catch (err) {
      console.error('Error posting shoutout:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleShare = useCallback(async (id) => {
    const el = shareRefs.current[id]
    if (!el) return
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 2,
      })
      canvas.toBlob(async (blob) => {
        if (blob) {
          await shareImage(blob, 'shoutout.png')
        }
      }, 'image/png')
    } catch (err) {
      console.error('Error sharing shoutout:', err)
    }
  }, [])

  return (
    <section className="bg-red-brand px-6 py-20">
      <h2 className="text-white font-heading text-3xl md:text-4xl font-bold text-center">
        Show Love
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="bg-white/10 border-2 border-white/30 text-white placeholder-white/50 rounded-xl px-4 py-3 w-full focus:outline-none focus:border-white/60"
        />
        <div>
          <textarea
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= 140) setMessage(e.target.value)
            }}
            placeholder="Show some love (140 chars max)"
            rows={3}
            className="bg-white/10 border-2 border-white/30 text-white placeholder-white/50 rounded-xl px-4 py-3 w-full resize-none focus:outline-none focus:border-white/60"
          />
          <p className="text-white/50 text-sm text-right mt-1">
            {message.length}/140
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting || !name.trim() || !message.trim()}
          className="bg-white text-red-brand px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 w-full"
        >
          {submitting ? 'Posting...' : 'Post Your Shoutout'}
        </button>
      </form>

      {/* Shoutout Cards Grid */}
      {shoutouts.length > 0 && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {shoutouts.map((shoutout) => (
            <div key={shoutout.id}>
              {/* Visible card */}
              <div className="bg-white rounded-2xl p-6 text-left shadow-lg">
                <p className="text-red-brand font-bold text-lg">{shoutout.name}</p>
                <p className="text-gray-700 mt-2">{shoutout.message}</p>
                <button
                  onClick={() => handleShare(shoutout.id)}
                  className="text-sm text-red-brand font-bold hover:underline mt-4 inline-block"
                >
                  Share this
                </button>
              </div>

              {/* Hidden shareable version for html2canvas */}
              <div
                ref={(el) => {
                  if (el) {
                    shareRefs.current[shoutout.id] = el
                  } else {
                    delete shareRefs.current[shoutout.id]
                  }
                }}
                style={{ position: 'absolute', left: '-9999px' }}
                className="w-[600px]"
              >
                <div className="bg-red-brand p-8" style={{ backgroundColor: '#CC0000' }}>
                  <p
                    className="text-white font-bold text-2xl"
                    style={{ fontFamily: "'Montserrat', sans-serif", color: '#ffffff', fontWeight: 700, fontSize: '24px' }}
                  >
                    {shoutout.name}
                  </p>
                  <div
                    className="h-1 bg-gold-accent w-16 my-4"
                    style={{ height: '4px', width: '64px', backgroundColor: '#FFD700', margin: '16px 0' }}
                  />
                  <p
                    className="text-white text-lg"
                    style={{ fontFamily: "'Inter', sans-serif", color: '#ffffff', fontSize: '18px' }}
                  >
                    {shoutout.message}
                  </p>
                  <p
                    className="text-white/70 text-sm mt-6"
                    style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '24px' }}
                  >
                    House of Amistad | Caleigh Elliott 2026-2027
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

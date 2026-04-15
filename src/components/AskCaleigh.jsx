import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

export default function AskCaleigh() {
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [answered, setAnswered] = useState([])

  useEffect(() => {
    const q = query(
      collection(db, 'questions'),
      where('status', '==', 'answered'),
      orderBy('timestamp', 'desc')
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setAnswered(docs)
    })
    return unsubscribe
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !question.trim()) return

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'questions'), {
        name: name.trim(),
        question: question.trim(),
        answer: '',
        status: 'unanswered',
        timestamp: serverTimestamp(),
      })
      setName('')
      setQuestion('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error('Error submitting question:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    backgroundColor: 'rgba(255,255,255,0.15)',
    border: '2px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '12px',
    padding: '14px 18px',
    width: '100%',
    fontSize: '16px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  }

  return (
    <section className="px-8 py-24" style={{ backgroundColor: '#CC0000' }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-bold"
          style={{ color: '#fff', fontFamily: "'Montserrat', sans-serif" }}
        >
          Ask Caleigh Anything
        </h2>
        <p
          className="text-lg mt-3"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          She actually reads these. She actually answers.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="placeholder-white/50"
            style={inputStyle}
            required
          />
          <textarea
            placeholder="What do you want to know?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="placeholder-white/50"
            style={{ ...inputStyle, resize: 'none' }}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            style={{
              backgroundColor: '#fff',
              color: '#CC0000',
              padding: '14px 28px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {submitting ? 'Sending...' : 'Submit Question'}
          </button>
          {submitted && (
            <p className="font-bold mt-2" style={{ color: '#FFD700' }}>
              Question submitted! Stay tuned for Caleigh's answer.
            </p>
          )}
        </form>

        {answered.length > 0 && (
          <div className="mt-16 space-y-6">
            {answered.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-sm text-left"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <p className="font-bold text-lg" style={{ color: '#fff' }}>
                  Q: {item.question}
                </p>
                <p className="italic mt-3" style={{ color: '#FFD700' }}>
                  A: {item.answer}
                </p>
                <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Asked by {item.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore'

export default function AskCaleigh() {
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [answered, setAnswered] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'questions'), where('status', '==', 'answered'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAnswered(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !question.trim()) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'questions'), { name: name.trim(), question: question.trim(), answer: '', status: 'unanswered', timestamp: serverTimestamp() })
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

  return (
    <section className="section section-red relative grain">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="heading-section" style={{ color: 'var(--white)' }}>
          Ask Caleigh Anything
        </h2>
        <p style={{ color: 'var(--white-muted)', fontSize: '1.1rem', marginTop: '12px' }}>
          She actually reads these. She actually answers.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-dark"
          />
          <textarea
            placeholder="What do you want to know?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="input-dark"
            style={{ resize: 'none' }}
          />
          <button type="submit" disabled={submitting} className="btn btn-white">
            {submitting ? 'Sending...' : 'Submit Question'}
          </button>
          {submitted && (
            <p style={{ color: 'var(--gold)', fontWeight: 700, marginTop: '8px' }}>
              Question submitted! Stay tuned.
            </p>
          )}
        </form>

        {/* Answered Q&A */}
        {answered.length > 0 && (
          <div className="mt-16 space-y-6 text-left">
            {answered.map((item) => (
              <div key={item.id} className="card-glass">
                <p style={{ color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
                  Q: {item.question}
                </p>
                <p style={{ color: 'var(--gold)', fontStyle: 'italic', marginTop: '12px', lineHeight: 1.6 }}>
                  A: {item.answer}
                </p>
                <p style={{ color: 'var(--white-muted)', fontSize: '0.8rem', marginTop: '12px' }}>
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

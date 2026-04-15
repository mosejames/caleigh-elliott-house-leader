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
    const unsubscribe = onSnapshot(q, (snap) => setAnswered(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
    return unsubscribe
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !question.trim()) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'questions'), { name: name.trim(), question: question.trim(), answer: '', status: 'unanswered', timestamp: serverTimestamp() })
      setName(''); setQuestion(''); setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) { console.error('Error submitting question:', err) }
    finally { setSubmitting(false) }
  }

  return (
    <section className="section section-red grain" style={{ position: 'relative' }}>
      <div className="contain center-text">
        <h2 className="heading-section" style={{ color: 'var(--white)' }}>Ask Caleigh Anything</h2>
        <p style={{ color: 'var(--white-muted)', fontSize: '1.1rem', marginTop: '12px' }}>She actually reads these. She actually answers.</p>

        <form onSubmit={handleSubmit} className="contain-sm space-y" style={{ marginTop: '40px' }}>
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="input-dark" />
          <textarea placeholder="What do you want to know?" value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} className="input-dark" style={{ resize: 'none' }} />
          <button type="submit" disabled={submitting} className="btn btn-white">
            {submitting ? 'Sending...' : 'Submit Question'}
          </button>
          {submitted && <p style={{ color: 'var(--gold)', fontWeight: 700, marginTop: '8px' }}>Question submitted! Stay tuned.</p>}
        </form>

        {answered.length > 0 && (
          <div className="space-y-lg" style={{ marginTop: '64px', textAlign: 'left' }}>
            {answered.map((item) => (
              <div key={item.id} className="card-glass">
                <p style={{ color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>Q: {item.question}</p>
                <p style={{ color: 'var(--gold)', fontStyle: 'italic', marginTop: '12px', lineHeight: 1.6 }}>A: {item.answer}</p>
                <p style={{ color: 'var(--white-muted)', fontSize: '0.8rem', marginTop: '12px' }}>Asked by {item.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

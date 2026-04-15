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

  return (
    <section className="bg-red-brand px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-white font-heading text-3xl md:text-4xl font-bold">
          Ask Caleigh Anything
        </h2>
        <p className="text-white/70 text-lg mt-2">
          She actually reads these. She actually answers.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 border-2 border-white/30 text-white placeholder-white/50 rounded-xl px-4 py-3 w-full outline-none focus:border-gold-accent transition-colors"
            required
          />
          <textarea
            placeholder="What do you want to know?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="bg-white/10 border-2 border-white/30 text-white placeholder-white/50 rounded-xl px-4 py-3 w-full outline-none focus:border-gold-accent transition-colors resize-none"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-white text-red-brand px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            {submitting ? 'Sending...' : 'Submit Question'}
          </button>
          {submitted && (
            <p className="text-gold-accent font-bold mt-2">
              Question submitted! Stay tuned for Caleigh's answer.
            </p>
          )}
        </form>

        {answered.length > 0 && (
          <div className="mt-12 space-y-6">
            {answered.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm text-left"
              >
                <p className="text-white font-bold text-lg">
                  Q: {item.question}
                </p>
                <p className="text-gold-accent italic mt-2">
                  A: {item.answer}
                </p>
                <p className="text-white/50 text-sm mt-2">
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

import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
} from 'firebase/firestore'

const PASSWORD = 'amistad2027'

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [unanswered, setUnanswered] = useState([])
  const [answeredList, setAnsweredList] = useState([])
  const [answers, setAnswers] = useState({})
  const [publishing, setPublishing] = useState({})

  function handleLogin(e) {
    e.preventDefault()
    if (passwordInput === PASSWORD) {
      setAuthenticated(true)
      setError('')
    } else {
      setError('Wrong password')
    }
  }

  useEffect(() => {
    if (!authenticated) return

    const unansweredQuery = query(
      collection(db, 'questions'),
      where('status', '==', 'unanswered'),
      orderBy('timestamp', 'asc')
    )
    const unsubUnanswered = onSnapshot(unansweredQuery, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setUnanswered(docs)
    })

    const answeredQuery = query(
      collection(db, 'questions'),
      where('status', '==', 'answered'),
      orderBy('timestamp', 'desc')
    )
    const unsubAnswered = onSnapshot(answeredQuery, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setAnsweredList(docs)
    })

    return () => {
      unsubUnanswered()
      unsubAnswered()
    }
  }, [authenticated])

  async function handlePublish(questionId) {
    const answerText = answers[questionId]
    if (!answerText || !answerText.trim()) return

    setPublishing((prev) => ({ ...prev, [questionId]: true }))
    try {
      await updateDoc(doc(db, 'questions', questionId), {
        answer: answerText.trim(),
        status: 'answered',
      })
      setAnswers((prev) => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
    } catch (err) {
      console.error('Error publishing answer:', err)
    } finally {
      setPublishing((prev) => ({ ...prev, [questionId]: false }))
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <form onSubmit={handleLogin} className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 outline-none focus:border-red-brand"
          />
          <br />
          <button
            type="submit"
            className="bg-red-brand text-white px-6 py-2 rounded-lg font-bold cursor-pointer"
          >
            Enter
          </button>
          {error && <p className="text-red-600 font-bold">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin — Q&A Management</h1>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          Unanswered ({unanswered.length})
        </h2>
        {unanswered.length === 0 && (
          <p className="text-gray-500">No unanswered questions right now.</p>
        )}
        {unanswered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm border mb-4"
          >
            <p className="text-sm text-gray-500 mb-1">From: {item.name}</p>
            <p className="font-bold mb-3">{item.question}</p>
            <textarea
              placeholder="Type your answer..."
              value={answers[item.id] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))
              }
              rows={3}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-red-brand resize-none mb-2"
            />
            <button
              onClick={() => handlePublish(item.id)}
              disabled={publishing[item.id] || !answers[item.id]?.trim()}
              className="bg-red-brand text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 cursor-pointer"
            >
              {publishing[item.id] ? 'Publishing...' : 'Publish Answer'}
            </button>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">
          Answered ({answeredList.length})
        </h2>
        {answeredList.length === 0 && (
          <p className="text-gray-500">No answered questions yet.</p>
        )}
        {answeredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm border mb-4"
          >
            <p className="text-sm text-gray-500 mb-1">From: {item.name}</p>
            <p className="font-bold">{item.question}</p>
            <p className="text-gray-700 mt-2 italic">{item.answer}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

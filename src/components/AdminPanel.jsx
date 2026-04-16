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

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [tab, setTab] = useState('qa')

  async function handleLogin(e) {
    e.preventDefault()
    if (!passwordInput) return
    setLoggingIn(true)
    setError('')
    try {
      const res = await fetch('/api/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
      setPassword(passwordInput)
      setAuthenticated(true)
      setPasswordInput('')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoggingIn(false)
    }
  }

  function signOut() {
    setAuthenticated(false)
    setPassword('')
    setError('')
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)' }}>
        <form onSubmit={handleLogin} style={{ textAlign: 'center', maxWidth: '320px', padding: '0 24px', width: '100%' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', marginBottom: '20px', color: 'var(--gray-800)' }}>
            Admin Login
          </h1>
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="input-light"
            autoFocus
          />
          <button type="submit" disabled={loggingIn || !passwordInput} className="btn btn-primary btn-full" style={{ marginTop: '16px' }}>
            {loggingIn ? 'Checking…' : 'Enter'}
          </button>
          {error && <p style={{ color: 'var(--red)', fontWeight: 600, marginTop: '12px', fontSize: '0.9rem' }}>{error}</p>}
        </form>
      </div>
    )
  }

  const TABS = [
    { id: 'qa', label: 'Q & A' },
    { id: 'shoutouts', label: 'Shoutouts' },
    { id: 'photos', label: 'Photos' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-100)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', color: 'var(--red)' }}>
            Admin
          </h1>
          <button onClick={signOut} style={{ background: 'transparent', border: 'none', color: 'var(--gray-600)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid var(--gray-200)', overflowX: 'auto' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '12px 20px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                color: tab === t.id ? 'var(--red)' : 'var(--gray-400)',
                borderBottom: tab === t.id ? '2px solid var(--red)' : '2px solid transparent',
                marginBottom: '-2px',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'qa' && <QATab password={password} onAuthFail={signOut} />}
        {tab === 'shoutouts' && <ShoutoutsTab password={password} onAuthFail={signOut} />}
        {tab === 'photos' && <PhotosTab password={password} onAuthFail={signOut} />}
      </div>
    </div>
  )
}

/* ── Shared delete helper ── */
async function serverDelete({ password, collection, id, onAuthFail }) {
  const res = await fetch('/api/admin-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, collection, id }),
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    onAuthFail?.()
    throw new Error('Session expired. Please log in again.')
  }
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`)
  }
  return data
}

/* ── Q & A ── */
function QATab({ password, onAuthFail }) {
  const [unanswered, setUnanswered] = useState([])
  const [answeredList, setAnsweredList] = useState([])
  const [answers, setAnswers] = useState({})
  const [busy, setBusy] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubs = []
    unsubs.push(onSnapshot(
      query(collection(db, 'questions'), where('status', '==', 'unanswered'), orderBy('timestamp', 'asc')),
      (snap) => setUnanswered(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    ))
    unsubs.push(onSnapshot(
      query(collection(db, 'questions'), where('status', '==', 'answered'), orderBy('timestamp', 'desc')),
      (snap) => setAnsweredList(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    ))
    return () => unsubs.forEach((u) => u())
  }, [])

  async function publish(id) {
    const text = answers[id]
    if (!text?.trim()) return
    setBusy((p) => ({ ...p, [id]: true }))
    setError('')
    try {
      await updateDoc(doc(db, 'questions', id), { answer: text.trim(), status: 'answered' })
      setAnswers((p) => { const n = { ...p }; delete n[id]; return n })
    } catch (e) { setError(e.message) }
    finally { setBusy((p) => ({ ...p, [id]: false })) }
  }

  async function remove(id) {
    if (!confirm('Delete this question?')) return
    setError('')
    try {
      await serverDelete({ password, collection: 'questions', id, onAuthFail })
    } catch (e) { setError(e.message) }
  }

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <Section title={`Unanswered (${unanswered.length})`}>
        {unanswered.length === 0 && <EmptyState>No unanswered questions.</EmptyState>}
        {unanswered.map((item) => (
          <Card key={item.id}>
            <Meta>From: {item.name}</Meta>
            <p style={{ fontWeight: 700, marginBottom: '12px' }}>{item.question}</p>
            <textarea
              placeholder="Type your answer..."
              value={answers[item.id] || ''}
              onChange={(e) => setAnswers((p) => ({ ...p, [item.id]: e.target.value }))}
              rows={3}
              className="input-light"
              style={{ resize: 'none', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => publish(item.id)}
                disabled={busy[item.id] || !answers[item.id]?.trim()}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '12px 20px' }}
              >
                {busy[item.id] ? 'Publishing…' : 'Publish Answer'}
              </button>
              <button onClick={() => remove(item.id)} className="btn" style={{ background: 'var(--gray-200)', color: 'var(--gray-800)', fontSize: '0.9rem', padding: '12px 20px' }}>
                Delete
              </button>
            </div>
          </Card>
        ))}
      </Section>

      <Section title={`Answered (${answeredList.length})`}>
        {answeredList.length === 0 && <EmptyState>No answered questions yet.</EmptyState>}
        {answeredList.map((item) => (
          <Card key={item.id}>
            <Meta>From: {item.name}</Meta>
            <p style={{ fontWeight: 700 }}>{item.question}</p>
            <p style={{ color: 'var(--gray-600)', marginTop: '8px', fontStyle: 'italic' }}>{item.answer}</p>
            <button onClick={() => remove(item.id)} className="btn" style={{ marginTop: '12px', background: 'var(--gray-200)', color: 'var(--gray-800)', fontSize: '0.85rem', padding: '10px 18px' }}>
              Delete
            </button>
          </Card>
        ))}
      </Section>
    </>
  )
}

/* ── Shoutouts ── */
function ShoutoutsTab({ password, onAuthFail }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'shoutouts'), orderBy('timestamp', 'desc')),
      (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  async function remove(id) {
    if (!confirm('Delete this shoutout?')) return
    setError('')
    try {
      await serverDelete({ password, collection: 'shoutouts', id, onAuthFail })
    } catch (e) { setError(e.message) }
  }

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <Section title={`All Shoutouts (${items.length})`}>
        {items.length === 0 && <EmptyState>No shoutouts yet.</EmptyState>}
        {items.map((item) => (
          <Card key={item.id}>
            <Meta>{item.name}</Meta>
            <p style={{ color: 'var(--gray-800)' }}>{item.message}</p>
            <button onClick={() => remove(item.id)} className="btn" style={{ marginTop: '12px', background: 'var(--gray-200)', color: 'var(--gray-800)', fontSize: '0.85rem', padding: '10px 18px' }}>
              Delete
            </button>
          </Card>
        ))}
      </Section>
    </>
  )
}

/* ── Photos ── */
function PhotosTab({ password, onAuthFail }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'photos'), orderBy('timestamp', 'desc')),
      (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  async function remove(id) {
    if (!confirm('Delete this photo? (Removes from the feed; the storage file stays.)')) return
    setError('')
    try {
      await serverDelete({ password, collection: 'photos', id, onAuthFail })
    } catch (e) { setError(e.message) }
  }

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <Section title={`All Photos (${items.length})`}>
        {items.length === 0 && <EmptyState>No photos yet.</EmptyState>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: 'var(--white)', padding: '12px' }}>
              <img src={item.storageUrl} alt={item.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', marginBottom: '10px' }} />
              <Meta>{item.name}</Meta>
              <button onClick={() => remove(item.id)} className="btn btn-full" style={{ background: 'var(--gray-200)', color: 'var(--gray-800)', fontSize: '0.8rem', padding: '8px 12px', marginTop: '8px' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

/* ── Primitives ── */
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '40px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '16px', color: 'var(--gray-800)' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Card({ children }) {
  return (
    <div style={{ background: 'var(--white)', padding: '20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {children}
    </div>
  )
}

function Meta({ children }) {
  return (
    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', marginBottom: '6px' }}>
      {children}
    </p>
  )
}

function EmptyState({ children }) {
  return <p style={{ color: 'var(--gray-400)' }}>{children}</p>
}

function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', borderLeft: '4px solid #991B1B' }}>
      {message}
    </div>
  )
}

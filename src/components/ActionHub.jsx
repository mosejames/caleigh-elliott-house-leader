import { useState, useEffect, useRef } from 'react'
import { db, storage } from '../firebase.js'
import { doc, setDoc, collection, addDoc, onSnapshot, query, orderBy, where, increment, serverTimestamp, limit } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { triggerShare } from '../utils/share.js'
import confetti from 'canvas-confetti'
import Family from './Family.jsx'

const ACTIONS = [
  { id: 'shoutout', icon: ShoutoutIcon, label: 'Send Me a Note', sub: 'Drop a kind word' },
  { id: 'photo', icon: PhotoIcon, label: 'Post a Pic', sub: 'Share a pic with me' },
]

export default function ActionHub() {
  const [active, setActive] = useState(null)

  return (
    <section className="section" style={{ background: 'var(--gray-100)' }}>
      <div className="contain center-text">
        <h2 className="heading-section" style={{ color: 'var(--red)' }}>Help Me Out?</h2>
        <p style={{ color: 'var(--gray-600)', marginTop: '12px', fontSize: '1rem', maxWidth: '520px', margin: '12px auto 0' }}>
          A kind word or a pic would mean a lot. No pressure &#x1F49B;
        </p>

        {/* Photo + Shoutout tiles */}
        <div className="grid-2" style={{ marginTop: '36px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
          {ACTIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => setActive(a.id)}
              style={{
                background: 'var(--red)',
                color: 'var(--white)',
                border: 'none',
                padding: '28px 20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 10px 28px rgba(204, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(204, 0, 0, 0.38), 0 4px 12px rgba(0, 0, 0, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(204, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.08)'
              }}
            >
              <a.icon />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {a.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.78)', marginTop: '-2px' }}>
                {a.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <Modal onClose={() => setActive(null)}>
          {active === 'pledge' && <PledgeModal onClose={() => setActive(null)} />}
          {active === 'shoutout' && <ShoutoutModal onClose={() => setActive(null)} />}
          {active === 'photo' && <PhotoModal onClose={() => setActive(null)} />}
          {active === 'qa' && <QAModal onClose={() => setActive(null)} />}
        </Modal>
      )}
    </section>
  )
}

/* ── Icons ── */
function PledgeIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function ShoutoutIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function PhotoIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="0" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}
function QAIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

/* ── Modal Shell ── */
function Modal({ children, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="animate-scale-in" style={{ background: 'var(--white)', width: '100%', maxWidth: '440px', maxHeight: '85dvh', overflow: 'auto', padding: '32px' }}>
        <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--gray-400)', lineHeight: 1 }}>&times;</button>
        <div style={{ clear: 'both' }}>{children}</div>
      </div>
    </div>
  )
}

/* ── Success Screen (shared) ── */
function SuccessScreen({ emoji, title, subtitle, shareText, onClose }) {
  return (
    <div className="center-text">
      <div style={{ fontSize: '4rem', lineHeight: 1 }}>{emoji}</div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)', marginTop: '12px' }}>{title}</p>
      <p style={{ color: 'var(--gray-400)', marginTop: '8px', fontSize: '0.95rem' }}>{subtitle}</p>
      <button onClick={() => { triggerShare(shareText + ' ' + window.location.origin); onClose() }} className="btn btn-primary btn-full" style={{ marginTop: '24px' }}>
        Share It
      </button>
      <button onClick={onClose} style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: 'var(--gray-400)', fontSize: '0.875rem', cursor: 'pointer' }}>
        Done
      </button>
    </div>
  )
}

/* ── Error Banner ── */
function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <p style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', fontSize: '0.875rem', fontWeight: 600, marginTop: '12px' }}>
      {message}
    </p>
  )
}

/* ── Pledge Modal ── */
function PledgeModal({ onClose }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(() => localStorage.getItem('caleigh-pledged') === 'true')
  const [error, setError] = useState('')
  const [count, setCount] = useState(0)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'pledges', 'counter'), (snap) => setCount(snap.data()?.count || 0))
    return unsub
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (!name.trim() || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'pledges', 'submissions', 'entries'), { name: name.trim(), timestamp: serverTimestamp() })
      await setDoc(doc(db, 'pledges', 'counter'), { count: increment(1) }, { merge: true })
      localStorage.setItem('caleigh-pledged', 'true')
      setDone(true)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    } catch (err) { setError('Something went wrong. Try again.'); console.error(err) }
    finally { setSubmitting(false) }
  }

  if (done) {
    return <SuccessScreen emoji={'\u2705'} title="You're on the wall!" subtitle={`${count} people stand with Caleigh. Now bring someone else.`} shareText="I pledged for Caleigh Elliott as House Leader! Stand with her too. \u{1F534}\u{26AA}" onClose={onClose} />
  }

  return (
    <form onSubmit={submit} className="center-text">
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)' }}>Pledge Your Vote</p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '3rem', color: 'var(--red)', marginTop: '8px' }}>{count}</p>
      <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>Pledges so far</p>
      <input type="text" placeholder="Your first name" value={name} onChange={(e) => setName(e.target.value)} className="input-light" autoFocus maxLength={30} />
      <ErrorBanner message={error} />
      <button type="submit" disabled={!name.trim() || submitting} className="btn btn-primary btn-full" style={{ marginTop: '16px' }}>
        {submitting ? 'Adding...' : 'I Stand With Caleigh'}
      </button>
    </form>
  )
}

/* ── Shoutout Modal ── */
function ShoutoutModal({ onClose }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim() || submitting) return
    setSubmitting(true)
    setError('')
    try {
      // AI moderation first — keeps bad content out of Firestore
      const modRes = await fetch('/api/moderate-shoutout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      })
      const mod = await modRes.json().catch(() => ({}))
      if (mod?.decision === 'reject') {
        setError(mod.rephrase_hint || "That doesn't quite fit the vibe — try rephrasing?")
        setSubmitting(false)
        return
      }

      await addDoc(collection(db, 'shoutouts'), { name: name.trim(), message: message.trim(), timestamp: serverTimestamp() })
      setDone(true)
    } catch (err) { setError('Something went wrong. Try again.'); console.error(err) }
    finally { setSubmitting(false) }
  }

  if (done) {
    return <SuccessScreen emoji={'\u{1F49B}'} title="Got it \u2014 thank you!" subtitle={<>Your note is on the wall. House of Amistad is <Family />.</>} shareText="Sent Caleigh some love for Amistad House Leader \u{1F534}\u{26AA}" onClose={onClose} />
  }

  return (
    <form onSubmit={submit}>
      <p className="center-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)', marginBottom: '20px' }}>Send Me a Note</p>
      <div className="space-y">
        <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="input-light" />
        <div>
          <textarea placeholder="Drop a kind word (140 chars)" value={message} onChange={(e) => { if (e.target.value.length <= 140) setMessage(e.target.value) }} rows={3} className="input-light" style={{ resize: 'none' }} />
          <p style={{ color: 'var(--gray-400)', fontSize: '0.75rem', textAlign: 'right', marginTop: '4px' }}>{message.length}/140</p>
        </div>
        <ErrorBanner message={error} />
        <button type="submit" disabled={submitting || !name.trim() || !message.trim()} className="btn btn-primary btn-full">
          {submitting ? 'Posting...' : 'Post It'}
        </button>
      </div>
    </form>
  )
}

/* ── Photo Modal ── */
function PhotoModal({ onClose }) {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!file || !name.trim() || uploading) return
    setUploading(true)
    setError('')
    try {
      const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      await addDoc(collection(db, 'photos'), { name: name.trim(), storageUrl: url, timestamp: serverTimestamp() })
      setDone(true)
    } catch (err) { setError('Upload failed. Check your connection and try again.'); console.error(err) }
    finally { setUploading(false) }
  }

  if (done) {
    return <SuccessScreen emoji={'\u{1F4F8}'} title="You\u2019re on the wall!" subtitle="Thanks for sharing. Tell a friend to post one too." shareText="On the wall for Caleigh \u{1F534}\u{26AA} Amistad House Leader" onClose={onClose} />
  }

  return (
    <form onSubmit={submit}>
      <p className="center-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)', marginBottom: '6px' }}>Post a Pic</p>
      <p className="center-text" style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '20px' }}>Got a pic of us? Share it.</p>
      <div className="space-y">
        <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="input-light" />
        <label style={{ display: 'block', background: 'rgba(204,0,0,0.05)', border: '2px dashed var(--red)', padding: '28px 16px', textAlign: 'center', cursor: 'pointer' }}>
          <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]) }} style={{ display: 'none' }} />
          <span style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            {file ? file.name : 'Tap to choose a photo \u{1F4F8}'}
          </span>
        </label>
        <ErrorBanner message={error} />
        <button type="submit" disabled={uploading || !file || !name.trim()} className="btn btn-primary btn-full">
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
    </form>
  )
}

/* ── Q&A Modal ── */
function QAModal({ onClose }) {
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!name.trim() || !question.trim() || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'questions'), { name: name.trim(), question: question.trim(), answer: '', status: 'unanswered', timestamp: serverTimestamp() })
      setDone(true)
    } catch (err) { setError('Something went wrong. Try again.'); console.error(err) }
    finally { setSubmitting(false) }
  }

  if (done) {
    return <SuccessScreen emoji={'\u2753'} title="Question sent!" subtitle="Caleigh reads every one. Stay tuned for her answer." shareText="I asked Caleigh Elliott a question! Check out her campaign \u{1F534}" onClose={onClose} />
  }

  return (
    <form onSubmit={submit}>
      <p className="center-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--red)', marginBottom: '4px' }}>Ask a Question</p>
      <p className="center-text" style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '20px' }}>She actually reads these. She actually answers.</p>
      <div className="space-y">
        <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="input-light" />
        <textarea placeholder="What do you want to know?" value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} className="input-light" style={{ resize: 'none' }} />
        <ErrorBanner message={error} />
        <button type="submit" disabled={submitting || !name.trim() || !question.trim()} className="btn btn-primary btn-full">
          {submitting ? 'Sending...' : 'Submit Question'}
        </button>
      </div>
    </form>
  )
}

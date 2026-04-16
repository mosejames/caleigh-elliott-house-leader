import { useState, useEffect } from 'react'

/**
 * Floating card that appears once the visitor has scrolled just past the
 * photo carousel, warmly inviting them to share a memory. Tapping "Share"
 * fires a custom window event that ActionHub listens for and opens the
 * memory-submission modal. Dismissal is session-scoped.
 */
export default function MemoryPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return (
        sessionStorage.getItem('memory-popup-dismissed') === '1' ||
        sessionStorage.getItem('memory-submitted') === '1'
      )
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (dismissed || visible) return

    const check = () => {
      const el = document.getElementById('photo-carousel')
      if (!el) return
      // Trigger once the carousel's bottom is ~80px above the viewport top —
      // visitor has scrolled a little past the pictures.
      if (el.getBoundingClientRect().bottom < -80) {
        setVisible(true)
        window.removeEventListener('scroll', check)
      }
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [dismissed, visible])

  function handleDismiss() {
    setVisible(false)
    setDismissed(true)
    try {
      sessionStorage.setItem('memory-popup-dismissed', '1')
    } catch {}
  }

  function handleShare() {
    window.dispatchEvent(new CustomEvent('openMemory'))
    setVisible(false)
    setDismissed(true)
  }

  if (!visible || dismissed) return null

  return (
    <div
      role="dialog"
      aria-label="Share a memory of Caleigh"
      style={{
        position: 'fixed',
        bottom: 'max(16px, env(safe-area-inset-bottom))',
        left: '16px',
        right: '16px',
        margin: '0 auto',
        maxWidth: '440px',
        zIndex: 40,
        background: 'var(--red)',
        color: 'var(--white)',
        padding: '16px 18px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'memory-popup-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <span
        aria-hidden="true"
        style={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0 }}
      >
        &#x1F49B;
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(0.95rem, 2.4vw, 1.05rem)',
            lineHeight: 1.25,
            marginBottom: '2px',
          }}
        >
          Got a favorite memory of us?
        </p>
        <p
          style={{
            fontSize: 'clamp(0.75rem, 1.9vw, 0.82rem)',
            color: 'var(--white-muted)',
            lineHeight: 1.35,
          }}
        >
          A laugh, a project, a pep talk &mdash; tell the story.
        </p>
      </div>

      <button
        onClick={handleShare}
        style={{
          background: 'var(--gold)',
          color: 'var(--red)',
          border: 'none',
          padding: '10px 14px',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '0.78rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        Share &rarr;
      </button>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--white-muted)',
          fontSize: '1.4rem',
          lineHeight: 1,
          cursor: 'pointer',
          padding: '4px 4px 4px 0',
          flexShrink: 0,
          marginLeft: '-6px',
        }}
      >
        &times;
      </button>

      <style>{`
        @keyframes memory-popup-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

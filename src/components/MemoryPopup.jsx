import { useState, useEffect } from 'react'

/**
 * Modal-style popup that appears right after the visitor scrolls past the
 * photo carousel. Tinted backdrop, centered gold card, red text. Stays open
 * until dismissed (×, Esc, or backdrop click) or until they tap Share,
 * which fires a window event ActionHub listens for.
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

  // Scroll trigger — fire right as the carousel passes above the viewport.
  useEffect(() => {
    if (dismissed || visible) return

    const check = () => {
      const el = document.getElementById('photo-carousel')
      if (!el) return
      // Fire as the carousel's top edge is about to meet the viewport top —
      // the user is mid-scroll through the gallery, not past it.
      if (el.getBoundingClientRect().top < 60) {
        setVisible(true)
        window.removeEventListener('scroll', check)
      }
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [dismissed, visible])

  // Lock page scroll while the popup is up.
  useEffect(() => {
    if (!visible) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [visible])

  // Esc key to dismiss.
  useEffect(() => {
    if (!visible) return
    const onKey = (e) => {
      if (e.key === 'Escape') handleDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

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
      aria-modal="true"
      aria-label="Share a memory of Caleigh"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 45,
        animation: 'memory-fade-in 0.28s ease-out forwards',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: 'var(--gold)',
          color: 'var(--red)',
          maxWidth: '520px',
          width: '100%',
          padding: 'clamp(32px, 6vw, 52px) clamp(24px, 5vw, 44px)',
          textAlign: 'center',
          boxShadow:
            '0 48px 120px rgba(0, 0, 0, 0.6), 0 18px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(204, 0, 0, 0.08)',
          animation: 'memory-pop-in 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            position: 'absolute',
            top: '10px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--red)',
            fontSize: '1.9rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '6px 10px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
          }}
        >
          &times;
        </button>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(1.75rem, 5.5vw, 2.4rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--red)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Got a favorite memory of us?
        </h2>

        <p
          className="text-balance"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2.6vw, 1.15rem)',
            lineHeight: 1.5,
            color: 'var(--red)',
            opacity: 0.85,
            marginBottom: 'clamp(28px, 4.5vw, 36px)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          A laugh, a project, a pep talk &mdash; tell the story.
        </p>

        <button
          onClick={handleShare}
          style={{
            background: 'var(--red)',
            color: 'var(--white)',
            border: 'none',
            padding: '18px 40px',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(0.95rem, 2.6vw, 1.1rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 10px 28px rgba(204, 0, 0, 0.35), 0 4px 10px rgba(204, 0, 0, 0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)'
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(204, 0, 0, 0.45), 0 6px 14px rgba(204, 0, 0, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 10px 28px rgba(204, 0, 0, 0.35), 0 4px 10px rgba(204, 0, 0, 0.2)'
          }}
        >
          Share a Memory &rarr;
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          style={{
            display: 'inline-block',
            background: 'transparent',
            border: 'none',
            padding: '10px 14px',
            marginTop: '10px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            color: 'var(--red)',
            opacity: 0.7,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textDecorationThickness: '1px',
          }}
        >
          No pressure &mdash; close anytime
        </button>
      </div>

      <style>{`
        @keyframes memory-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes memory-pop-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

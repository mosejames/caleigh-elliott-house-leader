import { useState } from 'react'

const VIDEO_ID = '5qXUkh6P9gg'

/**
 * Lite-YouTube pattern: show a static thumbnail + Tap for Sound button until
 * the visitor taps. Only then do we load the YouTube iframe, which is when
 * autoplay reliably works (because it's triggered by a user gesture — no
 * chrome flashes, no "Watch on YouTube" fallback overlay, no title bar).
 */
export default function Hero() {
  const [started, setStarted] = useState(false)

  if (started) {
    return (
      <section style={{ position: 'relative', width: '100%', background: '#000' }}>
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&fs=0&loop=1&playlist=${VIDEO_ID}`}
          title="Caleigh Elliott for Amistad House Leader"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={{
            display: 'block',
            width: '100%',
            aspectRatio: '16 / 9',
            border: 'none',
          }}
        />
      </section>
    )
  }

  return (
    <section style={{ position: 'relative', width: '100%', background: '#000' }}>
      <button
        type="button"
        onClick={() => setStarted(true)}
        aria-label="Play video with sound"
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          aspectRatio: '16 / 9',
          padding: 0,
          margin: 0,
          border: 'none',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          background: '#000',
          overflow: 'hidden',
        }}
      >
        <img
          src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
          onError={(e) => {
            e.currentTarget.src = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`
          }}
          alt="Caleigh Elliott"
          decoding="async"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            className="animate-pulse-glow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 28px',
              background: 'var(--red)',
              color: 'var(--white)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            <SpeakerIcon />
            <span>Tap for sound</span>
          </span>
        </div>
      </button>
    </section>
  )
}

function SpeakerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

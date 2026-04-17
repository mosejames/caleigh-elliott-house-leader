import { useState } from 'react'

const VIDEO_ID = '5qXUkh6P9gg'

/**
 * Lite-YouTube pattern: thumbnail + Tap-to-Play button until the visitor
 * taps, then we swap in the iframe with autoplay + sound. iOS Safari and
 * modern browsers block muted-autoplay-then-unmute flows, so tapping once
 * starts the real video with audio — cleaner than our previous two-step.
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
        aria-label="Play video"
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
            background: 'rgba(0, 0, 0, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            className="hero-play-pulse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 30px',
              background: 'var(--red)',
              color: 'var(--white)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
            }}
          >
            <PlayIcon />
            <span>Tap to play</span>
          </span>
        </div>
      </button>

      <style>{`
        @keyframes hero-play-pulse-kf {
          0% {
            transform: scale(1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45),
                        0 0 0 0 rgba(255, 255, 255, 0.55);
          }
          65% {
            transform: scale(1.045);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45),
                        0 0 0 22px rgba(255, 255, 255, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45),
                        0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        .hero-play-pulse {
          animation: hero-play-pulse-kf 1.8s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-play-pulse { animation: none; }
        }
      `}</style>
    </section>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="8 5 20 12 8 19 8 5" />
    </svg>
  )
}

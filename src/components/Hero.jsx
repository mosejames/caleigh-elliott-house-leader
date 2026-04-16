import { useRef, useState } from 'react'

export default function Hero() {
  const iframeRef = useRef(null)
  const [muted, setMuted] = useState(true)

  function handleUnmute() {
    const iframe = iframeRef.current
    if (iframe?.contentWindow) {
      // Unmute
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
        '*'
      )
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
        '*'
      )
      // Also fire play in case autoplay was blocked
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*'
      )
    }
    setMuted(false)
  }

  return (
    <section style={{ position: 'relative', width: '100%', background: '#000' }}>
      <iframe
        ref={iframeRef}
        src="https://www.youtube.com/embed/NtoHyxXwxrM?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0"
        title="Caleigh Elliott for House Leader"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{
          display: 'block',
          width: '100%',
          aspectRatio: '16 / 9',
          border: 'none',
        }}
      />

      {muted && (
        <button
          type="button"
          onClick={handleUnmute}
          aria-label="Tap for sound"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.25s ease',
            WebkitTapHighlightColor: 'transparent',
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
        </button>
      )}
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

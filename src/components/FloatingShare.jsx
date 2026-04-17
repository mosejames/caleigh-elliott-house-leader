import { triggerShare } from '../utils/share.js'

export default function FloatingShare() {
  return (
    <>
      <button
        onClick={() => triggerShare()}
        className="floating-share-btn"
        style={{
          position: 'fixed',
          bottom: 'max(20px, env(safe-area-inset-bottom))',
          right: '20px',
          zIndex: 50,
          background: 'var(--gold)',
          color: 'var(--red)',
          padding: '14px 20px',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(0.82rem, 2vw, 0.9rem)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Tell a friend about Caleigh's campaign"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span>Tell a Friend</span>
      </button>

      <style>{`
        .floating-share-btn {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28),
                      0 4px 10px rgba(0, 0, 0, 0.15);
          animation: floating-share-pulse 2.4s ease-out infinite;
        }
        @keyframes floating-share-pulse {
          0% {
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28),
                        0 4px 10px rgba(0, 0, 0, 0.15),
                        0 0 0 0 rgba(204, 0, 0, 0.45);
          }
          70% {
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28),
                        0 4px 10px rgba(0, 0, 0, 0.15),
                        0 0 0 16px rgba(204, 0, 0, 0);
          }
          100% {
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28),
                        0 4px 10px rgba(0, 0, 0, 0.15),
                        0 0 0 0 rgba(204, 0, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-share-btn { animation: none; }
        }
      `}</style>
    </>
  )
}

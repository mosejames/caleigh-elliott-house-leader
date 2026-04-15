import { triggerShare } from '../utils/share.js'

export default function FloatingShare() {
  return (
    <button
      onClick={() => triggerShare()}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        backgroundColor: '#CC0000',
        color: '#fff',
        width: '56px',
        height: '56px',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(204, 0, 0, 0.5)',
      }}
      className="animate-pulse-glow hover:scale-110 transition-transform md:hidden"
      aria-label="Share this page"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        width="24"
        height="24"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </button>
  )
}

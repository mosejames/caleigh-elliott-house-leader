import { triggerShare } from '../utils/share.js'

export default function FloatingShare() {
  return (
    <button
      onClick={() => triggerShare()}
      className="fixed bottom-6 right-6 z-50 bg-red-brand text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center animate-pulse-glow hover:scale-110 transition-transform md:hidden cursor-pointer"
      aria-label="Share this page"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </button>
  )
}

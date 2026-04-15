import { triggerShare } from '../utils/share.js'

export default function Footer() {
  return (
    <section className="px-8 py-24 text-center" style={{ backgroundColor: '#CC0000' }}>
      <div
        className="text-3xl sm:text-4xl md:text-6xl whitespace-nowrap overflow-hidden"
        style={{
          color: '#fff',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 900,
          letterSpacing: '0.15em',
          lineHeight: 1.2,
          fontSize: 'clamp(1.5rem, 6vw, 3.5rem)',
        }}
      >
        A — M — I — S — T — A — D
      </div>
      <p
        className="text-lg mt-6"
        style={{ color: 'rgba(255,255,255,0.7)' }}
      >
        House of Amistad | Ron Clark Academy | 2026-2027
      </p>
      <button
        onClick={() => triggerShare()}
        className="hover:scale-105 transition-transform mt-10 inline-block"
        style={{
          backgroundColor: '#fff',
          color: '#CC0000',
          padding: '16px 40px',
          borderRadius: '9999px',
          fontWeight: 700,
          fontSize: '18px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Share This Page
      </button>
    </section>
  )
}

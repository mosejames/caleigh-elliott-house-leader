import { triggerShare } from '../utils/share.js'

export default function Footer() {
  return (
    <section className="section section-red relative grain" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="text-center">
        {/* AMISTAD — the moment */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            color: 'var(--white)',
            letterSpacing: '0.12em',
            lineHeight: 1,
          }}
        >
          AMISTAD
        </div>

        {/* Gold accent line */}
        <div
          className="mx-auto"
          style={{
            width: '80px',
            height: '4px',
            background: 'var(--gold)',
            borderRadius: '2px',
            marginTop: '24px',
          }}
        />

        <p style={{ color: 'var(--white-muted)', fontSize: '1rem', marginTop: '20px', letterSpacing: '0.05em' }}>
          House of Amistad &bull; Ron Clark Academy &bull; 2026-2027
        </p>

        <div style={{ marginTop: '36px' }}>
          <button onClick={() => triggerShare()} className="btn btn-white" style={{ fontSize: '1.1rem', padding: '18px 48px' }}>
            Share This Page
          </button>
        </div>
      </div>
    </section>
  )
}

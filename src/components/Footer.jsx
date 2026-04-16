import { triggerShare } from '../utils/share.js'

export default function Footer() {
  return (
    <section className="section section-red grain center-text" style={{ position: 'relative', paddingTop: '100px', paddingBottom: '100px' }}>
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

      <div style={{ width: '80px', height: '4px', background: 'var(--gold)', margin: '24px auto 0' }} />

      <p style={{ color: 'var(--white-muted)', fontSize: '1rem', marginTop: '20px', letterSpacing: '0.05em' }}>
        Ron Clark Academy &bull; 2026-2027
      </p>
      <p style={{ color: 'var(--gold)', fontSize: '0.95rem', marginTop: '8px', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
        Everybody wins in Amistad.
      </p>

      <div style={{ marginTop: '36px' }}>
        <button onClick={() => triggerShare()} className="btn btn-white" style={{ fontSize: '1.1rem', padding: '18px 48px' }}>
          Spread The Love
        </button>
      </div>
    </section>
  )
}

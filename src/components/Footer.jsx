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

      <p style={{ color: 'var(--white-muted)', fontSize: '0.95rem', marginTop: '20px', letterSpacing: '0.05em' }}>
        Ron Clark Academy &bull; 2026&ndash;2027
      </p>
      <p style={{ color: 'var(--white-muted)', fontSize: '0.9rem', marginTop: '6px', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontWeight: 500 }}>
        Everybody wins in Amistad.
      </p>

      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
          color: 'var(--gold)',
          marginTop: '28px',
          letterSpacing: '0.04em',
          fontStyle: 'italic',
        }}
      >
        &mdash; With love, Caleigh &#x1F49B;
      </p>

      <div style={{ marginTop: '28px' }}>
        <button onClick={() => triggerShare()} className="btn btn-white" style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
          Tell a Friend
        </button>
      </div>
    </section>
  )
}

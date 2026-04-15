import { triggerShare } from '../utils/share.js'

export default function Video() {
  return (
    <section className="section section-white">
      <div className="contain center-text">
        <h2 className="heading-section" style={{ color: 'var(--red)' }}>
          Hear From Caleigh
        </h2>

        <div style={{ marginTop: '40px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/ul_30sXiF5o"
              title="Caleigh Elliott for House Leader"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>

        <blockquote
          className="text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            lineHeight: 1.4,
            color: 'var(--red)',
            maxWidth: '600px',
            margin: '40px auto 0',
            textAlign: 'center',
          }}
        >
          &ldquo;We are the best of the best, and we will never settle for less. We are that house.&rdquo;
        </blockquote>

        <div style={{ marginTop: '40px' }}>
          <button onClick={() => triggerShare()} className="btn btn-primary">
            Share This
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Hero() {
  return (
    <section className="section section-red grain" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }}
      />
      <div className="contain center-text" style={{ position: 'relative', zIndex: 1 }}>
        <h1 className="display-xl animate-fade-up" style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', color: 'var(--white)' }}>
          Caleigh
        </h1>
        <h1 className="display-xl animate-fade-up delay-1" style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', color: 'var(--white)', marginTop: '-0.1em' }}>
          Elliott
        </h1>
        <p className="animate-fade-up delay-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(0.7rem, 2vw, 1rem)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--white-soft)', marginTop: '20px' }}>
          House of Amistad &bull; House Leader 2026–2027
        </p>
        <p className="animate-fade-up delay-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.1rem, 3.5vw, 1.75rem)', fontStyle: 'italic', color: 'var(--gold)', marginTop: '16px' }}>
          Together We Are Better
        </p>

        {/* Video right in the hero */}
        <div className="animate-fade-up delay-4" style={{ marginTop: '40px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
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

        <blockquote style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', lineHeight: 1.5, color: 'var(--white-soft)', maxWidth: '540px', margin: '32px auto 0', textAlign: 'center' }}>
          &ldquo;We are the best of the best, and we will never settle for less. We are that house.&rdquo;
        </blockquote>
      </div>
    </section>
  )
}

export default function Hero() {
  return (
    <section
      className="section grain"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #8B0000 0%, #CC0000 40%, #CC0000 100%)',
        color: 'var(--white)',
      }}
    >
      <div className="contain center-text" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="AMI for Caleigh"
          className="animate-fade-up"
          style={{ maxWidth: '420px', width: '85%', margin: '0 auto', display: 'block' }}
        />

        <p className="animate-fade-up delay-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(0.7rem, 2vw, 1rem)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--white-soft)', marginTop: '20px' }}>
          House of Amistad &bull; House Leader 2026–2027
        </p>
        <p className="animate-fade-up delay-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.1rem, 3.5vw, 1.75rem)', fontStyle: 'italic', color: 'var(--gold)', marginTop: '12px' }}>
          Together We Are Better
        </p>

        {/* Video */}
        <div className="animate-fade-up delay-3" style={{ marginTop: '40px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/NtoHyxXwxrM"
              title="Caleigh Elliott for House Leader"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>

        <blockquote className="animate-fade-up delay-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', lineHeight: 1.5, color: 'var(--white-soft)', maxWidth: '540px', margin: '32px auto 0', textAlign: 'center' }}>
          &ldquo;We are the best of the best, and we will never settle for less. We are that house.&rdquo;
        </blockquote>
      </div>
    </section>
  )
}

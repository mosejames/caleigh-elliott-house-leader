export default function Hero() {
  return (
    <section className="section section-red relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden grain">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center w-full max-w-5xl mx-auto px-4">
        <h1
          className="display-xl opacity-0 animate-fade-up"
          style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)', color: 'var(--white)' }}
        >
          Caleigh
        </h1>
        <h1
          className="display-xl opacity-0 animate-fade-up delay-1"
          style={{
            fontSize: 'clamp(3.5rem, 14vw, 10rem)',
            color: 'var(--white)',
            marginTop: '-0.1em',
          }}
        >
          Elliott
        </h1>

        <p
          className="opacity-0 animate-fade-up delay-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 'clamp(0.75rem, 2.5vw, 1.125rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--white-soft)',
            marginTop: '24px',
          }}
        >
          House of Amistad &bull; House Leader 2026–2027
        </p>

        <p
          className="opacity-0 animate-fade-up delay-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontStyle: 'italic',
            color: 'var(--gold)',
            marginTop: '20px',
          }}
        >
          Together We Are Better
        </p>

        <div
          className="mx-auto opacity-0 animate-fade-up delay-4"
          style={{
            width: '64px',
            height: '4px',
            background: 'var(--gold)',
            borderRadius: '2px',
            marginTop: '32px',
          }}
        />
      </div>
    </section>
  )
}

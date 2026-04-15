export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-8 py-24 overflow-hidden"
      style={{ backgroundColor: '#CC0000' }}
    >
      {/* Pulsing radial gradient overlay */}
      <div
        className="absolute inset-0 opacity-20 animate-pulse"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1
          className="text-5xl md:text-8xl uppercase tracking-tight animate-fade-in-up stagger-1 opacity-0"
          style={{
            color: '#FFFFFF',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            lineHeight: 1.05,
          }}
        >
          Caleigh Elliott
        </h1>

        <p
          className="text-xl md:text-2xl mt-5 tracking-wide animate-fade-in-up stagger-2 opacity-0"
          style={{
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}
        >
          House of Amistad | House Leader 2026-2027
        </p>

        <p
          className="text-2xl md:text-3xl mt-8 animate-fade-in-up stagger-3 opacity-0"
          style={{
            color: '#FFD700',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontStyle: 'italic',
          }}
        >
          Together We Are Better
        </p>
      </div>
    </section>
  )
}

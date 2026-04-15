export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-red-brand px-6 py-20 overflow-hidden">
      {/* Pulsing radial gradient overlay */}
      <div
        className="absolute inset-0 opacity-20 animate-pulse"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center">
        <h1 className="font-heading text-5xl md:text-7xl font-black uppercase text-white animate-fade-in-up stagger-1 opacity-0">
          Caleigh Elliott
        </h1>

        <p className="text-white text-lg mt-4 animate-fade-in-up stagger-2 opacity-0">
          House of Amistad | House Leader 2026-2027
        </p>

        <p className="text-gold-accent italic text-2xl font-heading mt-6 animate-fade-in-up stagger-3 opacity-0">
          Together We Are Better
        </p>
      </div>
    </section>
  )
}

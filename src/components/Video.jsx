import { triggerShare } from '../utils/share.js'

export default function Video() {
  return (
    <section
      className="px-8 py-24"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <h2
        className="text-3xl md:text-5xl font-bold text-center mb-12"
        style={{
          color: '#CC0000',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Hear From Caleigh
      </h2>

      <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/ul_30sXiF5o"
            title="Caleigh Elliott for House Leader"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <p
        className="text-xl md:text-2xl max-w-2xl mx-auto mt-10 text-center leading-relaxed"
        style={{
          color: '#CC0000',
          fontStyle: 'italic',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        &ldquo;We are the best of the best, and we will never settle for less.
        We are that house.&rdquo;
      </p>

      <div className="text-center mt-10">
        <button
          onClick={() => triggerShare()}
          className="hover:scale-105 transition-transform"
          style={{
            backgroundColor: '#CC0000',
            color: '#FFFFFF',
            padding: '16px 32px',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '18px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Share This
        </button>
      </div>
    </section>
  )
}

import { triggerShare } from '../utils/share.js'

export default function Video() {
  return (
    <section className="section section-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="heading-section text-center" style={{ color: 'var(--red)' }}>
          Hear From Caleigh
        </h2>

        <div
          className="mt-10 rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' }}
        >
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/ul_30sXiF5o"
              title="Caleigh Elliott for House Leader"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
        </div>

        <blockquote
          className="text-center text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            lineHeight: 1.4,
            color: 'var(--red)',
            maxWidth: '600px',
            margin: '40px auto 0',
          }}
        >
          &ldquo;We are the best of the best, and we will never settle for less. We are that house.&rdquo;
        </blockquote>

        <div className="text-center mt-10">
          <button onClick={() => triggerShare()} className="btn btn-primary">
            Share This
          </button>
        </div>
      </div>
    </section>
  )
}

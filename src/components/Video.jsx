import { triggerShare } from '../utils/share.js'

export default function Video() {
  return (
    <section className="bg-white px-6 py-20">
      <h2 className="text-red-brand font-heading text-3xl md:text-4xl font-bold text-center mb-10">
        Hear From Caleigh
      </h2>

      <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl">
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

      <p className="text-red-brand italic text-lg md:text-xl max-w-2xl mx-auto mt-8 text-center">
        &ldquo;We are the best of the best, and we will never settle for less.
        We are that house.&rdquo;
      </p>

      <div className="text-center mt-8">
        <button
          onClick={() => triggerShare()}
          className="bg-red-brand text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform cursor-pointer"
        >
          Share This
        </button>
      </div>
    </section>
  )
}

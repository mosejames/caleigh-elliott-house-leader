import { triggerShare } from '../utils/share.js'

export default function Footer() {
  return (
    <section className="bg-red-brand px-6 py-20 text-center">
      <h2 className="text-white font-heading text-4xl md:text-6xl font-black tracking-widest">
        A — M — I — S — T — A — D
      </h2>
      <p className="text-white/70 text-lg mt-4">
        House of Amistad | Ron Clark Academy | 2026-2027
      </p>
      <button
        onClick={() => triggerShare()}
        className="bg-white text-red-brand px-8 py-3 rounded-full font-bold mt-8 hover:scale-105 transition-transform cursor-pointer"
      >
        Share This Page
      </button>
    </section>
  )
}

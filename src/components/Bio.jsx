const funFacts = [
  '\u{1F3C0} Point Guard',
  '\u{1F43B} Mama Bear',
  '\u{1F4DA} Mentorship Committee Co-Chair',
  '\u270A Dean of the Newbie Line (2025 + 2026)',
]

export default function Bio() {
  return (
    <section className="bg-red-brand px-6 py-20">
      <h2 className="text-white font-heading text-3xl md:text-4xl font-bold text-center mb-10">
        Who Is Caleigh?
      </h2>

      {/* Photo placeholder */}
      <div className="aspect-[3/4] max-w-sm mx-auto rounded-2xl border-4 border-gold-accent bg-white/10 flex items-center justify-center mb-10">
        <span className="text-white text-lg font-heading">
          Photo Coming Soon
        </span>
      </div>

      {/* Bio text */}
      <p className="text-white/90 text-lg max-w-2xl mx-auto italic text-center mb-10">
        I&apos;m a proud rising 8th grader and I&apos;ve been a leader my whole
        life. I play point guard, I co-chair the Mentorship Committee, and I
        served as Dean of the Newbie Line. Leadership to me means lifting
        everyone up and making sure nobody gets left behind. I&apos;m a Mama
        Bear. I show up for my people. That&apos;s just who I am.
      </p>

      {/* Fun fact chips */}
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
        {funFacts.map((fact) => (
          <span
            key={fact}
            className="bg-white text-red-brand px-4 py-2 rounded-full font-bold text-sm"
          >
            {fact}
          </span>
        ))}
      </div>
    </section>
  )
}

const funFacts = [
  '\u{1F3C0} Point Guard',
  '\u{1F43B} Mama Bear',
  '\u{1F4DA} Mentorship Committee Co-Chair',
  '\u270A Dean of the Newbie Line (2025 + 2026)',
]

export default function Bio() {
  return (
    <section
      className="px-8 py-24"
      style={{ backgroundColor: '#CC0000' }}
    >
      <h2
        className="text-3xl md:text-5xl font-bold text-center mb-12"
        style={{
          color: '#FFFFFF',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 900,
        }}
      >
        Who Is Caleigh?
      </h2>

      {/* Photo placeholder */}
      <div
        className="aspect-[3/4] max-w-xs mx-auto rounded-2xl flex items-center justify-center mb-12 backdrop-blur-sm"
        style={{
          borderWidth: '4px',
          borderStyle: 'solid',
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <span
          className="text-lg"
          style={{
            color: '#FFFFFF',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
          }}
        >
          Photo Coming Soon
        </span>
      </div>

      {/* Bio text */}
      <p
        className="text-lg md:text-xl max-w-2xl mx-auto text-center mb-12 leading-relaxed"
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontFamily: "'Inter', sans-serif",
          fontStyle: 'italic',
        }}
      >
        I&apos;m a proud rising 8th grader and I&apos;ve been a leader my whole
        life. I play point guard, I co-chair the Mentorship Committee, and I
        served as Dean of the Newbie Line. Leadership to me means lifting
        everyone up and making sure nobody gets left behind. I&apos;m a Mama
        Bear. I show up for my people. That&apos;s just who I am.
      </p>

      {/* Fun fact chips */}
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mt-10">
        {funFacts.map((fact) => (
          <span
            key={fact}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#CC0000',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {fact}
          </span>
        ))}
      </div>
    </section>
  )
}

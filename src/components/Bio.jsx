const funFacts = [
  '\u{1F3C0} Point Guard',
  '\u{1F43B} Mama Bear',
  '\u{1F4DA} Mentorship Co-Chair',
  '\u270A Dean of the Newbie Line',
]

export default function Bio() {
  return (
    <section className="section section-red grain" style={{ position: 'relative' }}>
      <div className="contain center-text">
        <h2 className="heading-section" style={{ color: 'var(--white)' }}>
          Who Is Caleigh?
        </h2>

        <div
          style={{
            maxWidth: '280px',
            aspectRatio: '3/4',
            border: '4px solid var(--gold)',
            background: 'var(--glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '40px auto 0',
          }}
        >
          <span style={{ color: 'var(--white-muted)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Photo Coming Soon
          </span>
        </div>

        <p
          className="text-balance"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--white-soft)',
            maxWidth: '600px',
            margin: '40px auto 0',
            textAlign: 'center',
          }}
        >
          I&apos;m a proud rising 8th grader and I&apos;ve been a leader my whole
          life. I play point guard, I co-chair the Mentorship Committee, and I
          served as Dean of the Newbie Line. Leadership to me means lifting
          everyone up and making sure nobody gets left behind. I&apos;m a Mama
          Bear. I show up for my people. That&apos;s just who I am.
        </p>

        <div className="flex-wrap-center" style={{ marginTop: '40px' }}>
          {funFacts.map((fact) => (
            <span
              key={fact}
              style={{
                background: 'var(--white)',
                color: 'var(--red)',
                padding: '10px 20px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
              }}
            >
              {fact}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

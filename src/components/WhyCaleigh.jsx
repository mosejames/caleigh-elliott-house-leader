const REASONS = [
  {
    emoji: '\u{1F3C0}',
    title: 'Point Guard Brain',
    copy: '"Being a point guard taught me how to lead, communicate, and make sure everyone is involved — just like a great house leader should."',
  },
  {
    emoji: '\u{1F43B}',
    title: '"Mama Bear" Energy',
    copy: 'She genuinely loves taking care of people. When it counts, she shows up.',
  },
  {
    emoji: '\u{1F91D}',
    title: 'Chair of the Mentorship Committee',
    copy: 'Built the welcome plan for every incoming 4th grader with her co-chair — cards, activities, quarterly goals. Nobody feels lost on day one.',
  },
  {
    emoji: '\u{1F451}',
    title: "Dean of the Newbie Line — '25 & '26",
    copy: 'Her Stomp Wars pep talk: "Do not fear the other teams. We only fear God."',
  },
  {
    emoji: '\u{1F4DA}',
    title: 'Lifts the Whole House Up',
    copy: 'Runs study groups and tutors across the Class of 2027 so we all win together.',
  },
  {
    emoji: '\u2728',
    title: 'Integrity. Determination. Perseverance.',
    copy: 'The values behind every accolade. The unconquered spirit of the peacock.',
  },
]

export default function WhyCaleigh() {
  return (
    <section className="section section-white">
      <div className="contain">
        <h2 className="heading-section" style={{ color: 'var(--red)' }}>
          Why Caleigh
        </h2>

        <p
          className="center-text text-balance"
          style={{
            color: 'var(--gray-600)',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            maxWidth: '640px',
            margin: '20px auto 0',
            lineHeight: 1.65,
            fontStyle: 'italic',
          }}
        >
          &ldquo;If I haven&rsquo;t had the pleasure of meeting you, my name is Caleigh Elliott, and I am a proud rising 8th grader running to be your next Amistad House Leader.&rdquo;
        </p>

        <div style={{ marginTop: '48px', display: 'grid', gap: '16px' }}>
          {REASONS.map((r) => (
            <div
              key={r.title}
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
                padding: '22px 24px',
                borderLeft: '4px solid var(--red)',
                background: 'var(--gray-100)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {r.emoji}
              </span>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    color: 'var(--red)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {r.title}
                </p>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    marginTop: '6px',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  {r.copy}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Amistad context */}
        <div
          className="grain"
          style={{
            position: 'relative',
            overflow: 'hidden',
            marginTop: '48px',
            padding: 'clamp(28px, 5vw, 44px) 24px',
            background: 'var(--red)',
            color: 'var(--white)',
            textAlign: 'center',
          }}
        >
          <div style={{ position: 'relative' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.72rem',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                marginBottom: '14px',
              }}
            >
              What Amistad Means
            </p>
            <p
              className="text-balance"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2.6vw, 1.25rem)',
                lineHeight: 1.5,
                maxWidth: '640px',
                margin: '0 auto',
              }}
            >
              <span style={{ fontWeight: 800 }}>Amistad</span> is Spanish for{' '}
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>friendship</span>.
              Our peacock never quits. Our knights protect the house. Our color is red — the{' '}
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>kindness of heart</span>.
              Caleigh lives this every single day.
            </p>
          </div>
        </div>

        {/* Closing pull quote */}
        <blockquote
          className="text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)',
            lineHeight: 1.3,
            color: 'var(--red)',
            textAlign: 'center',
            maxWidth: '640px',
            margin: '56px auto 0',
          }}
        >
          &ldquo;We are the best of the best, and we will never settle for less. We are that house.&rdquo;
        </blockquote>
        <p
          className="center-text"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.8rem',
            color: 'var(--gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            marginTop: '14px',
          }}
        >
          &mdash; Caleigh
        </p>
      </div>
    </section>
  )
}

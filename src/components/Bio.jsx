const facts = [
  { icon: '\u{1F3C0}', label: 'Point Guard' },
  { icon: '\u{1F43B}', label: 'Mama Bear' },
  { icon: '\u{1F4DA}', label: 'Mentorship Co-Chair' },
  { icon: '\u270A', label: 'Dean of the Newbie Line' },
]

export default function Bio() {
  return (
    <section className="section section-white">
      <div className="contain">
        <h2 className="heading-section" style={{ color: 'var(--red)' }}>Who Is Caleigh?</h2>

        <p style={{ fontStyle: 'italic', fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', lineHeight: 1.7, color: 'var(--gray-600)', maxWidth: '640px', margin: '24px auto 0', textAlign: 'center' }}>
          I&apos;m a proud rising 8th grader and I&apos;ve been a leader my whole
          life. I play point guard, I co-chair the Mentorship Committee, and I
          served as Dean of the Newbie Line. I&apos;m a Mama Bear. I show up for my people.
        </p>

        <div className="flex-wrap-center" style={{ marginTop: '24px' }}>
          {facts.map((f) => (
            <span key={f.label} style={{ background: 'var(--red)', color: 'var(--white)', padding: '8px 16px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              {f.icon} {f.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

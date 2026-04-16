export default function ElectionBanner() {
  return (
    <section
      className="grain"
      style={{
        position: 'relative',
        background: 'var(--red)',
        color: 'var(--white)',
        padding: 'clamp(56px, 9vw, 96px) 24px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div className="contain" style={{ position: 'relative' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(0.72rem, 1.8vw, 0.85rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--gold)',
            marginBottom: '22px',
          }}
        >
          How I Show Up
        </p>

        <p
          className="text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 'clamp(1.45rem, 4vw, 2.4rem)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            maxWidth: '820px',
            margin: '0 auto',
          }}
        >
          Servant leadership &mdash; not glitz or glam.
          <br />
          Driven by purpose, not title.
        </p>

        <div
          style={{
            width: '72px',
            height: '4px',
            background: 'var(--gold)',
            margin: '28px auto 0',
          }}
        />

        <p
          className="text-balance"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
            lineHeight: 1.6,
            color: 'var(--white-soft)',
            marginTop: '24px',
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          I&rsquo;d serve Amistad whether I&rsquo;m chosen or not. That&rsquo;s already what being a leader means to me.
        </p>
      </div>
    </section>
  )
}

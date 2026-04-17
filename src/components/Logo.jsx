function InlineLink({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'var(--red)',
        fontWeight: 700,
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        textDecorationThickness: '1.5px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

export default function Logo() {
  return (
    <section
      style={{
        background: 'var(--white)',
        padding: 'clamp(48px, 8vw, 96px) 24px',
      }}
    >
      <div className="contain center-text">
        <img
          src="/ami-for-caleigh.png"
          alt="AMI for Caleigh"
          className="animate-fade-up"
          style={{
            maxWidth: '520px',
            width: '85%',
            margin: '0 auto',
            display: 'block',
            height: 'auto',
          }}
        />

        <p
          className="animate-fade-up delay-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.25rem, 3.2vw, 1.75rem)',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            color: 'var(--gray-800)',
            maxWidth: '560px',
            margin: '36px auto 14px',
          }}
        >
          Hey, it&rsquo;s me, Caleigh {'\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F'}
        </p>

        <p
          className="animate-fade-up delay-2 text-balance"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
            lineHeight: 1.65,
            color: 'var(--gray-600)',
            maxWidth: '540px',
            margin: '0 auto',
          }}
        >
          I&rsquo;m running to be your next Amistad House Leader for 2026&ndash;2027. Amistad staff makes the call &mdash; but if we&rsquo;ve worked on something together,{' '}
          <InlineLink onClick={() => window.dispatchEvent(new CustomEvent('openMemory'))}>
            share a memory
          </InlineLink>
          {' '}or{' '}
          <InlineLink onClick={() => window.dispatchEvent(new CustomEvent('openPhoto'))}>
            post a pic
          </InlineLink>
          . Anything that says <strong>Team Caleigh</strong>.
        </p>
      </div>
    </section>
  )
}

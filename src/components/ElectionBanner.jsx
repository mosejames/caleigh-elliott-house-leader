export default function ElectionBanner() {
  const target = new Date('2026-04-20T00:00:00')
  const now = new Date()
  const days = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000))

  const countdown =
    days === 0 ? 'Today is the day \u{1F49B}' :
    days === 1 ? 'Tomorrow is the day. Thanks for being in my corner. \u{1F49B}' :
                 `${days} days to go. Thanks for being in my corner. \u{1F49B}`

  return (
    <section
      className="grain"
      style={{
        position: 'relative',
        background: 'var(--red)',
        color: 'var(--white)',
        padding: 'clamp(40px, 6vw, 72px) 24px',
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
            marginBottom: '14px',
          }}
        >
          Election Day
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(3rem, 12vw, 6rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
          }}
        >
          April 20
        </p>
        <div
          style={{
            width: '72px',
            height: '4px',
            background: 'var(--gold)',
            margin: '20px auto 0',
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            marginTop: '20px',
            color: 'var(--white)',
          }}
        >
          {countdown}
        </p>
      </div>
    </section>
  )
}

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
          House of Amistad is picking its next leader.
        </p>

        <p
          className="animate-fade-up delay-2 text-balance"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
            lineHeight: 1.65,
            color: 'var(--gray-600)',
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >
          On April 20, our family chooses who carries us into 2026&ndash;2027. Here&rsquo;s why we&rsquo;re standing with <strong style={{ color: 'var(--red)', fontWeight: 700 }}>Caleigh Elliott</strong>.
        </p>
      </div>
    </section>
  )
}

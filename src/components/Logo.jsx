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
          src="/ami4calieghlogo.png"
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
      </div>
    </section>
  )
}

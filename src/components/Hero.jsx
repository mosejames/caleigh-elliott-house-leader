export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <iframe
        src="https://www.youtube.com/embed/NtoHyxXwxrM?autoplay=1&mute=1&playsinline=1"
        title="Caleigh Elliott for House Leader"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '56.25vw',
          minHeight: '100vh',
          minWidth: '177.78vh',
          border: 'none',
        }}
      />
    </section>
  )
}

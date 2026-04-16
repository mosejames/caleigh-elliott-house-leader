export default function Hero() {
  return (
    <section style={{ width: '100%', background: '#000' }}>
      <iframe
        src="https://www.youtube.com/embed/NtoHyxXwxrM?playsinline=1"
        title="Caleigh Elliott for House Leader"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          display: 'block',
          width: '100%',
          aspectRatio: '16 / 9',
          border: 'none',
        }}
      />
    </section>
  )
}

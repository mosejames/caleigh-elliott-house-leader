import { useMemo, useState, useEffect } from 'react'

const PHOTOS = [
  '/photos/123_1.jpeg',
  '/photos/1736290278_1_39.jpg',
  '/photos/1747430614_1_99.jpg',
  '/photos/1747433886_1_244.jpg',
  '/photos/8AF15D8C-0833-4E3A-8074-55F52C08FC81.JPG',
  '/photos/B24CDBA4-6176-45BE-8529-81FE6AA25889.JPG',
  '/photos/IMG_1850.jpeg',
  '/photos/IMG_6423.JPG',
  '/photos/amiamor00188.jpg',
  '/photos/amivday00302.jpg',
  '/photos/amivday00495.jpg',
]

// Fisher-Yates shuffle. Runs once per mount so every page load
// gives visitors a fresh order.
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function PhotoCarousel() {
  const shuffled = useMemo(() => shuffle(PHOTOS), [])
  // Duplicate once so we can translate by -50% for a seamless loop
  const doubled = [...shuffled, ...shuffled]

  // Only start the CSS animation once every image has fully loaded. On iOS
  // WebKit the flex track's max-content width is computed from each <img>'s
  // intrinsic size — if the animation starts before images load, the track
  // is (near) zero-wide, translateX(-50%) moves nothing, and the section
  // paints as the black background.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    const loads = PHOTOS.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = resolve
          img.src = src
        }),
    )
    Promise.all(loads).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      aria-label="Photos of Caleigh and friends"
      style={{
        overflow: 'hidden',
        background: '#0D0D0C',
        padding: 0,
      }}
    >
      <div
        className="photo-carousel-track"
        style={{
          display: 'flex',
          gap: 0,
          width: 'max-content',
          animation: ready ? 'photo-carousel-scroll 60s linear infinite' : 'none',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            style={{
              height: 'clamp(150px, 26vh, 300px)',
              width: 'auto',
              display: 'block',
              flexShrink: 0,
              objectFit: 'cover',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes photo-carousel-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .photo-carousel-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

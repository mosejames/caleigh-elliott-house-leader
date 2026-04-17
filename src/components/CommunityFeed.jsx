import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase.js'
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore'
import Family from './Family.jsx'

// Home-page preview limits. /wall (full mode) ignores these.
const PREVIEW_PHOTO_CAP = 6
const PREVIEW_SHOUTOUT_CAP = 6
const PREVIEW_ANSWERED_CAP = 3

/**
 * CommunityFeed displays submitted photos, memories, and answered Q&A.
 *
 * Modes:
 *   <CommunityFeed />           -- preview mode (home page): hides sparse
 *                                  sections; caps each section at a few
 *                                  recent items; adds "See all" link.
 *   <CommunityFeed full />      -- full archive (/wall page): always renders
 *                                  each section; no caps; empty states shown.
 */
export default function CommunityFeed({ full = false }) {
  const [shoutouts, setShoutouts] = useState([])
  const [answered, setAnswered] = useState([])
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    const unsubs = []
    // We fetch everything (uncapped) so preview mode can count totals for the
    // "See all" link, and full mode gets the complete archive. Volume here is
    // small — tens, not thousands — so this is fine.
    unsubs.push(onSnapshot(
      query(collection(db, 'shoutouts'), orderBy('timestamp', 'desc')),
      (snap) => setShoutouts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    ))
    unsubs.push(onSnapshot(
      query(collection(db, 'questions'), where('status', '==', 'answered'), orderBy('timestamp', 'desc')),
      (snap) => setAnswered(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    ))
    unsubs.push(onSnapshot(
      query(collection(db, 'photos'), orderBy('timestamp', 'desc')),
      (snap) => setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    ))
    return () => unsubs.forEach((u) => u())
  }, [])

  const shownPhotos = full ? photos : photos.slice(0, PREVIEW_PHOTO_CAP)
  const shownShoutouts = full ? shoutouts : shoutouts.slice(0, PREVIEW_SHOUTOUT_CAP)
  const shownAnswered = full ? answered : answered.slice(0, PREVIEW_ANSWERED_CAP)

  const totalItems = photos.length + shoutouts.length + answered.length
  const moreThanPreview =
    photos.length > PREVIEW_PHOTO_CAP ||
    shoutouts.length > PREVIEW_SHOUTOUT_CAP ||
    answered.length > PREVIEW_ANSWERED_CAP

  if (!full) {
    // Preview mode: keep sparse-content thresholds so the home page doesn't
    // look empty when only one or two items have been submitted.
    const showPhotos = photos.length >= 3
    const showShoutouts = shoutouts.length >= 2
    const showAnswered = answered.length >= 1
    if (!showPhotos && !showShoutouts && !showAnswered) return null
    return (
      <section className="section section-white">
        <div className="contain">
          <Header />
          {showPhotos && <PhotoGrid photos={shownPhotos} />}
          {showShoutouts && <ShoutoutList shoutouts={shownShoutouts} />}
          {showAnswered && <AnsweredList answered={shownAnswered} />}
          {(moreThanPreview || totalItems > 0) && (
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link
                to="/wall"
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--red)',
                  textDecoration: 'none',
                  padding: '14px 28px',
                  border: '2px solid var(--red)',
                }}
              >
                See every memory &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Full mode (/wall): always render each section; empty states where needed.
  return (
    <section className="section section-white">
      <div className="contain">
        <PhotoGrid photos={shownPhotos} empty="No photos yet." />
        <ShoutoutList shoutouts={shownShoutouts} empty="No memories yet." />
        {shownAnswered.length > 0 && <AnsweredList answered={shownAnswered} />}
      </div>
    </section>
  )
}

function Header() {
  return (
    <>
      <h2 className="heading-section" style={{ color: 'var(--red)' }}>The Love Wall</h2>
      <p className="center-text" style={{ color: 'var(--gray-600)', marginTop: '12px', fontSize: '1rem' }}>
        Everybody in Amistad is <Family />. This is what that looks like.
      </p>
    </>
  )
}

function SectionHeading({ children }) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--gray-400)',
        marginBottom: '16px',
      }}
    >
      {children}
    </h3>
  )
}

function PhotoGrid({ photos, empty }) {
  return (
    <div style={{ marginTop: '40px' }}>
      <SectionHeading>In My Corner</SectionHeading>
      {photos.length === 0 ? (
        <EmptyLine>{empty}</EmptyLine>
      ) : (
        <div className="photo-masonry">
          {photos.map((p) => (
            <div key={p.id} className="photo-masonry-item">
              <img
                src={p.storageUrl}
                alt={p.name}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(204,0,0,0.85)',
                  color: '#fff',
                  textAlign: 'center',
                  padding: '4px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                }}
              >
                {p.name}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .photo-masonry {
          column-count: 3;
          column-gap: 6px;
        }
        .photo-masonry-item {
          position: relative;
          break-inside: avoid;
          margin-bottom: 6px;
          -webkit-column-break-inside: avoid;
          page-break-inside: avoid;
        }
        @media (max-width: 640px) {
          .photo-masonry { column-count: 2; }
        }
      `}</style>
    </div>
  )
}

function ShoutoutList({ shoutouts, empty }) {
  return (
    <div style={{ marginTop: '40px' }}>
      <SectionHeading>In Their Words</SectionHeading>
      {shoutouts.length === 0 ? (
        <EmptyLine>{empty}</EmptyLine>
      ) : (
        <div className="grid-2">
          {shoutouts.map((s) => (
            <div
              key={s.id}
              style={{
                borderLeft: '4px solid var(--red)',
                padding: '16px 20px',
                background: 'var(--gray-100)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red)', fontSize: '0.95rem' }}>
                {s.name}
              </p>
              <p style={{ color: 'var(--gray-600)', marginTop: '4px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {s.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AnsweredList({ answered }) {
  return (
    <div style={{ marginTop: '40px' }}>
      <SectionHeading>In Caleigh&rsquo;s Words</SectionHeading>
      <div className="space-y">
        {answered.map((item) => (
          <div
            key={item.id}
            style={{
              borderLeft: '4px solid var(--gold)',
              padding: '16px 20px',
              background: 'var(--gray-100)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gray-800)', fontSize: '0.95rem' }}>
              {item.question}
            </p>
            <p style={{ color: 'var(--red)', fontStyle: 'italic', marginTop: '8px', lineHeight: 1.5, fontSize: '0.9rem' }}>
              &ldquo;{item.answer}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyLine({ children }) {
  return (
    <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem', textAlign: 'center', padding: '24px 0' }}>
      {children}
    </p>
  )
}

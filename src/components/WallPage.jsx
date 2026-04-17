import { Link } from 'react-router-dom'
import CommunityFeed from './CommunityFeed.jsx'
import Footer from './Footer.jsx'
import Family from './Family.jsx'

/**
 * /wall — the full archive of memories, photos, and answered Q&A.
 * Linked from the home-page Caleigh's Corner preview. Simple static
 * page: header + full CommunityFeed + footer.
 */
export default function WallPage() {
  return (
    <>
      <WallHeader />
      <CommunityFeed full />
      <Footer />
    </>
  )
}

function WallHeader() {
  return (
    <section
      style={{
        background: 'var(--white)',
        padding: 'clamp(40px, 7vw, 80px) 24px clamp(24px, 4vw, 40px)',
        borderBottom: '1px solid var(--gray-200)',
      }}
    >
      <div className="contain center-text">
        <Link
          to="/"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--gray-400)',
            textDecoration: 'none',
            marginBottom: '24px',
          }}
        >
          &larr; Back
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(2.25rem, 7vw, 4rem)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: 'var(--red)',
            textTransform: 'uppercase',
          }}
        >
          Welcome to Caleigh&rsquo;s Corner
        </h1>

        <p
          className="text-balance"
          style={{
            color: 'var(--gray-600)',
            marginTop: '16px',
            fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
            lineHeight: 1.55,
            maxWidth: '540px',
            margin: '16px auto 0',
          }}
        >
          Everybody here is <Family />. Every memory, every pic, every shoutout.
        </p>

        <div style={{ marginTop: '28px' }}>
          <Link
            to="/#team-caleigh"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--white)',
              background: 'var(--red)',
              textDecoration: 'none',
              padding: '14px 26px',
            }}
          >
            Add yours &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}

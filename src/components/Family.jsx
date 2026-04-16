/**
 * Renders "family" with "AMI" styled in brand red and bold,
 * reinforcing the Amistad wordplay (amistad = friendship, ami = friend).
 *
 *   <Family />       → fAMIly
 *   <Family cap />   → FAMIly   (use at the start of a sentence)
 */
export default function Family({ cap = false }) {
  const firstLetter = cap ? 'F' : 'f'
  return (
    <span>
      {firstLetter}
      <span style={{ color: 'var(--red)', fontWeight: 700 }}>AMI</span>
      ly
    </span>
  )
}

/**
 * Renders "family" with "AMI" styled in a chosen color and bold,
 * reinforcing the Amistad wordplay (amistad = friendship, ami = friend).
 *
 *   <Family />                       → fAMIly (AMI in brand red — light backgrounds)
 *   <Family color="var(--gold)" />   → fAMIly (AMI in gold — red backgrounds)
 *   <Family cap />                   → FAMIly (capitalized first letter)
 */
export default function Family({ cap = false, color = 'var(--red)' }) {
  const firstLetter = cap ? 'F' : 'f'
  return (
    <span>
      {firstLetter}
      <span style={{ color, fontWeight: 700 }}>AMI</span>
      ly
    </span>
  )
}

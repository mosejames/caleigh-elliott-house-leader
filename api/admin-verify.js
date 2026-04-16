// POST /api/admin-verify  { password }
// Returns { ok: true } on match, 401 otherwise.
export async function POST(request) {
  const serverPassword = process.env.ADMIN_PASSWORD
  if (!serverPassword) {
    return Response.json(
      { error: 'ADMIN_PASSWORD env var is not configured on the server' },
      { status: 500 },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body?.password !== serverPassword) {
    console.warn('[admin-verify] Rejected login attempt')
    return Response.json({ error: 'Wrong password' }, { status: 401 })
  }

  return Response.json({ ok: true })
}

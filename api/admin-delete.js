import admin from 'firebase-admin'

// Initialize once and reuse across warm invocations.
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    })
  }
}

const ALLOWED_COLLECTIONS = new Set(['shoutouts', 'photos', 'questions'])

// POST /api/admin-delete  { password, collection, id }
export async function POST(request) {
  const serverPassword = process.env.ADMIN_PASSWORD
  if (!serverPassword) {
    console.error('[admin-delete] ADMIN_PASSWORD not set')
    return Response.json({ error: 'Server not configured (ADMIN_PASSWORD)' }, { status: 500 })
  }

  if (!admin.apps.length) {
    console.error('[admin-delete] firebase-admin not initialized — check FIREBASE_* env vars')
    return Response.json(
      { error: 'Server not configured (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)' },
      { status: 500 },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { password, collection, id } = body || {}

  if (password !== serverPassword) {
    console.warn('[admin-delete] Rejected delete attempt')
    return Response.json({ error: 'Wrong password' }, { status: 401 })
  }

  if (!ALLOWED_COLLECTIONS.has(collection)) {
    return Response.json({ error: `Collection "${collection}" not allowed` }, { status: 400 })
  }

  if (typeof id !== 'string' || !id) {
    return Response.json({ error: 'Missing or invalid id' }, { status: 400 })
  }

  try {
    await admin.firestore().collection(collection).doc(id).delete()
    console.log(`[admin-delete] Deleted ${collection}/${id}`)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[admin-delete] Delete failed:', err)
    return Response.json({ error: err?.message || 'Delete failed' }, { status: 500 })
  }
}

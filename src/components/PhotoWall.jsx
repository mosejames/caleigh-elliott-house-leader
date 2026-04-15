import { useState, useEffect } from 'react'
import { db, storage } from '../firebase.js'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { triggerShare } from '../utils/share.js'

export default function PhotoWall() {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPhotos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !name.trim()) return
    setUploading(true)
    try {
      const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadUrl = await getDownloadURL(storageRef)
      await addDoc(collection(db, 'photos'), { name: name.trim(), storageUrl: downloadUrl, timestamp: serverTimestamp() })
      setName('')
      setFile(null)
      setUploaded(true)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="section section-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="heading-section text-center" style={{ color: 'var(--red)' }}>
          Put Yourself On The Wall
        </h2>

        {/* Upload form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="input-light"
          />

          <label
            style={{
              display: 'block',
              background: 'rgba(204, 0, 0, 0.05)',
              border: '2px dashed var(--red)',
              borderRadius: '16px',
              padding: '32px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setUploaded(false) } }} style={{ display: 'none' }} />
            {file ? (
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>{file.name}</span>
            ) : (
              <span style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>
                Tap to upload a photo {'\u{1F4F8}'}
              </span>
            )}
          </label>

          <button type="submit" disabled={uploading || !file || !name.trim()} className="btn btn-primary btn-full">
            {uploading ? (
              <>
                <span style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                Uploading...
              </>
            ) : (
              'Upload to the Wall'
            )}
          </button>
        </form>

        {/* Share prompt */}
        {uploaded && (
          <div className="text-center mt-8">
            <p style={{ color: 'var(--gray-600)', fontWeight: 500, marginBottom: '12px' }}>
              You're on the wall. Send this to someone who should be up here too.
            </p>
            <button onClick={() => triggerShare("I'm on the wall! Put yourself up too \u{1F534}\u{26AA}")} className="btn btn-gold">
              Share the Wall
            </button>
          </div>
        )}

        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.storageUrl}
                  alt={photo.name}
                  className="w-full aspect-square object-cover"
                  style={{ borderRadius: '16px', border: '4px solid var(--red)' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(204, 0, 0, 0.9)',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '8px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    borderRadius: '0 0 12px 12px',
                  }}
                >
                  {photo.name}
                </div>
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'var(--gold)',
                    color: 'var(--red)',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  Amistad
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

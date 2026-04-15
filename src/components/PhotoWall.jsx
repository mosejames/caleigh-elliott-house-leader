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
      const photoData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPhotos(photoData)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !name.trim()) return

    setUploading(true)
    try {
      const storagePath = `photos/${Date.now()}_${file.name}`
      const storageRef = ref(storage, storagePath)
      await uploadBytes(storageRef, file)
      const downloadUrl = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'photos'), {
        name: name.trim(),
        storageUrl: downloadUrl,
        timestamp: serverTimestamp(),
      })

      setName('')
      setFile(null)
      setUploaded(true)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploaded(false)
    }
  }

  const handleSharePrompt = () => {
    triggerShare("I'm on the wall! Caleigh Elliott is running for House Leader. Put yourself on the wall too. 🔴⚪")
  }

  const handleSharePhoto = (photo) => {
    triggerShare(`Check out ${photo.name} on the wall for Caleigh Elliott, House Leader. We are that house. 🔴⚪`)
  }

  return (
    <section className="bg-white px-8 py-24">
      <h2
        className="text-3xl md:text-5xl font-bold text-center"
        style={{ color: '#CC0000', fontFamily: "'Montserrat', sans-serif" }}
      >
        Put Yourself On The Wall
      </h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '14px 18px',
            width: '100%',
            fontSize: '18px',
            outline: 'none',
            fontFamily: "'Inter', sans-serif",
          }}
        />

        <label
          style={{
            backgroundColor: 'rgba(204, 0, 0, 0.08)',
            border: '2px dashed #CC0000',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'block',
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <span className="font-medium" style={{ color: '#CC0000' }}>{file.name}</span>
          ) : (
            <span className="text-lg" style={{ color: '#CC0000' }}>Tap to upload a photo 📸</span>
          )}
        </label>

        <button
          type="submit"
          disabled={uploading || !file || !name.trim()}
          className="hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          style={{
            backgroundColor: '#CC0000',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {uploading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload to the Wall'
          )}
        </button>
      </form>

      {/* Share prompt after successful upload */}
      {uploaded && (
        <div className="max-w-md mx-auto mt-6 text-center space-y-3">
          <p className="text-gray-700 font-medium">
            You're on the wall. Send this to someone who should be up here too.
          </p>
          <button
            onClick={handleSharePrompt}
            className="px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            style={{
              backgroundColor: '#FFD700',
              color: '#CC0000',
              padding: '14px 28px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Share the Wall
          </button>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.storageUrl}
                alt={photo.name}
                className="w-full aspect-square object-cover rounded-xl"
                style={{ border: '4px solid #CC0000' }}
              />
              {/* Name overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 text-center py-2 font-bold rounded-b-xl"
                style={{ backgroundColor: 'rgba(204, 0, 0, 0.9)', color: '#fff' }}
              >
                {photo.name}
              </div>
              {/* House of Amistad stamp */}
              <span
                className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full"
                style={{ backgroundColor: '#FFD700', color: '#CC0000' }}
              >
                House of Amistad
              </span>
              {/* Share button - visible on hover (desktop) or always visible (mobile) */}
              <button
                onClick={() => handleSharePhoto(photo)}
                className="absolute top-2 left-2 bg-white/90 text-xs font-bold px-3 py-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: '#CC0000' }}
              >
                Share
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

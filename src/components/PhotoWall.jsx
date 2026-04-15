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
    <section className="bg-white px-6 py-20">
      <h2 className="text-red-brand font-heading text-3xl md:text-4xl font-bold text-center">
        Put Yourself On The Wall
      </h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border-2 border-gray-200 focus:border-red-brand rounded-xl px-4 py-3 w-full text-lg outline-none transition-colors"
        />

        <label className="block bg-red-brand/10 border-2 border-dashed border-red-brand rounded-xl p-8 text-center cursor-pointer hover:bg-red-brand/20 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <span className="text-red-brand font-medium">{file.name}</span>
          ) : (
            <span className="text-red-brand text-lg">Tap to upload a photo 📸</span>
          )}
        </label>

        <button
          type="submit"
          disabled={uploading || !file || !name.trim()}
          className="bg-red-brand text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform w-full disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
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
            className="bg-gold-accent text-red-brand px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
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
                className="w-full aspect-square object-cover rounded-xl border-4 border-red-brand"
              />
              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-red-brand/90 text-white text-center py-2 font-bold rounded-b-xl">
                {photo.name}
              </div>
              {/* House of Amistad stamp */}
              <span className="absolute top-2 right-2 bg-gold-accent text-red-brand text-xs font-bold px-2 py-1 rounded-full">
                House of Amistad
              </span>
              {/* Share button - visible on hover (desktop) or always visible (mobile) */}
              <button
                onClick={() => handleSharePhoto(photo)}
                className="absolute top-2 left-2 bg-white/90 text-red-brand text-xs font-bold px-3 py-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
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

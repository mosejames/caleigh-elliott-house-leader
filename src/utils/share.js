const SITE_URL = window.location.origin

const DEFAULT_SHARE_TEXT = `Show some love for Caleigh! House of Amistad is family. Drop a shoutout or share a pic. \u{1F534}\u{26AA} ${SITE_URL}`

export async function triggerShare(customText) {
  const text = customText || DEFAULT_SHARE_TEXT

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Caleigh Elliott for House Leader',
        text,
        url: SITE_URL,
      })
      return true
    } catch (err) {
      if (err.name !== 'AbortError') {
        return fallbackCopy(text)
      }
      return false
    }
  }

  return fallbackCopy(text)
}

async function fallbackCopy(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

export async function shareImage(blob, filename) {
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], filename, { type: 'image/png' })
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'House of Amistad',
          text: DEFAULT_SHARE_TEXT,
        })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

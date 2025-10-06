'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FileUploadProps {
  roomId: string
  onUploadComplete: () => void
}

export function FileUpload({ roomId, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/uploadthing', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      const { url } = await uploadRes.json()

      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          content: `Shared a file: ${file.name}`,
          fileUrl: url,
          fileName: file.name,
          fileType: file.type,
        }),
      })

      onUploadComplete()
      router.refresh()
    } catch (error) {
      console.error('File upload error:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      {/* TODO: Polish UI - add drag-and-drop, preview, progress bar */}
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
        accept="image/*,video/*,.pdf"
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? 'Uploading...' : '📎 Attach File'}
      </label>
    </div>
  )
}
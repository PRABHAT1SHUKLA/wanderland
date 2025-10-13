import { describe, it, expect } from 'vitest'
import { formatTimestamp, generateId, getFileType } from '@/lib/utils'

describe('Utils', () => {
  describe('formatTimestamp', () => {
    it('should return "Just now" for recent timestamps', () => {
      const now = Date.now()
      expect(formatTimestamp(now)).toBe('Just now')
    })

    it('should return minutes ago for timestamps within an hour', () => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      expect(formatTimestamp(fiveMinutesAgo)).toBe('5m ago')
    })

    it('should return hours ago for timestamps within a day', () => {
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
      expect(formatTimestamp(twoHoursAgo)).toBe('2h ago')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should generate IDs with correct format', () => {
      const id = generateId()
      expect(id).toMatch(/^\d+-[a-z0-9]+$/)
    })
  })

  describe('getFileType', () => {
    it('should detect image files', () => {
      expect(getFileType('photo.jpg')).toBe('image')
      expect(getFileType('picture.png')).toBe('image')
    })

    it('should detect video files', () => {
      expect(getFileType('video.mp4')).toBe('video')
      expect(getFileType('clip.webm')).toBe('video')
    })

    it('should detect PDF files', () => {
      expect(getFileType('document.pdf')).toBe('pdf')
    })

    it('should return "other" for unknown types', () => {
      expect(getFileType('file.txt')).toBe('other')
    })
  })
})
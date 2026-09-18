import { useEffect } from 'react'

/**
 * Enterprise Client Security Shield Hook
 * Prevents casual code theft, right-click context menu, developer shortcut inspection, and image dragging.
 */
export function useSecurityShield() {
  useEffect(() => {
    // 1. Prevent Right-Click Context Menu
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // 2. Prevent Developer Tools Shortcuts & Source Inspection
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      const isMetaOrCtrl = e.ctrlKey || e.metaKey

      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element Mode)
      if (isMetaOrCtrl && e.shiftKey && ['i', 'j', 'c'].includes(key)) {
        e.preventDefault()
        return false
      }

      // Ctrl+U / Cmd+Option+U (View Page Source)
      if (isMetaOrCtrl && key === 'u') {
        e.preventDefault()
        return false
      }

      // Ctrl+S / Cmd+S (Save Page As HTML/Code)
      if (isMetaOrCtrl && key === 's') {
        e.preventDefault()
        return false
      }
    }

    // 3. Prevent Image / Asset Drag & Drop Theft
    const handleDragStart = (e) => {
      if (e.target && e.target.nodeName && e.target.nodeName.toLowerCase() === 'img') {
        e.preventDefault()
        return false
      }
    }

    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('dragstart', handleDragStart)

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('dragstart', handleDragStart)
    }
  }, [])
}

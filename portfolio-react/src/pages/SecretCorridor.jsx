import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PersistentUI from './EasterEgg/components/PersistentUI'
import EEPreloader from './EasterEgg/scenes/Preloader'
import BuildingExterior from './EasterEgg/scenes/BuildingExterior'
import Hub from './EasterEgg/scenes/Hub'
import Gallery from './EasterEgg/scenes/Gallery'
import Studio from './EasterEgg/scenes/Studio'

import './EasterEgg/easter-egg.css'

/**
 * Scene state machine:
 *   preloader → building → hub → (gallery | studio)
 *                                  ↕ back to hub
 */
export default function SecretCorridor() {
  const navigate = useNavigate()
  const [scene, setScene] = useState('preloader')
  const [prevScene, setPrevScene] = useState(null)

  // Guard: redirect if not unlocked
  useEffect(() => {
    if (sessionStorage.getItem('corridor-unlocked') !== 'true') {
      navigate('/', { replace: true })
    }
  }, [navigate])

  // Lock scrolling on the html/body
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  const goTo = useCallback((next) => {
    setPrevScene(scene)
    setScene(next)
  }, [scene])

  // Back handler — go to parent scene or exit
  const handleBack = useCallback(() => {
    if (scene === 'gallery' || scene === 'studio') {
      goTo('hub')
    } else if (scene === 'hub') {
      sessionStorage.removeItem('corridor-unlocked')
      navigate('/')
    } else {
      navigate('/')
    }
  }, [scene, goTo, navigate])

  const handleNavigate = useCallback((door) => {
    if (door === 'gallery' || door === 'studio') {
      goTo(door)
    }
  }, [goTo])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Persistent UI (except during preloader & building) */}
      {scene !== 'preloader' && scene !== 'building' && (
        <PersistentUI onBack={handleBack} />
      )}

      {/* Scene renderer */}
      {scene === 'preloader' && (
        <EEPreloader onComplete={() => goTo('building')} />
      )}

      {scene === 'building' && (
        <BuildingExterior onEnter={() => goTo('hub')} />
      )}

      {scene === 'hub' && (
        <Hub onNavigate={handleNavigate} />
      )}

      {scene === 'gallery' && (
        <Gallery onBack={() => goTo('hub')} />
      )}

      {scene === 'studio' && (
        <Studio onBack={() => goTo('hub')} />
      )}
    </div>
  )
}

import { useEffect, useRef } from 'react'

/**
 * Hook that adds the 'fade-in--visible' class to elements
 * with className 'fade-in' when they enter the viewport.
 */
export function useFadeIn(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-in:not(.fade-in--visible)')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach(el => observer.observe(el))
    // Trigger immediately-visible elements
    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('fade-in--visible')
      }
    })
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Hook for parallax image effect on scroll
 */
export function useParallax(ref, { intensity = 15 } = {}) {
  useEffect(() => {
    if (!ref.current) return
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!ref.current) return
          const wrap = ref.current.closest('[data-parallax-wrap]')
          if (!wrap) return
          const rect = wrap.getBoundingClientRect()
          const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
          const offset = -progress * intensity
          ref.current.style.transform = `translateY(${offset}%)`
          ticking = false
        })
        ticking = true
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    document.body.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.body.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('scroll', onScroll)
    }
  }, [ref, intensity])
}

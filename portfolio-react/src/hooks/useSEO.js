import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SEO_CONFIG = {
  '/': {
    title: 'Muhammad Abdullah | Software Engineer & Systems Architect',
    description: 'Muhammad Abdullah — Software Engineer & Systems Architect. Specialized in 3D game physics, mission-critical database infrastructure, and hardware-level performance engineering.',
  },
  '/works': {
    title: 'Works & Projects | Muhammad Abdullah — Software Engineer',
    description: 'Explore engineering projects by Muhammad Abdullah: Ragdoll Royale 3D physics RTS game engine, MCUFLIX desktop streaming suite, gamified learning architectures, and e-commerce SaaS platforms.',
  },
  '/contact': {
    title: 'Contact Muhammad Abdullah | Software Engineer & Collaborations',
    description: 'Get in touch with Muhammad Abdullah for software engineering, game systems architecture, and technical collaborations.',
  },
}

export function useSEO() {
  const location = useLocation()

  useEffect(() => {
    const config = SEO_CONFIG[location.pathname] || SEO_CONFIG['/']
    
    // Update Title
    document.title = config.title

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', config.description)
    }

    // Update Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}${location.pathname === '/' ? '' : location.pathname}`)
    }
  }, [location.pathname])
}

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import ThemeToggle from './components/ThemeToggle'
import Preloader from './components/Preloader'
import Home from './pages/Home'
import Works from './pages/Works'
import Contact from './pages/Contact'

import { useSEO } from './hooks/useSEO'

function Layout({ children, loading, revealing }) {
  useSEO()
  const contentClass = [
    'app-content',
    loading && !revealing ? 'app-content--hidden' : 'app-content--revealed',
  ].filter(Boolean).join(' ')

  return (
    <>
      <Cursor visible={!loading} />
      <div className={contentClass}>
        <ThemeToggle />
        <Nav />
        <main className="main">{children}</main>
        <footer className="site-footer">
          <p>© Muhammad Abdullah</p>
        </footer>
      </div>
    </>
  )
}

import { useSecurityShield } from './hooks/useSecurityShield'

export default function App() {
  useSecurityShield()
  const [loading, setLoading] = useState(true)
  const [revealing, setRevealing] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    <ThemeProvider>
      {loading && (
        <Preloader
          onStartReveal={() => setRevealing(true)}
          onComplete={() => {
            setLoading(false)
            setRevealing(false)
          }}
        />
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout loading={loading} revealing={revealing}><Home /></Layout>} />
          <Route path="/works" element={<Layout loading={loading} revealing={revealing}><Works /></Layout>} />
          <Route path="/contact" element={<Layout loading={loading} revealing={revealing}><Contact /></Layout>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFadeIn, useParallax } from '../hooks/useAnimations';
import HeroLetterGrid from '../components/HeroLetterGrid';
import SecretDoorButton from '../components/SecretDoorButton';

const ArrowUpRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7h10v10" /><path d="M7 17 17 7" />
  </svg>
)

const DownloadIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13m0 0-4-4m4 4 4-4M5 21h14" />
  </svg>
)

export default function Home() {
  const parallaxRef = useRef(null)
  useParallax(parallaxRef, { intensity: 18 })
  useFadeIn([])   // trigger on mount

  return (
    <>
      {/* ===== HERO ===== */}
      <div id="home" className="home-grid">
        <div className="home-left">
          <div className="fade-in">
            <HeroLetterGrid />
          </div>
          <div className="hero-inquiry fade-in fade-in--d2">
            <p className="hero-title" style={{ marginTop: 0, marginLeft: "30px" }}>
              Software Engineer <br /> Game Dev & Systems
            </p>
          </div>
        </div>

        <div className="home-right">
          <div id="about" className="fade-in">
            <div className="section-header">
              <h2 className="section-title">About Me</h2>
              <div className="section-divider" />
            </div>
            <div className="about-text">
              <p>I specialize in software architecture and systems engineering, building high-performance 3D physics mechanics, game engines, and mission-critical database infrastructure. My baseline is engineering raw, chaotic concepts into rock-solid functional reality.</p>
              <p>Beyond the codebase, I bring structural thinking to community impact as the Founder of the KUN Foundation, leading large-scale volunteer operations and social initiatives.</p>
            </div>
            <div className="about-cv-wrap">
              <a href="/Muhammad_Abdullah_Resume.pdf" download="Muhammad_Abdullah_Resume.pdf" className="cv-download">
                <div className="cv-download__circle">
                  <DownloadIcon />
                </div>
                <span>Download CV</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOTIVATION ===== */}
      <div id="motivation" className="motivation">
        <div className="motivation__inner">
          <div className="motivation__text fade-in">
            <div className="section-header">
              <h2 className="section-title">Motivation</h2>
              <div className="section-divider" />
            </div>
            <p>My fascination with technology didn't start with just writing code; it started with a relentless need to understand how things work under the hood. Whether I was diagnosing hardware bottlenecks, analyzing custom PC configurations, or pushing Arduino circuit simulations to their limits, I’ve always been obsessed with the architecture of a system. The thrill of taking a raw, chaotic concept and engineering it into a functional reality quickly became my baseline.</p>
            <p>That drive to build and optimize defined my work on Ragdoll Royale. Spending 30 weeks developing a 3D physics-based combat game from scratch in Unity meant relentlessly tweaking finite state machines and spatial mechanics until the gameplay felt perfectly controlled. It’s the exact same problem-solving instinct I relied on during my time at PITC. When a critical database crashed and threatened system operations, the pressure was immense. I didn't panic; I tracked the fault, systematically debugged the issue, and had everything fully restored within two hours.</p>
            <p>But logic and code are only half the equation. Stepping up as Head Boy, debating at Model UN, and eventually founding the KUN Foundation taught me how to scale impact beyond a screen. Orchestrating large-scale volunteer operations and winter clothing drives requires the same structural thinking and adaptability as designing a complex software backend—you're just working with human variables instead of data structures.</p>
            <p>One thing people don't always expect: I dissect the technical specs of twin-turbo engines and analyze the exact cut of a tailored sherwani with the same obsessive precision I apply to my code. Whether it's coordinating the perfect lapel pin and pocket square or optimizing a neural network's backpropagation, I believe that true excellence is always found in mastering the details.</p>
          </div>
          <div className="motivation__image fade-in fade-in--d1">
            <div className="motivation__img-wrap" data-parallax-wrap>
              <div className="motivation__img-inner" ref={parallaxRef}>
                <img
                  src="/images/me.jpeg"
                  alt="Muhammad Abdullah"
                  onError={e => {
                    e.currentTarget.parentElement.style.background =
                      'linear-gradient(135deg,#1a1a2e,#16213e)'
                    e.currentTarget.remove()
                  }}
                />
                <div className="motivation__img-overlay" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SKILLS ===== */}
      <section id="skills" className="skills">
        <div className="skills__inner">
          <div className="skills__header section-header fade-in">
            <h2 className="section-title">Skills</h2>
            <div className="section-divider" />
          </div>
          <div className="skills__grid">
            {[
              {
                title: 'Game Dev & Physics',
                tags: ['Unity', 'C#', '3D Physics', 'Finite State Machines', 'Spatial Mechanics'],
              },
              {
                title: 'Systems & Architecture',
                tags: ['Database Diagnostics', 'SQL/PostgreSQL', 'Crash Recovery', 'REST APIs', 'Node.js'],
              },
              {
                title: 'AI/ML & Hardware',
                tags: ['Neural Networks', 'Backpropagation', 'Arduino Simulations', 'Python', 'PC Architecture'],
              },
            ].map(({ title, tags }, i) => (
              <div key={title} className={`skills__category fade-in${i > 0 ? ` fade-in--d${i}` : ''}`}>
                <h3>{title}</h3>
                <div className="skills__tags">
                  {tags.map(tag => (
                    <span key={tag} className="skill-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CHAPTER NAV ===== */}
      <section className="chapter-nav">
        <div className="chapter-nav__inner">
          <Link to="/works" className="chapter-link">
            <div className="fade-in">
              <p className="chapter-link__label">Next Chapter</p>
              <div className="chapter-link__row">
                <h2 className="chapter-link__title">WORKS</h2>
                <span className="chapter-link__arrow"><ArrowUpRight /></span>
              </div>
              <div className="chapter-link__underline">
                <div className="chapter-link__line-base" />
                <div className="chapter-link__line-active" />
              </div>
            </div>
          </Link>

          <Link to="/contact" className="chapter-link">
            <div className="fade-in">
              <p className="chapter-link__label">Get In Touch</p>
              <div className="chapter-link__row">
                <h2 className="chapter-link__title">CONTACT</h2>
                <span className="chapter-link__arrow"><ArrowUpRight /></span>
              </div>
              <div className="chapter-link__underline">
                <div className="chapter-link__line-base" />
                <div className="chapter-link__line-active" />
              </div>
            </div>
          </Link>
        </div>
      </section>
      <SecretDoorButton />
    </>
  )
}

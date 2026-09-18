import { useEffect, useRef, useState, useCallback } from 'react'

const projects = [
  {
    title: 'RAGDOLL ROYALE',
    category: '3D Physics RTS & Engine Architecture',
    desc: 'Engineered a high-performance 3D physics-based RTS combat game in Unity (C#) with an Entity-Component-System (ECS) architecture. Multi-threaded rigid-body ragdoll simulations with complex joint physics and autonomous FSM combat AI running at a sustained 60 FPS on mobile hardware without thermal throttling.',
    href: '#',
    img: '/images/RagdollRoyale.png',
    imgAlt: 'RAGDOLL ROYALE: THE FLYING FORTRESS',
    fallbackBg: 'linear-gradient(135deg,#1c0a00,#7c1d1d)',
  },
  {
    title: 'CODEQUEST',
    category: 'Gamified Learning Platform',
    desc: 'Engineered an interactive, gamified platform to teach Python programming. Designed dynamic feature flows and integrated hidden technical Easter eggs to drive user retention and deliver a highly engaging learning environment.',
    href: 'https://code-quest-taupe.vercel.app',
    img: '/images/CodeQuest.png',
    imgAlt: 'CODEQUEST',
    fallbackBg: 'linear-gradient(135deg,#0f2027,#203a43)',
  },
  {
    title: 'ONLINE365',
    category: 'Logistics & E-Commerce Prep SaaS',
    desc: 'Delivered a full SaaS dashboard for a real e-commerce prep-services client, covering supply chain tracking, real-time inventory management, and order fulfilment workflows. Containerized with Docker & CI/CD pipelines.',
    href: 'https://portal.theonline365.com/',
    img: '/images/Online365.png',
    imgAlt: 'ONLINE365',
    fallbackBg: 'linear-gradient(135deg,#0f3460,#533483)',
  },
  {
    title: 'TOUCHLESS MOUSE',
    category: 'Computer Vision & AI',
    desc: 'Real-time hand-gesture interface using MediaPipe 3D landmark detection and OpenCV in Python for system-level cursor control without physical input devices.',
    href: '#',
    img: '/images/VirtualMouse.png',
    imgAlt: 'TOUCHLESS MOUSE',
    fallbackBg: 'linear-gradient(135deg,#1b262c,#0f4c75)',
  },
  {
    title: 'ZAIN AHMED PORTFOLIO',
    category: 'Mechanical Engineering & Simulations',
    desc: 'Engineered a high-performance digital portfolio for a Mechanical Engineer specializing in advanced physics simulations. Features a sleek, dark-mode technical UI designed to showcase complex engineering solutions and precision modeling.',
    href: 'https://www.zainahmed.cv/',
    img: '/images/ZainAhmed.png',
    imgAlt: 'ZAIN AHMED',
    fallbackBg: 'linear-gradient(135deg,#040814,#101a2e)',
  },
]

const CARD_BORDERS = [
  {
    straight: 'M -2.1036774620197414,4.273243567064204 L 100.35280002014967,-0.8920062382698206 M 96.60268931334215,0.6985387454973147 L 99.64246649679697,102.47339561655845 M 102.03029621310439,96.63994722277657 L 2.4999755163767587,97.65856770499892 M 3.0504175920666023,103.47651838923717 L 2.625719600392792,0.7197582916626633',
    curved: 'M -1.8455899675182272,-1.0039489870867042 Q 50.59950883865181,3.6517810029105107 101.34662255414422,1.9645947628383844 Q 96.61511838329932,46.377686551973504 97.47059299960891,101.05023380191841 Q 53.82550371361801,101.08362315323147 -0.6545355368518702,94.04787350362855 Q -1.61615058129226,52.20570672496676 5.999647440429069,4.116330744480095',
  },
  {
    straight: 'M 2.342294783950657,1.4697920427338715 L 101.76934962014961,3.4421753165736275 M 99.86967628960839,1.5023991073051053 L 95.50682430636924,98.80826195489891 M 102.20537806611294,100.4942751422285 L -1.4899471555183366,98.11576862526798 M -0.4454516568956799,99.24166503651243 L 1.5453867863738735,-2.347682440023203',
    curved: 'M 5.1864474963319696,1.6869979555547228 Q 46.47532105095758,-3.4957822827797442 97.74712049264465,5.222519520917954 Q 103.73514896306948,50.8136996740969 95.14413865732794,94.1002433885323 Q 48.641766363671024,102.43204308023526 5.986310604772505,99.87558254309515 Q -1.9595474590118311,46.00692143578056 -0.35539165250897664,3.447831482073103',
  },
  {
    straight: 'M -0.7048598192390394,0.3625042581050779 L 97.52565473037079,-0.03629316749425282 M 100.35452209372413,-2.4999959886712246 L 99.3469851009562,98.9555623233621 M 98.52439072899776,96.36928288153574 L -0.7134488323524496,101.40167321694219 M 3.8818103217587776,100.63181969516329 L -1.2796676571158008,2.095239078668659',
    curved: 'M 2.0248682336261994,5.37925525381206 Q 53.62677057787717,0.539849758351455 94.95659356064213,-1.828568792109455 Q 98.9062373462548,52.64664382432747 101.95373817593682,99.62578388218763 Q 47.80309138484166,96.00022653670909 -0.12526503517420107,99.7032022651198 Q 3.965753257582334,52.582208994031845 0.824593689835375,-1.852358473459661',
  },
  {
    straight: 'M -1.4971299934390438,4.493653323121185 L 101.1975232875972,-0.19960413588205217 M 96.50617895091074,1.4952303906088162 L 98.87806819338914,102.44407492980406 M 102.76301044718616,97.46104228996454 L 2.3454106341813046,97.00449616232383 M 2.1890599844509984,103.1998029287687 L 3.1880572052874347,-0.16462177800769562',
    curved: 'M -1.2162658444481487,-1.7389065488928614 Q 49.17598618486355,2.8484734201220028 101.90208732932851,3.3681401433480804 Q 97.57633121907497,46.01283219466308 96.11511686271155,99.95035439459906 Q 53.99244509061232,102.36390018242048 0.5619963481954833,94.08218643974594 Q -2.795603749328949,50.896871256141964 5.764766964849661,5.171353288186979',
  },
  {
    straight: 'M 2.499999111814421,0.6474714407229989 L 101.03845051315467,3.4746829728518414 M 100.63570331989428,0.7071344219417419 L 95.600163962638,98.11386053255745 M 101.36166503046577,100.2769563672676 L -2.098824520725882,98.99104308905397 M -0.10850340000106407,98.73049841304325 L 0.6560695187927916,-1.897848722847566',
    curved: 'M 5.831607301590553,3.1038945639050484 Q 47.36126625503602,-3.9553224178574857 96.36459409932328,4.188095259525507 Q 103.99987172903826,52.13418457722681 96.30633796740946,94.03563641963322 Q 47.40975246504684,101.16533014855787 5.849508667680116,100.99446667065604 Q -0.6136741736786119,46.3423941871634 -1.3387515355860433,2.049735506040739',
  },
  {
    straight: 'M -1.5005032492914692,1.1281010814588233 L 97.55731875836506,-0.7676736961712396 M 99.53252489350739,-2.3431225519596888 L 99.99946414200353,99.81750762089065 M 98.80333375152418,95.80876470056094 L 0.17119272149735454,101.00624365509333 M 4.339148867457859,101.52145139861932 L -0.7756660813134832,2.4402443549903627',
    curved: 'M 0.6219628440759597,4.415277662149116 Q 53.98799733626599,1.8941706510119156 96.058852204633,-1.9917839107472157 Q 97.62760769235888,51.42816584226255 101.91567490311425,100.80313051610273 Q 49.11340085988504,96.23880636432763 -1.177764048225744,98.32728715014989 Q 3.531432052039727,53.488794611317566 2.2385754943507123,-1.230988831874921',
  },

]

function CardBorder({ border }) {
  if (!border) return null
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="project-card-border"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}
    >
      <path d={border.straight} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <path d={border.curved} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Works() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const carouselRef = useRef(null)
  const bgLineRef = useRef(null)
  const cardRefs = useRef([])

  // Trigger SVG line draw animation on mount
  useEffect(() => {
    const el = bgLineRef.current
    if (!el) return
    // Small delay so the class is applied after paint
    const timer = requestAnimationFrame(() => {
      el.classList.add('works-bg-line--animate')
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  // Update active project with crossfade
  const updateActive = useCallback((idx) => {
    if (idx === activeIdx) return
    setFading(true)
    setTimeout(() => {
      setActiveIdx(idx)
      setFading(false)
    }, 180)
  }, [activeIdx])

  // Desktop: IntersectionObserver on cards
  useEffect(() => {
    if (window.innerWidth < 1024) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const idx = Number(entry.target.dataset.idx)
          if (entry.isIntersecting) {
            entry.target.classList.add('project-card--visible')
            updateActive(idx)
          }
        })
      },
      { threshold: 0.5 }
    )
    cardRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [updateActive])

  // Keyboard navigation: ArrowUp / ArrowDown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        scrollToCard(1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        scrollToCard(-1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx])

  // Mobile: track scroll position
  const handleCarouselScroll = () => {
    if (!carouselRef.current || window.innerWidth >= 1024) return
    const { scrollLeft, clientWidth } = carouselRef.current
    const idx = Math.round(scrollLeft / clientWidth)
    updateActive(Math.max(0, Math.min(idx, projects.length - 1)))
  }

  const scrollToCard = (dir) => {
    const next = Math.max(0, Math.min(activeIdx + dir, projects.length - 1))
    cardRefs.current[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    updateActive(next)
  }

  const project = projects[activeIdx]
  const d1 = String(Math.floor((activeIdx + 1) / 10))
  const d2 = String((activeIdx + 1) % 10)

  return (
    <div className="works-main">
      {/* Background decorative SVG line — draws from bottom to top on mount */}
      <div className="works-bg-line" ref={bgLineRef}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            pathLength="1"
            d="M -5,105
               C 15,95 25,95 30,80
               C 35,65 45,65 40,80
               C 35,95 25,95 35,70
               C 50,40 70,50 80,30
               C 90,10 100,10 90,25
               C 80,40 70,30 85,10"
            stroke="white"
            strokeWidth="0.18"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="works-wrapper">
        <div className="works-grid">

          {/* ---- LEFT: info panel (sticky on desktop) ---- */}
          <div className="works-left">
            <div className="works-left__sticky">
              <div className="works-left__content">
                <div className="works-header">
                  <h2>Works</h2>
                  <a href="https://www.linkedin.com/in/muhammad-abdullah-622a663a1/" target="_blank" rel="noopener noreferrer" className="works-header__github" style={{ textDecoration: 'none', color: 'inherit' }}>
                    /muhammad-abdullah
                  </a>
                </div>

                <div className="works-counter">
                  <span className="counter-bracket">[</span>
                  <span className="counter-digits">
                    <span className="counter-digit"><span>{d1}</span></span>
                    <span className="counter-digit"><span>{d2}</span></span>
                  </span>
                  <span className="counter-sep">/</span>
                  <span style={{ letterSpacing: '0.3em' }}>{String(projects.length).padStart(2, '0')}</span>
                  <span className="counter-bracket">]</span>
                </div>

                <div className={fading ? 'works-info works-info--fading' : 'works-info'}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h1 className="works-project__title">{project.title}</h1>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p className="works-project__category">{project.category}</p>
                  </div>
                  <div>
                    <p className="works-project__desc">{project.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- RIGHT: scrollable cards ---- */}
          <div className="works-right">
            <div
              ref={carouselRef}
              className="works-carousel no-scrollbar"
              onScroll={handleCarouselScroll}
            >
              {projects.map((p, i) => (
                <a
                  key={p.title}
                  ref={el => { cardRefs.current[i] = el }}
                  data-idx={i}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${p.title} project details`}
                  data-cursor="view"
                  className={[
                    'project-card',
                    i === 0 ? 'project-card--first' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <CardBorder border={CARD_BORDERS[i]} />
                  <div className="project-card__img-wrap">
                    <img
                      src={p.img}
                      alt={p.imgAlt}
                      className="project-card__img"
                      onError={e => {
                        e.currentTarget.parentElement.style.background = p.fallbackBg
                        e.currentTarget.remove()
                      }}
                    />
                    <div className="project-card__overlay" />
                    <div className="project-card__mobile-cta">
                      <button className="project-card__view-btn">View Project</button>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Mobile prev/next */}
            <div className="carousel-nav">
              <button
                className="carousel-nav__btn"
                onClick={() => scrollToCard(-1)}
                aria-label="Previous project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                </svg>
              </button>
              <button
                className="carousel-nav__btn"
                onClick={() => scrollToCard(1)}
                aria-label="Next project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

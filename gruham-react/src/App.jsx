import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { LangCtx, LbCtx, Ph } from './components.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { LINKS, MR, WA } from './data.js'
import { About, Blog, Contact, Design, Estimate, Home, Materials, NotFound, Process, ProjectPage, Projects, Quiz, Services, Testimonials } from './pages.jsx'

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 48 48" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 42V22a16 16 0 0 1 32 0v20" /><path d="M17 42V25a7 7 0 0 1 14 0v17" /><path d="M4 42.5h40" />
      </g>
      <circle cx="24" cy="12.2" r="2.8" fill="#F9A825" />
    </svg>
  )
}

function Layout() {
  const { pathname } = useLocation()
  const [menu, setMenu] = useState(false)
  const [lb, setLb] = useState(null)
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('lang') || 'en' } catch { return 'en' } })
  const t = s => (lang === 'mr' && MR[s]) || s

  useEffect(() => { window.scrollTo(0, 0); setMenu(false) }, [pathname])

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang])

  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.12 })
    document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  useEffect(() => {
    const k = e => e.key === 'Escape' && setLb(null)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <LbCtx.Provider value={setLb}>
        <header className="top"><div className="w">
          <Link className="logo" to="/"><Mark /><b className="mr">गृहम्</b><span>Gruham Studio</span></Link>
          <button className="burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><i /><i /></button>
          <nav aria-label="Main" className={menu ? 'open' : ''}>
            {LINKS.map(([l, to]) => <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'on' : '')}>{t(l)}</NavLink>)}
            <button className="lang" onClick={() => setLang(lang === 'en' ? 'mr' : 'en')} aria-label="Switch language">{lang === 'en' ? 'मराठी' : 'English'}</button>
            <Link className="btn sm fill" to="/contact">{t('Book a consultation')}</Link>
          </nav>
        </div></header>

        <main><ErrorBoundary key={pathname}><Outlet /></ErrorBoundary></main>

        <footer><div className="w">
          <div className="g">
            <div><Link className="logo" to="/"><Mark /><b className="mr">गृहम्</b><span>Gruham Studio</span></Link><p>Interior design studio in Goa. Homes, cafes and workplaces with a sense of place.</p></div>
            <div><h4>Studio</h4><Link to="/about">About</Link><Link to="/process">Process</Link><Link to="/testimonials">Kind words</Link><Link to="/blog">Journal</Link></div>
            <div><h4>Explore</h4><Link to="/services">Services</Link><Link to="/projects">Projects</Link><Link to="/design">3D tour</Link><Link to="/materials">Materials</Link><Link to="/quiz">Style quiz</Link><Link to="/estimate">Estimate</Link></div>
            <div><h4>Say hello</h4><Link to="/contact">Contact</Link><a href="mailto:hello@gruhamstudio.in">hello@gruhamstudio.in</a><a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">WhatsApp</a></div>
          </div>
          <div className="cp">&copy; 2026 Gruham Studio. All rights reserved.</div>
        </div></footer>

        <a className="wa" href={`https://wa.me/${WA}?text=${encodeURIComponent('Hello Gruham Studio, I would like to talk about my space.')}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.6-5.4A8.5 8.5 0 1 1 21 11.5z" /></svg>
          <span>WhatsApp</span>
        </a>

        {lb && <div className="lb" onClick={() => setLb(null)}><Ph {...lb} lb={false} /></div>}
      </LbCtx.Provider>
    </LangCtx.Provider>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectPage />} />
        <Route path="design" element={<Design />} />
        <Route path="materials" element={<Materials />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="process" element={<Process />} />
        <Route path="estimate" element={<Estimate />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </ErrorBoundary>
  )
}
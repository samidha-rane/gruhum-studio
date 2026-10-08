import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from './components.jsx'

// One project card. Used on the Home page and the Projects page.
export default function Card({ p, i = 0, hide }) {
  const { t } = useLang()
  const [ok, setOk] = useState(true)
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  // Reveal-on-scroll handled in React state. The old approach added the 'in'
  // class straight to the DOM, and React wiped it whenever 'hide' toggled
  // (project filters), leaving cards stuck at opacity 0 on phones.
  useEffect(() => {
    if (hide || seen) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { setSeen(true); io.disconnect() }
    }, { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [hide, seen])
  const m = (p.desc || '').match(/^.*?[.!?](\s|$)/)
  const line = m ? m[0].trim() : p.desc

  return (
    <Link
      ref={ref}
      className={`pj rv${seen ? ' in' : ''}${hide ? ' hide' : ''}`}
      to={`/projects/${p.id}`}
      style={{ transitionDelay: `${(i % 2) * 80}ms` }}
    >
      <div className="pj-in">
        <div className="pj-img" style={{ background: p.pal && p.pal[0] }}>
          {ok && (
            <img
              src={`/images/${p.id}-1.jpg`}
              alt={`${p.title}, ${p.type} interior in ${p.loc}`}
              loading="lazy"
              decoding="async"
              onError={() => setOk(false)}
            />
          )}
          <span className="pj-type">{t(p.type)}</span>
        </div>
        <div className="pj-body">
          <div className="pj-top">
            <h3>{p.title}</h3>
            <span className="pj-no">{String(i + 1).padStart(2, '0')}</span>
          </div>
          {line && <p className="pj-desc">{line}</p>}
          <div className="pj-foot">
            <span className="meta">{p.loc} &middot; {p.year}</span>
            <span className="pj-pal" aria-hidden="true">
              {(p.pal || []).slice(0, 4).map(c => <i key={c} style={{ background: c }} />)}
            </span>
            <span className="pj-go">{t('View project')} &rarr;</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
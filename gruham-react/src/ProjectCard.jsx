import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from './components.jsx'

// One project card. Used on the Home page and the Projects page.
// `n` is the position among the cards currently shown; it drives the wide / slim rhythm.
export default function Card({ p, i = 0, n = i, hide }) {
  const { t } = useLang()
  const [ok, setOk] = useState(true)
  const [seen, setSeen] = useState(false)
  const ref = useRef(null)

  // Fade the card in once it scrolls into view. The "seen" flag lives in React state,
  // so the card stays visible when the filter buttons hide and show it again.
  useEffect(() => {
    if (seen || hide) return
    if (!('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: 0.1 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [seen, hide])

  const m = (p.desc || '').match(/^.*?[.!?](\s|$)/)
  const line = m ? m[0].trim() : p.desc
  const side = n % 4 === 0 || n % 4 === 3 ? 'wide' : 'slim'

  return (
    <Link
      ref={ref}
      className={`pj ${side}${seen ? ' vis' : ''}${hide ? ' hide' : ''}`}
      to={`/projects/${p.id}`}
      style={{ transitionDelay: `${(Math.max(n, 0) % 2) * 80}ms` }}
    >
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
      </div>
      <div className="pj-cap">
        <span className="meta">{t(p.type)} &middot; {p.loc} &middot; {p.year}</span>
        <h3>{p.title}<i aria-hidden="true">&rarr;</i></h3>
        {line && <p>{line}</p>}
      </div>
    </Link>
  )
}
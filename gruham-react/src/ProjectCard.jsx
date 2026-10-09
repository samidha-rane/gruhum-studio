import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from './components.jsx'
export default function Card({ p, i = 0, hide }) {
  const { t } = useLang()
  const [ok, setOk] = useState(true)
  const m = (p.desc || '').match(/^.*?[.!?](\s|$)/)
  const line = m ? m[0].trim() : p.desc

  return (
    <Link
      className={hide ? 'pj rv hide' : 'pj rv'}
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
import { createContext, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { COL, MR, PAY } from './data'

export const LbCtx = createContext(() => {})
export const LangCtx = createContext({ lang: 'en', setLang: () => {} })

export function useLang() {
  const { lang, setLang } = useContext(LangCtx)
  return { lang, setLang, t: s => (lang === 'mr' && MR[s]) || s }
}

const EXTS = ['jpg', 'jpeg', 'png', 'webp']

export function Ph({ name, alt = '', k = 0, ar, lb = true, cls = '' }) {
  const open = useContext(LbCtx)
  const [ext, setExt] = useState(0)
  useEffect(() => setExt(0), [name])
  const base = name.replace(/\.[a-z0-9]+$/i, '')
  const [c1, c2] = COL[k % COL.length]
  const style = { '--c1': c1, '--c2': c2, ...(ar ? { '--ar': ar } : {}) }
  return (
    <figure className={`ph ${cls}`} style={style} data-lb={lb ? '' : undefined} onClick={lb ? () => open({ name, alt, k }) : undefined}>
      {ext < EXTS.length && <img key={ext} src={`/images/${base}.${EXTS[ext]}`} alt={alt} loading="lazy" onError={() => setExt(e => e + 1)} />}
    </figure>
  )
}

export function useSeo(title, desc) {
  useEffect(() => {
    document.title = title
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = desc
  }, [title, desc])
}

export function PageHead({ eb, lead, children }) {
  return (
    <section className="pagehead"><div className="w rv">
      <span className="eb">{eb}</span><h1>{children}</h1>{lead && <p className="lead">{lead}</p>}
    </div></section>
  )
}

export function Cta() {
  const { t } = useLang()
  return (
    <section className="dk"><div className="w rv">
      <span className="eb" style={{ color: '#FAC8CE' }}>{t('Start here')}</span>
      <h2>Let us talk about <em>your</em> space.</h2>
      <p className="lead">A free 30-minute consultation. No pressure, just a good conversation.</p>
      <p style={{ marginTop: 32 }}><Link className="btn gold" to="/contact">{t('Transform your space')}</Link></p>
    </div></section>
  )
}

export function Srow({ n, t, d }) {
  return <div className="srow rv"><small>{n}</small><h3>{t}</h3><p>{d}</p></div>
}

export function PaySec() {
  return (
    <section style={{ background: '#E7E4E6' }}><div className="w">
      <div className="rv" style={{ marginBottom: 40 }}><span className="eb">Transparent payments</span><h2>What you pay, and when</h2></div>
      {PAY.map(([a, b, c]) => <Srow key={b} n={a} t={b} d={c} />)}
    </div></section>
  )
}

export function Quote({ q }) {
  return <div className="rv"><p className="q">&ldquo;{q[0]}&rdquo;</p><p className="meta">{q[1]}</p></div>
}

export function Rot({ words }) {
  const [i, setI] = useState(0)
  const [out, setOut] = useState(false)
  useEffect(() => {
    const t = setInterval(() => {
      setOut(true)
      setTimeout(() => { setI(v => (v + 1) % words.length); setOut(false) }, 400)
    }, 2600)
    return () => clearInterval(t)
  }, [words])
  return <em className={out ? 'rot out' : 'rot'}>{words[i]}</em>
}

export function BeforeAfter() {
  const [p, setP] = useState(50)
  return (
    <div className="ba rv" style={{ '--p': p + '%' }}>
      <Ph name="after.jpg" alt="Living room after renovation" k={0} lb={false} />
      <Ph name="before.jpg" alt="Living room before renovation" k={3} lb={false} cls="bf" />
      <i /><em className="l">Before</em><em className="r">After</em>
      <input type="range" min="0" max="100" value={p} onChange={e => setP(+e.target.value)} aria-label="Compare before and after" />
    </div>
  )
}

const RT = [[900, 1300, 2000], [1500, 2200, 3500]]
const lakh = n => (n / 1e5).toFixed(1).replace('.0', '')

export function Estimator() {
  const [s, setS] = useState({ bhk: 600, scope: 0, fin: 0 })
  const b = s.bhk * RT[s.scope][s.fin]
  const grp = (k, opts) => (
    <div className="opts">{opts.map(([l, v]) => <button key={l} className={s[k] === v ? 'on' : ''} onClick={() => setS({ ...s, [k]: v })}>{l}</button>)}</div>
  )
  return (
    <div className="est rv">
      <div className="eform">
        <div><label>Home size</label>{grp('bhk', [['1 BHK', 600], ['2 BHK', 900], ['3 BHK', 1300], ['4 BHK', 1800]])}</div>
        <div><label>Scope</label>{grp('scope', [['Modular only', 0], ['Full home', 1]])}</div>
        <div><label>Finish</label>{grp('fin', [['Essential', 0], ['Signature', 1], ['Luxe', 2]])}</div>
      </div>
      <div className="eres">
        <span className="eb" style={{ color: '#FAC8CE' }}>Indicative estimate</span>
        <b className="eamt">₹{lakh(b * 0.9)} to {lakh(b * 1.15)} lakh</b>
        <p>A rough range only. The final quote depends on site conditions, materials and your design choices.</p>
        <Link className="btn" to="/contact">Get an exact quote</Link>
      </div>
    </div>
  )
}

export function Faq({ items }) {
  const [o, setO] = useState(-1)
  return items.map(([q, a], i) => (
    <details key={q} className="rv" open={o === i}>
      <summary onClick={e => { e.preventDefault(); setO(o === i ? -1 : i) }}>{q}</summary>
      <p>{a}</p>
    </details>
  ))
}
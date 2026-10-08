import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { BeforeAfter, Cta, Estimator, Faq, PageHead, PaySec, Ph, Quote, Srow, useLang, useSeo } from './components.jsx'
import { FAQ, FORM, MATERIALS, POSTS, PROJ, QUIZ, QUOTES, RES, ROOMS, SERV, STEPS, TEAM } from './data.js'

const Configurator = lazy(() => import('./Configurator.jsx'))

const SLIDES = [
  { word: 'homes', rest: 'you will never want to leave.', img: 'hero-home.jpg', alt: 'Bright Goan living room with arched doors and a high timber ceiling' },
  { word: 'cafes', rest: 'people keep coming back to.', img: 'hero-1.jpg', alt: 'Open courtyard with timber lounge chairs and a red-trunked tree' },
  { word: 'offices', rest: 'people enjoy working in.', img: 'hero-office.jpg', alt: 'Calm daylit office with timber desks and plants' },
  { word: 'courtyards', rest: 'where the whole family gathers.', img: 'hero-courtyard.jpg', alt: 'Indoor courtyard filled with tropical plants and curved seating' },
]
const TINT = { background: '#FDEFC0' }

function Person({ n, r, i }) {
  const [ok, setOk] = useState(true)
  const initials = n.split(' ').map(w => w[0]).join('')
  return (
    <div className="rv">
      <div className="pp">
        {ok ? <img src={`/images/team-${i + 1}.jpg`} alt={n} onError={() => setOk(false)} /> : <span>{initials}</span>}
      </div>
      <h3>{n}</h3><span className="meta">{r}</span>
    </div>
  )
}

function RoomSection() {
  const { t } = useLang()
  return (
    <section style={TINT}><div className="w">
      <div className="rv" style={{ marginBottom: 40 }}>
        <span className="eb">{t('See it in 3D')}</span>
        <h2>Take a 3D tour, then <em>make it yours</em>.</h2>
        <p className="lead">Walk through a home, an office or a cafe. Change the walls, floor, furniture and light, then send your design to us.</p>
      </div>
      <Suspense fallback={null}><Configurator /></Suspense>
    </div></section>
  )
}

function Card({ p, i, hide }) {
  return (
    <Link className={hide ? 'pj rv hide' : 'pj rv'} to={`/projects/${p.id}`}>
      <Ph name={`${p.id}-1.jpg`} alt={`${p.title}, ${p.type} interior in ${p.loc}`} k={i} ar="4/5" lb={false} />
      <h3>{p.title}</h3>
      <span className="meta">{p.type} &middot; {p.loc} &middot; {p.year}</span>
    </Link>
  )
}

export function Home() {
  useSeo('Gruham Studio | Interior Designers in Goa', 'Gruham Studio is a Goa interior design studio for homes, cafes and workplaces. Natural materials, honest craft and fixed-price delivery.')
  const [vid, setVid] = useState(true)
  const { lang, t } = useLang()
  const [s, setS] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setS(v => (v + 1) % SLIDES.length), 5500)
    return () => clearInterval(id)
  }, [])
  return (
    <>
      <section className="hero2">
        <div className="bg">
          {SLIDES.map((x, i) => <Ph key={x.img} name={x.img} alt={x.alt} k={i} ar="auto" lb={false} cls={i === s ? 'on' : ''} />)}
          {vid && <video className="hv" autoPlay muted loop playsInline ref={el => { if (el) el.muted = true }}><source src="/images/hero.mp4" type="video/mp4" onError={() => setVid(false)} /></video>}
        </div>
        <div className="w rv">
          <span className="eb" style={{ color: '#F9A825' }}>{t('Interior design studio')} &middot; {t('Goa')}</span>
          {lang === 'mr' ? <h1>तुमचे घर, तुमच्या पद्धतीने.</h1> : <div key={s} className="hero-h"><h1>We design <em>{SLIDES[s].word}</em> {SLIDES[s].rest}</h1></div>}
          <p className="lead">{t('Natural materials, honest craft and a lot of light, delivered at a price we fix before we start.')}</p>
          <div className="acts"><Link className="btn fill" to="/contact">{t('Transform your space')}</Link><Link className="btn" to="/estimate">{t('Estimate your budget')}</Link></div>
          <div className="hero-tabs">{SLIDES.map((x, i) => <button key={x.word} className={i === s ? 'on' : ''} onClick={() => setS(i)}>{x.word}</button>)}</div>
        </div>
      </section>

      <div className="trust"><div className="w tr">
        <div><b>10 years</b><span>warranty on joinery</span></div>
        <div><b>Fixed price</b><span>quotation, no surprises</span></div>
        <div><b>Weekly</b><span>designer site visits</span></div>
        <div><b>140+</b><span>spaces delivered</span></div>
        <div><b>90 days</b><span>typical full-home timeline</span></div>
      </div></div>

      <RoomSection />

      <section><div className="w">
        <div className="head rv"><div><span className="eb">{t('Selected work')}</span><h2>{t('Recent projects')}</h2></div><Link className="btn" to="/projects">{t('All projects')}</Link></div>
        <div className="pgrid">{PROJ.slice(0, 4).map((p, i) => <Card key={p.id} p={p} i={i} />)}</div>
      </div></section>

      <section style={TINT}><div className="w">
        <div className="head rv"><div><span className="eb">{t('What we do')}</span><h2>{t('Services')}</h2></div><Link className="btn" to="/services">{t('Details')}</Link></div>
        {SERV.slice(0, 4).map((s, i) => <Srow key={s[0]} n={`0${i + 1}`} t={s[0]} d={s[1]} />)}
      </div></section>

      <section><div className="w">
        <div className="head rv"><div><span className="eb">{t('Ideas by room')}</span><h2>{t('Start with the room you love most')}</h2></div></div>
        <div className="rooms">{ROOMS.map((n, i) => (
          <Link key={n} className="rm rv" to="/contact"><Ph name={`room-${i + 1}.jpg`} alt={`${n} design idea`} k={i} ar="4/5" lb={false} /><span>{n}</span></Link>
        ))}</div>
      </div></section>

      <section style={TINT}><div className="w">
        <div className="rv" style={{ marginBottom: 56 }}><span className="eb">Why choose us</span><h2>A studio that <em>stays</em> till the end.</h2></div>
        <div className="cols3">
          <div className="rv"><b>01</b><h3>Fixed quotation</h3><p>The price you sign is the price you pay. We absorb the surprises.</p></div>
          <div className="rv"><b>02</b><h3>Made locally</h3><p>Furniture and joinery built by craftspeople within an hour of your site.</p></div>
          <div className="rv"><b>03</b><h3>Always on site</h3><p>A designer visits every week, not just on the day of the photo shoot.</p></div>
        </div>
      </div></section>

      <section><div className="w">
        <div className="rv" style={{ marginBottom: 46, textAlign: 'center' }}><span className="eb">Before and after</span><h2>Drag to see the difference</h2></div>
        <BeforeAfter />
      </div></section>

      <section style={TINT}><div className="w">
        <div className="rv" style={{ marginBottom: 46 }}><span className="eb">Plan your budget</span><h2>What could your home <em>cost</em>?</h2><p className="lead">Pick a size, scope and finish for an instant, indicative range.</p></div>
        <Estimator />
      </div></section>

      <section><div className="w">
        <div className="rv" style={{ marginBottom: 46 }}><span className="eb">How we work</span><h2>Five steps, no mystery</h2></div>
        <div className="steps">{STEPS.map((s, i) => <div key={s[0]} className="rv"><b>0{i + 1}</b><h3>{s[0]}</h3><p>{s[1]}</p></div>)}</div>
        <p style={{ marginTop: 36 }}><Link className="btn" to="/process">The full process</Link></p>
      </div></section>

      <section style={TINT}><div className="w">
        <span className="eb rv">Kind words</span>
        <div className="qgrid" style={{ marginTop: 20 }}><Quote q={QUOTES[0]} /><Quote q={QUOTES[1]} /></div>
        <p style={{ marginTop: 46 }}><Link className="btn" to="/testimonials">More stories</Link></p>
      </div></section>

      <section><div className="w">
        <div className="head rv"><div><span className="eb">Gallery</span><h2>Moments from our sites</h2></div></div>
        <div className="insta">{[0, 1, 2, 3, 4, 5].map(i => <Ph key={i} name={`insta-${i + 1}.jpg`} alt={`Studio moment ${i + 1}`} k={i} ar="1" />)}</div>
      </div></section>

      <Cta />
    </>
  )
}

export function About() {
  useSeo('About | Gruham Studio', 'Meet Gruham Studio, a small interior design team in Goa with 12 years of experience in homes, cafes and workplaces.')
  return (
    <>
      <PageHead eb="About us">A small studio with <em>long</em> memories.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w two">
        <div className="rv"><Ph name="about.jpg" alt="A Gruham Studio interior with a carved timber ceiling and red walls" k={2} ar="4/5" /></div>
        <div className="rv">
          <span className="eb">Why Gruham?</span>
          <h2 style={{ marginBottom: 26 }}>Our first project was a home. It is still lived in, happily.</h2>
          <p>It was our founder's grandmother's house in Assagao. In 2014 she renovated it, because nobody would build what she had drawn, so she learned to build it herself. Today the house still stands and the family still lives there happily. That is why we are called Gruham (<span className="mr">गृहम्</span>), the Sanskrit word for home: a place where a family gathers and the light comes in. It is the idea behind everything we design.</p>
          <p>Twelve years later we are a team of nine designers, site engineers and craftspeople. We still draw by hand first, still visit every site weekly, and still believe a room should be quiet enough to think in.</p>
          <p>We work with lime, stone, timber, cane and clay because they age well and feel good under your hand.</p>
        </div>
      </div></section>
      <section style={TINT}><div className="w">
        <div className="rv" style={{ marginBottom: 50 }}><span className="eb">The team</span><h2>The people you will meet</h2></div>
        <div className="team">{TEAM.map(([n, r], i) => <Person key={n} n={n} r={r} i={i} />)}</div>
      </div></section>
      <Cta />
    </>
  )
}

export function Services() {
  useSeo('Services | Gruham Studio', 'Interior design services in Goa: residential, commercial and hospitality interiors, space planning, furniture and turnkey project management.')
  return (
    <>
      <PageHead eb="Services" lead="Hire us for one part of the journey or all of it.">Everything a room <em>needs</em>.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w">{SERV.map((s, i) => <Srow key={s[0]} n={`0${i + 1}`} t={s[0]} d={s[1]} />)}</div></section>
      <Cta />
    </>
  )
}

export function Projects() {
  useSeo('Projects | Gruham Studio', 'Browse interior design projects by Gruham Studio: villas, apartments, cafes and offices across Goa.')
  const [f, setF] = useState('all')
  return (
    <>
      <PageHead eb="Portfolio">Spaces we have <em>made</em>.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w">
        <div className="filters rv">{['all', 'Residential', 'Commercial', 'Hospitality'].map(x => <button key={x} className={f === x ? 'on' : ''} onClick={() => setF(x)}>{x === 'all' ? 'All' : x}</button>)}</div>
        <div className="pgrid">{PROJ.map((p, i) => <Card key={p.id} p={p} i={i} hide={f !== 'all' && p.type !== f} />)}</div>
      </div></section>
      <Cta />
    </>
  )
}

export function ProjectPage() {
  const { id } = useParams()
  const i = PROJ.findIndex(p => p.id === id)
  const p = PROJ[i]
  useSeo(p ? `${p.title} | Gruham Studio` : 'Project | Gruham Studio', p ? p.desc.slice(0, 150) : 'Project by Gruham Studio')
  if (!p) return <Navigate to="/projects" replace />
  const nx = PROJ[(i + 1) % PROJ.length]
  return (
    <>
      <section className="pagehead"><div className="w rv"><span className="eb">{p.type} &middot; {p.loc}</span><h1>{p.title}</h1></div></section>
      <section style={{ paddingTop: 20 }}><div className="w">
        <div className="rv"><Ph name={`${p.id}-1.jpg`} alt={`${p.title} main view`} k={i} ar="16/9" /></div>
        <div className="facts rv"><div><span>Location</span>{p.loc}</div><div><span>Year</span>{p.year}</div><div><span>Size</span>{p.area}</div><div><span>Scope</span>{p.scope}</div></div>
        <div className="palrow rv"><span className="meta">Palette</span>{p.pal.map(c => <i key={c} style={{ background: c }} title={c} />)}</div>
        <div className="two"><h2 className="rv">The brief</h2><p className="rv">{p.desc}</p></div>
        <div className="gal rv" style={{ marginTop: 70 }}>{[2, 3, 4].map(n => <Ph key={n} name={`${p.id}-${n}.jpg`} alt={`${p.title} detail ${n}`} k={i + n} ar="4/3" />)}</div>
      </div></section>
      <section className="dk"><div className="w rv">
        <span className="eb" style={{ color: '#F9A825' }}>Next project</span>
        <h2><Link to={`/projects/${nx.id}`} style={{ textDecoration: 'none' }}>{nx.title} &rarr;</Link></h2>
      </div></section>
    </>
  )
}

export function Process() {
  useSeo('Our Process | Gruham Studio', 'How Gruham Studio works: discover, concept, develop, build and handover. A clear five-step interior design process.')
  return (
    <>
      <PageHead eb="Process" lead="You always know where you are, what happens next and what it costs.">Five steps, <em>no</em> mystery.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w">{STEPS.map((s, i) => <Srow key={s[0]} n={`0${i + 1}`} t={s[0]} d={s[1]} />)}</div></section>
      <PaySec />
      <Cta />
    </>
  )
}

export function Estimate() {
  useSeo('Cost Estimator | Gruham Studio', 'Get an instant indicative cost range for your home interiors in Goa. Choose size, scope and finish with the Gruham Studio estimator.')
  return (
    <>
      <PageHead eb="Estimator" lead="Pick a size, scope and finish. Then talk to us for an exact quote.">What could your home <em>cost</em>?</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w"><Estimator /></div></section>
      <PaySec />
      <Cta />
    </>
  )
}

export function Testimonials() {
  useSeo('Testimonials | Gruham Studio', 'What clients say about working with Gruham Studio on their homes, cafes and offices in Goa.')
  return (
    <>
      <PageHead eb="Testimonials">Kind words from <em>kind</em> clients.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w qgrid">{QUOTES.map(q => <Quote key={q[1]} q={q} />)}</div></section>
      <Cta />
    </>
  )
}

export function Blog() {
  useSeo('Journal | Gruham Studio', 'Notes on materials, planning and renovation from the designers at Gruham Studio.')
  return (
    <>
      <PageHead eb="Journal">Notes from the <em>studio</em>.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w">
        {POSTS.map(([t, c, d]) => <Link key={t} className="rowpost rv" to="/contact"><span className="meta">{c}</span><div><h3>{t}</h3></div><span className="meta">{d}</span></Link>)}
      </div></section>
    </>
  )
}

export function Contact() {
  useSeo('Contact | Gruham Studio', 'Book a free consultation with Gruham Studio. Tell us about your space and we will get back within two working days.')
  const [sent, setSent] = useState(false)
  const loc = useLocation()
  const note = (loc.state && loc.state.note) || ''
  const ptype = (loc.state && loc.state.type) || 'Home'
  const send = async e => {
    e.preventDefault()
    const f = new FormData(e.target)
    if (FORM) {
      try {
        const r = await fetch(FORM, { method: 'POST', body: f, headers: { Accept: 'application/json' } })
        if (r.ok) { setSent(true); return }
      } catch { /* fall through to email */ }
    }
    const body = `Name: ${f.get('name')}\nPhone: ${f.get('phone')}\nType: ${f.get('type')}\n\n${f.get('message')}`
    window.location.href = `mailto:hello@gruhamstudio.in?subject=${encodeURIComponent('Enquiry from ' + f.get('name'))}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  return (
    <>
      <PageHead eb="Contact">Tell us about your <em>space</em>.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w two">
        <div className="rv">
          {sent
            ? <p className="ok show">Thank you. We will reply within two working days.</p>
            : (
              <form onSubmit={send}>
                <div className="f2">
                  <div><label htmlFor="n">Name</label><input id="n" name="name" required /></div>
                  <div><label htmlFor="e">Email</label><input id="e" type="email" name="email" required /></div>
                </div>
                <div className="f2">
                  <div><label htmlFor="p">Phone</label><input id="p" type="tel" name="phone" /></div>
                  <div><label htmlFor="t">Project type</label><select id="t" name="type" defaultValue={ptype}><option>Home</option><option>Cafe or restaurant</option><option>Office</option><option>Other</option></select></div>
                </div>
                <div><label htmlFor="m">Tell us about it</label><textarea id="m" name="message" rows={note ? 9 : 4} defaultValue={note} required /></div>
                <div><button className="btn fill" type="submit">Send enquiry</button></div>
              </form>
            )}
        </div>
        <div className="rv">
          <span className="eb">Studio</span><p style={{ marginBottom: 22 }}>12 Fontainhas Lane<br />Panjim, Goa 403001</p>
          <span className="eb">Write</span><p style={{ marginBottom: 22 }}>hello@gruhamstudio.in</p>
          <span className="eb">Hours</span><p style={{ marginBottom: 22 }}>Mon to Sat, 10 am to 6 pm</p>
          <iframe className="map" title="Studio location" loading="lazy" src="https://www.google.com/maps?q=Panjim%2C%20Goa&output=embed" />
          <p style={{ marginTop: 10 }}><a href="https://www.google.com/maps/search/?api=1&query=Panjim%20Goa" target="_blank" rel="noreferrer">Get directions</a></p>
        </div>
      </div></section>
      <section style={TINT}><div className="w">
        <div className="rv" style={{ marginBottom: 40 }}><span className="eb">Good to know</span><h2>Questions we hear a lot</h2></div>
        <Faq items={FAQ} />
      </div></section>
    </>
  )
}

export function Design() {
  useSeo('3D Tour and Design Your Space | Gruham Studio', 'Take a 3D tour of a home, office or cafe, change the walls, floor, furniture and lighting, and send your design to Gruham Studio.')
  return (
    <>
      <PageHead eb="3D tour" lead="Walk through a home, an office or a cafe. Change the colours and materials, then send your design to us.">Design your <em>space</em>.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w"><Suspense fallback={null}><Configurator /></Suspense></div></section>
      <Cta />
    </>
  )
}

export function Materials() {
  useSeo('Materials | Gruham Studio', 'The materials Gruham Studio builds with in Goa: laterite, lime plaster, teak, cane, oxide tiles and more, and why they suit the climate.')
  return (
    <>
      <PageHead eb="Materials" lead="What we build with, and why it suits Goa's heat, humidity and monsoon.">Honest <em>materials</em>.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w mgrid">
        {MATERIALS.map(([n, c, d, u]) => <article key={n} className="mat rv"><div className="swatch" style={{ background: c }} /><h3>{n}</h3><p>{d}</p><span className="meta">Used for: {u}</span></article>)}
      </div></section>
      <Cta />
    </>
  )
}

export function Quiz() {
  useSeo('Style Quiz | Gruham Studio', 'Answer five quick questions and find out which interior style suits you: Goan Heritage, Coastal Calm or Tropical Garden.')
  const [step, setStep] = useState(0)
  const [ans, setAns] = useState([])
  const done = step >= QUIZ.length
  const score = [0, 1, 2].map(n => ans.filter(a => a === n).length)
  const r = RES[score.indexOf(Math.max(...score))]
  return (
    <>
      <PageHead eb="Style quiz" lead="Five quick questions. We will tell you which style feels most like you.">Find your <em>style</em>.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w">
        {!done ? (
          <div className="quiz">
            <p className="meta">Question {step + 1} of {QUIZ.length}</p>
            <h2>{QUIZ[step][0]}</h2>
            <div className="qopts">{QUIZ[step][1].map((o, n) => <button key={o} onClick={() => { setAns([...ans, n]); setStep(step + 1) }}>{o}</button>)}</div>
            <div className="bar"><i style={{ width: `${(step / QUIZ.length) * 100}%` }} /></div>
          </div>
        ) : (
          <div className="quiz">
            <span className="eb">Your style</span>
            <h2>{r.name}</h2>
            <p className="lead">{r.text}</p>
            <div className="palrow">{r.pal.map(c => <i key={c} style={{ background: c }} />)}</div>
            <p className="meta">Materials: {r.mats}</p>
            <div className="acts2"><Link className="btn fill" to="/contact">Talk to us about it</Link><button className="btn" onClick={() => { setStep(0); setAns([]) }}>Retake the quiz</button></div>
          </div>
        )}
      </div></section>
    </>
  )
}

export function NotFound() {
  useSeo('Page not found | Gruham Studio', 'This page could not be found.')
  return (
    <>
      <PageHead eb="404">This page <em>moved</em>.</PageHead>
      <section style={{ paddingTop: 30 }}><div className="w"><Link className="btn fill" to="/">Back home</Link></div></section>
    </>
  )
}
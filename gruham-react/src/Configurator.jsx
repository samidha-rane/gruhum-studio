import { lazy, Suspense, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary.jsx'
import { ACCENTS, FLOORS, SOFTS, SPACES, TONES, WALLS, WOODS } from './spaces.js'

const Space3D = lazy(() => import('./Space3D.jsx'))

const TABS = ['Room', 'Colours', 'Floor', 'Light and extras']
const EXTRAS = [['plants', 'Plants'], ['rug', 'Rug'], ['pendants', 'Pendant lights'], ['art', 'Wall art'], ['curtains', 'Curtains']]
const FORM_TYPE = { Home: 'Home', Office: 'Office', Cafe: 'Cafe or restaurant' }
const FLOOR_SW = {
  Teak: '#8a5a3b',
  Oak: '#c9a36b',
  'Oxide tile': 'conic-gradient(#b3452f 25%,#efe3c8 0 50%,#b3452f 0 75%,#efe3c8 0) 0 0/14px 14px',
  Chequer: 'conic-gradient(#1f1f22 25%,#f2efe6 0 50%,#1f1f22 0 75%,#f2efe6 0) 0 0/14px 14px',
  'Kota stone': '#6f7f69',
  Terrazzo: '#e9e2d3',
}
const DEFAULT = {
  wall: WALLS[0][1], floor: 'Teak', accent: ACCENTS[0][1], wood: WOODS[0][1], soft: SOFTS[0][1],
  light: 'day', tone: 'Warm', extras: { plants: true, rug: true, pendants: true, art: true, curtains: false },
}
const same = (a, b) => a.toLowerCase() === b.toLowerCase()
const nameOf = (list, hex) => { const f = list.find(([, c]) => same(c, hex)); return f ? f[0] : hex }

function ColorPick({ label, value, onChange, presets }) {
  return (
    <div className="cg">
      <label>{label}: {nameOf(presets, value)}</label>
      <div className="dots">
        {presets.map(([n, c]) => <button key={n} aria-label={n} title={n} className={same(c, value) ? 'on' : ''} style={{ background: c }} onClick={() => onChange(c)} />)}
        <span className="custom" title="Pick any colour"><input type="color" value={value} onChange={e => onChange(e.target.value)} aria-label={`${label}: custom colour`} /><b>+</b></span>
      </div>
    </div>
  )
}

export default function Configurator() {
  const nav = useNavigate()
  const view = useRef(null)
  const [type, setType] = useState('Home')
  const [ri, setRi] = useState(0)
  const [cfg, setCfg] = useState(DEFAULT)
  const [tab, setTab] = useState(0)

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }))
  const rooms = SPACES[type]
  const room = rooms[ri]

  const send = () => {
    const on = EXTRAS.filter(([k]) => cfg.extras[k]).map(([, n]) => n).join(', ') || 'none'
    const note = `My 3D design (${type})\nRoom viewed: ${room}\nWalls: ${nameOf(WALLS, cfg.wall)}\nFloor: ${cfg.floor}\nFurniture colour: ${nameOf(ACCENTS, cfg.accent)}\nWood finish: ${nameOf(WOODS, cfg.wood)}\nSoft furnishings: ${nameOf(SOFTS, cfg.soft)}\nLighting: ${cfg.light === 'day' ? 'Day' : 'Evening'}, ${cfg.tone.toLowerCase()} lamps\nExtras: ${on}\n\nI would like to talk about this space.`
    nav('/contact', { state: { note, type: FORM_TYPE[type] } })
  }

  const save = () => {
    try {
      const url = view.current && view.current.capture()
      if (!url) return
      const a = document.createElement('a')
      a.href = url
      a.download = 'my-gruham-design.png'
      a.click()
    } catch { /* ignore */ }
  }

  return (
    <div className="cfg">
      <div className="cfg-view" data-light={cfg.light}>
        <ErrorBoundary fallback={msg => <div className="cfg-load" style={{ padding: 24, textAlign: 'center' }}>The 3D view could not start on this device ({msg}). You can still choose your options and send them to us.</div>}>
          <Suspense fallback={<div className="cfg-load">Loading the 3D space...</div>}>
            <Space3D ref={view} type={type} room={room} cfg={cfg} />
          </Suspense>
        </ErrorBoundary>
        <div className="cfg-cap"><b>{type}: {room}</b><span>Drag sideways to look around</span></div>
      </div>

      <div className="cfg-panel">
        <div className="cfg-tabs" role="tablist">
          {TABS.map((t, i) => <button key={t} role="tab" aria-selected={tab === i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>)}
        </div>

        <div className="cfg-body">
          {tab === 0 && (
            <>
              <div className="cg"><label>Space</label>
                <div className="opts">{Object.keys(SPACES).map(t => <button key={t} className={t === type ? 'on' : ''} onClick={() => { setType(t); setRi(0) }}>{t}</button>)}</div>
              </div>
              <div className="cg"><label>Room</label>
                <div className="opts">{rooms.map((r, i) => <button key={r} className={i === ri ? 'on' : ''} onClick={() => setRi(i)}>{r}</button>)}</div>
              </div>
            </>
          )}

          {tab === 1 && (
            <>
              <ColorPick label="Walls" value={cfg.wall} onChange={v => set('wall', v)} presets={WALLS} />
              <ColorPick label="Furniture" value={cfg.accent} onChange={v => set('accent', v)} presets={ACCENTS} />
              <ColorPick label="Wood finish" value={cfg.wood} onChange={v => set('wood', v)} presets={WOODS} />
              <ColorPick label="Rug and curtains" value={cfg.soft} onChange={v => set('soft', v)} presets={SOFTS} />
            </>
          )}

          {tab === 2 && (
            <div className="cg"><label>Floor: {cfg.floor}</label>
              <div className="floors">{FLOORS.map(n => <button key={n} className={cfg.floor === n ? 'floor on' : 'floor'} onClick={() => set('floor', n)}><i style={{ background: FLOOR_SW[n] }} />{n}</button>)}</div>
            </div>
          )}

          {tab === 3 && (
            <>
              <div className="cg"><label>Time of day</label>
                <div className="opts"><button className={cfg.light === 'day' ? 'on' : ''} onClick={() => set('light', 'day')}>Day</button><button className={cfg.light === 'evening' ? 'on' : ''} onClick={() => set('light', 'evening')}>Evening</button></div>
              </div>
              <div className="cg"><label>Lamp colour</label>
                <div className="opts">{Object.keys(TONES).map(t => <button key={t} className={cfg.tone === t ? 'on' : ''} onClick={() => set('tone', t)}>{t}</button>)}</div>
              </div>
              <div className="cg"><label>Extras</label>
                <div className="opts">{EXTRAS.map(([k, n]) => <button key={k} className={cfg.extras[k] ? 'on' : ''} aria-pressed={cfg.extras[k]} onClick={() => set('extras', { ...cfg.extras, [k]: !cfg.extras[k] })}>{n}</button>)}</div>
              </div>
            </>
          )}
        </div>

        <div className="cfg-actions">
          <button className="btn fill" onClick={send}>Send this design to the studio</button>
          <div className="cfg-mini"><button className="btn sm" onClick={save}>Save picture</button><button className="btn sm" onClick={() => setCfg(DEFAULT)}>Reset</button></div>
        </div>
      </div>
    </div>
  )
}
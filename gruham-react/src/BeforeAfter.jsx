import { useRef, useState } from 'react'

// Before / After slider. Uses /images/before.jpg and /images/after.jpg
export default function BeforeAfter({
  before = '/images/before.jpg',
  after = '/images/after.jpg',
  beforeAlt = 'The room before the redesign',
  afterAlt = 'The same room after the redesign',
}) {
  const [pos, setPos] = useState(50)
  const box = useRef(null)
  const dragging = useRef(false)

  const move = x => {
    const r = box.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }

  const onKey = e => {
    if (e.key === 'ArrowLeft') setPos(p => Math.max(0, p - 5))
    if (e.key === 'ArrowRight') setPos(p => Math.min(100, p + 5))
    if (e.key === 'Home') setPos(0)
    if (e.key === 'End') setPos(100)
  }

  return (
    <div
      className="cmp"
      ref={box}
      style={{ '--p': `${pos}%` }}
      onPointerDown={e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX) }}
      onPointerMove={e => { if (dragging.current) move(e.clientX) }}
      onPointerUp={() => { dragging.current = false }}
      onPointerCancel={() => { dragging.current = false }}
    >
      <img className="cmp-img" src={after} alt={afterAlt} draggable="false" />
      <img className="cmp-img cmp-before" src={before} alt={beforeAlt} draggable="false" />
      <em className="cmp-tag l">Before</em>
      <em className="cmp-tag r">After</em>
      <div
        className="cmp-line"
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKey}
      >
        <span className="cmp-knob" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
        </span>
      </div>
    </div>
  )
}
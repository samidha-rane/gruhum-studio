import * as THREE from 'three'

export const WALLS = [['Laterite', '#b9633f'], ['Lime white', '#ece8de'], ['Azulejo blue', '#bcd0ea'], ['Betel green', '#8aa57a'], ['Mustard', '#e0b04a'], ['Sapphire', '#27447e']]
export const FLOORS = ['Teak', 'Oak', 'Oxide tile', 'Chequer', 'Kota stone', 'Terrazzo']
export const WOODS = [['Teak', '#5b3a24'], ['Walnut', '#4a3426'], ['Light oak', '#c19a6b'], ['Whitewash', '#d8cdb8'], ['Ebony', '#2b211c']]
export const SOFTS = [['Mustard', '#c9a24a'], ['Cream', '#efe3c8'], ['Terracotta', '#b9633f'], ['Sea blue', '#5b8fc7'], ['Olive', '#7a8f5a']]
export const TONES = {
  Warm: { glow: '#ffd27a', emissive: '#ffb84d', lamp: '#ffb84d' },
  Neutral: { glow: '#fff3d6', emissive: '#ffe9b8', lamp: '#fff1d0' },
  Cool: { glow: '#dfeaff', emissive: '#a9c8ff', lamp: '#cfe0ff' },
}
export const ACCENTS = [['Sapphire', '#1e3a6e'], ['Brick', '#a8452b'], ['Mustard', '#e9c46a'], ['Olive', '#6b7a46'], ['Cream', '#e8dcc0'], ['Charcoal', '#3a3a3a']]
export const SPACES = { Home: ['Living room', 'Bedroom', 'Kitchen', 'Dining'], Office: ['Workspace', 'Meeting room', 'Reception'], Cafe: ['Seating', 'Counter'] }

let seed = 7
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const cache = {}

export function floorTexture(key) {
  if (cache[key]) return cache[key]
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  if (key === 'Teak' || key === 'Oak') {
    const pal = key === 'Teak' ? ['#7d4f32', '#946342', '#4a2c19'] : ['#c9a36b', '#d6b47c', '#8a6a3d']
    for (let i = 0; i < 8; i++) {
      g.fillStyle = i % 2 ? pal[0] : pal[1]
      g.fillRect(0, i * 32, 256, 32)
      g.fillStyle = pal[2]
      g.fillRect(0, i * 32, 256, 2)
    }
    for (let i = 0; i < 16; i++) { g.fillStyle = 'rgba(74,44,25,.4)'; g.fillRect(rnd() * 256, Math.floor(rnd() * 8) * 32 + 2, 2, 28) }
  } else if (key === 'Oxide tile') {
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      const ox = x * 128, oy = y * 128, a = (x + y) % 2
      g.fillStyle = a ? '#efe3c8' : '#b3452f'
      g.fillRect(ox, oy, 128, 128)
      g.fillStyle = a ? '#b3452f' : '#efe3c8'
      g.beginPath(); g.moveTo(ox + 64, oy + 22); g.lineTo(ox + 106, oy + 64); g.lineTo(ox + 64, oy + 106); g.lineTo(ox + 22, oy + 64); g.closePath(); g.fill()
      g.strokeStyle = '#1e3a6e'; g.lineWidth = 4; g.strokeRect(ox + 2, oy + 2, 124, 124)
    }
  } else if (key === 'Chequer') {
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      g.fillStyle = (x + y) % 2 ? '#1f1f22' : '#f2efe6'
      g.fillRect(x * 128, y * 128, 128, 128)
    }
  } else if (key === 'Kota stone') {
    g.fillStyle = '#6f7f69'; g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 900; i++) { g.fillStyle = rnd() > 0.5 ? '#7d8d77' : '#5f6f59'; g.fillRect(rnd() * 256, rnd() * 256, 3, 3) }
    g.strokeStyle = '#4f5e4a'; g.lineWidth = 3; g.strokeRect(0, 0, 256, 256)
  } else {
    g.fillStyle = '#e9e2d3'; g.fillRect(0, 0, 256, 256)
    const cols = ['#b9633f', '#1e3a6e', '#f9a825', '#8aa57a', '#444444']
    for (let i = 0; i < 260; i++) { g.fillStyle = cols[Math.floor(rnd() * cols.length)]; g.fillRect(rnd() * 256, rnd() * 256, 3 + rnd() * 6, 3 + rnd() * 5) }
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(3, 3)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  cache[key] = t
  return t
}

export function createMaterials() {
  const M = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra })
  return {
    wall: M('#b9633f'), floor: M('#ffffff'), accent: M('#1e3a6e'), wood: M('#5b3a24'), white: M('#f2f2ee'),
    leaf: M('#3f7a45'), dark: M('#2a2a2e', { roughness: 0.5 }), stone: M('#d9d2c3', { roughness: 0.5 }), rug: M('#c9a24a'),
    glow: M('#ffd27a', { emissive: '#ffb84d', emissiveIntensity: 1.4 }),
    screen: M('#bcd7ff', { emissive: '#6fa8ff', emissiveIntensity: 0.9 }),
  }
}

export function applyConfig(m, cfg) {
  m.wall.color.set(cfg.wall)
  m.accent.color.set(cfg.accent)
  m.wood.color.set(cfg.wood)
  m.rug.color.set(cfg.soft)
  const t = floorTexture(cfg.floor)
  if (m.floor.map !== t) { m.floor.map = t; m.floor.needsUpdate = true }
}

function kit() {
  const g = new THREE.Group()
  const ex = {}
  ;['plants', 'rug', 'pendants', 'art', 'curtains'].forEach(n => { ex[n] = new THREE.Group(); g.add(ex[n]) })
  const put = (p, geo, mat, x, y, z) => {
    const o = new THREE.Mesh(geo, mat)
    o.position.set(x, y, z)
    o.castShadow = o.receiveShadow = true
    p.add(o)
    return o
  }
  return {
    g, ex,
    B: (w, h, d, mat, x, y, z, p = g) => put(p, new THREE.BoxGeometry(w, h, d), mat, x, y, z),
    C: (r, h, mat, x, y, z, p = g, rb = r) => put(p, new THREE.CylinderGeometry(r, rb, h, 28), mat, x, y, z),
    S: (r, mat, x, y, z, p = g) => put(p, new THREE.SphereGeometry(r, 20, 20), mat, x, y, z),
  }
}

function label(text, w, h, bg, fg, font) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = Math.round((512 * h) / w)
  const g = c.getContext('2d')
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height) }
  g.fillStyle = fg
  g.font = font || 'bold 70px sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, c.width / 2, c.height / 2)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9, transparent: !bg }))
  mesh.userData.own = true
  return mesh
}

function shell(k, m) {
  const { B } = k
  B(6.4, 0.2, 6.4, m.floor, 0, -0.1, 0)
  B(6.4, 3.4, 0.2, m.wall, 0, 1.7, -3.1)
  B(0.2, 3.4, 6.4, m.wall, -3.1, 1.7, 0)
  B(6.4, 0.14, 0.04, m.wood, 0, 0.07, -2.98)
  B(0.04, 0.14, 6.4, m.wood, -2.98, 0.07, 0)
  B(1.9, 1.7, 0.08, m.glow, 1.2, 1.9, -2.98)
  B(2.1, 0.08, 0.14, m.white, 1.2, 0.98, -2.95)
  B(0.06, 1.7, 0.1, m.white, 1.2, 1.9, -2.95)
  B(0.4, 2.3, 0.14, m.rug, 0.1, 1.75, -2.88, k.ex.curtains); B(0.4, 2.3, 0.14, m.rug, 2.3, 1.75, -2.88, k.ex.curtains)
  B(2.9, 0.05, 0.05, m.wood, 1.2, 2.95, -2.85, k.ex.curtains)
}

function chair(k, m, x, z, ry = 0) {
  const c = new THREE.Group()
  c.position.set(x, 0, z)
  c.rotation.y = ry
  k.g.add(c)
  k.B(0.5, 0.07, 0.5, m.accent, 0, 0.48, 0, c)
  k.B(0.5, 0.55, 0.06, m.accent, 0, 0.78, -0.22, c)
  ;[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([a, b]) => k.B(0.05, 0.45, 0.05, m.wood, a, 0.22, b, c))
}

function stool(k, m, x, z, mat) {
  k.C(0.22, 0.06, mat, x, 0.72, z)
  k.C(0.04, 0.72, m.dark, x, 0.36, z)
}

function plant(k, m, x, z, s = 1) {
  const P = k.ex.plants
  k.C(0.3 * s, 0.5 * s, m.wood, x, 0.25 * s, z, P, 0.22 * s)
  ;[[0, 0.95, 0, 0.4], [0.2, 1.35, 0.1, 0.3], [-0.18, 1.25, -0.1, 0.3]].forEach(([a, b, c, r]) => k.S(r * s, m.leaf, x + a * s, b * s, z + c * s, P))
}

function pendant(k, m, x, z, y = 2.2) {
  k.B(0.02, 1.2, 0.02, m.wood, x, y + 0.6, z, k.ex.pendants)
  k.S(0.26, m.glow, x, y, z, k.ex.pendants)
}

function art(k, m, side, pos, y, w, h) {
  const A = k.ex.art
  if (side === 'left') {
    k.B(0.05, h, w, m.wood, -2.97, y, pos, A)
    k.B(0.06, h - 0.14, w - 0.14, m.accent, -2.95, y, pos, A)
  } else {
    k.B(w, h, 0.05, m.wood, pos, y, -2.97, A)
    k.B(w - 0.14, h - 0.14, 0.06, m.accent, pos, y, -2.95, A)
  }
}

const rug = (k, m, x, z, r) => k.C(r, 0.03, m.rug, x, 0.015, z, k.ex.rug)

function table(k, m, w, d, x, z, h = 0.78) {
  k.B(w, 0.08, d, m.wood, x, h, z)
  ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => k.B(0.08, h, 0.08, m.wood, x + a * (w / 2 - 0.1), h / 2, z + b * (d / 2 - 0.1)))
}

function round(k, m, x, z) {
  k.C(0.45, 0.05, m.wood, x, 0.78, z)
  k.C(0.05, 0.78, m.dark, x, 0.39, z)
  k.C(0.25, 0.04, m.dark, x, 0.02, z)
}

const ROOMS = {
  'Home:Living room'(k, m) {
    const { B, C } = k
    B(2.8, 0.5, 1.05, m.accent, -0.5, 0.3, -2.3); B(2.8, 0.8, 0.28, m.accent, -0.5, 0.75, -2.75)
    B(0.28, 0.7, 1.05, m.accent, -1.76, 0.5, -2.3); B(0.28, 0.7, 1.05, m.accent, 0.76, 0.5, -2.3)
    rug(k, m, -0.4, -0.4, 1.7)
    C(0.65, 0.07, m.wood, -0.4, 0.45, -0.4); C(0.07, 0.45, m.wood, -0.4, 0.22, -0.4)
    pendant(k, m, -0.4, -0.4)
    C(0.02, 2.1, m.wood, -2.6, 1.05, -2.5); C(0.22, 0.4, m.glow, -2.6, 2.25, -2.5, k.g, 0.34)
    plant(k, m, 2.4, -2.3)
    art(k, m, 'back', -0.9, 1.9, 1.3, 0.8)
    B(0.3, 0.06, 2, m.wood, -2.9, 1.5, 0.2)
    C(0.28, 0.45, m.white, 1.6, 0.22, 0.9, k.g, 0.24)
  },
  'Home:Bedroom'(k, m) {
    const { B, S } = k
    B(2.2, 0.35, 2.5, m.wood, 0.6, 0.18, -1.65); B(2.1, 0.25, 2.35, m.white, 0.6, 0.47, -1.65)
    B(2.12, 0.1, 1.3, m.accent, 0.6, 0.62, -1.2); B(2.3, 1.1, 0.12, m.accent, 0.6, 0.9, -2.9)
    B(0.8, 0.15, 0.4, m.white, 0.1, 0.65, -2.55); B(0.8, 0.15, 0.4, m.white, 1.1, 0.65, -2.55)
    ;[-0.85, 2.05].forEach(x => { B(0.5, 0.5, 0.5, m.wood, x, 0.25, -2.7); S(0.16, m.glow, x, 0.72, -2.7) })
    rug(k, m, 0.6, -0.4, 1.6)
    B(0.6, 2.6, 2, m.wood, -2.75, 1.3, 0.5); B(0.02, 2.3, 0.9, m.accent, -2.43, 1.3, 0.05)
    plant(k, m, 2.5, 0.6)
    art(k, m, 'back', -0.9, 2.1, 1.1, 0.7)
    pendant(k, m, 0.6, -0.4, 2.1)
  },
  'Home:Kitchen'(k, m) {
    const { B, C } = k
    B(5.6, 0.9, 0.65, m.accent, -0.1, 0.45, -2.72); B(5.6, 0.06, 0.7, m.stone, -0.1, 0.93, -2.72)
    B(2.2, 0.8, 0.4, m.accent, -1.7, 2.1, -2.9)
    C(0.15, 0.02, m.dark, -1.3, 0.97, -2.72); C(0.15, 0.02, m.dark, -0.9, 0.97, -2.72); B(0.7, 0.04, 0.45, m.dark, 0.3, 0.96, -2.72)
    B(0.65, 0.9, 2.2, m.accent, -2.7, 0.45, 0); B(0.7, 0.06, 2.2, m.stone, -2.7, 0.93, 0)
    B(2.4, 0.9, 0.9, m.wood, 0.6, 0.45, 0.4); B(2.5, 0.06, 1, m.stone, 0.6, 0.93, 0.4)
    ;[-0.2, 0.6, 1.4].forEach(x => stool(k, m, x, 1.25, m.accent))
    pendant(k, m, 0, 0.4); pendant(k, m, 1.2, 0.4)
    plant(k, m, 2.6, -2.5)
  },
  'Home:Dining'(k, m) {
    const { B, S } = k
    table(k, m, 2.6, 1.2, 0, -0.2)
    ;[-0.8, 0, 0.8].forEach(x => { chair(k, m, x, -1.2, 0); chair(k, m, x, 0.8, Math.PI) })
    B(2.4, 0.9, 0.5, m.wood, 0.6, 0.45, -2.75); S(0.16, m.glow, 1.6, 1.1, -2.75)
    rug(k, m, 0, -0.2, 2.1)
    pendant(k, m, -0.7, -0.2); pendant(k, m, 0.7, -0.2)
    plant(k, m, 2.5, -2.4)
    art(k, m, 'left', 0, 1.8, 1.6, 0.9)
  },
  'Office:Workspace'(k, m) {
    const { B } = k
    ;[-1.8, 0, 1.8].forEach(x => {
      table(k, m, 1.5, 0.75, x, -1.2, 0.75)
      B(0.55, 0.35, 0.04, m.dark, x, 1.08, -1.45); B(0.05, 0.15, 0.05, m.dark, x, 0.84, -1.45)
      chair(k, m, x, -0.3, Math.PI)
      pendant(k, m, x, -1.2, 2.4)
    })
    const wb = label('Ideas', 2.4, 1.2, '#f7f7f4', '#27447e')
    wb.position.set(-1.4, 1.9, -2.96); k.g.add(wb)
    plant(k, m, 2.6, -2.5); plant(k, m, -2.6, 2.4)
    art(k, m, 'left', 1.2, 1.9, 1.6, 0.9)
  },
  'Office:Meeting room'(k, m) {
    const { B } = k
    table(k, m, 3.2, 1.3, 0, -0.4)
    ;[-1, 0, 1].forEach(x => { chair(k, m, x, -1.5, 0); chair(k, m, x, 0.7, Math.PI) })
    B(2.2, 1.2, 0.06, m.dark, -1.2, 1.9, -2.95); B(2, 1, 0.07, m.screen, -1.2, 1.9, -2.94)
    pendant(k, m, -0.8, -0.4); pendant(k, m, 0.8, -0.4)
    plant(k, m, 2.6, -2.4)
    art(k, m, 'left', 0, 1.8, 1.8, 0.9)
  },
  'Office:Reception'(k, m) {
    const { B } = k
    B(2.6, 1, 0.7, m.accent, 0.2, 0.5, -0.6); B(2.8, 0.07, 0.8, m.stone, 0.2, 1.03, -0.6)
    const lg = label('YOUR BRAND', 2.6, 0.8, null, '#ffffff')
    lg.position.set(-1.5, 2.1, -2.96); k.g.add(lg)
    B(0.9, 0.5, 2.2, m.accent, -2.5, 0.3, 0.8); B(0.28, 0.8, 2.2, m.accent, -2.9, 0.75, 0.8)
    B(0.7, 0.4, 0.7, m.wood, -1.6, 0.2, 0.8)
    rug(k, m, -1.6, 0.8, 1.2)
    plant(k, m, 2.5, 1.5)
    pendant(k, m, -0.4, -0.6); pendant(k, m, 0.8, -0.6)
  },
  'Cafe:Seating'(k, m) {
    const { B, C } = k
    ;[[-1, -0.2], [1, -0.9], [0.2, 1.4]].forEach(([x, z]) => {
      round(k, m, x, z)
      chair(k, m, x - 0.75, z, Math.PI / 2); chair(k, m, x + 0.75, z, -Math.PI / 2)
      pendant(k, m, x, z, 2.3)
    })
    B(0.6, 0.45, 4.5, m.accent, -2.7, 0.25, -0.2); B(0.2, 0.9, 4.5, m.accent, -2.95, 0.75, -0.2)
    plant(k, m, 2.6, -2.5); plant(k, m, 2.6, 2)
    art(k, m, 'back', -1.4, 2, 2, 1.2)
    B(1.6, 0.05, 0.3, m.wood, -1.4, 1.2, -2.9); C(0.08, 0.3, m.white, -1.8, 1.37, -2.9); C(0.08, 0.3, m.accent, -1.4, 1.37, -2.9)
  },
  'Cafe:Counter'(k, m) {
    const { B, C } = k
    B(4.2, 1.05, 0.8, m.accent, 0.2, 0.52, -1.2); B(4.4, 0.07, 0.95, m.stone, 0.2, 1.08, -1.2)
    ;[-1.4, -0.4, 0.6, 1.6].forEach(x => stool(k, m, x, -0.35, m.wood))
    B(2.4, 0.05, 0.35, m.wood, -1.2, 1.5, -2.9); B(2.4, 0.05, 0.35, m.wood, -1.2, 2.1, -2.9)
    const mats = [m.leaf, m.white, m.accent]
    for (let i = 0; i < 9; i++) C(0.07, 0.3, mats[i % 3], -2.2 + i * 0.25, 1.68, -2.9)
    B(0.8, 0.5, 0.5, m.dark, -1, 1.35, -1.2)
    const mn = label('MENU', 2, 0.9, '#1b1b1b', '#f9a825')
    mn.position.set(-1.6, 2.6, -2.96); k.g.add(mn)
    pendant(k, m, -0.8, -1.2, 2.3); pendant(k, m, 0.6, -1.2, 2.3); pendant(k, m, 2, -1.2, 2.3)
    plant(k, m, 2.6, 1.8)
  },
}

export function buildRoom(type, room, m) {
  const k = kit()
  shell(k, m)
  ROOMS[`${type}:${room}`](k, m)
  return { group: k.g, extras: k.ex }
}

export function disposeGroup(g) {
  g.traverse(o => {
    o.geometry?.dispose()
    if (o.userData.own) { o.material.map?.dispose(); o.material.dispose() }
  })
}
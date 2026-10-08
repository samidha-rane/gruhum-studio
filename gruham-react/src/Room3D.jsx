import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// A small procedural living room. Drag to look around; palette prop recolours it live.
export default function Room3D({ palette }) {
  const mount = useRef(null)
  const mats = useRef(null)

  useEffect(() => {
    const el = mount.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(7.5, 5.5, 8.5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    el.appendChild(renderer.domElement)

    const M = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra })
    const m = (mats.current = {
      wall: M(palette.wall), sofa: M(palette.sofa), rug: M(palette.rug),
      floor: M('#8a5a3b'), wood: M('#5b3a24'), white: M('#f2f2ee'),
      leaf: M('#3f7a45'), glow: M('#ffd27a', { emissive: '#ffb84d', emissiveIntensity: 1.4 }),
    })

    const add = (geo, mat, x, y, z) => {
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.castShadow = mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }
    const B = (w, h, d) => new THREE.BoxGeometry(w, h, d)
    const C = (rt, rb, h, s = 40) => new THREE.CylinderGeometry(rt, rb, h, s)

    // shell: floor + two walls
    add(B(6.4, 0.2, 6.4), m.floor, 0, -0.1, 0)
    add(B(6.4, 3.4, 0.2), m.wall, 0, 1.7, -3.1)
    add(B(0.2, 3.4, 6.4), m.wall, -3.1, 1.7, 0)
    // window (lets in warm light)
    add(B(1.9, 1.7, 0.08), m.glow, 1.2, 1.9, -2.98)
    add(B(2.1, 0.08, 0.14), m.white, 1.2, 0.98, -2.95)
    add(B(0.06, 1.7, 0.1), m.white, 1.2, 1.9, -2.95)
    // sofa
    add(B(2.8, 0.5, 1.05), m.sofa, -0.5, 0.3, -2.3)
    add(B(2.8, 0.8, 0.28), m.sofa, -0.5, 0.75, -2.75)
    add(B(0.28, 0.7, 1.05), m.sofa, -1.76, 0.5, -2.3)
    add(B(0.28, 0.7, 1.05), m.sofa, 0.76, 0.5, -2.3)
    // rug, table
    add(C(1.7, 1.7, 0.03), m.rug, -0.4, 0.015, -0.4)
    add(C(0.65, 0.65, 0.07), m.wood, -0.4, 0.45, -0.4)
    add(C(0.07, 0.07, 0.45), m.wood, -0.4, 0.22, -0.4)
    // pendant over table
    add(B(0.02, 1.2, 0.02), m.wood, -0.4, 2.8, -0.4)
    add(new THREE.SphereGeometry(0.28, 24, 24), m.glow, -0.4, 2.1, -0.4)
    // floor lamp
    add(C(0.02, 0.02, 2.1), m.wood, -2.6, 1.05, -2.5)
    add(C(0.22, 0.34, 0.4), m.glow, -2.6, 2.25, -2.5)
    // plant
    add(C(0.32, 0.22, 0.5), m.wood, 2.4, 0.25, -2.3)
    ;[[0, 0.9, 0, 0.4], [0.2, 1.3, 0.1, 0.32], [-0.18, 1.2, -0.1, 0.3]].forEach(([x, y, z, r]) =>
      add(new THREE.SphereGeometry(r, 16, 16), m.leaf, 2.4 + x, y, -2.3 + z))
    // wall shelf + stool
    add(B(0.3, 0.06, 2), m.wood, -2.9, 1.5, 0.2)
    add(C(0.28, 0.24, 0.45), m.white, 1.6, 0.22, 0.9)

    scene.add(new THREE.HemisphereLight('#fff4e0', '#6b4a35', 0.8))
    const sun = new THREE.DirectionalLight('#ffe2b0', 1.3)
    sun.position.set(4, 7, 5)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    scene.add(sun)
    const lamp = new THREE.PointLight('#ffb84d', 14, 7)
    lamp.position.set(-0.4, 1.9, -0.4)
    scene.add(lamp)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 1, -0.5)
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.minPolarAngle = 0.6
    controls.maxPolarAngle = 1.35
    controls.minAzimuthAngle = 0.1
    controls.maxAzimuthAngle = 1.45
    controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    controls.autoRotateSpeed = 0.8
    controls.addEventListener('end', () => (controls.autoRotate = false))

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    // bounce auto-rotate between the azimuth limits
    renderer.setAnimationLoop(() => {
      const az = controls.getAzimuthalAngle()
      if (az > 1.4) { controls.autoRotateSpeed = -Math.abs(controls.autoRotateSpeed) }
      if (az < 0.15) { controls.autoRotateSpeed = Math.abs(controls.autoRotateSpeed) }
      controls.update()
      renderer.render(scene, camera)
    })

    return () => {
      ro.disconnect()
      renderer.setAnimationLoop(null)
      controls.dispose()
      scene.traverse(o => { o.geometry?.dispose() })
      Object.values(m).forEach(x => x.dispose())
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!mats.current) return
    mats.current.wall.color.set(palette.wall)
    mats.current.sofa.color.set(palette.sofa)
    mats.current.rug.color.set(palette.rug)
  }, [palette])

  return <div ref={mount} className="room3d" role="img" aria-label="Interactive 3D living room. Drag to look around." />
}
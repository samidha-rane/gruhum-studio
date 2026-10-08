import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TONES, applyConfig, buildRoom, createMaterials, disposeGroup } from './spaces.js'

const LIGHT = {
  day: { hemi: 0.95, sun: 1.5, sunColor: '#fff0d0', lamp: 4, glow: 1, bg: '#f6d9a0' },
  evening: { hemi: 0.35, sun: 0.6, sunColor: '#ff9a55', lamp: 20, glow: 1.9, bg: '#17284a' },
}

const Space3D = forwardRef(function Space3D({ type, room, cfg, tour }, ref) {
  const mount = useRef(null)
  const S = useRef({})
  const live = useRef({ cfg, tour })
  live.current = { cfg, tour }

  useImperativeHandle(ref, () => ({
    capture: () => {
      const s = S.current
      s.scene.background = new THREE.Color(LIGHT[live.current.cfg.light].bg)
      s.renderer.render(s.scene, s.camera)
      const url = s.renderer.domElement.toDataURL('image/png')
      s.scene.background = null
      return url
    },
  }), [])

  useEffect(() => {
    const el = mount.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(7.5, 5.2, 8.5)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.domElement.style.touchAction = 'pan-y'
    el.appendChild(renderer.domElement)

    const mats = createMaterials()
    const hemi = new THREE.HemisphereLight('#fff4e0', '#6b4a35', 0.9)
    const sun = new THREE.DirectionalLight('#fff0d0', 1.4)
    sun.position.set(4, 7, 5)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    const lamp = new THREE.PointLight('#ffb84d', 4, 9)
    lamp.position.set(0, 2, -0.4)
    scene.add(hemi, sun, lamp)

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
    controls.addEventListener('end', () => { if (!live.current.tour) controls.autoRotate = false })

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    renderer.setAnimationLoop(() => {
      const az = controls.getAzimuthalAngle()
      if (az > 1.4) controls.autoRotateSpeed = -Math.abs(controls.autoRotateSpeed)
      if (az < 0.15) controls.autoRotateSpeed = Math.abs(controls.autoRotateSpeed)
      controls.update()
      renderer.render(scene, camera)
    })

    S.current = { scene, camera, renderer, mats, hemi, sun, lamp, controls, group: null, extras: null }

    return () => {
      ro.disconnect()
      renderer.setAnimationLoop(null)
      controls.dispose()
      if (S.current.group) disposeGroup(S.current.group)
      Object.values(mats).forEach(x => x.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const s = S.current
    if (s.group) { s.scene.remove(s.group); disposeGroup(s.group) }
    const { group, extras } = buildRoom(type, room, s.mats)
    s.scene.add(group)
    s.group = group
    s.extras = extras
    Object.entries(extras).forEach(([k, g]) => { g.visible = !!live.current.cfg.extras[k] })
    const el = mount.current
    el.classList.remove('fade')
    void el.offsetWidth
    el.classList.add('fade')
  }, [type, room])

  useEffect(() => {
    const s = S.current
    applyConfig(s.mats, cfg)
    if (s.extras) Object.entries(s.extras).forEach(([k, g]) => { g.visible = !!cfg.extras[k] })
    const L = LIGHT[cfg.light]
    const T = TONES[cfg.tone]
    s.hemi.intensity = L.hemi
    s.sun.intensity = L.sun
    s.sun.color.set(L.sunColor)
    s.lamp.intensity = L.lamp
    s.lamp.color.set(T.lamp)
    s.mats.glow.emissiveIntensity = L.glow
    s.mats.glow.color.set(T.glow)
    s.mats.glow.emissive.set(T.emissive)
  }, [cfg])

  useEffect(() => {
    const c = S.current.controls
    if (c && tour && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) c.autoRotate = true
  }, [tour])

  return <div ref={mount} className="space3d" role="img" aria-label={`Interactive 3D ${type.toLowerCase()} design: ${room}. Drag to look around.`} />
})

export default Space3D
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

/** Atmospheric set lighting; animation runs only while this scene is visible. */
export function CinemaLight({ scene }: { scene: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element || reduced) return
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [reduced])
  return (
    <div ref={ref} aria-hidden="true" className={`cinema-light cinema-scene-${scene % 4}`}
      data-playing={active && !reduced}>
      <div className="cinema-atmosphere" />
      <div className="cinema-orbit" />
      <div className="cinema-horizon" />
      <div className="cinema-flare" />
      <div className="cinema-projector" />
      <div className="cinema-dust">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ left: `${12 + i * 11}%`, top: `${18 + (i * 17) % 65}%`, animationDelay: `${-i * 2.3}s` }} />)}</div>
      <div className="cinema-shade" />
    </div>
  )
}

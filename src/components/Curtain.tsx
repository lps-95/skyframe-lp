import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Logo } from "@/components/Logo"

function seenIntro() {
  try { return sessionStorage.getItem("skyframe:exposure-intro") === "1" }
  catch { return false }
}

/** A short studio signature: darkness, first light, frame, image. */
export function Curtain() {
  const reduced = useReducedMotion()
  const [finished, setFinished] = useState(seenIntro)
  useEffect(() => {
    if (finished || reduced) return
    const timer = window.setTimeout(() => {
      try { sessionStorage.setItem("skyframe:exposure-intro", "1") } catch { /* Optional preference. */ }
      setFinished(true)
    }, 2700)
    return () => window.clearTimeout(timer)
  }, [finished, reduced])
  function dismiss() {
    try { sessionStorage.setItem("skyframe:exposure-intro", "1") } catch { /* Optional preference. */ }
    setFinished(true)
  }
  return (
    <AnimatePresence>
      {!finished && !reduced && (
        <motion.div className="studio-intro" key="exposure" aria-label="Abertura Skyframe"
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .65 }}>
          <div className="studio-exposure" aria-hidden="true" />
          <div className="studio-ray" aria-hidden="true" />
          <div className="studio-frame" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="studio-signature">
            <span className="studio-overline">Florianópolis · Produção independente</span>
            <div className="studio-logo"><Logo className="text-[clamp(36px,7vw,84px)]" /></div>
            <p>Antes de ser visto.<br /><span>É preciso sentir.</span></p>
          </div>
          <span className="studio-footnote">Luz. Presença. História.</span>
          <button type="button" onClick={dismiss} className="studio-skip">Pular abertura <span aria-hidden="true">↗</span></button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

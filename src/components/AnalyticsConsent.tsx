import { useEffect, useState } from "react"

const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const enabled = /^G-[A-Z0-9]+$/.test(id ?? "")
const key = "skyframe-analytics"
type Choice = "accepted" | "rejected" | null
function saved(): Choice {
  try {
    const value = localStorage.getItem(key)
    return value === "accepted" || value === "rejected" ? value : null
  } catch { return null }
}
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
let started = false
function start() {
  if (started || !enabled) return
  started = true
  window.dataLayer ??= []
  window.gtag = function () { window.dataLayer!.push(arguments) }
  window.gtag("js", new Date())
  window.gtag("config", id, {
    send_page_view: false,
    page_location: location.origin + location.pathname,
    page_referrer: document.referrer ? new URL(document.referrer).origin : "",
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  window.gtag("event", "page_view", {
    page_location: location.origin + location.pathname,
    page_referrer: document.referrer ? new URL(document.referrer).origin : "",
    page_title: document.title,
  })
  const script = document.createElement("script")
  script.async = true
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + id
  document.head.appendChild(script)
}

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<Choice>(saved)
  const [open, setOpen] = useState(() => saved() === null)
  useEffect(() => {
    if (!enabled || choice !== "accepted") return
    start()
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a") : null
      if (!anchor) return
      const url = new URL(anchor.href, location.href)
      const channel = url.hostname === "wa.me" ? "whatsapp" :
        ["instagram.com", "www.instagram.com"].includes(url.hostname) ? "instagram" : null
      if (!channel) return
      window.gtag?.("event", "contact_click", {
        contact_method: channel,
        section: anchor.closest("section")?.id ?? "navigation",
        transport_type: "beacon",
      })
    }
    document.addEventListener("click", click)
    return () => document.removeEventListener("click", click)
  }, [choice])
  if (!enabled) return null
  function choose(value: Exclude<Choice, null>) {
    try { localStorage.setItem(key, value) } catch { /* Choice remains valid for this visit. */ }
    if (choice === "accepted" && value === "rejected") {
      window.gtag?.("consent", "update", { analytics_storage: "denied" })
      setChoice(value)
      location.reload()
      return
    }
    setChoice(value)
    setOpen(false)
  }
  return open ? (
    <aside aria-label="Preferências de privacidade" className="fixed bottom-4 left-4 right-4 z-[200] mx-auto max-w-lg rounded-lg border border-white/20 bg-[#0B0E13] p-5 text-sm text-white shadow-xl">
      <p>Podemos usar o Google Analytics para entender as visitas e os cliques de contato? Ele usa cookies e envia dados de navegação ao Google. A escolha é opcional e pode ser alterada em “Privacidade”.</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <button type="button" className="rounded border px-4 py-2" onClick={() => choose("accepted")}>Aceitar</button>
        <button type="button" className="rounded border px-4 py-2" onClick={() => choose("rejected")}>Recusar</button>
      </div>
    </aside>
  ) : <button type="button" className="fixed bottom-2 left-2 z-[200] rounded bg-[#0B0E13] px-3 py-2 text-xs text-white" onClick={() => setOpen(true)}>Privacidade</button>
}

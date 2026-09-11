import { useId } from "react"

export function Softbox() {
  const id = useId()
  return (
    <svg viewBox="0 0 210 420" fill="none" className="softbox-prop">
      <defs>
        <linearGradient id={id} x1="42" y1="60" x2="160" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4efe4"/><stop offset=".55" stopColor="#c4cdd3"/><stop offset="1" stopColor="#8c9aa4"/>
        </linearGradient>
      </defs>
      <path d="M110 205V347M110 340L49 407M110 340L176 409M110 344L112 413" stroke="#4c5864" strokeWidth="6" strokeLinecap="round"/>
      <path d="M109 220V343" stroke="#a5b0b7" strokeWidth="1.4"/>
      <rect x="102" y="293" width="17" height="10" rx="2" fill="#202a35"/>
      <path d="M152 123L178 132L119 230L103 216Z" fill="#101720" stroke="#52606a"/>
      <path d="M41 46L130 30L167 62L175 165L144 212L55 211L29 178L22 88Z" fill="#111820" stroke="#667581" strokeWidth="3"/>
      <path d="M46 57L126 43L155 68L162 161L136 197L61 196L42 171L35 92Z" fill={`url(#${id})`}/>
      <path d="M47 61L61 194M128 47L137 192M39 93L158 75" stroke="#ffffff" strokeOpacity=".14"/>
      <path d="M146 214C168 268 118 289 156 382" stroke="#090d14" strokeWidth="3"/>
      <path d="M42 409H57M170 411H183M107 415H119" stroke="#111923" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  )
}

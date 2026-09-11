export function StudioLamp() {
  return (
    <svg viewBox="0 0 260 440" fill="none" className="studio-lamp">
      <defs>
        <linearGradient id="lamp-metal"><stop stopColor="#111820"/><stop offset=".5" stopColor="#7c8891"/><stop offset=".6" stopColor="#26313c"/><stop offset="1" stopColor="#111820"/></linearGradient>
        <linearGradient id="lamp-beam" x1="110" y1="94" x2="-150" y2="345" gradientUnits="userSpaceOnUse"><stop stopColor="#efdaad" stopOpacity=".17"/><stop offset=".65" stopColor="#efdaad" stopOpacity=".055"/><stop offset="1" stopColor="#efdaad" stopOpacity="0"/></linearGradient>
        <radialGradient id="lamp-glass"><stop stopColor="#fff6de"/><stop offset=".5" stopColor="#ebd6a7"/><stop offset="1" stopColor="#8e7957"/></radialGradient>
      </defs>
      <path className="lamp-attached-beam" d="M89 77Q101 73 118 107L-84 447L-298 326Z" fill="url(#lamp-beam)" />
      <path d="M146 167V354M146 344L65 423M146 344L224 423M146 344L150 432" stroke="url(#lamp-metal)" strokeWidth="8" strokeLinecap="round"/>
      <path d="M146 260V348" stroke="#8c969d" strokeWidth="2"/>
      <rect x="136" y="253" width="21" height="14" rx="3" fill="#222d37"/>
      <path d="M156 188C197 230 113 271 174 358" stroke="#090c11" strokeWidth="4"/>
      <path d="M106 110V158Q145 188 190 145V93" stroke="url(#lamp-metal)" strokeWidth="9"/>
      <path d="M101 51L177 39L209 97L135 120Z" fill="#222d37" stroke="#697780"/>
      <path d="M154 48L177 44L201 94L178 101Z" fill="#101820"/>
      <path d="M157 57L178 53M162 68L183 64M168 80L189 75" stroke="#64717b" strokeWidth="3"/>
      <ellipse cx="112" cy="94" rx="40" ry="48" transform="rotate(-24 112 94)" fill="#0a1017" stroke="#77818a" strokeWidth="4"/>
      <ellipse className="lamp-emitter" cx="110" cy="94" rx="30" ry="38" transform="rotate(-24 110 94)" fill="url(#lamp-glass)"/>
      <g stroke="#6a6657" opacity=".45"><ellipse cx="110" cy="94" rx="22" ry="30" transform="rotate(-24 110 94)"/><ellipse cx="110" cy="94" rx="15" ry="22" transform="rotate(-24 110 94)"/><ellipse cx="110" cy="94" rx="8" ry="13" transform="rotate(-24 110 94)"/></g>
      <path d="M76 62L43 34L95 25L112 48M79 127L61 164L117 154L132 138M76 68L42 73L51 128L77 121M137 60L171 55L183 103L150 116" fill="#141c25" stroke="#53616c" strokeWidth="2"/>
      <circle cx="153" cy="148" r="8" fill="#222e39" stroke="#87929b"/>
      <path d="M59 424H73M217 424H230M143 433H158" stroke="#121921" strokeWidth="7" strokeLinecap="round"/>
    </svg>
  )
}

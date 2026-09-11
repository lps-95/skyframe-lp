/** Original vector set prop, lit from the doorway at upper right. */
export function DirectorChair() {
  return (
    <svg viewBox="0 0 240 300" fill="none" className="director-chair">
      <defs>
        <linearGradient id="chair-wood" x1="40" y1="150" x2="195" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#33271e" /><stop offset=".5" stopColor="#80654a" /><stop offset=".85" stopColor="#b8a283" /><stop offset="1" stopColor="#5a4735" />
        </linearGradient>
        <linearGradient id="chair-canvas" x1="70" y1="110" x2="170" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0b1016" /><stop offset=".6" stopColor="#222c35" /><stop offset="1" stopColor="#49535a" />
        </linearGradient>
        <linearGradient id="chair-seat" x1="110" y1="175" x2="120" y2="142" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10171d" /><stop offset="1" stopColor="#4a5358" />
        </linearGradient>
      </defs>
      <path d="M66 142L186 270M176 132L66 278" stroke="#261e18" strokeWidth="12" strokeLinecap="round" />
      <path d="M65 142L184 269M175 133L66 276" stroke="url(#chair-wood)" strokeWidth="8" strokeLinecap="round" />
      <path d="M48 164L160 287M165 155L50 292" stroke="url(#chair-wood)" strokeWidth="10" strokeLinecap="round" />
      <path d="M54 281L68 268M162 279L184 266" stroke="#71604c" strokeWidth="6" />
      <path d="M61 52L56 166M179 35L176 149" stroke="url(#chair-wood)" strokeWidth="9" strokeLinecap="round" />
      <path d="M62 58Q113 61 178 42L177 113Q120 133 61 124Z" fill="url(#chair-canvas)" stroke="#596169" strokeWidth=".8" />
      <path d="M68 64Q120 65 171 49M67 117Q120 126 171 109" stroke="#84909b" strokeOpacity=".3" strokeDasharray="2 3" />
      <path d="M67 70Q85 91 68 115M169 57Q152 85 169 102" stroke="#7a8790" strokeOpacity=".12" />
      <path d="M53 151L171 137L188 158Q122 183 47 175Z" fill="url(#chair-seat)" stroke="#69716f" strokeWidth="1" />
      <path d="M52 158L50 183M186 141L187 164" stroke="url(#chair-wood)" strokeWidth="7" />
      <path d="M41 148L77 139M165 129L200 120" stroke="#2a211a" strokeWidth="12" strokeLinecap="round" />
      <path d="M41 145L77 136M165 126L200 117" stroke="url(#chair-wood)" strokeWidth="8" strokeLinecap="round" />
      <path d="M45 149L50 170M193 124L185 158" stroke="url(#chair-wood)" strokeWidth="6" />
      <circle cx="111" cy="223" r="4" fill="#b1b6b4" /><circle cx="124" cy="209" r="3" fill="#a2aaa9" />
      <path d="M69 243L144 235" stroke="url(#chair-wood)" strokeWidth="6" />
    </svg>
  )
}

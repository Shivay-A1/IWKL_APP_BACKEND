"use client"

export default function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Corner geometric shapes - reduced opacity and moved to lower areas */}
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-2">
        <svg viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 192L192 192L0 0Z" stroke="#CC66FF" strokeWidth="1"/>
          <path d="M0 144L48 192" stroke="#CC66FF" strokeWidth="0.5"/>
          <path d="M0 96L96 192" stroke="#CC66FF" strokeWidth="0.5"/>
          <path d="M0 48L144 192" stroke="#CC66FF" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-48 h-48 opacity-2">
        <svg viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M192 192L0 192L192 0Z" stroke="#CC66FF" strokeWidth="1"/>
          <path d="M192 144L144 192" stroke="#CC66FF" strokeWidth="0.5"/>
          <path d="M192 96L96 192" stroke="#CC66FF" strokeWidth="0.5"/>
          <path d="M192 48L48 192" stroke="#CC66FF" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Diagonal sports-style line patterns - reduced opacity */}
      <div className="absolute inset-0 opacity-1">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="20" stroke="#CC66FF" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#diagonalLines)"/>
        </svg>
      </div>

      {/* Angular geometric shapes - reduced opacity and moved to lower areas */}
      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 opacity-2">
        <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="48,0 96,48 48,96 0,48" stroke="#CC66FF" strokeWidth="0.5"/>
          <polygon points="48,12 84,48 48,84 12,48" stroke="#CC66FF" strokeWidth="0.3"/>
        </svg>
      </div>

      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 opacity-2">
        <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="48,0 96,48 48,96 0,48" stroke="#CC66FF" strokeWidth="0.5"/>
          <polygon points="48,12 84,48 48,84 12,48" stroke="#CC66FF" strokeWidth="0.3"/>
        </svg>
      </div>

      {/* Soft glowing overlays - reduced opacity */}
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-[#CC66FF] rounded-full filter blur-[150px] opacity-3 animate-glow"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#CC66FF] rounded-full filter blur-[150px] opacity-3 animate-glow" style={{animationDelay: '2s'}}></div>

      {/* Stadium-style atmosphere lines - reduced opacity */}
      <div className="absolute bottom-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC66FF]/5 to-transparent"></div>
      <div className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC66FF]/3 to-transparent"></div>
      <div className="absolute bottom-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC66FF]/3 to-transparent"></div>

      <div className="absolute left-1/2 bottom-0 top-1/3 w-px bg-gradient-to-b from-transparent via-[#CC66FF]/5 to-transparent"></div>
      <div className="absolute left-1/3 bottom-0 top-1/3 w-px bg-gradient-to-b from-transparent via-[#CC66FF]/3 to-transparent"></div>
      <div className="absolute left-2/3 bottom-0 top-1/3 w-px bg-gradient-to-b from-transparent via-[#CC66FF]/3 to-transparent"></div>
    </div>
  )
}

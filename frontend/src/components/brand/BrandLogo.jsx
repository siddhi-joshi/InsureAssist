export function BrandLogo({ className = '' }) {
  return (
    <svg className={`brand-logo ${className}`} viewBox="0 0 302 72" role="img" aria-label="InsureAssist">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M31 7.5a23.5 23.5 0 1 1-17.2 7.5" stroke="#26251e" strokeWidth="5" />
        <path
          d="M13.8 32c5.3-7.2 11-10.8 17.2-10.8S42.9 24.8 48.2 32c-5.3 7.2-11 10.8-17.2 10.8S19.1 39.2 13.8 32Z"
          stroke="#807d72"
          strokeWidth="4.2"
        />
        <circle cx="31" cy="32" r="4.5" fill="#f54e00" stroke="none" />
        <path d="M9.5 20.5 14 15.8" stroke="#f54e00" strokeWidth="4.2" />
      </g>
      <text
        x="76"
        y="50"
        fill="#26251e"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="39"
        fontWeight="700"
        letterSpacing="-1.5"
      >
        Insure
      </text>
      <text
        x="194"
        y="50"
        fill="#f54e00"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="39"
        fontWeight="700"
        letterSpacing="-1.5"
      >
        Assist
      </text>
    </svg>
  )
}

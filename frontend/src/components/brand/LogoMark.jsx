export function LogoMark({ size = 34, className = '' }) {
  return (
    <div
      className={`brand-mark ${className}`}
      style={{ width: size, height: size }}
      aria-label="InsureAssist logo"
    >
      <svg viewBox="0 0 32 32" width={size * 0.58} height={size * 0.58} fill="none" aria-hidden="true">
        <path
          d="M16 5.5 19.7 12.3 26.5 16l-6.8 3.7L16 26.5l-3.7-6.8L5.5 16l6.8-3.7L16 5.5Z"
          fill="currentColor"
        />
        <circle cx="16" cy="16" r="3.1" fill="var(--cursor-primary, #f54e00)" />
      </svg>
    </div>
  )
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="داده کشت نوین">
      <defs>
        <linearGradient id="dknLogoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22C55E" />
          <stop offset="1" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#dknLogoGrad)" strokeWidth="10" opacity="0.22">
        <ellipse cx="256" cy="250" rx="172" ry="120" transform="rotate(-20 256 250)" />
      </g>
      <path d="M256 250 L256 372" stroke="url(#dknLogoGrad)" strokeWidth="22" strokeLinecap="round" />
      <path d="M256 252 C 196 252 146 214 142 150 C 206 150 252 188 256 252 Z" fill="url(#dknLogoGrad)" />
      <path d="M256 252 C 316 252 366 214 370 150 C 306 150 260 188 256 252 Z" fill="url(#dknLogoGrad)" />
      <g stroke="#ffffff" strokeWidth="7" fill="#ffffff" opacity="0.95" strokeLinecap="round">
        <path d="M286 214 L312 196" fill="none" />
        <path d="M286 214 L320 222" fill="none" />
        <circle cx="312" cy="196" r="9" />
        <circle cx="320" cy="222" r="9" />
        <circle cx="286" cy="214" r="7" />
      </g>
      <path d="M256 372 C 240 398 230 412 230 426 a 26 26 0 0 0 52 0 C 282 412 272 398 256 372 Z" fill="url(#dknLogoGrad)" />
    </svg>
  );
}

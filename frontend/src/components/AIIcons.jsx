// Accurate AI model icons — matching real brand logos

// ChatGPT / OpenAI — the interlocking knot
export function ChatGPTIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.99-3.108 10.079 10.079 0 0 0-9.615 6.977 9.967 9.967 0 0 0-6.69 4.839 10.081 10.081 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.99 3.109 10.079 10.079 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.69-4.838 10.079 10.079 0 0 0-1.243-11.816zm-17.297 24.12a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.601zm-16.124-6.908a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zm-2.15-17.512a7.477 7.477 0 0 1 3.91-3.293c0 .068-.004.19-.004.274v9.2a1.297 1.297 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L2.864 27.15a7.504 7.504 0 0 1-.904-10.58zm27.677 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V21.97z"
        fill="currentColor"
      />
    </svg>
  );
}

// Claude / Anthropic — sunburst with 11 rounded rays
export function ClaudeIcon({ size = 16 }) {
  const N = 11;
  const cx = 50, cy = 50;
  const innerR = 11, outerR = 47, halfW = 5.8, tipHalfW = 2.4;
  const rays = Array.from({ length: N }, (_, i) => {
    const angle = (i * 360) / N - 90; // start from top
    const rad = (angle * Math.PI) / 180;
    const perp = rad + Math.PI / 2;
    const cos = Math.cos(rad), sin = Math.sin(rad);
    const cp = Math.cos(perp), sp = Math.sin(perp);
    // Base corners (inner circle)
    const x1 = cx + cos * innerR + cp * halfW;
    const y1 = cy + sin * innerR + sp * halfW;
    const x4 = cx + cos * innerR - cp * halfW;
    const y4 = cy + sin * innerR - sp * halfW;
    // Tip corners (outer, narrower)
    const x2 = cx + cos * outerR + cp * tipHalfW;
    const y2 = cy + sin * outerR + sp * tipHalfW;
    const x3 = cx + cos * outerR - cp * tipHalfW;
    const y3 = cy + sin * outerR - sp * tipHalfW;
    const r = 1.8; // corner rounding radius
    return (
      <path
        key={i}
        d={`M ${x1.toFixed(1)} ${y1.toFixed(1)}
            L ${x2.toFixed(1)} ${y2.toFixed(1)}
            L ${x3.toFixed(1)} ${y3.toFixed(1)}
            L ${x4.toFixed(1)} ${y4.toFixed(1)} Z`}
        fill="currentColor"
        rx={r}
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="12" fill="currentColor" />
      {rays}
    </svg>
  );
}

// Gemini — 4-pointed star with the real gradient (red top, blue right, green bottom, yellow left)
export function GeminiIcon({ size = 16 }) {
  const uid = `g${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${uid}t`} x1="50" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF3B30" />
          <stop offset="1" stopColor="#4285F4" />
        </linearGradient>
        <linearGradient id={`${uid}r`} x1="100" y1="50" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="1" stopColor="#4285F4" />
        </linearGradient>
        <linearGradient id={`${uid}b`} x1="50" y1="100" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34A853" />
          <stop offset="1" stopColor="#4285F4" />
        </linearGradient>
        <linearGradient id={`${uid}l`} x1="0" y1="50" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBC04" />
          <stop offset="1" stopColor="#4285F4" />
        </linearGradient>
      </defs>
      {/* Top arm — red to blue */}
      <path
        d="M50 2 C47 26 50 50 50 50 C50 50 53 26 50 2Z"
        fill={`url(#${uid}t)`}
      />
      {/* Right arm — blue */}
      <path
        d="M98 50 C74 47 50 50 50 50 C50 50 74 53 98 50Z"
        fill={`url(#${uid}r)`}
      />
      {/* Bottom arm — green to blue */}
      <path
        d="M50 98 C53 74 50 50 50 50 C50 50 47 74 50 98Z"
        fill={`url(#${uid}b)`}
      />
      {/* Left arm — yellow to blue */}
      <path
        d="M2 50 C26 53 50 50 50 50 C50 50 26 47 2 50Z"
        fill={`url(#${uid}l)`}
      />
    </svg>
  );
}

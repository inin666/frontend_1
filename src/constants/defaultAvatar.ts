const DEFAULT_AVATAR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect width="160" height="160" rx="80" fill="#F8E7C8" />
  <circle cx="80" cy="60" r="28" fill="#FFFFFF" />
  <path d="M34 132c8-27 29-40 46-40s38 13 46 40" fill="#FFFFFF" />
</svg>
`.trim()

export const DEFAULT_AVATAR_URL = `data:image/svg+xml;utf8,${encodeURIComponent(DEFAULT_AVATAR_SVG)}`

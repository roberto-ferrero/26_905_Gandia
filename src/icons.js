const paths = {
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  pause: '<path d="M8 5v14M16 5v14" stroke-width="2.5"/>',
  play: '<path d="m8 4 12 8-12 8Z"/>',
  promenade: '<path d="M16 22V8m0 0c-1-4-5-6-8-3 4-1 6 1 8 3Zm0 0c1-4 5-6 7-3-3-1-5 1-7 3Zm0 0c-4-1-6 1-6 4 2-2 4-3 6-4Zm0 0c4-1 6 1 6 4-2-2-4-3-6-4ZM2 22l6-8M3 22h20M5 18h8"/>',
  external: '<path d="M14 3h7v7M10 14 21 3M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  car: '<path d="m5 7 2-4h10l2 4M4 7h16l1 5v7h-3v-3H6v3H3v-7zM3 12h18M7 12h1m8 0h1"/>',
  'beach-umbrella': '<path d="M2 11a10 10 0 0 1 20 0H2ZM12 1c-3 3-4 6-4 10m4-10c3 3 4 6 4 10M12 11v10M7 22h10"/>',
  'dune-tree': '<path d="M17 18v-5M14 13h6a3 3 0 0 0 1-5.8 4 4 0 0 0-8 0A3 3 0 0 0 14 13ZM1 21c5-9 9-9 14-2M1 23c8-4 14-4 22-1"/>',
  'sun-cocktail': '<circle cx="6" cy="6" r="2.8"/><path d="M6 1V.5M6 11v1M1 6H.5M11 6h1M2 2l.7.7M9.5 9.5l.7.7M2 10l.7-.7M9.5 2.5l.7-.7M14 8h8l-4 7-4-7ZM18 15v7M15 22h6M17 10l3-7h3"/>',
  waves: '<path d="M2 12c2-3 4 3 7 0s4 3 7 0 4 2 6 0M2 18c2-3 4 3 7 0s4 3 7 0 4 2 6 0M5 7c3-7 10-6 12 0"/>',
  steps: '<ellipse cx="7" cy="7" rx="3" ry="5" transform="rotate(-18 7 7)"/><path d="m4 15 5-1 1 5-4 1z"/><ellipse cx="17" cy="13" rx="3" ry="5" transform="rotate(18 17 13)"/><path d="m14 21 5 1"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  parking: '<circle cx="12" cy="12" r="9"/><path d="M9 18V6h4a4 4 0 0 1 0 8H9"/>',
  pool: '<path d="M6 17V5a2 2 0 0 1 4 0m4 12V5a2 2 0 0 1 4 0M6 8h8M6 12h8M2 20c2-2 4 2 6 0s4 2 6 0 4 2 8 0"/>',
  phone: '<path d="m5 3 4 5-2 3a15 15 0 0 0 6 6l3-2 5 4-2 3C10 23 1 14 2 5z"/>',
  whatsapp: '<path d="m4 17-1 5 5-1a10 10 0 1 0-4-4Z"/><path d="m9 6 2 3-1 2 3 3 2-1 3 2c-2 5-11 0-11-6z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',
  home: '<path d="m2 11 10-9 10 9M5 9v13h5v-7h4v7h5V9"/>',
};

export function icon(name, className = '') {
  return '<svg class="icon ' + className + '" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || paths.arrow) + '</svg>';
}

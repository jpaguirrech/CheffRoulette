// shared.jsx — shared data, mock content, tiny icon atoms used by all 3 directions.
// Three style tokens (Dusk = dark neon, Glass = iOS blur, Clay = 3D soft) live in
// their own screens files; this one is style-agnostic.

// ─── mock recipes (all from Unsplash — food photography, warm/bright)
const MOCK_RECIPES = [
  { id: 'r1', title: 'Birria Tacos', cuisine: 'Mexican', time: 45, diff: 'Medium', src: 'tiktok',    user: '@chefmaya',     likes: 1240, img: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=70' },
  { id: 'r2', title: 'Gochujang Pasta', cuisine: 'Fusion',  time: 20, diff: 'Easy',   src: 'instagram', user: '@seoulfoodies',  likes: 3211, img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=70' },
  { id: 'r3', title: 'Miso Glazed Salmon', cuisine: 'Japanese', time: 25, diff: 'Easy',  src: 'youtube',   user: '@ramsaycooks',   likes: 8720, img: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&q=70' },
  { id: 'r4', title: 'Arepa de Huevo', cuisine: 'Colombian', time: 30, diff: 'Medium', src: 'tiktok',  user: '@cocinacolombia', likes: 560, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=70' },
  { id: 'r5', title: 'Burrata Peach Toast', cuisine: 'Italian', time: 10, diff: 'Easy', src: 'pinterest', user: '@tastemade',  likes: 912, img: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=600&q=70' },
  { id: 'r6', title: 'Thai Green Curry', cuisine: 'Thai', time: 35, diff: 'Medium', src: 'youtube', user: '@painternal', likes: 4002, img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=70' },
];
window.MOCK_RECIPES = MOCK_RECIPES;

// ─── source brand colors (for filtering pills etc)
window.SOURCE_META = {
  tiktok:    { label: 'TikTok',    emoji: '🎵', hex: '#FF0050', hex2: '#00F2EA' },
  instagram: { label: 'Instagram', emoji: '📸', hex: '#E1306C', hex2: '#FD8D32' },
  youtube:   { label: 'YouTube',   emoji: '🎥', hex: '#FF0000', hex2: '#FF4444' },
  pinterest: { label: 'Pinterest', emoji: '📌', hex: '#E60023', hex2: '#BD081C' },
};

// ─── tiny inline icon (we use emoji mostly, but some need crisp strokes)
function Icon({ d, size = 20, stroke = 'currentColor', sw = 2, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}
window.Icon = Icon;
// common path strings
window.ICONS = {
  home:     'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10',
  search:   'M21 21l-4.3-4.3M10 17a7 7 0 100-14 7 7 0 000 14z',
  heart:    'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  bolt:     'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  plus:     'M12 5v14M5 12h14',
  users:    'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  share:    'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
  arrow:    'M5 12h14M12 5l7 7-7 7',
  chevronR: 'M9 18l6-6-6-6',
  chevronL: 'M15 18l-9-6 9-6',
  clock:    'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  flame:    'M8 14s-2-3 0-6c2-3 4-6 4-6s2 3 4 6 0 6 0 6a4 4 0 11-8 0z',
  x:        'M18 6L6 18M6 6l12 12',
  filter:   'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  check:    'M20 6L9 17l-5-5',
  qr:       'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2v6h-6v-2M17 19h2',
};

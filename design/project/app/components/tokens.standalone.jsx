// tokens.jsx — Glass design system tokens + mock data + router + shared atoms
// Everything reusable across screens lives here.

// ─── TOKENS ────────────────────────────────────────────────────────────
const L = {
  // Light mode
  bg: '#F7F4EE',
  bg2: '#FFFFFF',
  card: '#FFFFFF',
  tintWarm: '#FFF5EC',
  tintMint: '#E8F5EE',
  tintSky:  '#E7F0FA',
  border: 'rgba(0,0,0,0.08)',
  divider: 'rgba(0,0,0,0.06)',
  text: '#1A1A1A',
  text2: 'rgba(26,26,26,0.58)',
  text3: 'rgba(26,26,26,0.38)',
  primary: '#FF6B35',
  primary2: '#FF8A5C',
  primaryPressed: '#E05520',
  accent: '#2E7D6B',
  yellow: '#FFC83D',
  coral: '#FF8A7A',
  shadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.07)',
  shadowLg: '0 2px 6px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.1)',
  shadowXL: '0 8px 20px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.15)',
};
const D = {
  bg: '#0F0E10',
  bg2: '#1A181C',
  card: '#1F1D22',
  tintWarm: '#2A1F1A',
  tintMint: '#152620',
  tintSky:  '#16202A',
  border: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.06)',
  text: '#F7F4EE',
  text2: 'rgba(247,244,238,0.6)',
  text3: 'rgba(247,244,238,0.38)',
  primary: '#FF7A4A',
  primary2: '#FF9870',
  primaryPressed: '#E05520',
  accent: '#6FC5AE',
  yellow: '#FFC83D',
  coral: '#FF9080',
  shadow: '0 1px 3px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.4)',
  shadowLg: '0 2px 6px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.6)',
  shadowXL: '0 8px 20px rgba(0,0,0,0.5), 0 40px 80px rgba(0,0,0,0.7)',
};
window.L = L; window.D = D;

const FONT = '-apple-system, "SF Pro Text", "Inter", system-ui, sans-serif';
const FONT_DISP = '"Fraunces", "SF Pro Display", -apple-system, Georgia, serif';
window.FONT = FONT; window.FONT_DISP = FONT_DISP;

// Theme hook
const ThemeCtx = React.createContext({ t: L, dark: false, toggle: () => {} });
window.ThemeCtx = ThemeCtx;
function useTheme() { return React.useContext(ThemeCtx); }
window.useTheme = useTheme;

// ─── MOCK DATA ────────────────────────────────────────────────────────
const RECIPES = [
  { id: 'r1', title: 'Birria Tacos', cuisine: 'Mexican', time: 45, diff: 'Medium', src: 'tiktok',    user: '@chefmaya',      likes: 1240, spicy: 2, img: window.__resources.img_r1,
    tags: ['Comfort', 'Weeknight'], blurb: 'Slow-braised beef, crispy tortillas, dipped in consommé.' },
  { id: 'r2', title: 'Gochujang Pasta', cuisine: 'Fusion',  time: 20, diff: 'Easy',   src: 'instagram', user: '@seoulfoodies',   likes: 3211, spicy: 2, img: window.__resources.img_r2,
    tags: ['Quick', 'Spicy'], blurb: 'Spicy, creamy, 10 ingredients or less.' },
  { id: 'r3', title: 'Miso Glazed Salmon', cuisine: 'Japanese', time: 25, diff: 'Easy', src: 'youtube', user: '@ramsaycooks', likes: 8720, spicy: 0, img: window.__resources.img_r3,
    tags: ['Healthy', 'Date night'], blurb: 'Sweet-savory miso glaze, flaky salmon, rice on the side.' },
  { id: 'r4', title: 'Arepa de Huevo', cuisine: 'Colombian', time: 30, diff: 'Medium', src: 'tiktok',  user: '@cocinacolombia', likes: 560, spicy: 1, img: window.__resources.img_r4,
    tags: ['Breakfast', 'Fried'], blurb: 'Fried corn pocket stuffed with a whole egg.' },
  { id: 'r5', title: 'Burrata Peach Toast', cuisine: 'Italian', time: 10, diff: 'Easy', src: 'pinterest', user: '@tastemade', likes: 912, spicy: 0, img: window.__resources.img_r5,
    tags: ['Summer', 'No-cook'], blurb: 'Honey, peaches, torn burrata, flaky salt.' },
  { id: 'r6', title: 'Thai Green Curry', cuisine: 'Thai', time: 35, diff: 'Medium', src: 'youtube', user: '@painternal', likes: 4002, spicy: 3, img: window.__resources.img_r6,
    tags: ['Comfort', 'Spicy'], blurb: 'Fragrant, creamy, herby — ready in 35.' },
  { id: 'r7', title: 'Crispy Rice Salad', cuisine: 'Thai', time: 15, diff: 'Easy', src: 'tiktok', user: '@hot_thai_kitchen', likes: 2200, spicy: 1, img: window.__resources.img_r7,
    tags: ['Fresh', 'Crunchy'], blurb: 'Golden rice clusters, herbs, lime.' },
  { id: 'r8', title: 'Smash Burger', cuisine: 'American', time: 15, diff: 'Easy', src: 'instagram', user: '@burgerchef', likes: 6100, spicy: 0, img: window.__resources.img_r8,
    tags: ['Weekend', 'Classic'], blurb: 'Thin, crispy-edged, melty cheese, soft brioche.' },
];
window.RECIPES = RECIPES;

const SOURCES = {
  tiktok:    { label: 'TikTok',    emoji: '🎵', hex: '#FF0050', hex2: '#00F2EA', username: '@juan' },
  instagram: { label: 'Instagram', emoji: '📸', hex: '#E1306C', hex2: '#FD8D32', username: '@juan.a' },
  youtube:   { label: 'YouTube',   emoji: '🎥', hex: '#FF0000', hex2: '#FF4444', username: 'Juan A' },
  pinterest: { label: 'Pinterest', emoji: '📌', hex: '#E60023', hex2: '#BD081C', username: 'Juan A' },
};
window.SOURCES = SOURCES;

const FRIENDS = [
  { id: 'f1', name: 'Maya',   emoji: '👩',    color: '#FF6B35' },
  { id: 'f2', name: 'Alex',   emoji: '👨‍🍳', color: '#2E7D6B' },
  { id: 'f3', name: 'Sam',    emoji: '🧑',    color: '#4A90E2' },
  { id: 'f4', name: 'Riley',  emoji: '👱‍♀️', color: '#FFC83D' },
  { id: 'f5', name: 'Chris',  emoji: '👨',    color: '#9B6BD8' },
];
window.FRIENDS = FRIENDS;

// ─── ROUTER (tiny — hash-based, with history stack) ───────────────────
const RouteCtx = React.createContext(null);
window.RouteCtx = RouteCtx;

function useRoute() { return React.useContext(RouteCtx); }
window.useRoute = useRoute;

function RouterProvider({ children, initial = 'splash' }) {
  const [stack, setStack] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rr_nav') || 'null');
      if (saved && saved.length) return saved;
    } catch {}
    return [{ screen: initial, params: {} }];
  });
  const [dir, setDir] = React.useState('forward');

  React.useEffect(() => {
    try { localStorage.setItem('rr_nav', JSON.stringify(stack)); } catch {}
  }, [stack]);

  const go = React.useCallback((screen, params = {}) => {
    setDir('forward');
    setStack((s) => [...s, { screen, params }]);
  }, []);
  const replace = React.useCallback((screen, params = {}) => {
    setDir('forward');
    setStack((s) => [...s.slice(0, -1), { screen, params }]);
  }, []);
  const back = React.useCallback(() => {
    setDir('back');
    setStack((s) => s.length > 1 ? s.slice(0, -1) : s);
  }, []);
  const reset = React.useCallback((screen = 'home', params = {}) => {
    setDir('forward');
    setStack([{ screen, params }]);
  }, []);

  const current = stack[stack.length - 1];
  const value = { ...current, stack, dir, go, back, replace, reset };
  return <RouteCtx.Provider value={value}>{children}</RouteCtx.Provider>;
}
window.RouterProvider = RouterProvider;

// ─── SHARED ATOMS ─────────────────────────────────────────────────────

// Ripple-free haptic press wrapper — applies tiny scale-down + opacity on press.
function Press({ children, onClick, style, as = 'div', ...rest }) {
  const [down, setDown] = React.useState(false);
  const C = as;
  return (
    <C
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerCancel={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onClick={onClick}
      style={{
        transition: 'transform 120ms, opacity 120ms',
        transform: down ? 'scale(0.96)' : 'scale(1)',
        opacity: down ? 0.85 : 1,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      {...rest}
    >{children}</C>
  );
}
window.Press = Press;

// Nav-bar top (back arrow, title, trailing)
function TopBar({ title, trailing, onBack, transparent = false }) {
  const { t } = useTheme();
  const r = useRoute();
  const back = onBack || (() => r.back());
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 16px 10px',
      background: transparent ? 'transparent' : t.bg,
      position: 'relative', zIndex: 10,
    }}>
      <Press onClick={back} style={{
        width: 36, height: 36, borderRadius: '50%',
        background: transparent ? 'rgba(255,255,255,0.85)' : t.bg2,
        backdropFilter: transparent ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: transparent ? 'blur(14px)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, color: t.text, flexShrink: 0,
        boxShadow: transparent ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
      }}>‹</Press>
      <div style={{ flex: 1, textAlign: 'center', fontFamily: FONT_DISP, fontWeight: 600, fontSize: 16, letterSpacing: -0.3, color: transparent ? '#fff' : t.text }}>
        {title}
      </div>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}
window.TopBar = TopBar;

// Tab bar (liquid glass)
function TabBar({ active = 'home' }) {
  const { t, dark } = useTheme();
  const r = useRoute();
  const tabs = [
    { id: 'home',   screen: 'home',    emoji: '🏠', label: 'Home' },
    { id: 'search', screen: 'search',  emoji: '🔍', label: 'Search' },
    { id: 'spin',   screen: 'roulette', emoji: '🎰', label: '', big: true },
    { id: 'vote',   screen: 'lobby',   emoji: '👥', label: 'Vote' },
    { id: 'you',    screen: 'profile', emoji: '👤', label: 'You' },
  ];
  return (
    <div style={{
      margin: '0 16px 14px', borderRadius: 999,
      background: dark ? 'rgba(31,29,34,0.75)' : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(24px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.5)',
      boxShadow: dark
        ? '0 8px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
      padding: '8px 10px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      position: 'relative', zIndex: 5,
    }}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        if (tab.big) {
          return (
            <Press key={tab.id} onClick={() => r.go(tab.screen)}
              style={{
                width: 50, height: 50, borderRadius: '50%',
                background: `linear-gradient(135deg, ${t.primary2}, ${t.primary})`,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
                boxShadow: `0 6px 16px ${t.primary}80`,
              }}>{tab.emoji}</Press>
          );
        }
        return (
          <Press key={tab.id} onClick={() => r.go(tab.screen)}
            style={{
              width: 46, height: 42, borderRadius: 14,
              background: isActive ? (dark ? 'rgba(255,122,74,0.18)' : t.tintWarm) : 'transparent',
              color: isActive ? t.primary : t.text2,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 1, fontSize: 9, fontWeight: 700,
            }}>
            <span style={{ fontSize: 19, filter: isActive ? 'none' : 'grayscale(0.3)' }}>{tab.emoji}</span>
          </Press>
        );
      })}
    </div>
  );
}
window.TabBar = TabBar;

// Recipe thumbnail card (used in many screens)
function RecipeCard({ recipe, width = 152, onClick }) {
  const { t } = useTheme();
  const src = SOURCES[recipe.src];
  return (
    <Press onClick={onClick} style={{
      width, borderRadius: 18, overflow: 'hidden',
      background: t.card, boxShadow: t.shadow, flexShrink: 0,
    }}>
      <div style={{ height: width * 0.86, background: `url(${recipe.img}) center/cover`, position: 'relative' }}>
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
          borderRadius: 999, padding: '3px 8px', fontSize: 9.5, fontWeight: 700,
          display: 'flex', gap: 4, alignItems: 'center', color: '#1A1A1A',
        }}>{src.emoji} {src.label}</div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 14, letterSpacing: -0.2, lineHeight: 1.2, color: t.text }}>
          {recipe.title}
        </div>
        <div style={{ fontSize: 10.5, color: t.text2, marginTop: 3 }}>⏱ {recipe.time}m · {recipe.cuisine}</div>
      </div>
    </Press>
  );
}
window.RecipeCard = RecipeCard;

// Section header
function SectionHeader({ title, action, onAction }) {
  const { t } = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 20px 10px' }}>
      <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 18, letterSpacing: -0.4, color: t.text }}>{title}</div>
      {action && <Press onClick={onAction} style={{ fontSize: 12, color: t.primary, fontWeight: 600 }}>{action}</Press>}
    </div>
  );
}
window.SectionHeader = SectionHeader;

// Platform badge pill
function PlatformBadge({ src, size = 'sm' }) {
  const m = SOURCES[src];
  const big = size === 'lg';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: big ? 6 : 4,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      borderRadius: 999, padding: big ? '5px 11px' : '3px 8px',
      fontSize: big ? 11 : 9.5, fontWeight: 700, color: '#1A1A1A',
    }}>
      <span>{m.emoji}</span>{m.label}
    </span>
  );
}
window.PlatformBadge = PlatformBadge;

// Avatar stack
function AvatarStack({ users = FRIENDS, max = 5, size = 24, border = '#fff' }) {
  return (
    <div style={{ display: 'flex' }}>
      {users.slice(0, max).map((u, i) => (
        <div key={u.id} style={{
          width: size, height: size, borderRadius: '50%',
          background: u.color,
          border: `${Math.max(1.5, size/12)}px solid ${border}`,
          marginLeft: i === 0 ? 0 : -size/3,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size*0.45,
        }}>{u.emoji}</div>
      ))}
    </div>
  );
}
window.AvatarStack = AvatarStack;

// screens-core.jsx — Splash, Onboarding, Home, Search
const { useTheme, useRoute, RECIPES, SOURCES, FRIENDS, FONT, FONT_DISP,
        Press, TopBar, TabBar, RecipeCard, SectionHeader, PlatformBadge, AvatarStack } = window;

// ─── SPLASH ──────────────────────────────────────────────────────────
function SplashScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [spin, setSpin] = React.useState(false);
  React.useEffect(() => {
    const t1 = setTimeout(() => setSpin(true), 200);
    const t2 = setTimeout(() => r.replace('onboarding'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(160deg, ${t.primary2}, ${t.primary})`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: FONT, overflow: 'hidden', position: 'relative',
    }}>
      <svg viewBox="0 0 200 200" width="180" height="180"
        style={{ transform: spin ? 'rotate(1080deg) scale(1)' : 'rotate(0deg) scale(0.8)',
                 transition: 'transform 2200ms cubic-bezier(.2,.7,.2,1)',
                 filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.3))' }}>
        {[['#FFE4B5',0],['#B1E0C6',60],['#FFC83D',120],['#FFAA7A',180],['#2E7D6B',240],['#FFF1D6',300]].map(([c, ang]) => {
          const a = ang * Math.PI/180, b = (ang+60) * Math.PI/180;
          return <path key={ang} d={`M100 100 L${100+90*Math.cos(a)} ${100+90*Math.sin(a)} A90 90 0 0 1 ${100+90*Math.cos(b)} ${100+90*Math.sin(b)} Z`} fill={c}/>;
        })}
        <circle cx="100" cy="100" r="90" fill="none" stroke="#fff" strokeWidth="4"/>
        <circle cx="100" cy="100" r="26" fill="#1A1A1A"/>
      </svg>
      <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 34, letterSpacing: -0.8, marginTop: 24 }}>
        RecipeRoulette
      </div>
      <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
        Social saves → dinner, solved.
      </div>
    </div>
  );
}
window.SplashScreen = SplashScreen;

// ─── ONBOARDING (3 slides) ───────────────────────────────────────────
function OnboardingScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [step, setStep] = React.useState(0);
  const slides = [
    { emoji: '🎵', title: 'Bring your saves', body: 'Connect TikTok, Instagram, YouTube or Pinterest and we turn videos into real recipes.', color: t.tintWarm },
    { emoji: '🎰', title: 'Spin when stuck', body: "Can't decide? The roulette picks from your saves — solo or with friends.", color: t.tintMint },
    { emoji: '👥', title: 'Vote together', body: 'Swipe on recipes with friends Tinder-style. Mutual likes become matches.', color: t.tintSky },
  ];
  const s = slides[step];
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, fontFamily: FONT, color: t.text,
        display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <Press onClick={() => r.reset('connect')} style={{ fontSize: 13, color: t.text2, fontWeight: 600 }}>Skip</Press>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '0 30px', textAlign: 'center' }}>
        <div style={{ width: 180, height: 180, borderRadius: 40, background: s.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, marginBottom: 32,
            boxShadow: t.shadowLg, transition: 'background 300ms' }}>
          {s.emoji}
        </div>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 28, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 10 }}>
          {s.title}
        </div>
        <div style={{ fontSize: 14, color: t.text2, lineHeight: 1.5, maxWidth: 280 }}>{s.body}</div>
      </div>
      <div style={{ padding: '0 20px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 22 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 22 : 7, height: 7, borderRadius: 999,
              background: i === step ? t.primary : t.text3, transition: 'width 200ms',
            }} />
          ))}
        </div>
        <Press onClick={() => step < 2 ? setStep(step+1) : r.reset('connect')}
          style={{ background: t.primary, color: '#fff', borderRadius: 999, padding: '15px 0',
              textAlign: 'center', fontFamily: FONT_DISP, fontWeight: 700, fontSize: 15,
              boxShadow: `0 10px 24px ${t.primary}60` }}>
          {step < 2 ? 'Next →' : "Let's go"}
        </Press>
      </div>
    </div>
  );
}
window.OnboardingScreen = OnboardingScreen;

// ─── CONNECT SOCIALS ─────────────────────────────────────────────────
function ConnectScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [connected, setConnected] = React.useState({ tiktok: true });
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, fontFamily: FONT, color: t.text,
        display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <Press onClick={() => r.back()} style={{ fontSize: 13, color: t.text2, fontWeight: 600 }}>‹ Back</Press>
        <Press onClick={() => r.reset('home')} style={{ fontSize: 13, color: t.text2, fontWeight: 600 }}>Skip</Press>
      </div>
      <div style={{ padding: '10px 24px 22px' }}>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 28, letterSpacing: -0.8, lineHeight: 1.1 }}>
          Connect your<br/>food feeds
        </div>
        <div style={{ fontSize: 13, color: t.text2, marginTop: 8 }}>
          We'll sync your saved videos and turn them into recipes automatically.
        </div>
      </div>
      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
        {Object.entries(SOURCES).map(([k, m]) => {
          const on = !!connected[k];
          return (
            <Press key={k} onClick={() => setConnected({ ...connected, [k]: !on })}
              style={{ background: t.card, borderRadius: 20, padding: '14px',
                  boxShadow: t.shadow, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14,
                  border: on ? `2px solid ${t.primary}` : '2px solid transparent' }}>
              <div style={{ width: 46, height: 46, borderRadius: 14,
                  background: `linear-gradient(135deg, ${m.hex}, ${m.hex2})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  boxShadow: `0 4px 10px ${m.hex}40` }}>{m.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 16 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: t.text2, marginTop: 2 }}>
                  {on ? (k === 'tiktok' ? '143 saved videos · synced' : 'Connected') : 'Tap to connect'}
                </div>
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: on ? t.primary : 'transparent',
                border: on ? 'none' : `2px solid ${t.text3}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13,
              }}>{on ? '✓' : ''}</div>
            </Press>
          );
        })}
      </div>
      <div style={{ padding: '14px 20px 26px' }}>
        <Press onClick={() => r.reset('home')} style={{
          background: t.primary, color: '#fff', borderRadius: 999, padding: '15px 0',
          textAlign: 'center', fontFamily: FONT_DISP, fontWeight: 700, fontSize: 15,
          boxShadow: `0 10px 24px ${t.primary}60`,
        }}>Continue →</Press>
      </div>
    </div>
  );
}
window.ConnectScreen = ConnectScreen;

// ─── HOME ────────────────────────────────────────────────────────────
function HomeScreen() {
  const { t, dark, toggle } = useTheme();
  const r = useRoute();
  const [installShown, setInstallShown] = React.useState(true);
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, fontFamily: FONT, color: t.text,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: t.text2, fontWeight: 500 }}>Tuesday · 7:42 PM</div>
          <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 26, letterSpacing: -0.8, lineHeight: 1.1, marginTop: 2 }}>
            Hola, Juan
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Press onClick={toggle} style={{ width: 36, height: 36, borderRadius: '50%', background: t.card,
              boxShadow: t.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            {dark ? '☀️' : '🌙'}
          </Press>
          <Press onClick={() => r.go('profile')} style={{ width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD6B8, #FF6B35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: '#fff', fontWeight: 700 }}>J</Press>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* install prompt */}
        {installShown && (
          <div style={{ margin: '4px 20px 10px', background: `linear-gradient(135deg, ${t.tintWarm}, ${t.tintMint})`,
              borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 22 }}>📱</div>
            <div style={{ flex: 1, fontSize: 11.5, lineHeight: 1.3 }}>
              <b>Install the app.</b> Add to Home Screen for offline saves and faster spins.
            </div>
            <Press style={{ background: t.primary, color: '#fff', borderRadius: 999, padding: '6px 12px', fontSize: 11, fontWeight: 700 }}>Install</Press>
            <Press onClick={() => setInstallShown(false)} style={{ color: t.text2, padding: '4px 2px', fontSize: 16 }}>×</Press>
          </div>
        )}

        {/* hero ai pick */}
        <div style={{ padding: '4px 20px 0' }}>
          <Press onClick={() => r.go('recipe', { id: 'r3' })} style={{
            borderRadius: 24, overflow: 'hidden', position: 'relative',
            height: 180, background: `url(${RECIPES[2].img}) center/cover`,
            boxShadow: t.shadowLg,
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent 55%)' }}/>
            <div style={{ position: 'absolute', top: 12, left: 12 }}>
              <span style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(18px)',
                  borderRadius: 999, padding: '5px 11px', fontSize: 10.5, fontWeight: 700, color: '#1A1A1A' }}>
                ✨ AI pick for tonight
              </span>
            </div>
            <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, color: '#fff' }}>
              <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 22, letterSpacing: -0.4, lineHeight: 1.15 }}>
                Miso Glazed Salmon
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 3 }}>25 min · Easy · based on your salmon saves</div>
            </div>
          </Press>
        </div>

        {/* quick tiles */}
        <div style={{ padding: '14px 20px 10px', display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 8 }}>
          <Press onClick={() => r.go('roulette')} style={{
            background: `linear-gradient(135deg, #FFE4C2, #FFB98A)`,
            borderRadius: 18, padding: '14px 12px', color: '#5a2a0d',
            boxShadow: t.shadow, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🎰</div>
            <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 15, lineHeight: 1.1 }}>Spin roulette</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>Let fate pick</div>
          </Press>
          <Press onClick={() => r.go('lobby')} style={{
            background: t.tintMint, borderRadius: 18, padding: '14px 12px', boxShadow: t.shadow,
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>👥</div>
            <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 14, color: t.accent }}>Vote</div>
            <div style={{ fontSize: 10, color: t.text2, marginTop: 2 }}>With friends</div>
          </Press>
          <Press onClick={() => r.go('capture')} style={{
            background: t.card, borderRadius: 18, padding: '14px 12px', boxShadow: t.shadow,
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🔗</div>
            <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 14 }}>Paste</div>
            <div style={{ fontSize: 10, color: t.text2, marginTop: 2 }}>Import link</div>
          </Press>
        </div>

        <SectionHeader title="From your feeds" action="See all" onAction={() => r.go('search')} />
        <div style={{ padding: '0 20px', display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {RECIPES.slice(0, 4).map(x => <RecipeCard key={x.id} recipe={x} onClick={() => r.go('recipe', { id: x.id })} />)}
        </div>

        <SectionHeader title="Quick & easy · under 20 min" />
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 12, overflowX: 'auto' }}>
          {RECIPES.filter(x => x.time <= 20).map(x => <RecipeCard key={x.id} recipe={x} width={140} onClick={() => r.go('recipe', { id: x.id })} />)}
        </div>
      </div>

      <TabBar active="home" />
    </div>
  );
}
window.HomeScreen = HomeScreen;

// ─── SEARCH ──────────────────────────────────────────────────────────
function SearchScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [q, setQ] = React.useState('');
  const [source, setSource] = React.useState('all');
  const filtered = RECIPES.filter(x => (source === 'all' || x.src === source) && (!q || x.title.toLowerCase().includes(q.toLowerCase()) || x.cuisine.toLowerCase().includes(q.toLowerCase())));
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, fontFamily: FONT, color: t.text,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px 8px' }}>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 26, letterSpacing: -0.8, marginBottom: 12 }}>Search</div>
        <div style={{ background: t.card, borderRadius: 14, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: t.shadow }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search recipes, cuisines…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: t.text, fontFamily: FONT }}/>
        </div>
      </div>

      <div style={{ padding: '8px 20px 10px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {[['all', 'All', '🍽️'], ...Object.entries(SOURCES).map(([k, m]) => [k, m.label, m.emoji])].map(([k, label, emoji]) => (
          <Press key={k} onClick={() => setSource(k)} style={{
            background: source === k ? t.primary : t.card,
            color: source === k ? '#fff' : t.text,
            borderRadius: 999, padding: '7px 13px', fontSize: 12, fontWeight: 600,
            display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0,
            boxShadow: source === k ? 'none' : t.shadow,
          }}>
            <span style={{ fontSize: 13 }}>{emoji}</span>{label}
          </Press>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 10px' }}>
        <div style={{ fontSize: 11, color: t.text2, fontWeight: 600, marginBottom: 10 }}>
          {filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map(x => <RecipeCard key={x.id} recipe={x} width="100%" onClick={() => r.go('recipe', { id: x.id })} />)}
        </div>
      </div>
      <TabBar active="search" />
    </div>
  );
}
window.SearchScreen = SearchScreen;

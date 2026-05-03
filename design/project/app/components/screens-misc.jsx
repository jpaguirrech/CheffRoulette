// screens-misc.jsx — Capture (paste link), Profile
const { useTheme, useRoute, RECIPES, SOURCES, FRIENDS, FONT, FONT_DISP, Press, TopBar, TabBar, RecipeCard, SectionHeader, AvatarStack } = window;

function CaptureScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [url, setUrl] = React.useState('');
  const [parsing, setParsing] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const parse = () => {
    setParsing(true);
    setTimeout(() => { setParsing(false); setDone(true); }, 1800);
  };
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="Import a recipe" />
      <div style={{ padding: '10px 24px 20px' }}>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 24, letterSpacing: -0.6, lineHeight: 1.15 }}>
          Drop a link,<br/>we'll do the rest
        </div>
        <div style={{ fontSize: 13, color: t.text2, marginTop: 6 }}>TikTok, Instagram, YouTube Shorts, Pinterest — paste any URL.</div>
      </div>
      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
        <div style={{ background: t.card, borderRadius: 18, padding: 14, boxShadow: t.shadow,
            display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://tiktok.com/@..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 14, color: t.text, fontFamily: FONT }}/>
          {url && <Press onClick={() => setUrl('')} style={{ color: t.text3, fontSize: 18, padding: '0 4px' }}>×</Press>}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {Object.entries(SOURCES).map(([k, m]) => (
            <Press key={k} style={{ flex: 1, background: t.card, borderRadius: 14, padding: '10px 0',
                textAlign: 'center', boxShadow: t.shadow, fontSize: 18 }}>{m.emoji}</Press>
          ))}
        </div>

        {parsing && (
          <div style={{ marginTop: 20, background: t.card, borderRadius: 18, padding: 16, boxShadow: t.shadow,
              display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${t.primary}`,
              borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}/>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Watching the video…</div>
              <div style={{ fontSize: 11, color: t.text2, marginTop: 2 }}>Extracting ingredients & steps with AI</div>
            </div>
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {done && (
          <div style={{ marginTop: 20, background: t.tintMint, borderRadius: 18, padding: 16,
              display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 26 }}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 15 }}>Got it!</div>
              <div style={{ fontSize: 12, color: t.text2, marginTop: 2 }}>Birria Tacos by @chefmaya — 9 ingredients, 6 steps</div>
            </div>
            <Press onClick={() => r.go('recipe', { id: 'r1' })} style={{
              background: t.accent, color: '#fff', borderRadius: 999, padding: '8px 14px',
              fontSize: 12, fontWeight: 700 }}>View</Press>
          </div>
        )}

        <div style={{ marginTop: 26, fontSize: 11, color: t.text2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
          Recently imported
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {RECIPES.slice(0, 4).map(x => <RecipeCard key={x.id} recipe={x} width={130} onClick={() => r.go('recipe', { id: x.id })} />)}
        </div>
      </div>
      <div style={{ padding: '14px 20px 26px' }}>
        <Press onClick={parse} style={{
          background: url ? t.primary : t.text3, color: '#fff', borderRadius: 999, padding: '15px 0',
          textAlign: 'center', fontFamily: FONT_DISP, fontWeight: 700, fontSize: 15,
          boxShadow: url ? `0 10px 24px ${t.primary}60` : 'none',
          pointerEvents: url && !parsing ? 'auto' : 'none',
        }}>{parsing ? 'Parsing…' : 'Import →'}</Press>
      </div>
    </div>
  );
}
window.CaptureScreen = CaptureScreen;

function ProfileScreen() {
  const { t, dark, toggle } = useTheme();
  const r = useRoute();
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: `linear-gradient(160deg, ${t.primary2}, ${t.primary})`, padding: '56px 24px 30px', color: '#fff', position: 'relative' }}>
          <Press onClick={() => r.back()} style={{ position: 'absolute', top: 14, left: 16,
            width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</Press>
          <Press onClick={toggle} style={{ position: 'absolute', top: 14, right: 16,
            width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            {dark ? '☀️' : '🌙'}
          </Press>
          <div style={{ width: 76, height: 76, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD6B8, #fff)',
              border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_DISP, fontWeight: 700, fontSize: 34, color: t.primary,
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)' }}>J</div>
          <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 26, letterSpacing: -0.6, marginTop: 12 }}>Juan A.</div>
          <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 2 }}>@juan · Home cook · 28 recipes cooked</div>
        </div>

        <div style={{ margin: '-18px 20px 0', background: t.card, borderRadius: 22, padding: '14px 10px',
            boxShadow: t.shadowLg, display: 'flex' }}>
          {[['28', 'Cooked'], ['143', 'Saved'], ['12', 'Matches'], ['7', 'Streak 🔥']].map(([v, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? `1px solid ${t.divider}` : 'none' }}>
              <div style={{ fontFamily: FONT_DISP, fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>{v}</div>
              <div style={{ fontSize: 10.5, color: t.text2, fontWeight: 600, marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>

        <SectionHeader title="Badges" />
        <div style={{ padding: '0 20px 10px', display: 'flex', gap: 10, overflowX: 'auto' }}>
          {[
            ['🔥','7-day streak', t.primary],
            ['🌶️','Spice lover', '#E74C3C'],
            ['👥','Crew cook', t.accent],
            ['⚡','Speed chef', t.yellow],
            ['🌍','World eater', '#4A90E2'],
          ].map(([e, l, c]) => (
            <div key={l} style={{ flexShrink: 0, width: 88, background: t.card, borderRadius: 18,
                padding: '14px 8px', textAlign: 'center', boxShadow: t.shadow }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${c}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto' }}>{e}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 6, lineHeight: 1.2 }}>{l}</div>
            </div>
          ))}
        </div>

        <SectionHeader title="Your collections" action="Edit" />
        <div style={{ padding: '0 20px 10px', display: 'flex', gap: 12, overflowX: 'auto' }}>
          {RECIPES.slice(0, 5).map(x => <RecipeCard key={x.id} recipe={x} width={130} onClick={() => r.go('recipe', { id: x.id })} />)}
        </div>

        <SectionHeader title="Settings" />
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ background: t.card, borderRadius: 18, overflow: 'hidden', boxShadow: t.shadow }}>
            {[
              ['🔔','Notifications','On'],
              ['🍽','Dietary preferences','Vegetarian-friendly'],
              ['🗣','Language','English'],
              ['📱','Add to Home Screen','Install'],
              ['↗','Help & feedback',''],
            ].map(([i, l, v], k) => (
              <Press key={l} style={{ padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: k < 4 ? `1px solid ${t.divider}` : 'none' }}>
                <div style={{ width: 28, textAlign: 'center', fontSize: 16 }}>{i}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{l}</div>
                <div style={{ fontSize: 12, color: t.text2 }}>{v}</div>
                <div style={{ color: t.text3, fontSize: 16 }}>›</div>
              </Press>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="you" />
    </div>
  );
}
window.ProfileScreen = ProfileScreen;

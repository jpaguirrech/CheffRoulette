// screens-roulette.jsx — The "wow" spinning wheel + slot reels
const { useTheme, useRoute, RECIPES, SOURCES, FONT, FONT_DISP, Press, TopBar } = window;

// Spinning wheel with REAL physics — eased rotation to a target recipe.
function RouletteScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [mode, setMode] = React.useState('wheel'); // 'wheel' | 'reels'
  const [spinning, setSpinning] = React.useState(false);
  const [angle, setAngle] = React.useState(0);
  const [result, setResult] = React.useState(null);
  const picks = RECIPES.slice(0, 8);
  const colors = ['#FFE4B5','#B1E0C6','#FFC83D','#FFAA7A','#2E7D6B','#FFF1D6','#FF8A7A','#C4B5FD'];

  const spin = () => {
    if (spinning) return;
    setResult(null);
    const winner = Math.floor(Math.random() * picks.length);
    const seg = 360 / picks.length;
    const target = 360 * 6 + (360 - (winner * seg + seg/2)); // 6 full turns + land pointer on segment
    setSpinning(true);
    setAngle(angle + target);
    setTimeout(() => { setSpinning(false); setResult(picks[winner]); }, 4200);
  };

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* ambient glow */}
      <div style={{ position: 'absolute', top: '20%', left: '-30%', width: 320, height: 320, borderRadius: '50%',
        background: `radial-gradient(circle, ${t.primary}22, transparent 70%)`, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '10%', right: '-30%', width: 320, height: 320, borderRadius: '50%',
        background: `radial-gradient(circle, ${t.accent}22, transparent 70%)`, pointerEvents: 'none' }}/>

      <TopBar title="Tonight's pick" trailing={
        <Press style={{ fontSize: 18, color: t.text2, width: 36, height: 36, borderRadius: '50%',
            background: t.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙</Press>
      } />

      {/* mode toggle */}
      <div style={{ padding: '0 20px 8px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: t.card, borderRadius: 999, padding: 4, display: 'flex', boxShadow: t.shadow }}>
          {['wheel', 'reels'].map(m => (
            <Press key={m} onClick={() => { setMode(m); setResult(null); }}
              style={{ background: mode === m ? t.primary : 'transparent',
                color: mode === m ? '#fff' : t.text2, borderRadius: 999,
                padding: '7px 18px', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>
              {m === 'wheel' ? '🎡 Wheel' : '🎰 Reels'}
            </Press>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 22px', position: 'relative', zIndex: 1 }}>
        {mode === 'wheel' ? (
          <div style={{ position: 'relative', width: 300, height: 300 }}>
            {/* soft glow ring */}
            <div style={{ position: 'absolute', inset: -18, borderRadius: '50%',
              background: `conic-gradient(from 0deg, ${t.primary}, ${t.yellow}, ${t.accent}, ${t.primary})`,
              filter: 'blur(24px)', opacity: spinning ? 0.7 : 0.4, transition: 'opacity 300ms' }}/>
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.25))',
                transform: `rotate(${angle}deg)`,
                transition: spinning ? 'transform 4200ms cubic-bezier(.17,.67,.2,.99)' : 'none' }}>
              {picks.map((p, i) => {
                const seg = 360/picks.length, a = i*seg*Math.PI/180, b = (i+1)*seg*Math.PI/180;
                const x1 = 50 + 50*Math.cos(a), y1 = 50 + 50*Math.sin(a);
                const x2 = 50 + 50*Math.cos(b), y2 = 50 + 50*Math.sin(b);
                const lx = 50 + 32*Math.cos((a+b)/2), ly = 50 + 32*Math.sin((a+b)/2);
                return (
                  <g key={i}>
                    <path d={`M50 50 L${x1} ${y1} A50 50 0 0 1 ${x2} ${y2} Z`} fill={colors[i]} />
                    <text x={lx} y={ly} textAnchor="middle" fontSize="3.6" fontWeight="700" fill="#1A1A1A"
                      transform={`rotate(${(i+0.5)*seg+90} ${lx} ${ly})`}>{p.title.slice(0,12)}</text>
                  </g>
                );
              })}
              <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="1.2"/>
              <circle cx="50" cy="50" r="13" fill="#1A1A1A" stroke="#fff" strokeWidth="1"/>
              <text x="50" y="52.5" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#fff">SPIN</text>
            </svg>
            {/* pointer */}
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent',
              borderTop: `24px solid ${t.primary}`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))', zIndex: 3 }}/>
          </div>
        ) : (
          <SlotReels spinning={spinning} onDone={(cuisine, vibe, time) => setResult({ ...RECIPES[0], title: `${vibe} ${cuisine}`, time })} />
        )}
      </div>

      {/* result */}
      <div style={{ padding: '0 24px', minHeight: 80, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {result ? (
          <Press onClick={() => r.go('recipe', { id: result.id || 'r1' })} style={{
            background: t.card, borderRadius: 20, padding: '12px 16px', boxShadow: t.shadowLg,
            display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
          }}>
            {result.img && <div style={{ width: 52, height: 52, borderRadius: 14,
              background: `url(${result.img}) center/cover`, flexShrink: 0 }}/>}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: t.primary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>🏆 Your pick</div>
              <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 17, letterSpacing: -0.3, lineHeight: 1.1, marginTop: 2 }}>{result.title}</div>
              <div style={{ fontSize: 11, color: t.text2, marginTop: 2 }}>⏱ {result.time}m · tap to view</div>
            </div>
            <div style={{ fontSize: 20, color: t.text3 }}>›</div>
          </Press>
        ) : (
          <div style={{ fontSize: 11, color: t.text2, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, paddingTop: 14 }}>
            {spinning ? 'spinning…' : 'ready when you are'}
          </div>
        )}
      </div>

      <div style={{ padding: '14px 20px 26px', position: 'relative', zIndex: 1 }}>
        <Press onClick={spin} style={{
          background: spinning ? t.text3 : t.text, color: t.bg, borderRadius: 999,
          padding: '15px 0', textAlign: 'center', fontWeight: 700, fontSize: 15,
          fontFamily: FONT_DISP, letterSpacing: -0.2,
          boxShadow: spinning ? 'none' : `0 10px 24px rgba(0,0,0,0.2)`,
          pointerEvents: spinning ? 'none' : 'auto',
        }}>
          {spinning ? 'Spinning…' : mode === 'wheel' ? '🎰 Spin the wheel' : '🎰 Pull the handle'}
        </Press>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Press onClick={() => r.go('lobby')} style={{ flex: 1, background: t.card, borderRadius: 999,
            padding: '11px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: t.text2, boxShadow: t.shadow }}>
            👥 With friends
          </Press>
          <Press style={{ flex: 1, background: t.card, borderRadius: 999,
            padding: '11px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: t.text2, boxShadow: t.shadow }}>
            📱 Shake to spin
          </Press>
        </div>
      </div>
    </div>
  );
}
window.RouletteScreen = RouletteScreen;

// Slot reels — 3 independent reels that stop one-by-one
function SlotReels({ spinning, onDone }) {
  const { t } = useTheme();
  const reels = [
    { items: ['🌮','🍝','🍣','🍛','🥗','🍕'], labels: ['Mexican','Italian','Japanese','Indian','Salad','Pizza'] },
    { items: ['🌶️','🧄','🍋','🧀','🌿','🔥'], labels: ['Spicy','Savory','Citrusy','Cheesy','Herby','Smoky'] },
    { items: ['⏱️','🍳','🔥','🕐','⚡','🥘'], labels: ['15m','20m','30m','45m','Quick','Slow'] },
  ];
  const [offsets, setOffsets] = React.useState([0, 0, 0]);
  const [stopped, setStopped] = React.useState([true, true, true]);

  React.useEffect(() => {
    if (!spinning) return;
    setStopped([false, false, false]);
    const targets = reels.map(r => Math.floor(Math.random() * r.items.length));
    // each reel gets more rotations before stopping
    const durations = [2000, 2800, 3600];
    reels.forEach((r, i) => {
      const totalItems = r.items.length * 10 + targets[i]; // 10 full cycles + land
      setTimeout(() => setOffsets(o => o.map((v, j) => j === i ? totalItems : v)), 50);
      setTimeout(() => {
        setStopped(s => s.map((v, j) => j === i ? true : v));
        if (i === 2 && onDone) onDone(reels[0].labels[targets[0]], reels[1].labels[targets[1]], reels[2].labels[targets[2]]);
      }, durations[i]);
    });
  }, [spinning]);

  const ITEM_H = 60;
  return (
    <div style={{
      background: t.bg2, borderRadius: 28, padding: 14,
      boxShadow: t.shadowLg, border: `1px solid ${t.border}`,
      display: 'flex', gap: 10, position: 'relative',
    }}>
      {reels.map((reel, i) => {
        const loop = [...reel.items, ...reel.items, ...reel.items, ...reel.items, ...reel.items, ...reel.items,
                      ...reel.items, ...reel.items, ...reel.items, ...reel.items, ...reel.items];
        return (
          <div key={i} style={{
            width: 70, height: ITEM_H * 3, borderRadius: 18,
            background: ['#FFE4C2', '#E8F5EE', '#FFF1D6'][i],
            overflow: 'hidden', position: 'relative',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              display: 'flex', flexDirection: 'column',
              transform: `translateY(-${offsets[i] * ITEM_H}px)`,
              transition: spinning && !stopped[i] ? `transform ${2000 + i*800}ms cubic-bezier(.17,.67,.2,.99)` :
                stopped[i] ? 'transform 200ms ease-out' : 'none',
            }}>
              {loop.map((it, j) => (
                <div key={j} style={{ height: ITEM_H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                  {it}
                </div>
              ))}
            </div>
            {/* shine overlay */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)' }}/>
          </div>
        );
      })}
      {/* center band */}
      <div style={{ position: 'absolute', left: 10, right: 10, top: '50%', height: ITEM_H, marginTop: -ITEM_H/2,
        border: `2.5px solid ${t.primary}`, borderRadius: 14, pointerEvents: 'none',
        boxShadow: `0 0 0 4px ${t.primary}22` }}/>
    </div>
  );
}
window.SlotReels = SlotReels;

// dusk.jsx — Direction A · "DUSK"
// Dark neon kitchen. Near-black background, hot-magenta + lime primary,
// chunky rounded type, glowy soft shadows. Feels like a late-night snack.
const DUSK = {
  bg: '#0B0910',
  bg2: '#141020',
  card: '#1A1528',
  border: 'rgba(255,255,255,0.08)',
  text: '#F5F0FF',
  text2: 'rgba(245,240,255,0.62)',
  primary: '#B8FF3C',    // lime
  primary2: '#D9FF7A',
  accent: '#FF2E88',     // hot magenta
  accent2: '#FF66B2',
  orange: '#FF8A3D',
  glow: '0 0 40px rgba(184,255,60,0.35)',
  glowPink: '0 0 40px rgba(255,46,136,0.4)',
  font: '"Space Grotesk", "Inter", system-ui, sans-serif',
  fontDisp: '"Space Grotesk", Inter, system-ui, sans-serif',
};
window.DUSK = DUSK;

// Tiny helper: recipe thumb card (vertical)
function DuskRecipeCard({ r, w = 150 }) {
  const src = window.SOURCE_META[r.src];
  return (
    <div style={{
      width: w, borderRadius: 18, overflow: 'hidden',
      background: DUSK.card, border: `1px solid ${DUSK.border}`,
      flexShrink: 0, position: 'relative',
    }}>
      <div style={{ width: '100%', height: w * 0.95, backgroundImage: `url(${r.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
          borderRadius: 999, padding: '4px 9px', display: 'flex', gap: 4,
          alignItems: 'center', fontSize: 10, fontWeight: 600, color: '#fff',
        }}>
          <span style={{fontSize: 11}}>{src.emoji}</span>{src.label}
        </div>
      </div>
      <div style={{ padding: '10px 12px 14px' }}>
        <div style={{
          fontFamily: DUSK.fontDisp, fontWeight: 700, fontSize: 14,
          color: DUSK.text, lineHeight: 1.2, marginBottom: 6,
        }}>{r.title}</div>
        <div style={{
          fontSize: 11, color: DUSK.text2, display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <span>⏱ {r.time}m</span>
          <span>·</span>
          <span>{r.cuisine}</span>
        </div>
      </div>
    </div>
  );
}
window.DuskRecipeCard = DuskRecipeCard;

// ─── Screen 1 · HOME / FEED
function DuskHome() {
  const r = window.MOCK_RECIPES;
  return (
    <div style={{ background: DUSK.bg, height: '100%', overflow: 'hidden',
        fontFamily: DUSK.font, color: DUSK.text, display: 'flex', flexDirection: 'column' }}>
      {/* glow bg blob */}
      <div style={{ position: 'absolute', top: -80, right: -60, width: 220, height: 220,
        background: `radial-gradient(circle, ${DUSK.accent}66 0%, transparent 70%)`,
        pointerEvents: 'none' }} />
      <div style={{ padding: '16px 18px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: DUSK.text2, fontWeight: 500 }}>¡Hola, Juan!</div>
            <div style={{ fontFamily: DUSK.fontDisp, fontWeight: 700, fontSize: 24, lineHeight: 1.1, letterSpacing: -0.5 }}>
              What's for <span style={{ color: DUSK.primary }}>dinner?</span>
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: DUSK.accent,
            boxShadow: DUSK.glowPink, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🔥</div>
        </div>
        {/* streak pill */}
        <div style={{
          background: DUSK.card, border: `1px solid ${DUSK.border}`, borderRadius: 16,
          padding: '11px 14px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ fontSize: 20 }}>🔥</div>
            <div>
              <div style={{ fontSize: 11, color: DUSK.text2 }}>Cooking streak</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>7 days</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: DUSK.primary, fontWeight: 600 }}>+240 pts</div>
        </div>
      </div>

      {/* big roulette CTA */}
      <div style={{ padding: '0 18px 14px' }}>
        <div style={{
          borderRadius: 22, padding: '20px 18px',
          background: `linear-gradient(135deg, ${DUSK.primary} 0%, ${DUSK.accent} 100%)`,
          color: '#0B0910', position: 'relative', overflow: 'hidden',
          boxShadow: DUSK.glow,
        }}>
          <div style={{ fontFamily: DUSK.fontDisp, fontWeight: 800, fontSize: 22, letterSpacing: -0.6, marginBottom: 4 }}>
            Spin the roulette
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 14 }}>
            Can't decide? Let fate pick tonight.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              background: '#0B0910', color: DUSK.primary, borderRadius: 999,
              padding: '8px 14px', fontWeight: 700, fontSize: 13, display: 'flex', gap: 6, alignItems: 'center',
            }}>🎰 Solo spin</div>
            <div style={{
              background: 'rgba(0,0,0,0.15)', color: '#0B0910', borderRadius: 999,
              padding: '8px 14px', fontWeight: 700, fontSize: 13, display: 'flex', gap: 6, alignItems: 'center',
              border: '1.5px solid rgba(0,0,0,0.25)',
            }}>👥 With friends</div>
          </div>
          {/* deco */}
          <div style={{ position: 'absolute', right: -14, top: -12, fontSize: 90, opacity: 0.25 }}>🎰</div>
        </div>
      </div>

      {/* source filters (horizontal scroll) */}
      <div style={{ padding: '0 18px 10px' }}>
        <div style={{ fontSize: 11, color: DUSK.text2, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
          Browse by source
        </div>
        <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
          {['tiktok','instagram','youtube','pinterest'].map((k, i) => {
            const m = window.SOURCE_META[k];
            return (
              <div key={k} style={{
                background: i === 0 ? DUSK.primary : DUSK.card,
                color: i === 0 ? '#0B0910' : DUSK.text,
                border: `1px solid ${i === 0 ? 'transparent' : DUSK.border}`,
                borderRadius: 999, padding: '7px 13px', fontSize: 12, fontWeight: 600,
                display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0,
              }}>
                <span style={{ fontSize: 13 }}>{m.emoji}</span>{m.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* recent row */}
      <div style={{ padding: '8px 18px 0', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontFamily: DUSK.fontDisp, fontWeight: 700, fontSize: 17 }}>Recent from TikTok ♡</div>
          <div style={{ fontSize: 11, color: DUSK.primary, fontWeight: 600 }}>See all</div>
        </div>
        <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
          {r.slice(0, 3).map(x => <DuskRecipeCard key={x.id} r={x} />)}
        </div>
      </div>

      {/* tab bar */}
      <div style={{
        background: DUSK.bg2, borderTop: `1px solid ${DUSK.border}`,
        padding: '10px 24px 22px', display: 'flex', justifyContent: 'space-between',
      }}>
        {[
          ['🏠', 'Home', true],
          ['🔍', 'Search', false],
          ['🎰', '', false, true], // center accent
          ['👥', 'Votes', false],
          ['👤', 'You', false],
        ].map(([e, l, active, big], i) => big ? (
          <div key={i} style={{
            width: 52, height: 52, borderRadius: '50%', marginTop: -22,
            background: `linear-gradient(135deg, ${DUSK.primary}, ${DUSK.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: DUSK.glow, fontSize: 24,
          }}>{e}</div>
        ) : (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: active ? DUSK.primary : DUSK.text2, fontSize: 10, fontWeight: 600,
          }}>
            <span style={{ fontSize: 20, filter: active ? 'none' : 'grayscale(0.5)' }}>{e}</span>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
window.DuskHome = DuskHome;

// ─── Screen 2 · ROULETTE (classic wheel w/ physics)
function DuskRoulette() {
  return (
    <div style={{ background: DUSK.bg, height: '100%', color: DUSK.text,
        fontFamily: DUSK.font, display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '-20%', width: 300, height: 300,
        background: `radial-gradient(circle, ${DUSK.primary}44 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '-20%', width: 280, height: 280,
        background: `radial-gradient(circle, ${DUSK.accent}55 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 22 }}>‹</div>
        <div style={{ fontFamily: DUSK.fontDisp, fontWeight: 700, fontSize: 16 }}>🎰 Roulette</div>
        <div style={{
          background: DUSK.card, border: `1px solid ${DUSK.border}`, borderRadius: 999,
          padding: '5px 10px', fontSize: 11, fontWeight: 600,
        }}>Solo</div>
      </div>

      <div style={{ textAlign: 'center', padding: '4px 18px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, color: DUSK.text2, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
          Tonight's pick
        </div>
        <div style={{ fontFamily: DUSK.fontDisp, fontSize: 22, fontWeight: 800, letterSpacing: -0.6, marginTop: 2 }}>
          ¿Qué cocinamos?
        </div>
      </div>

      {/* wheel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', width: 280, height: 280 }}>
          {/* glow */}
          <div style={{ position: 'absolute', inset: -14, borderRadius: '50%',
            background: `conic-gradient(from 0deg, ${DUSK.primary}, ${DUSK.accent}, ${DUSK.orange}, ${DUSK.primary})`,
            filter: 'blur(22px)', opacity: 0.55 }} />
          {/* wheel disc with segments */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}>
            {[
              ['#B8FF3C', '🌮 Tacos'],
              ['#FF2E88', '🍝 Pasta'],
              ['#FF8A3D', '🍣 Sushi'],
              ['#8B5CF6', '🍛 Curry'],
              ['#22D3EE', '🥗 Salad'],
              ['#FDBA74', '🍕 Pizza'],
              ['#F472B6', '🥘 Paella'],
              ['#A3E635', '🍜 Ramen'],
            ].map(([c, label], i) => {
              const seg = 360/8, a = i*seg*Math.PI/180, b = (i+1)*seg*Math.PI/180;
              const x1 = 50 + 50*Math.cos(a), y1 = 50 + 50*Math.sin(a);
              const x2 = 50 + 50*Math.cos(b), y2 = 50 + 50*Math.sin(b);
              const lx = 50 + 32*Math.cos((a+b)/2), ly = 50 + 32*Math.sin((a+b)/2);
              return (
                <g key={i}>
                  <path d={`M50 50 L${x1} ${y1} A50 50 0 0 1 ${x2} ${y2} Z`} fill={c} opacity={0.92} />
                  <text x={lx} y={ly} textAnchor="middle" fontSize="4.5" fontWeight="700"
                    fill="#0B0910" fontFamily="sans-serif" transform={`rotate(${(i+0.5)*seg+90} ${lx} ${ly})`}>
                    {label}
                  </text>
                </g>
              );
            })}
            <circle cx="50" cy="50" r="14" fill={DUSK.bg} stroke={DUSK.primary} strokeWidth="1" />
            <text x="50" y="52.5" textAnchor="middle" fontSize="7" fontWeight="800" fill={DUSK.primary}>SPIN</text>
          </svg>
          {/* pointer */}
          <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent',
            borderTop: `20px solid ${DUSK.primary}`, filter: `drop-shadow(0 0 6px ${DUSK.primary})` }} />
        </div>
      </div>

      {/* actions */}
      <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{
          background: DUSK.primary, color: '#0B0910', borderRadius: 999,
          padding: '16px 0', textAlign: 'center', fontWeight: 800, fontSize: 16,
          fontFamily: DUSK.fontDisp, boxShadow: DUSK.glow, letterSpacing: -0.3,
        }}>🎰 SPIN THE WHEEL</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: DUSK.card, border: `1px solid ${DUSK.border}`,
            borderRadius: 999, padding: '11px 0', textAlign: 'center', fontSize: 12, fontWeight: 600 }}>
            📱 Shake to spin
          </div>
          <div style={{ flex: 1, background: DUSK.card, border: `1px solid ${DUSK.border}`,
            borderRadius: 999, padding: '11px 0', textAlign: 'center', fontSize: 12, fontWeight: 600 }}>
            ⚙️ Filters
          </div>
        </div>
      </div>

      <div style={{ height: 22 }} />
    </div>
  );
}
window.DuskRoulette = DuskRoulette;

// ─── Screen 3 · FRIENDS VOTING (swipe Tinder style)
function DuskVote() {
  const r = window.MOCK_RECIPES;
  return (
    <div style={{ background: DUSK.bg, height: '100%', color: DUSK.text,
        fontFamily: DUSK.font, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 22 }}>‹</div>
          <div style={{ fontFamily: DUSK.fontDisp, fontWeight: 700, fontSize: 15 }}>Friday Dinner</div>
          <div style={{
            background: DUSK.accent, color: '#fff', borderRadius: 999, padding: '4px 10px',
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
          }}>LIVE</div>
        </div>
        {/* participants */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex' }}>
            {['👩', '👨‍🍳', '🧑', '👱‍♀️', '👨'].map((e, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: ['#FF2E88','#B8FF3C','#FF8A3D','#22D3EE','#8B5CF6'][i],
                border: `2.5px solid ${DUSK.bg}`, marginLeft: i === 0 ? 0 : -10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>{e}</div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: DUSK.text2, marginBottom: 4 }}>
          5 chefs · 12 recipes · 2 voted
        </div>
      </div>

      {/* swipe card stack */}
      <div style={{ flex: 1, position: 'relative', padding: '16px 22px' }}>
        {/* back card */}
        <div style={{ position: 'absolute', top: 24, left: 34, right: 34, bottom: 40,
          background: DUSK.card, borderRadius: 24, border: `1px solid ${DUSK.border}`,
          transform: 'scale(0.94) translateY(8px)' }} />
        {/* active card */}
        <div style={{ position: 'absolute', top: 16, left: 22, right: 22, bottom: 30,
          borderRadius: 28, overflow: 'hidden',
          backgroundImage: `url(${r[1].img})`, backgroundSize: 'cover', backgroundPosition: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)', transform: 'rotate(-2deg)',
        }}>
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            borderRadius: 999, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#fff',
          }}>📸 Instagram · @seoulfoodies</div>
          {/* like badge */}
          <div style={{
            position: 'absolute', top: 30, right: 24, transform: 'rotate(16deg)',
            border: `3px solid ${DUSK.primary}`, color: DUSK.primary, borderRadius: 10,
            padding: '3px 12px', fontWeight: 900, fontSize: 18, letterSpacing: 1,
            fontFamily: DUSK.fontDisp, background: 'rgba(11,9,16,0.3)',
          }}>YES!</div>
          {/* bottom gradient */}
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(11,9,16,0.95) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18 }}>
            <div style={{ fontFamily: DUSK.fontDisp, fontWeight: 800, fontSize: 24,
                letterSpacing: -0.5, marginBottom: 4, color: '#fff' }}>
              Gochujang Pasta
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <span style={{ background: 'rgba(184,255,60,0.25)', color: DUSK.primary, borderRadius: 999, padding: '3px 9px', fontSize: 10, fontWeight: 600 }}>Fusion</span>
              <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 999, padding: '3px 9px', fontSize: 10, fontWeight: 600 }}>⏱ 20m</span>
              <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 999, padding: '3px 9px', fontSize: 10, fontWeight: 600 }}>Easy</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              Spicy, creamy, 10 ingredients · 3 friends already liked 🔥
            </div>
          </div>
        </div>
      </div>

      {/* action bar */}
      <div style={{ padding: '0 18px 28px', display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: 54, height: 54, borderRadius: '50%', background: DUSK.card,
          border: `1.5px solid ${DUSK.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>✕</div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: DUSK.card,
          border: `1.5px solid ${DUSK.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>⭐</div>
        <div style={{
          width: 66, height: 66, borderRadius: '50%',
          background: `linear-gradient(135deg, ${DUSK.primary}, #7FE020)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, boxShadow: DUSK.glow,
        }}>❤️</div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: DUSK.card,
          border: `1.5px solid ${DUSK.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>↶</div>
        <div style={{
          width: 54, height: 54, borderRadius: '50%', background: DUSK.card,
          border: `1.5px solid ${DUSK.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>👥</div>
      </div>
    </div>
  );
}
window.DuskVote = DuskVote;

// ─── Screen 4 · CAPTURE (with TikTok favs integration)
function DuskCapture() {
  return (
    <div style={{ background: DUSK.bg, height: '100%', color: DUSK.text,
        fontFamily: DUSK.font, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 22 }}>‹</div>
        <div style={{ fontFamily: DUSK.fontDisp, fontWeight: 700, fontSize: 15 }}>Add recipe</div>
        <div style={{ width: 22 }} />
      </div>

      <div style={{ padding: '0 18px 8px' }}>
        <div style={{
          fontFamily: DUSK.fontDisp, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, lineHeight: 1.1, marginBottom: 6,
        }}>Grab it from <span style={{ color: DUSK.primary }}>anywhere</span>.</div>
        <div style={{ fontSize: 12, color: DUSK.text2, marginBottom: 16 }}>
          Paste a URL or connect a social account — AI will extract ingredients & steps.
        </div>

        {/* paste URL */}
        <div style={{
          background: DUSK.card, border: `1.5px solid ${DUSK.border}`,
          borderRadius: 16, padding: '14px', marginBottom: 10,
        }}>
          <div style={{ fontSize: 10, color: DUSK.text2, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
            Paste video URL
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: 12, color: DUSK.text2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              tiktok.com/@chefmaya/video/72910…
            </div>
            <div style={{
              background: DUSK.primary, color: '#0B0910', borderRadius: 999,
              padding: '7px 14px', fontSize: 12, fontWeight: 700,
            }}>✨ Extract</div>
          </div>
        </div>
      </div>

      {/* connect platforms */}
      <div style={{ padding: '6px 18px 0' }}>
        <div style={{ fontSize: 10, color: DUSK.text2, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
          Or connect your favorites
        </div>
        {[
          ['tiktok', 'TikTok', 'Sync 143 saved videos', true],
          ['instagram', 'Instagram', 'Import saved reels', false],
          ['youtube', 'YouTube', 'Watch Later · Cooking playlist', false],
          ['pinterest', 'Pinterest', 'Import your boards', false],
        ].map(([k, label, sub, connected]) => {
          const m = window.SOURCE_META[k];
          return (
            <div key={k} style={{
              background: DUSK.card, border: `1px solid ${DUSK.border}`, borderRadius: 16,
              padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: `linear-gradient(135deg, ${m.hex}, ${m.hex2})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{m.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div>
                <div style={{ fontSize: 11, color: DUSK.text2 }}>{sub}</div>
              </div>
              <div style={{
                background: connected ? 'rgba(184,255,60,0.15)' : 'transparent',
                border: connected ? `1px solid ${DUSK.primary}` : `1px solid ${DUSK.border}`,
                color: connected ? DUSK.primary : DUSK.text,
                borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 700,
              }}>{connected ? '✓ Synced' : 'Connect'}</div>
            </div>
          );
        })}
      </div>

      {/* tiktok favs preview */}
      <div style={{ padding: '12px 18px 0', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>From your TikTok favs 🎵</div>
          <div style={{ fontSize: 11, color: DUSK.primary, fontWeight: 600 }}>See 143</div>
        </div>
        <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
          {window.MOCK_RECIPES.slice(0, 4).map(r => (
            <div key={r.id} style={{
              width: 88, height: 128, borderRadius: 12, overflow: 'hidden',
              backgroundImage: `url(${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
              flexShrink: 0, position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%)' }}/>
              <div style={{ position: 'absolute', bottom: 5, left: 6, right: 6, fontSize: 9, fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>
                {r.title}
              </div>
              <div style={{ position: 'absolute', top: 5, right: 5, fontSize: 10 }}>🎵</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 22 }} />
    </div>
  );
}
window.DuskCapture = DuskCapture;

// glass.jsx — Direction B · "GLASS"
// Apple-native feel. Warm off-white, liquid glass blurs, SF-like type, soft depth.
const GLASS = {
  bg: '#F7F4EE',
  bg2: '#FFFFFF',
  card: '#FFFFFF',
  tintWarm: '#FFF5EC',
  tintMint: '#E8F5EE',
  border: 'rgba(0,0,0,0.08)',
  text: '#1A1A1A',
  text2: 'rgba(26,26,26,0.56)',
  text3: 'rgba(26,26,26,0.38)',
  primary: '#FF6B35',     // tomato
  primary2: '#FF8A5C',
  accent: '#2E7D6B',      // deep basil
  yellow: '#FFC83D',
  shadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.07)',
  shadowLg: '0 2px 6px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.1)',
  font: '-apple-system, "SF Pro Text", "Inter", system-ui, sans-serif',
  fontDisp: '"Fraunces", "SF Pro Display", -apple-system, Georgia, serif',
};
window.GLASS = GLASS;

// ─── Screen 1 · HOME
function GlassHome() {
  const r = window.MOCK_RECIPES;
  return (
    <div style={{ background: GLASS.bg, height: '100%', overflow: 'hidden',
        fontFamily: GLASS.font, color: GLASS.text, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: GLASS.text2, fontWeight: 500 }}>Tuesday · 7:42 PM</div>
          <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 26, letterSpacing: -0.8, lineHeight: 1.1, color: GLASS.text, marginTop: 2 }}>
            Good evening, Juan
          </div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD6B8, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: '#fff', fontWeight: 600 }}>J</div>
      </div>

      {/* hero card */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{
          borderRadius: 24, overflow: 'hidden', position: 'relative',
          height: 180, background: `url(${r[2].img}) center/cover`,
          boxShadow: GLASS.shadowLg,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 55%)' }}/>
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            borderRadius: 999, padding: '5px 11px', fontSize: 10.5, fontWeight: 600,
          }}>✨ AI pick for you</div>
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, color: '#fff' }}>
            <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 22, letterSpacing: -0.4, lineHeight: 1.15 }}>
              Miso Glazed Salmon
            </div>
            <div style={{ fontSize: 11.5, opacity: 0.88, marginTop: 3 }}>
              25 min · Easy · You liked salmon teriyaki
            </div>
          </div>
        </div>
      </div>

      {/* 3 quick tiles */}
      <div style={{ padding: '14px 20px 10px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 8 }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFE4C2, #FFB98A)',
          borderRadius: 18, padding: '14px 12px', color: '#5a2a0d',
          boxShadow: GLASS.shadow, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🎰</div>
          <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 15, letterSpacing: -0.2, lineHeight: 1.1 }}>Spin the roulette</div>
          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>Let fate pick dinner</div>
        </div>
        <div style={{ background: GLASS.tintMint, borderRadius: 18, padding: '14px 12px', boxShadow: GLASS.shadow }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>👥</div>
          <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 14, color: GLASS.accent }}>Vote with friends</div>
          <div style={{ fontSize: 10, color: GLASS.text2, marginTop: 2 }}>2 active</div>
        </div>
        <div style={{ background: GLASS.bg2, borderRadius: 18, padding: '14px 12px', boxShadow: GLASS.shadow }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🔗</div>
          <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 14 }}>Paste link</div>
          <div style={{ fontSize: 10, color: GLASS.text2, marginTop: 2 }}>TikTok, IG…</div>
        </div>
      </div>

      {/* section */}
      <div style={{ padding: '6px 20px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 18, letterSpacing: -0.4 }}>From your feeds</div>
        <div style={{ fontSize: 12, color: GLASS.primary, fontWeight: 600 }}>See all</div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', gap: 12, overflow: 'hidden', flex: 1 }}>
        {r.slice(0, 3).map(x => {
          const src = window.SOURCE_META[x.src];
          return (
            <div key={x.id} style={{
              width: 152, borderRadius: 18, overflow: 'hidden',
              background: GLASS.card, boxShadow: GLASS.shadow, flexShrink: 0,
            }}>
              <div style={{ height: 130, background: `url(${x.img}) center/cover`, position: 'relative' }}>
                <div style={{
                  position: 'absolute', bottom: 8, left: 8,
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
                  borderRadius: 999, padding: '3px 8px', fontSize: 9.5, fontWeight: 600,
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>{src.emoji} {src.label}</div>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 14, letterSpacing: -0.2, lineHeight: 1.2 }}>{x.title}</div>
                <div style={{ fontSize: 10.5, color: GLASS.text2, marginTop: 3 }}>⏱ {x.time}m · {x.cuisine}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* tab bar — liquid glass */}
      <div style={{
        margin: '14px 20px 18px', borderRadius: 999,
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
        padding: '8px 12px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        {['🏠','🔍','🎰','👥','👤'].map((e, i) => (
          <div key={i} style={{
            width: i === 2 ? 44 : 36, height: i === 2 ? 44 : 36, borderRadius: i === 2 ? '50%' : 12,
            background: i === 0 ? GLASS.primary : i === 2 ? GLASS.accent : 'transparent',
            color: i === 0 || i === 2 ? '#fff' : GLASS.text2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 2 ? 22 : 19,
            boxShadow: i === 2 ? '0 6px 16px rgba(46,125,107,0.4)' : 'none',
          }}>{e}</div>
        ))}
      </div>
    </div>
  );
}
window.GlassHome = GlassHome;

// ─── Screen 2 · ROULETTE (slot-machine reels — more playful, less gambling-y)
function GlassRoulette() {
  return (
    <div style={{ background: GLASS.bg, height: '100%', color: GLASS.text,
        fontFamily: GLASS.font, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 20, color: GLASS.text2 }}>‹</div>
        <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 17, letterSpacing: -0.3 }}>Tonight's pick</div>
        <div style={{ fontSize: 18 }}>⚙️</div>
      </div>

      <div style={{ padding: '0 24px 4px' }}>
        <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 400, fontSize: 32, letterSpacing: -1, lineHeight: 1.05, textAlign: 'center' }}>
          A little <em style={{ fontStyle: 'italic', color: GLASS.primary }}>happy</em> chaos<br/>for dinner?
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: GLASS.text2, marginTop: 10 }}>
          Pull the handle or let us shuffle.
        </div>
      </div>

      {/* slot reels */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 22px' }}>
        <div style={{
          background: GLASS.bg2, borderRadius: 28, padding: 14,
          boxShadow: GLASS.shadowLg, border: `1px solid ${GLASS.border}`,
          display: 'flex', gap: 10, position: 'relative',
        }}>
          {[
            [['🌮','🍕','🥘'], '#FFE4C2'],
            [['🌶️','🧄','🍋'], '#E8F5EE'],
            [['🍳','⏱️','🔥'], '#FFF1D6'],
          ].map(([items, bg], i) => (
            <div key={i} style={{
              width: 66, height: 170, borderRadius: 18, background: bg,
              overflow: 'hidden', position: 'relative',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.08)',
            }}>
              <div style={{
                display: 'flex', flexDirection: 'column',
                transform: `translateY(-${i*28}px)`, transition: 'transform 300ms',
              }}>
                {[...items, ...items].map((it, j) => (
                  <div key={j} style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
                    {it}
                  </div>
                ))}
              </div>
              {/* shine */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 100%)' }}/>
            </div>
          ))}
          {/* center glow band */}
          <div style={{ position: 'absolute', left: 10, right: 10, top: '50%', height: 56, marginTop: -28,
            border: `2px solid ${GLASS.primary}`, borderRadius: 12, pointerEvents: 'none',
            boxShadow: `0 0 0 4px rgba(255,107,53,0.12)` }} />
        </div>
      </div>

      {/* result */}
      <div style={{ padding: '0 24px 10px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: GLASS.text2, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>
          Matches so far
        </div>
        <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 22, letterSpacing: -0.4, marginTop: 4 }}>
          Spicy · Quick · Mexican
        </div>
      </div>

      <div style={{ padding: '0 20px 22px' }}>
        <div style={{
          background: GLASS.text, color: GLASS.bg, borderRadius: 999,
          padding: '15px 0', textAlign: 'center', fontWeight: 600, fontSize: 15,
          fontFamily: GLASS.fontDisp, letterSpacing: -0.2,
        }}>Pull the handle</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1, background: GLASS.bg2, border: `1px solid ${GLASS.border}`,
            borderRadius: 999, padding: '11px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: GLASS.text2 }}>
            Lock a reel
          </div>
          <div style={{ flex: 1, background: GLASS.bg2, border: `1px solid ${GLASS.border}`,
            borderRadius: 999, padding: '11px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: GLASS.text2 }}>
            Invite friends
          </div>
        </div>
      </div>
    </div>
  );
}
window.GlassRoulette = GlassRoulette;

// ─── Screen 3 · SWIPE VOTE
function GlassVote() {
  const r = window.MOCK_RECIPES;
  return (
    <div style={{ background: GLASS.bg, height: '100%', color: GLASS.text,
        fontFamily: GLASS.font, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 20, color: GLASS.text2 }}>‹</div>
        <div>
          <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 15, letterSpacing: -0.2, textAlign: 'center' }}>Friday Dinner Club</div>
          <div style={{ fontSize: 10.5, color: GLASS.text2, textAlign: 'center', marginTop: 1 }}>5 friends · ends in 2h</div>
        </div>
        <div style={{ fontSize: 18 }}>⋯</div>
      </div>

      {/* progress */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: '62%', height: '100%', background: GLASS.primary, borderRadius: 999 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: GLASS.text2, marginTop: 5 }}>
          <span>Card 5 of 8</span>
          <span>3 mutual likes ♥</span>
        </div>
      </div>

      {/* card stack */}
      <div style={{ flex: 1, position: 'relative', padding: '8px 24px' }}>
        <div style={{ position: 'absolute', top: 18, left: 36, right: 36, bottom: 44,
          background: GLASS.card, borderRadius: 24, transform: 'scale(0.93) translateY(10px)',
          boxShadow: GLASS.shadow, opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: 12, left: 30, right: 30, bottom: 38,
          background: GLASS.card, borderRadius: 26, transform: 'scale(0.97) translateY(4px)',
          boxShadow: GLASS.shadow, opacity: 0.9 }} />
        <div style={{
          position: 'absolute', top: 8, left: 24, right: 24, bottom: 32,
          borderRadius: 28, overflow: 'hidden', background: GLASS.card,
          boxShadow: GLASS.shadowLg, transform: 'rotate(-1.5deg)',
        }}>
          <div style={{ height: '62%', background: `url(${r[0].img}) center/cover`, position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)',
              borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 600,
              display: 'flex', gap: 4, alignItems: 'center',
            }}>🎵 From Maya's TikTok</div>
          </div>
          <div style={{ padding: '14px 18px' }}>
            <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 22, letterSpacing: -0.4, lineHeight: 1.1 }}>Birria Tacos</div>
            <div style={{ fontSize: 11, color: GLASS.text2, marginTop: 4 }}>
              Slow-braised · 45 min · Medium · 12 ingredients
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <span style={{ background: GLASS.tintWarm, color: '#9a4318', borderRadius: 999, padding: '3px 9px', fontSize: 10, fontWeight: 600 }}>Mexican</span>
              <span style={{ background: GLASS.tintMint, color: GLASS.accent, borderRadius: 999, padding: '3px 9px', fontSize: 10, fontWeight: 600 }}>Comfort</span>
              <span style={{ background: 'rgba(0,0,0,0.06)', color: GLASS.text2, borderRadius: 999, padding: '3px 9px', fontSize: 10, fontWeight: 600 }}>🌶️ Spicy</span>
            </div>
          </div>
        </div>
      </div>

      {/* action bar */}
      <div style={{ padding: '0 24px 22px', display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: 54, height: 54, borderRadius: '50%', background: GLASS.bg2,
          boxShadow: GLASS.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>✕</div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: GLASS.bg2,
          boxShadow: GLASS.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>⭐</div>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `linear-gradient(135deg, ${GLASS.primary2}, ${GLASS.primary})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          fontSize: 26, boxShadow: '0 10px 24px rgba(255,107,53,0.45)',
        }}>♥</div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: GLASS.bg2,
          boxShadow: GLASS.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>↶</div>
        <div style={{
          width: 54, height: 54, borderRadius: '50%', background: GLASS.bg2,
          boxShadow: GLASS.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>💬</div>
      </div>
    </div>
  );
}
window.GlassVote = GlassVote;

// ─── Screen 4 · RESULT / COOK MODE
function GlassResult() {
  const r = window.MOCK_RECIPES[1];
  return (
    <div style={{ background: GLASS.bg, height: '100%', color: GLASS.text,
        fontFamily: GLASS.font, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* hero image */}
      <div style={{ height: 200, background: `url(${r.img}) center/cover`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 16, left: 16, width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</div>
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>♥</div>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>↗</div>
        </div>
        {/* source badge */}
        <div style={{ position: 'absolute', bottom: 12, left: 16,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(14px)',
          borderRadius: 999, padding: '5px 11px', fontSize: 11, fontWeight: 600,
          display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>📸</span>@seoulfoodies · Instagram
        </div>
      </div>

      {/* winner celebration strip */}
      <div style={{ margin: '-14px 16px 0', position: 'relative', zIndex: 2,
        background: `linear-gradient(135deg, ${GLASS.yellow}, ${GLASS.primary})`,
        borderRadius: 14, padding: '9px 12px', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 8, boxShadow: GLASS.shadow }}>
        <span style={{ fontSize: 18 }}>🏆</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 12.5 }}>Winner of Friday Dinner Club</div>
          <div style={{ fontSize: 10.5, opacity: 0.9 }}>4 of 5 friends loved it</div>
        </div>
        <div style={{ display: 'flex' }}>
          {['👩','👨‍🍳','🧑','👱‍♀️'].map((e, i) => (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: '50%',
              background: '#fff', border: '1.5px solid #fff',
              marginLeft: i === 0 ? 0 : -6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
            }}>{e}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px 0', flex: 1, overflow: 'hidden' }}>
        <div style={{ fontFamily: GLASS.fontDisp, fontWeight: 600, fontSize: 26, letterSpacing: -0.7, lineHeight: 1.05 }}>
          Gochujang Pasta
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: GLASS.text2 }}>
          <div><span style={{ fontSize: 14 }}>⏱</span> 20 min</div>
          <div><span style={{ fontSize: 14 }}>🍽</span> Serves 4</div>
          <div><span style={{ fontSize: 14 }}>🌶️</span> Medium heat</div>
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', gap: 4, marginTop: 16,
          background: 'rgba(0,0,0,0.05)', padding: 4, borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
          <div style={{ flex: 1, textAlign: 'center', background: '#fff', padding: '7px 0', borderRadius: 999, boxShadow: GLASS.shadow }}>Ingredients</div>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 0', color: GLASS.text2 }}>Steps</div>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 0', color: GLASS.text2 }}>Video</div>
        </div>

        <div style={{ marginTop: 14, fontSize: 13 }}>
          {[
            ['200g', 'spaghetti'],
            ['2 tbsp', 'gochujang paste'],
            ['3 cloves', 'garlic, minced'],
            ['1 tbsp', 'soy sauce'],
            ['2 tbsp', 'butter'],
            ['¼ cup', 'pasta water'],
          ].map(([qty, ing], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                borderBottom: i < 5 ? `1px solid ${GLASS.border}` : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: 6, border: `1.5px solid ${GLASS.text3}` }} />
              <div style={{ width: 68, fontSize: 12, color: GLASS.text2, fontWeight: 600 }}>{qty}</div>
              <div style={{ flex: 1 }}>{ing}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 20px 22px' }}>
        <div style={{
          background: GLASS.primary, color: '#fff', borderRadius: 999,
          padding: '15px 0', textAlign: 'center', fontWeight: 700, fontSize: 15,
          fontFamily: GLASS.fontDisp, letterSpacing: -0.2,
          boxShadow: '0 10px 24px rgba(255,107,53,0.4)',
        }}>Start cooking →</div>
      </div>
    </div>
  );
}
window.GlassResult = GlassResult;

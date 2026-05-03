// clay.jsx — Direction C · "CLAY"
// Soft 3D claymorphism. Pastel gradients, chunky shadows, playful + joyful.
// Targets first-time / family users; feels like a kids' app grew up.
const CLAY = {
  bg: '#FFF0E5',
  bg2: '#FFE0CC',
  card: '#FFFFFF',
  border: 'rgba(120, 60, 30, 0.12)',
  text: '#3A2218',
  text2: 'rgba(58,34,24,0.58)',
  primary: '#FF7B54',   // coral
  primary2: '#FFB26B',
  mint: '#B1E0C6',
  sky: '#B8DEFF',
  lemon: '#FFE66A',
  lilac: '#D8C0FF',
  shadow: '0 4px 0 rgba(120,60,30,0.12), 0 8px 24px rgba(120,60,30,0.1)',
  shadowPress: 'inset 0 2px 6px rgba(120,60,30,0.18)',
  font: '"Nunito", "Fredoka", system-ui, sans-serif',
  fontDisp: '"Fredoka", "Nunito", system-ui, sans-serif',
};
window.CLAY = CLAY;

// ─── Screen 1 · ONBOARDING / CONNECT SOCIAL
function ClayOnboarding() {
  return (
    <div style={{ background: CLAY.bg, height: '100%', color: CLAY.text,
        fontFamily: CLAY.font, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* bg blobs */}
      <div style={{ position: 'absolute', top: -50, left: -30, width: 200, height: 200, borderRadius: '50%', background: CLAY.mint, opacity: 0.5, filter: 'blur(30px)' }} />
      <div style={{ position: 'absolute', top: 100, right: -60, width: 180, height: 180, borderRadius: '50%', background: CLAY.lemon, opacity: 0.5, filter: 'blur(30px)' }} />

      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ fontSize: 12, color: CLAY.text2, fontWeight: 700 }}>Step 2 of 4</div>
        <div style={{ fontSize: 12, color: CLAY.text2, fontWeight: 700 }}>Skip</div>
      </div>

      <div style={{ padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.6)', borderRadius: 999, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ width: '50%', height: '100%', background: CLAY.primary, borderRadius: 999 }} />
        </div>
        <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 28, letterSpacing: -0.7, lineHeight: 1.05 }}>
          Bring your favorite<br/>recipes with you 🫶
        </div>
        <div style={{ fontSize: 13, color: CLAY.text2, marginTop: 8, fontWeight: 500 }}>
          Connect the apps where you save cooking videos. We'll turn them into real recipes.
        </div>
      </div>

      {/* big chunky platform buttons */}
      <div style={{ padding: '22px 20px 0', flex: 1, position: 'relative', zIndex: 1 }}>
        {[
          ['tiktok', 143, true],
          ['instagram', null, false],
          ['youtube', null, false],
          ['pinterest', null, false],
        ].map(([k, count, connected]) => {
          const m = window.SOURCE_META[k];
          return (
            <div key={k} style={{
              background: CLAY.card, borderRadius: 22, padding: '14px',
              boxShadow: CLAY.shadow, marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 14,
              border: connected ? `2.5px solid ${CLAY.primary}` : 'none',
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: 16,
                background: `linear-gradient(135deg, ${m.hex}, ${m.hex2})`,
                boxShadow: `0 4px 0 rgba(0,0,0,0.08), 0 6px 14px ${m.hex}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}>{m.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 16 }}>{m.label}</div>
                <div style={{ fontSize: 11.5, color: CLAY.text2, fontWeight: 600 }}>
                  {connected ? `${count} saved videos found ✨` : 'Not connected'}
                </div>
              </div>
              <div style={{
                background: connected ? CLAY.mint : CLAY.primary, color: connected ? '#1a5a3a' : '#fff',
                borderRadius: 14, padding: '9px 14px', fontSize: 12, fontWeight: 800,
                boxShadow: connected ? 'inset 0 2px 4px rgba(0,0,0,0.08)' : `0 3px 0 #c9522a`,
              }}>{connected ? '✓ Connected' : 'Connect'}</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '10px 20px 26px', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: CLAY.primary, color: '#fff', borderRadius: 20,
          padding: '16px 0', textAlign: 'center',
          fontFamily: CLAY.fontDisp, fontWeight: 800, fontSize: 16,
          boxShadow: `0 5px 0 #c9522a, 0 10px 22px rgba(255,123,84,0.4)`,
        }}>Continue →</div>
      </div>
    </div>
  );
}
window.ClayOnboarding = ClayOnboarding;

// ─── Screen 2 · HOME (playful)
function ClayHome() {
  const r = window.MOCK_RECIPES;
  return (
    <div style={{ background: CLAY.bg, height: '100%', color: CLAY.text,
        fontFamily: CLAY.font, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: CLAY.lemon, opacity: 0.45, filter: 'blur(24px)' }} />

      <div style={{ padding: '16px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 22, letterSpacing: -0.3, lineHeight: 1.05 }}>
            Hola, Juan! 👋
          </div>
          <div style={{ fontSize: 12, color: CLAY.text2, fontWeight: 600, marginTop: 2 }}>
            Cooking streak: 🔥 7 days
          </div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 16,
          background: `linear-gradient(135deg, ${CLAY.sky}, ${CLAY.lilac})`,
          boxShadow: CLAY.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>🌮</div>
      </div>

      {/* GIANT roulette CTA */}
      <div style={{ padding: '10px 20px 0', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: CLAY.card, borderRadius: 28, padding: '18px 18px 14px',
          boxShadow: CLAY.shadow, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -10, fontSize: 120, opacity: 0.13 }}>🎰</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: CLAY.primary, letterSpacing: 1, textTransform: 'uppercase' }}>
            Can't decide?
          </div>
          <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 22, letterSpacing: -0.4, lineHeight: 1.08, marginTop: 4 }}>
            Spin the Dinner Wheel
          </div>
          <div style={{ fontSize: 12, color: CLAY.text2, marginTop: 4, marginBottom: 14, maxWidth: 200 }}>
            We'll pick something from your saved recipes.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              background: CLAY.primary, color: '#fff', borderRadius: 14,
              padding: '10px 16px', fontFamily: CLAY.fontDisp, fontWeight: 800, fontSize: 13,
              boxShadow: `0 3px 0 #c9522a`,
            }}>🎰 Spin solo</div>
            <div style={{
              background: CLAY.mint, color: '#1a5a3a', borderRadius: 14,
              padding: '10px 16px', fontFamily: CLAY.fontDisp, fontWeight: 800, fontSize: 13,
              boxShadow: `0 3px 0 #7fb093`,
            }}>👥 With friends</div>
          </div>
        </div>
      </div>

      {/* grid of categories */}
      <div style={{ padding: '14px 20px 10px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Your sources</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {['tiktok','instagram','youtube','pinterest'].map(k => {
            const m = window.SOURCE_META[k];
            return (
              <div key={k} style={{
                background: CLAY.card, borderRadius: 18, padding: '10px 6px',
                boxShadow: CLAY.shadow, textAlign: 'center',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, margin: '0 auto 4px',
                  background: `linear-gradient(135deg, ${m.hex}, ${m.hex2})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  boxShadow: `0 2px 0 rgba(0,0,0,0.08)`,
                }}>{m.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: CLAY.text }}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* recents */}
      <div style={{ padding: '4px 20px 0', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 15 }}>Saved this week</div>
          <div style={{ fontSize: 11, color: CLAY.primary, fontWeight: 700 }}>See all</div>
        </div>
        <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
          {r.slice(0, 3).map(x => (
            <div key={x.id} style={{
              width: 138, borderRadius: 20, overflow: 'hidden',
              background: CLAY.card, boxShadow: CLAY.shadow, flexShrink: 0,
            }}>
              <div style={{ height: 110, background: `url(${x.img}) center/cover` }} />
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 13, lineHeight: 1.15 }}>{x.title}</div>
                <div style={{ fontSize: 10, color: CLAY.text2, marginTop: 3, fontWeight: 600 }}>⏱ {x.time}m</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tab bar */}
      <div style={{
        margin: '12px 20px 18px', background: CLAY.card, borderRadius: 22,
        padding: '10px', boxShadow: CLAY.shadow,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        {[
          ['🏠', true], ['🔍', false], ['🎰', false, true], ['👥', false], ['👤', false],
        ].map(([e, active, big], i) => big ? (
          <div key={i} style={{
            width: 48, height: 48, borderRadius: 16, marginTop: -20,
            background: `linear-gradient(135deg, ${CLAY.primary2}, ${CLAY.primary})`,
            boxShadow: `0 4px 0 #c9522a, 0 6px 16px rgba(255,123,84,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>{e}</div>
        ) : (
          <div key={i} style={{
            width: 40, height: 40, borderRadius: 12,
            background: active ? CLAY.bg2 : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, filter: active ? 'none' : 'grayscale(0.4)',
          }}>{e}</div>
        ))}
      </div>
    </div>
  );
}
window.ClayHome = ClayHome;

// ─── Screen 3 · GROUP VOTE RESULT / CELEBRATION
function ClayResult() {
  const r = window.MOCK_RECIPES[0];
  return (
    <div style={{ background: CLAY.bg, height: '100%', color: CLAY.text,
        fontFamily: CLAY.font, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* confetti bits */}
      {['🎉','✨','🌟','🎊','💫','⭐'].map((e, i) => (
        <div key={i} style={{
          position: 'absolute', fontSize: 18,
          left: `${(i * 17 + 8) % 90}%`, top: `${(i * 23 + 12) % 60}%`,
          opacity: 0.7, transform: `rotate(${i * 30}deg)`,
        }}>{e}</div>
      ))}

      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: CLAY.card,
          boxShadow: CLAY.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>‹</div>
        <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 14 }}>Friday Dinner Club</div>
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: CLAY.card,
          boxShadow: CLAY.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>↗</div>
      </div>

      <div style={{ padding: '10px 20px 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 800, fontSize: 32, letterSpacing: -0.8, lineHeight: 1.02 }}>
          It's a match!
        </div>
        <div style={{ fontSize: 13, color: CLAY.text2, marginTop: 4, fontWeight: 600 }}>
          Everyone agreed on dinner 🎉
        </div>
      </div>

      {/* big winner card */}
      <div style={{ padding: '16px 20px', position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: '100%', background: CLAY.card, borderRadius: 28,
          boxShadow: `0 8px 0 rgba(120,60,30,0.12), 0 20px 40px rgba(120,60,30,0.15)`,
          overflow: 'hidden', transform: 'rotate(-1deg)',
        }}>
          <div style={{ height: 170, background: `url(${r.img}) center/cover`, position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: CLAY.lemon, color: '#3A2218',
              borderRadius: 12, padding: '5px 10px',
              fontFamily: CLAY.fontDisp, fontWeight: 800, fontSize: 11,
              boxShadow: `0 3px 0 #e0b84a`,
            }}>🏆 Winner</div>
          </div>
          <div style={{ padding: '14px 16px 16px' }}>
            <div style={{ fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 24, letterSpacing: -0.4, lineHeight: 1.1 }}>
              Birria Tacos
            </div>
            <div style={{ fontSize: 12, color: CLAY.text2, marginTop: 4, fontWeight: 600 }}>
              🎵 from @chefmaya · 45 min · Medium
            </div>
            {/* votes row */}
            <div style={{
              marginTop: 12, background: CLAY.bg, borderRadius: 14,
              padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex' }}>
                {['👩','👨‍🍳','🧑','👱‍♀️','👨'].map((e, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: [CLAY.primary, CLAY.mint, CLAY.sky, CLAY.lemon, CLAY.lilac][i],
                    border: `2.5px solid ${CLAY.card}`, marginLeft: i === 0 ? 0 : -8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                  }}>{e}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 14, fontFamily: CLAY.fontDisp, fontWeight: 800 }}>5/5 ♥</div>
                <div style={{ fontSize: 10, color: CLAY.text2, fontWeight: 600 }}>unanimous</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 22px', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: CLAY.primary, color: '#fff', borderRadius: 20,
          padding: '16px 0', textAlign: 'center',
          fontFamily: CLAY.fontDisp, fontWeight: 800, fontSize: 16,
          boxShadow: `0 5px 0 #c9522a, 0 10px 22px rgba(255,123,84,0.4)`,
        }}>Start cooking together 🍳</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1, background: CLAY.card, color: CLAY.text, borderRadius: 16, padding: '11px 0',
            textAlign: 'center', fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 12, boxShadow: CLAY.shadow }}>
            🛒 Shopping list
          </div>
          <div style={{ flex: 1, background: CLAY.card, color: CLAY.text, borderRadius: 16, padding: '11px 0',
            textAlign: 'center', fontFamily: CLAY.fontDisp, fontWeight: 700, fontSize: 12, boxShadow: CLAY.shadow }}>
            📅 Schedule
          </div>
        </div>
      </div>
    </div>
  );
}
window.ClayResult = ClayResult;

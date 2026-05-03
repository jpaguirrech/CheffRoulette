// screens-social.jsx — Lobby, Swipe voting, Match
const { useTheme, useRoute, RECIPES, FRIENDS, FONT, FONT_DISP, Press, TopBar, AvatarStack } = window;

// ─── LOBBY ─────────────────────────────────────────────────────────
function LobbyScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [invited, setInvited] = React.useState(['f1', 'f2']);
  const toggle = (id) => setInvited(inv => inv.includes(id) ? inv.filter(x => x !== id) : [...inv, id]);
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="New vote session" />
      <div style={{ padding: '8px 24px 16px' }}>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 26, letterSpacing: -0.8, lineHeight: 1.15 }}>
          Friday dinner<br/>with the crew
        </div>
        <div style={{ fontSize: 13, color: t.text2, marginTop: 6 }}>
          Everyone swipes on 20 recipes. Mutual likes become matches.
        </div>
      </div>
      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
        {/* QR card */}
        <div style={{ background: `linear-gradient(135deg, ${t.primary2}, ${t.primary})`,
            borderRadius: 22, padding: 16, color: '#fff', boxShadow: t.shadowLg, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 68, height: 68, background: '#fff', borderRadius: 12, padding: 6 }}>
              <svg viewBox="0 0 50 50" width="100%" height="100%" style={{ imageRendering: 'pixelated' }}>
                {Array.from({length:100}).map((_,i) => {
                  const x=(i%10)*5, y=Math.floor(i/10)*5;
                  const on=(x+y+((x*y)%7))%3===0 || (i<15 && i>3) || (i>85 && i<97);
                  return on ? <rect key={i} x={x} y={y} width="5" height="5" fill="#1A1A1A"/> : null;
                })}
                <rect x="3" y="3" width="12" height="12" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/>
                <rect x="35" y="3" width="12" height="12" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/>
                <rect x="3" y="35" width="12" height="12" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Session code</div>
              <div style={{ fontFamily: FONT_DISP, fontWeight: 700, fontSize: 28, letterSpacing: 2, marginTop: 2 }}>PIZZA</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Share code or scan QR</div>
            </div>
          </div>
        </div>

        {/* invited */}
        <div style={{ fontSize: 11, color: t.text2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Invited · {invited.length + 1}
        </div>
        <div style={{ background: t.card, borderRadius: 20, padding: 4, boxShadow: t.shadow, marginBottom: 14 }}>
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${t.divider}` }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #FFD6B8, #FF6B35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>J</div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>You <span style={{ color: t.text2, fontWeight: 400, fontSize: 11 }}>· host</span></div>
            <div style={{ fontSize: 11, color: t.accent, fontWeight: 700 }}>READY</div>
          </div>
          {FRIENDS.filter(f => invited.includes(f.id)).map(f => (
            <div key={f.id} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${t.divider}` }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{f.emoji}</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{f.name}</div>
              <div style={{ fontSize: 11, color: t.text2, fontWeight: 600 }}>invited</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: t.text2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Suggested
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {FRIENDS.filter(f => !invited.includes(f.id)).map(f => (
            <Press key={f.id} onClick={() => toggle(f.id)} style={{
              background: t.card, borderRadius: 999, padding: '6px 12px 6px 6px',
              display: 'flex', alignItems: 'center', gap: 8, boxShadow: t.shadow, fontSize: 13, fontWeight: 600,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: f.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{f.emoji}</div>
              {f.name} <span style={{ color: t.primary, fontSize: 16 }}>+</span>
            </Press>
          ))}
        </div>
      </div>
      <div style={{ padding: '14px 20px 26px' }}>
        <Press onClick={() => r.go('swipe')} style={{
          background: t.primary, color: '#fff', borderRadius: 999, padding: '15px 0',
          textAlign: 'center', fontFamily: FONT_DISP, fontWeight: 700, fontSize: 15,
          boxShadow: `0 10px 24px ${t.primary}60`,
        }}>Start swiping →</Press>
      </div>
    </div>
  );
}
window.LobbyScreen = LobbyScreen;

// ─── SWIPE VOTE ────────────────────────────────────────────────────
function SwipeScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [idx, setIdx] = React.useState(0);
  const [drag, setDrag] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const [exitDir, setExitDir] = React.useState(null);
  const [liked, setLiked] = React.useState([]);
  const stack = RECIPES.slice(idx, idx + 3);
  const start = React.useRef({ x: 0, y: 0 });

  const onDown = (e) => {
    if (exitDir) return;
    setDragging(true);
    const p = e.touches ? e.touches[0] : e;
    start.current = { x: p.clientX, y: p.clientY };
  };
  const onMove = (e) => {
    if (!dragging || exitDir) return;
    const p = e.touches ? e.touches[0] : e;
    setDrag({ x: p.clientX - start.current.x, y: p.clientY - start.current.y });
  };
  const decide = (dir) => {
    setExitDir(dir);
    if (dir === 'right') setLiked(l => [...l, RECIPES[idx].id]);
    setTimeout(() => {
      if (idx + 1 >= RECIPES.length) {
        r.replace('match', { liked: [...liked, ...(dir === 'right' ? [RECIPES[idx].id] : [])] });
      } else {
        setIdx(i => i + 1);
        setDrag({ x: 0, y: 0 }); setExitDir(null);
      }
    }, 360);
  };
  const onUp = () => {
    setDragging(false);
    if (Math.abs(drag.x) > 100) decide(drag.x > 0 ? 'right' : 'left');
    else if (drag.y < -120) decide('up');
    else setDrag({ x: 0, y: 0 });
  };

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title={`Swiping · ${idx+1}/${RECIPES.length}`} trailing={
        <AvatarStack users={FRIENDS.slice(0,3)} size={22} border={t.bg}/>
      } />

      {/* progress */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ height: 4, background: t.divider, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${((idx+1)/RECIPES.length)*100}%`, height: '100%', background: t.primary, transition: 'width 300ms' }}/>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', padding: '10px 24px', touchAction: 'none' }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}>
        {stack.slice().reverse().map((rec, iRev) => {
          const i = stack.length - 1 - iRev;
          const isTop = i === 0;
          const dragX = isTop ? drag.x : 0;
          const dragY = isTop ? drag.y : 0;
          const rot = isTop ? dragX * 0.06 : 0;
          const exitX = exitDir === 'right' ? 500 : exitDir === 'left' ? -500 : 0;
          const exitY = exitDir === 'up' ? -600 : 0;
          return (
            <div key={rec.id} style={{
              position: 'absolute', inset: '10px 24px',
              transform: isTop && exitDir
                ? `translate(${exitX}px, ${exitY}px) rotate(${exitDir === 'right' ? 30 : exitDir === 'left' ? -30 : 0}deg)`
                : `translate(${dragX}px, ${dragY}px) rotate(${rot}deg) scale(${1 - i*0.04}) translateY(${i*8}px)`,
              transition: dragging ? 'none' : 'transform 360ms cubic-bezier(.2,.8,.2,1)',
              zIndex: 10 - i,
              borderRadius: 28, overflow: 'hidden', background: t.card,
              boxShadow: t.shadowXL,
              cursor: isTop ? 'grab' : 'default',
            }}>
              <div style={{ height: '60%', background: `url(${rec.img}) center/cover`, position: 'relative' }}>
                {/* like/nope stamps */}
                {isTop && (
                  <>
                    <div style={{ position: 'absolute', top: 20, left: 20, padding: '6px 14px',
                      border: '3px solid #2ECC71', color: '#2ECC71', borderRadius: 10,
                      transform: 'rotate(-15deg)', fontWeight: 900, fontSize: 22, letterSpacing: 2,
                      opacity: Math.min(1, Math.max(0, drag.x/100)) }}>LIKE</div>
                    <div style={{ position: 'absolute', top: 20, right: 20, padding: '6px 14px',
                      border: '3px solid #E74C3C', color: '#E74C3C', borderRadius: 10,
                      transform: 'rotate(15deg)', fontWeight: 900, fontSize: 22, letterSpacing: 2,
                      opacity: Math.min(1, Math.max(0, -drag.x/100)) }}>NOPE</div>
                    <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%) rotate(-6deg)',
                      padding: '6px 14px', border: '3px solid #4A90E2', color: '#4A90E2', borderRadius: 10,
                      fontWeight: 900, fontSize: 18, letterSpacing: 2,
                      opacity: Math.min(1, Math.max(0, -drag.y/120)) }}>SUPER</div>
                  </>
                )}
                <div style={{ position: 'absolute', top: 14, right: 14,
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(14px)',
                  borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: '#1A1A1A' }}>
                  ⏱ {rec.time}m
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)' }}/>
                <div style={{ position: 'absolute', bottom: 14, left: 18, right: 18, color: '#fff' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 }}>{rec.cuisine} · {rec.user}</div>
                  <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 24, letterSpacing: -0.4, lineHeight: 1.1, marginTop: 4 }}>
                    {rec.title}
                  </div>
                </div>
              </div>
              <div style={{ padding: '14px 18px' }}>
                <div style={{ fontSize: 12.5, color: t.text2, lineHeight: 1.45 }}>{rec.blurb}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {rec.tags.map(tag => (
                    <span key={tag} style={{ background: t.tintWarm, color: t.primary,
                        borderRadius: 999, padding: '3px 10px', fontSize: 10.5, fontWeight: 700 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* action buttons */}
      <div style={{ padding: '8px 24px 24px', display: 'flex', justifyContent: 'center', gap: 14 }}>
        <Press onClick={() => decide('left')} style={{
          width: 58, height: 58, borderRadius: '50%', background: t.card, boxShadow: t.shadowLg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: '#E74C3C',
        }}>✕</Press>
        <Press onClick={() => decide('up')} style={{
          width: 48, height: 48, borderRadius: '50%', background: t.card, boxShadow: t.shadow,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#4A90E2',
          alignSelf: 'center',
        }}>⭐</Press>
        <Press onClick={() => decide('right')} style={{
          width: 58, height: 58, borderRadius: '50%',
          background: `linear-gradient(135deg, ${t.primary2}, ${t.primary})`,
          boxShadow: `0 10px 24px ${t.primary}60`, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
        }}>♥</Press>
      </div>
    </div>
  );
}
window.SwipeScreen = SwipeScreen;

// ─── MATCH ─────────────────────────────────────────────────────────
function MatchScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [burst, setBurst] = React.useState(false);
  React.useEffect(() => { setTimeout(() => setBurst(true), 100); }, []);
  const match = RECIPES[5]; // thai green curry
  return (
    <div style={{ width: '100%', height: '100%',
        background: `linear-gradient(160deg, ${t.primary2}, ${t.primary})`,
        color: '#fff', fontFamily: FONT, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'relative' }}>
      {/* confetti */}
      {Array.from({length: 20}).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', width: 8, height: 12,
          background: ['#FFC83D','#B1E0C6','#fff','#FFAA7A'][i%4],
          top: -20, left: `${(i*53)%100}%`,
          animation: `fall-${i} ${2+Math.random()*2}s linear infinite`,
          transform: burst ? `translateY(800px) rotate(${i*120}deg)` : 'translateY(0)',
          transition: `transform ${3+i*0.1}s linear`, opacity: burst ? 1 : 0,
        }}/>
      ))}
      <div style={{ padding: '20px', textAlign: 'right' }}>
        <Press onClick={() => r.reset('home')} style={{ color: '#fff', fontSize: 16, opacity: 0.8 }}>✕</Press>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 48, letterSpacing: -1.5, lineHeight: 1, marginBottom: 4,
            transform: burst ? 'scale(1)' : 'scale(0.5)', transition: 'transform 600ms cubic-bezier(.3,1.6,.5,1)' }}>
          It's a match!
        </div>
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 24 }}>3 of 4 liked this recipe</div>
        <div style={{ width: 220, height: 220, borderRadius: 28, overflow: 'hidden',
            background: `url(${match.img}) center/cover`,
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            transform: burst ? 'rotate(0deg) scale(1)' : 'rotate(-8deg) scale(0.7)',
            transition: 'transform 700ms cubic-bezier(.3,1.6,.5,1)' }}/>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 28, letterSpacing: -0.6, marginTop: 20 }}>{match.title}</div>
        <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 4 }}>⏱ {match.time}m · {match.cuisine}</div>
        <AvatarStack users={FRIENDS.slice(0,3)} size={32} border={t.primary} />
      </div>
      <div style={{ padding: '0 24px 30px' }}>
        <Press onClick={() => r.go('recipe', { id: match.id })} style={{
          background: '#fff', color: t.primary, borderRadius: 999, padding: '15px 0', textAlign: 'center',
          fontFamily: FONT_DISP, fontWeight: 700, fontSize: 15, marginBottom: 10,
        }}>Let's cook it tonight →</Press>
        <Press onClick={() => r.reset('home')} style={{
          background: 'transparent', color: '#fff', borderRadius: 999, padding: '12px 0', textAlign: 'center',
          fontSize: 13, fontWeight: 600, opacity: 0.9,
        }}>See all matches</Press>
      </div>
    </div>
  );
}
window.MatchScreen = MatchScreen;

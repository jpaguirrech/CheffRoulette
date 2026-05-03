// screens-recipe.jsx — Recipe detail, Cook mode, Shopping list, Rating
const { useTheme, useRoute, RECIPES, SOURCES, FONT, FONT_DISP, Press, TopBar, PlatformBadge } = window;

function RecipeScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const rec = RECIPES.find(x => x.id === r.params.id) || RECIPES[0];
  const [tab, setTab] = React.useState('ingredients');
  const src = SOURCES[rec.src];
  const ingredients = [
    '500g chicken thighs', '2 tbsp green curry paste', '400ml coconut milk',
    '1 cup Thai basil', '2 kaffir lime leaves', '1 tbsp fish sauce',
    '1 tsp palm sugar', '1 red chili', 'Jasmine rice for serving',
  ];
  const steps = [
    { time: 3, text: 'Heat 1 tbsp oil in a wok. Fry curry paste until fragrant.' },
    { time: 2, text: 'Add chicken, stir to coat in paste.' },
    { time: 8, text: 'Pour in coconut milk, simmer until chicken is cooked through.' },
    { time: 4, text: 'Add lime leaves, fish sauce, palm sugar. Taste and adjust.' },
    { time: 1, text: 'Stir in Thai basil. Serve over jasmine rice.' },
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 260, background: `url(${rec.img}) center/cover`, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 40%)' }}/>
        <TopBar transparent title="" trailing={
          <Press style={{ width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔖</Press>
        }/>
        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, color: '#fff' }}>
          <PlatformBadge src={rec.src} size="lg" />
          <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 30, letterSpacing: -0.8, lineHeight: 1.05, marginTop: 8 }}>
            {rec.title}
          </div>
          <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>from {rec.user} · {rec.likes.toLocaleString()} ❤</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '16px 20px 10px', display: 'flex', gap: 10 }}>
          {[['⏱', `${rec.time}m`], ['🔥', rec.diff], ['🌶', '·'.repeat(rec.spicy+1)], ['👥', '4']].map(([i, v]) => (
            <div key={i} style={{ flex: 1, background: t.card, borderRadius: 14, padding: '10px 8px',
                textAlign: 'center', boxShadow: t.shadow }}>
              <div style={{ fontSize: 16 }}>{i}</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ margin: '6px 20px 0', background: t.card, borderRadius: 999, padding: 4, display: 'flex', boxShadow: t.shadow }}>
          {['ingredients', 'steps', 'video'].map(x => (
            <Press key={x} onClick={() => setTab(x)} style={{
              flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 999,
              background: tab === x ? t.primary : 'transparent',
              color: tab === x ? '#fff' : t.text2, fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
            }}>{x}</Press>
          ))}
        </div>

        <div style={{ padding: '14px 20px 20px' }}>
          {tab === 'ingredients' && ingredients.map((ing, i) => (
            <div key={i} style={{ padding: '11px 0', borderBottom: `1px solid ${t.divider}`,
                display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${t.text3}` }}/>
              {ing}
            </div>
          ))}
          {tab === 'steps' && steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.primary, color: '#fff',
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT_DISP, fontWeight: 700, fontSize: 14 }}>{i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, color: t.primary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{s.time} min</div>
                <div style={{ fontSize: 14, marginTop: 2, lineHeight: 1.4 }}>{s.text}</div>
              </div>
            </div>
          ))}
          {tab === 'video' && (
            <div style={{ background: '#000', borderRadius: 18, aspectRatio: '9/16', maxHeight: 360,
                position: 'relative', overflow: 'hidden',
                backgroundImage: `url(${rec.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, paddingLeft: 4 }}>▶</div>
              </div>
              <div style={{ position: 'absolute', bottom: 12, left: 12, color: '#fff', fontSize: 11 }}>Original from {rec.user}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '10px 20px 24px', display: 'flex', gap: 8 }}>
        <Press onClick={() => r.go('shopping', { id: rec.id })} style={{
          flex: 1, background: t.card, color: t.text, borderRadius: 999, padding: '14px 0',
          textAlign: 'center', fontWeight: 700, fontSize: 13, boxShadow: t.shadow,
        }}>🛒 Shop list</Press>
        <Press onClick={() => r.go('cook', { id: rec.id })} style={{
          flex: 1.5, background: t.primary, color: '#fff', borderRadius: 999, padding: '14px 0',
          textAlign: 'center', fontFamily: FONT_DISP, fontWeight: 700, fontSize: 14,
          boxShadow: `0 10px 24px ${t.primary}60`,
        }}>👨‍🍳 Start cooking</Press>
      </div>
    </div>
  );
}
window.RecipeScreen = RecipeScreen;

function CookScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const rec = RECIPES.find(x => x.id === r.params.id) || RECIPES[5];
  const steps = [
    { time: 180, text: 'Heat 1 tbsp oil in a wok. Fry curry paste until fragrant.' },
    { time: 120, text: 'Add chicken, stir to coat in paste.' },
    { time: 480, text: 'Pour in coconut milk, simmer until chicken is cooked through.' },
    { time: 240, text: 'Add lime leaves, fish sauce, palm sugar. Taste and adjust.' },
    { time: 60,  text: 'Stir in Thai basil. Serve over jasmine rice.' },
  ];
  const [step, setStep] = React.useState(0);
  const [remaining, setRemaining] = React.useState(steps[0].time);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => { setRemaining(steps[step].time); setRunning(false); }, [step]);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining(x => x > 0 ? x - 1 : 0), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = Math.floor(remaining/60), ss = (remaining%60).toString().padStart(2, '0');
  const pct = 1 - remaining / steps[step].time;

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title={`Step ${step+1} of ${steps.length}`} trailing={
        <Press onClick={() => r.back()} style={{ fontSize: 13, color: t.text2, fontWeight: 600 }}>End</Press>
      }/>
      <div style={{ padding: '0 20px 10px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 999,
              background: i < step ? t.primary : i === step ? t.primary2 : t.divider }}/>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 30 }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }} width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="none" stroke={t.divider} strokeWidth="6"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke={t.primary} strokeWidth="6"
              strokeDasharray={`${2*Math.PI*45}`} strokeDashoffset={`${2*Math.PI*45*(1-pct)}`}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }}/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 48, letterSpacing: -1.5 }}>{mm}:{ss}</div>
            <div style={{ fontSize: 11, color: t.text2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{running ? 'cooking…' : 'paused'}</div>
          </div>
        </div>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 21, letterSpacing: -0.4, lineHeight: 1.25, maxWidth: 320 }}>
          {steps[step].text}
        </div>
      </div>
      <div style={{ padding: '14px 20px 26px', display: 'flex', gap: 10 }}>
        <Press onClick={() => setStep(Math.max(0, step-1))} style={{
          width: 54, height: 54, borderRadius: '50%', background: t.card, boxShadow: t.shadow,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: t.text2,
        }}>‹</Press>
        <Press onClick={() => setRunning(!running)} style={{
          flex: 1, background: t.primary, color: '#fff', borderRadius: 999, padding: '17px 0',
          textAlign: 'center', fontFamily: FONT_DISP, fontWeight: 700, fontSize: 15,
          boxShadow: `0 10px 24px ${t.primary}60`,
        }}>{running ? 'Pause' : remaining > 0 ? 'Start timer' : 'Next step →'}</Press>
        <Press onClick={() => step+1 < steps.length ? setStep(step+1) : r.replace('rating', { id: rec.id })} style={{
          width: 54, height: 54, borderRadius: '50%', background: t.card, boxShadow: t.shadow,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: t.text,
        }}>›</Press>
      </div>
    </div>
  );
}
window.CookScreen = CookScreen;

function ShoppingScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const groups = {
    'Proteins': [{n:'Chicken thighs',q:'500g'}, {n:'Fish sauce',q:'1 tbsp'}],
    'Pantry':   [{n:'Jasmine rice',q:'2 cups'}, {n:'Green curry paste',q:'2 tbsp'}, {n:'Coconut milk',q:'400ml'}, {n:'Palm sugar',q:'1 tsp'}],
    'Produce':  [{n:'Thai basil',q:'1 cup'}, {n:'Kaffir lime leaves',q:'2'}, {n:'Red chili',q:'1'}],
  };
  const [checked, setChecked] = React.useState({});
  const all = Object.values(groups).flat();
  const done = all.filter(x => checked[x.n]).length;
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="Shopping list" trailing={
        <Press style={{ fontSize: 18, width: 36, height: 36, borderRadius: '50%', background: t.card,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text2 }}>↗</Press>
      }/>
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 22, letterSpacing: -0.5 }}>Thai green curry</div>
        <div style={{ fontSize: 12.5, color: t.text2, marginTop: 4 }}>{done} of {all.length} collected</div>
        <div style={{ height: 5, borderRadius: 999, background: t.divider, marginTop: 10, overflow: 'hidden' }}>
          <div style={{ width: `${(done/all.length)*100}%`, height: '100%', background: t.accent, transition: 'width 300ms' }}/>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
        {Object.entries(groups).map(([g, items]) => (
          <div key={g} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: t.text2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{g}</div>
            <div style={{ background: t.card, borderRadius: 18, boxShadow: t.shadow, overflow: 'hidden' }}>
              {items.map((it, i) => {
                const on = !!checked[it.n];
                return (
                  <Press key={it.n} onClick={() => setChecked({...checked, [it.n]: !on})}
                    style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                      borderBottom: i < items.length-1 ? `1px solid ${t.divider}` : 'none',
                      opacity: on ? 0.5 : 1 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7,
                      background: on ? t.accent : 'transparent',
                      border: on ? 'none' : `2px solid ${t.text3}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 12 }}>{on ? '✓' : ''}</div>
                    <div style={{ flex: 1, fontSize: 14, textDecoration: on ? 'line-through' : 'none' }}>{it.n}</div>
                    <div style={{ fontSize: 12, color: t.text2, fontWeight: 600 }}>{it.q}</div>
                  </Press>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 20px 26px' }}>
        <Press onClick={() => r.go('cook', { id: r.params.id })} style={{
          background: t.text, color: t.bg, borderRadius: 999, padding: '15px 0', textAlign: 'center',
          fontFamily: FONT_DISP, fontWeight: 700, fontSize: 15,
        }}>I have everything → Cook</Press>
      </div>
    </div>
  );
}
window.ShoppingScreen = ShoppingScreen;

function RatingScreen() {
  const { t } = useTheme();
  const r = useRoute();
  const [stars, setStars] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, fontFamily: FONT,
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="How was it?" />
      <div style={{ flex: 1, padding: '20px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 58, marginBottom: 10 }}>🎉</div>
        <div style={{ fontFamily: FONT_DISP, fontWeight: 600, fontSize: 28, letterSpacing: -0.6, lineHeight: 1.1 }}>Bon appétit!</div>
        <div style={{ fontSize: 13, color: t.text2, marginTop: 6, marginBottom: 24 }}>You cooked Thai green curry. Rate it so we get your taste right.</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 30 }}>
          {[1,2,3,4,5].map(n => (
            <Press key={n} onClick={() => setStars(n)}
              onPointerEnter={() => setHover(n)} onPointerLeave={() => setHover(0)}
              style={{ fontSize: 44, color: (hover || stars) >= n ? t.yellow : t.text3, padding: 2,
                transform: stars === n ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 200ms' }}>★</Press>
          ))}
        </div>
        <div style={{ width: '100%', background: t.card, borderRadius: 20, padding: 16, boxShadow: t.shadow }}>
          <div style={{ fontSize: 11, color: t.text2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>What worked?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Too spicy 🌶','Perfect 👌','Would cook again','Kids loved it','Needed more time','Too saucy'].map(tag => (
              <Press key={tag} style={{ background: t.tintWarm, color: t.primary,
                borderRadius: 999, padding: '7px 12px', fontSize: 12, fontWeight: 600 }}>{tag}</Press>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 20px 26px' }}>
        <Press onClick={() => r.reset('home')} style={{
          background: t.primary, color: '#fff', borderRadius: 999, padding: '15px 0', textAlign: 'center',
          fontFamily: FONT_DISP, fontWeight: 700, fontSize: 15, boxShadow: `0 10px 24px ${t.primary}60`,
        }}>Save & done</Press>
      </div>
    </div>
  );
}
window.RatingScreen = RatingScreen;

# Chef Roulette Design System

> Turn your social media food discoveries into organized, cookable recipes — with a playful spin.

This is a design system derived from the **Chef Roulette** web app — a recipe discovery and capture platform that extracts recipes from TikTok, Instagram, YouTube, and Pinterest videos using AI, then helps users decide what to cook via a literal in‑app roulette wheel.

---

## Product context

**Chef Roulette** is a single web product (desktop + responsive mobile web) built by **A4 Company S.A.S.** (Bogotá, Colombia), founded by Juan Aguirre. The tagline is "bringing fun back to cooking inspiration." The brand promise: never wonder *"what's for dinner?"* again.

Core surfaces:
- **Landing page** — marketing + pricing (Free / Pro $4.99/mo)
- **Dashboard** — welcome, stats, quick capture, recent recipes, the roulette wheel, filters sidebar
- **My Recipes** — filterable grid of saved recipes
- **Recipe Detail** — full ingredients, steps, source attribution
- **Profile / Settings** — avatar, streaks, subscription
- **Recipe Capture** — paste a social URL → AI extracts structured recipe

### Source of truth
- **Codebase:** https://github.com/jpaguirrech/CheffRoulette (React 18 + TypeScript + Vite, Tailwind + shadcn/ui, wouter routing, lucide-react icons)
- Stack: `shadcn/ui` on top of Radix primitives. Design tokens live in `client/src/index.css`; Tailwind theme in `tailwind.config.ts` wires CSS vars → Tailwind color names. **All tokens below were read directly from the repo.**
- No Figma file provided.

### Products represented
Just the one — Chef Roulette web app. The codebase has both a public (landing) and authenticated (dashboard) experience sharing a single component kit.

---

## Index

- `README.md` — this file
- `colors_and_type.css` — CSS custom properties for colors, type, spacing, radii, shadows + semantic element defaults (h1, h2, p, code)
- `fonts/` — webfont references (loaded from Google Fonts at runtime — see typography section)
- `assets/` — logos, icons, sample recipe imagery, wheel graphics
- `preview/` — Design System tab cards (swatches, type specimens, components)
- `ui_kits/web/` — React recreation of the Chef Roulette web app with interactive click‑through demo
- `SKILL.md` — cross-compatible Agent Skill manifest
- `attached_assets/` — raw source text imported from the repo (for reference only)

---

## Content fundamentals

Chef Roulette's voice is **warm, playful, bilingual, and lightly gamified**. It sounds like a friend inviting you to cook, not a recipe database.

**Tone & vibe**
- Fun > formal. Exclamation points are common; sentences stay short.
- **Bilingual by design.** The UI mixes English and Spanish *in the same view* — primary labels are often English but CTAs, toasts, and emotional moments switch to Spanish. Examples pulled from the repo:
  - Landing hero (EN): *"Never Wonder 'What's for Dinner?' Again"*
  - Landing CTA (ES): *"Comenzar a Capturar Recetas"*, *"Iniciar Sesión con Google"*, *"Crear Cuenta Gratuita"*
  - Roulette title (EN): *"Recipe Roulette"*; subtitle (ES): *"¡Gira la ruleta y descubre tu próxima aventura culinaria!"*
  - Toast on spin (ES): *"¡Receta Seleccionada!"* / *"Has obtenido: {title}"*
  - Button states (ES): *"¡Girar la Ruleta!"* → *"¡Girando la Ruleta...!"*
  - Empty state (EN): *"No recipes yet. Start by capturing your first recipe from social media!"*
- Emoji are **first-class** UI. They appear as platform icons (🎵 TikTok, 📸 Instagram, 🎥 YouTube, 📌 Pinterest), as meal-type icons (🌅 breakfast, ☀️ lunch, 🌙 dinner, 🍰 dessert), as reward flourishes (🎰, 🎉, 🔥), and as decorative accents in card headers. This is deliberate — the brand leans into them.
- Spanish uses inverted punctuation correctly (`¡Gira!`, `¿Qué cocinar?`).
- Address: **you / tú** (implicit via commands like *"Selecciona"*, *"Gira"*). Friendly imperative, not formal *"usted"*.
- Gamification copy celebrates progress: *"day streak 🔥"*, *"Cooking Streak"*, *"Weekly Challenge"*, *"Reward: 100 points"*.
- Casing: **Title Case** on buttons and section headers; **Sentence case** on descriptions and helper text.
- Error/help tone is reassuring, never scary: *"Processing status unclear — video processing may have completed."*

**Good example snippets to emulate**
- Section intro: *"Can't decide? Let us help!"*
- Feature tagline: *"AI-Powered Capture: Extract complete recipes from any social media platform"*
- Pricing row: *"Pantry-aware roulette & 'leftovers mode'"*

**Avoid**
- Corporate/enterprise hedging ("seamless," "leverage," "robust ecosystem").
- Pure-English UIs — the Spanish sprinkle is part of the brand.
- Long paragraphs in-app. Landing page copy is the exception.

---

## Visual foundations

**Primary motif: fresh, green, optimistic.** The app lives in a green-forward palette with warm orange accents on the Pro/premium path. Generous whitespace, rounded cards, soft shadows. The roulette wheel itself is the one place where the design goes loud — vibrant 4‑segment gradients, pulsing glow, animated dots.

### Colors
- **Primary green** `hsl(142, 76%, 36%)` / `#16A34A` — every primary CTA, brand logo tint, active nav state, positive stats. This is *the* brand color.
- **Secondary emerald** `hsl(160, 60%, 45%)` / `#2DBF96` — gradient pair with primary, used for the "chef-gradient" button/header treatment.
- **Accent light-green** `hsl(120, 50%, 70%)` / `#84D184` — soft highlights, backgrounds.
- **Orange** `hsl(14, 100%, 60%)` / `#FF5F33` — appears in `navigation.tsx`, `recipe-card.tsx`, landing pricing as a secondary accent ("Upgrade to Pro" CTA). Used sparingly; green is dominant.
- **Yellow** `hsl(52, 100%, 70%)` / `#FFEC66` — points/streaks pill background, Pro badge.
- **Teal** `hsl(174, 60%, 51%)` / `#34CFCF` — small avatar chip backgrounds, stat accent.
- **Neutrals** — Tailwind `gray-50` through `gray-900`. Text is `gray-900` (near-black, warm `hsl(20, 14.3%, 4.1%)`), secondary text `gray-600`, borders `gray-200`.
- **Semantic:** success = green-600, warning = amber-500, destructive = `hsl(0, 84.2%, 60.2%)`.
- Backgrounds: mostly `bg-white` or `bg-gray-50`; hero/dashboard wrappers use `bg-gradient-to-br from-green-50 to-emerald-50`.

**Note:** the repo README mentions an "orange #FF6B35 primary" — this was aspirational/outdated. The **actual shipping code is green-primary** (verified in `client/src/index.css`). This design system follows the code.

### Typography
- **Display / headings:** `'Playfair Display', serif` — elegant slab serif, used via the `.font-display` utility class on H1–H3 in hero, recipe titles, card titles.
- **Body / UI:** `'Inter', sans-serif` — set on `body` as default.
- Both loaded from **Google Fonts**. No self-hosted TTFs in the repo. We substitute Google Fonts CDN link — no font files needed on disk. **Flagged** — if the brand ever wants self-hosted fonts we'd need TTF uploads.
- Scale follows Tailwind defaults: `text-xs` 12px → `text-6xl` 60px. Typical: h1 = `text-4xl md:text-6xl font-bold`, h2 = `text-3xl font-bold`, card title = `text-2xl font-semibold`, body = `text-base`, helper = `text-sm text-gray-600`.
- Line height via Tailwind `leading-tight` (headings) and `leading-relaxed` (body paragraphs).

### Spacing
- **8px grid** (Tailwind default). Common paddings: card `p-4` or `p-6`, section `py-8` / `py-20`, container `px-4 sm:px-6 lg:px-8`.
- Max content width `max-w-7xl` on page containers.

### Radii
- `--radius: 0.5rem` (8px). `rounded-md` default, `rounded-lg` cards, `rounded-full` for avatars / points pills / roulette / primary CTA buttons in the roulette section, `rounded-xl` on meal-type filter tiles.

### Shadows / Elevation
- `shadow-sm` — nav bar, default cards
- `shadow-md` — recipe card on hover (`hover:shadow-md`)
- `shadow-lg` — landing stats card, recipe image in modal
- `shadow-xl / 2xl` — roulette spin button on hover
- `shadow-inner` — center circle of the roulette wheel
- **No heavy drop shadows.** The feel is flat-ish, soft, with shadow used to lift interactive items on hover.

### Borders
- `border` (1px) with `var(--border)` = `hsl(20, 5.9%, 90%)` — warm off-white gray.
- Pricing card uses `border-2 border-orange-500` to highlight the Pro plan.
- Meal-type filter tiles use `border-2` that swaps color on active.

### Backgrounds
- Pages: solid white or `bg-gray-50`.
- Feature sections alternate: white → `bg-gray-50` → white, with one CTA section in solid `bg-orange-600`.
- Hero and roulette cards use **subtle multi-stop gradients** — `from-green-50 via-emerald-50 to-teal-50` — always light, never saturated.
- `chef-gradient-light` utility overlays three green hues at 10% opacity for tinted zones (e.g. AI Capture card).
- **No full-bleed photography** on marketing pages. Recipe cards use photography but it's contained within the card frame.
- **No repeating patterns/textures.** No grain. No hand-drawn illustrations.

### Animation
- **Framer Motion** is a dependency but used sparingly. Most motion is CSS.
- Standard `transition-colors` / `transition-shadow` on everything interactive (150–300ms).
- `hover:scale-105` on roulette CTA and recipe images; `transform hover:scale-105` on selected filter tiles.
- Roulette spin: custom `@keyframes roulette-spin-enhanced` — 3s, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, goes `rotate(0deg) scale(1)` → `rotate(2160deg) scale(1)` with brightness pulsing up to 1.3 mid-spin.
- Bounce entrance for recipe reveal: `@keyframes bounce-in` — 0.6s, scales from 0.3 with slight rotation for a playful "pop."
- Accordion uses standard Radix 200ms `ease-out`.
- Decorative dots rotate continuously: `rotate-dots` 20s linear infinite.
- **Easing vocabulary:** `ease-out` for entrances, `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for the roulette (a gentle deceleration). No bouncy springs outside the reveal moment.

### Hover / press states
- **Hover:** buttons darken by ~10% (`hover:bg-primary/90`); outline buttons fill with accent; cards lift shadow; images scale `105%`; links switch to primary color.
- **Active / press:** Radix-provided active state; meal-type filter tiles go `scale-105` and swap border to transparent + colored fill; no explicit shrink.
- **Focus:** `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` — a 2px green ring for keyboard nav.
- **Disabled:** `disabled:pointer-events-none disabled:opacity-50`.

### Transparency & blur
- Modal overlays use `bg-black/50` backdrop (from Radix Dialog).
- Platform chip on recipe image uses `bg-black bg-opacity-50 text-white` for legibility.
- "Most Popular" badge sits on a translucent-adjacent surface.
- **No backdrop-filter blur** anywhere in the code — the brand stays crisp and opaque.

### Imagery
- Recipe photography: **warm, bright, shot from above or 45°**. Saturated food colors against neutral surfaces. No B&W, no heavy grain.
- Placeholders reach for Unsplash URLs or `via.placeholder.com` at 400×300.
- User avatars default to `robohash.org` with `set=set5` (robot chefs).

### Component motifs
- **Cards:** `rounded-lg border bg-card shadow-sm`. Title in `font-display`, meta in `gray-500`, badges below. Hover lifts shadow.
- **Badges:** `rounded-full px-2.5 py-0.5 text-xs font-semibold`. Variants: solid (default), secondary (muted bg), destructive, outline. Color-coded for difficulty (easy=green, medium=yellow, hard=red).
- **Buttons:** `rounded-md` default. Primary = solid green. Outline = border + transparent bg. Ghost = transparent, hover bg. Roulette spin button is `rounded-full` with a gradient and shadow (the one "hero button" in the system).
- **Inputs:** `h-10 rounded-md border` — clean, minimal, no inner shadow.
- **No left-border-accent cards.** No heavy gradient-y containers. The look stays clean.

---

## Iconography

See `README.md` → **ICONOGRAPHY** section below (inline for convenience).

### Icon libraries
- **Primary:** [`lucide-react`](https://lucide.dev) v0.453 — stroke-based, 24×24 grid, 2px strokes. Used for all UI icons: `ChefHat, Clock, Users, Heart, Bookmark, Share2, Flame, Trophy, Target, Star, Menu, X, Loader2, Sparkles, ArrowRight, CheckCircle, Shuffle, Smartphone, Eye, Zap, TrendingUp, Coffee, Soup, UtensilsCrossed, IceCream, Filter`, etc.
- **Brand mark:** `<ChefHat />` from lucide, tinted `text-green-600`, is **the Chef Roulette logo** throughout. There is no custom SVG wordmark file in the repo.
- **Secondary:** `react-icons` (v5) is a dependency but barely used — mostly for one-off social icons if needed.
- **Inline SVGs:** a few ad-hoc inline `<svg>` icons appear in `navigation.tsx` for the "shuffle/roulette" glyph on the logo and the Google "G" multicolor logo on the sign-in button.
- **Emoji as icons:** intentional brand choice. Used for platforms (🎵 📸 🎥 📌), meals (🌅 ☀️ 🌙 🍰), rewards (🎰 🎉 🔥), and decorative headers. Keep them — they're part of the voice.

### Usage rules
- Default icon size: **16–20px** inside body text/buttons (`w-4 h-4`, `w-5 h-5`); **24–32px** in feature cards (`w-6 h-6`, `w-8 h-8`); **48–64px** for empty states and hero feature illustrations (`w-12 h-12`, `w-16 h-16`).
- Color: inherit from parent (`currentColor`) unless the icon sits on a tinted chip, then use `text-green-600` or the chip's accent.
- Pair icons with labels. Icon-only buttons only for destructive/close/overflow.
- For Chef Roulette branding: always `ChefHat` + wordmark "Chef Roulette" in Playfair Display bold, green tint.

This design system links lucide at runtime from CDN; no icon assets are copied locally. If offline bundling is needed, import lucide's SVG set from `node_modules/lucide-static/icons/`.

---

## Caveats
- No Figma file — all tokens pulled from the repo CSS vars and Tailwind config.
- README.md in the repo cited `#FF6B35` orange as primary; the actual code ships **green as primary**. This system follows the code.
- Fonts are Google-CDN-only; no self-hosted TTFs exist in the repo.
- Binary screenshots in `attached_assets/` were not imported (mostly development screenshots, not brand assets).

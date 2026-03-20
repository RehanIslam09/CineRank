# 🎬 CineRank — Frontend Design System

> **The complete design system, principles, patterns, and component library for CineRank.** Everything documented for quick walkthrough to the project and the design principles followed and you may use to create your own beautiful react app !

![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![TMDB](https://img.shields.io/badge/API-TMDB-01B4E4?style=flat-square)
![Theme](https://img.shields.io/badge/Theme-Dark-09080d?style=flat-square)
![Pages](https://img.shields.io/badge/Pages-8-a855f7?style=flat-square)
![Components](https://img.shields.io/badge/Components-40+-e879f9?style=flat-square)

---

## Table of Contents

- [Design Philosophy](#-design-philosophy)
- [Color System](#-color-system)
- [Typography](#-typography)
- [Spacing & Layout](#-spacing--layout)
- [Shadows & Depth](#-shadows--depth)
- [Core Components](#-core-components)
- [Card Patterns](#-card-patterns)
- [Modals & Overlays](#-modals--overlays)
- [Motion & Animation](#-motion--animation)
- [Loading States](#-loading-states)
- [Page Identities](#-page-identities)
- [Hero Patterns](#-hero-patterns)
- [Layout Patterns](#-layout-patterns)
- [Do's & Don'ts](#-dos--donts)
- [Reusable Patterns](#-reusable-patterns)
- [New Project Checklist](#-new-project-checklist)

---

## 🎭 Design Philosophy

CineRank was built around one north star: **every page should feel like it was designed for cinema, not for software.**

| Principle | Description |
|-----------|-------------|
| **Cinematic First** | Every page references the visual language of the content it serves. Film pages feel like opening titles. Award pages feel like ceremony programs. |
| **Each Page Has Its Own Identity** | A different accent color, typographic mood, and layout rhythm for every page. The navbar ties it together, but each page is its own world. |
| **Content Is the Design** | Movie posters, actor portraits, and backdrops ARE the visual design. The UI frames them without competing. |
| **Depth Over Flatness** | Layers of blur, glassmorphism, ambient backdrops, and gradient overlays create cinematic atmosphere. Nothing is ever flat. |
| **Motion With Purpose** | Every animation has a reason — hover lifts communicate interactivity, staggered reveals create life, fade transitions feel like a projector changing reels. |
| **Information Hierarchy Through Scale** | Heroes dominate at viewport height. Section titles are bold serif. Cards are secondary. You always know what's most important by size alone. |

> **The Golden Rule:** Before building any component, ask: *"What emotion should a user feel when they see this?"* — Excitement? Luxury? Anticipation? Then design backwards from that emotion using texture, scale, color temperature, and motion.

---

## 🎨 Color System

### Global Background & Surface Scale

> The background system uses a very dark near-black with a subtle purple tint — **never pure black**. This creates warmth and lets colored elements pop without harsh contrast.

| Token | Value | Usage |
|-------|-------|-------|
| Page Background | `#0a0a0f` | Root background of every page |
| Navbar BG | `#09090b` | With 80% opacity for glass effect |
| Surface | `#0d0d18` | Card backgrounds, panels, right sidebars |
| Surface Raised | `#1a1a2e` | Fallback images, elevated surfaces |
| Surface Active | `rgba(139,92,246,0.15)` | Active nav items, selected states |

### Primary Accent Palette

The global accent is **purple → fuchsia**. Used in the navbar, section headers, pagination, and cross-page interactive elements.

| Name | Value | Usage |
|------|-------|-------|
| Purple 500 | `#a855f7` | Primary accent, section bars, active states |
| Purple → Fuchsia | `linear-gradient(135deg, #a855f7, #e879f9)` | Buttons, active pills |
| Violet 700 | `#7c3aed` | Button hover shadows, deep accents |
| Purple/30% Alpha | `rgba(139,92,246,0.3)` | Card borders on hover |
| Purple/8% Alpha | `rgba(139,92,246,0.08)` | Hover backgrounds |

### Per-Page Accent Identity

> Every page has a unique accent color so users instantly know where they are. This is the **single most impactful design decision** in CineRank.

| Page | Accent | Colors | Feeling |
|------|--------|--------|---------|
| 🎬 Movies | Purple + Fuchsia | `#a855f7` / `#e879f9` | The home accent — sets the base identity |
| 📺 TV Shows | Violet | `#8b5cf6` / `#a78bfa` | One shade cooler — feels like prime-time TV blue |
| 🏆 Top Rated | Gold / Amber | `#facc15` / `#f59e0b` | Gold = prestige, rankings, the best |
| 🕐 Coming Soon | Fuchsia + Cyan | `#e879f9` / `#22d3ee` | The most electric duo — hype and anticipation |
| 🌟 Celebrities | Rose / Pink | `#fb7185` / `#db2777` | Warm, human, glamorous — Hollywood editorial |
| 🏅 Awards | Metallic Gold | `#d97706` → `#fbbf24` (animated) | Deep amber bg `#0a0908`, shimmer animation |
| 🎭 Community | Emerald + Teal | `#34d399` / `#2dd4bf` | The green EXIT sign glow of an arthouse cinema |
| ✦ For You | Fuchsia (Special) | `#e879f9` | Only nav link styled fuchsia — signals premium |

> ⚠️ **Color Discipline:** Never reuse a page accent color on a different page. Each color owns its page.

### Semantic Colors

| Token | Color | Usage |
|-------|-------|-------|
| Rating / Score | `#fbbf24` (yellow-400) | Star ratings, vote averages — always yellow, on every page |
| Out Now / Released | `#34d399` (green-400) | Release status badges |
| Imminent / Tomorrow | `#f87171` (red-400) | Films releasing within 24h |
| This Week | `#fb923c` (orange-400) | Films releasing within 7 days |
| Saved to Watchlist | `#d8b4fe` (purple-300) | Filled bookmark icon state |
| Error / Remove | `#ef4444` (red-500) | Destructive actions only |
| Live / Active feed | `emerald-400 animate-pulse` | Live badges, community activity dots |

---

## ✍️ Typography

CineRank uses a **dual-font strategy**: a display serif for hero headings, and the system sans-serif stack for body text and UI.

### Font Stack

```css
/* Display / Editorial */
font-family: 'Georgia', 'Times New Roman', serif;

/* UI / Body */
font-family: -apple-system, 'Segoe UI', sans-serif;
```

### Type Scale

| Role | Size | Weight | Font | Used On |
|------|------|--------|------|---------|
| Hero Title | `clamp(2.8rem, 7vw, 5.5rem)` | 900 | Serif | Page hero sections, carousel titles |
| Page Title | `clamp(2.5rem, 5.5vw, 4.5rem)` | 900 | Serif | ForYouPage, CommunityPage heroes |
| Section Title | `text-xl / 1.25rem` | 800 | Sans | Section headers throughout |
| Card Title | `text-sm / 0.875rem` | 700 | Serif or Sans | Movie/show card titles |
| UI Label | `text-xs / 0.75rem` | 500–600 | Sans | Button labels, badge text |
| Micro Label | `text-[10px]` | 700 | Sans | Badges, status chips, category labels |
| Mono / Code | `text-[10px]`–`text-sm` | 700 | Monospace | Countdowns, rank numbers |
| Body / Overview | `text-sm / 0.875rem` | 400 | Sans | Movie overviews, bios, descriptions |

### Typography Rules

✅ Always use `letter-spacing: -0.02em` to `-0.025em` on large serif headlines — it tightens them and looks designed, not default.

✅ Use `line-height: 0.88–0.95` on hero titles — condensed line height reads as premium and editorial.

✅ Uppercase micro-labels always get `tracking-widest (0.12em+)`.

✅ Use `font-black (900)` for display text, `font-bold (700)` for UI, `font-medium (500)` for secondary.

❌ Never use Inter, Roboto, or Arial as display fonts — they kill the cinematic feel instantly.

❌ Never use `line-height: 1.5+` on headings — it makes them look like body text.

---

## 📐 Spacing & Layout

### Layout Containers

| Element | Value | Notes |
|---------|-------|-------|
| Max content width | `max-w-7xl mx-auto` | 80rem / 1280px |
| Section padding | `px-6 py-8` to `py-10` | 24px horizontal, 32–40px vertical |
| Navbar height | `h-16 (64px)` | All pages offset with `pt-16` |
| Hero height | `85vh, max 700px, min 520px` | Carousel heroes |
| Card grid gap | `gap-4` | 16px between all cards |
| Grid columns | `grid-cols-2 sm:3 md:4 lg:5` | Standard movie card grid |

### Two-Column Layout

```jsx
/* Standard 2-col layout with fixed sidebar */
className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8"
```

> The content-to-sidebar ratio is always `1fr 320px` — never equal columns.

### Horizontal Scroll Rows

```jsx
/* Hide scrollbar globally */
<style>{'.scrollbar-hide::-webkit-scrollbar{display:none}'}</style>

/* Apply to the scrollable div */
className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
```

---

## 🌒 Shadows & Depth

> Shadows in CineRank are always **colored, not black**. Using the page accent color as the shadow tint ties the depth to the brand and creates atmosphere.

| Shadow | Value | Usage |
|--------|-------|-------|
| Card Hover | `0 4px 16px rgba(139,92,246,0.2)` | `shadow-xl shadow-purple-900/30` |
| Primary Button | `0 8px 24px rgba(139,92,246,0.35)` | `shadow-lg shadow-purple-900/50` |
| Modal | `0 16px 48px rgba(139,92,246,0.5)` | `shadow-2xl shadow-purple-900/50` |
| Glow Accent | `0 0 24px rgba(168,85,247,0.4)` | Active thumbnail, neon borders |
| Subtle Lift | `0 2px 8px rgba(0,0,0,0.6)` | Posters, profile pics |
| Gold (Awards only) | `0 0 40px rgba(251,191,36,0.25)` | `shadow-yellow-500/25` |

### Glassmorphism Navbar

```css
/* Navbar glass effect */
backdrop-blur-md bg-[#09090b]/80 border-b border-purple-900/30

/* Gradient accent line below navbar */
h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70
```

### Layered Backdrop Pattern

Every hero section uses 3 layers for cinematic depth:

```jsx
/* Layer 1: Ambient blur */
className="absolute inset-0 object-cover scale-110 blur-2xl opacity-25"

/* Layer 2: Crisp image */
className="absolute inset-0 object-cover opacity-45"

/* Layer 3: Gradient overlays */
"bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/55 to-transparent"  // bottom fade
"bg-gradient-to-r from-[#0a0a0f]/95 via-[#0a0a0f]/35 to-transparent" // left fade for text
```

> ✅ Text on any image always needs at minimum a bottom gradient (`from-black via-black/50 to-transparent`). Never place white text directly on an image.

---

## 🧩 Core Components

### Buttons

```jsx
/* Primary */
className="bg-gradient-to-r from-purple-600 to-violet-700 text-white font-bold
           shadow-lg shadow-purple-900/50 hover:scale-[1.02] transition-all duration-200"

/* Secondary */
className="bg-white/8 border border-white/15 text-white/80"

/* Ghost */
className="bg-transparent border border-purple-500/30 text-purple-300"
```

### Badges & Chips

All badges share the same structure — only color changes:

```jsx
className="text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider"
```

### Section Header Pattern

The single most reused pattern in the entire app:

```jsx
<div className="flex items-center gap-3 mb-6">
  <span className="w-1 h-7 bg-purple-500 rounded-full" />  {/* accent bar */}
  <h2 className="text-white font-bold text-xl">Section Name</h2>
  <span className="bg-purple-500/15 border border-purple-500/25 text-purple-400
                   text-xs px-2.5 py-0.5 rounded-full font-semibold">
    {count} items
  </span>
</div>
```

### ImageOrFallback Component

Used in every single component. Never render a raw `<img>`:

```jsx
const ImageOrFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className={`${className} bg-[#1a1a2e] relative overflow-hidden`}>
        {/* Diagonal repeating watermark text */}
        <div style={{ transform: 'rotate(-35deg) scale(2)' }}>
          {/* 80x "Illustration Not Available •" spans */}
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};
```

---

## 🃏 Card Patterns

### Card Anatomy Rules

✅ Rank badge top-left: `bg-black/80 backdrop-blur-sm`  
✅ Watchlist btn top-right: `opacity-0 group-hover:opacity-100`  
✅ Gradient bottom fade always from page bg color  
✅ Poster thumbnail bleeds out of image area with `-mt-8`  
✅ Hover: `hover:-translate-y-1.5 hover:border-purple-500/40`  
✅ Default border: `border-purple-900/30`  
✅ Image scales on hover: `group-hover:scale-105 duration-500`  
❌ Never use box borders without the `group` parent pattern  

### Tooltip Pattern

```jsx
<div className="absolute ... opacity-0 group-hover:opacity-100 transition-opacity duration-200
                bg-[#13131f] border border-purple-500/25 rounded-2xl p-3 shadow-xl">
  {/* Tooltip content */}
</div>
```

### Skeleton Loading Cards

```jsx
/* Always use the page accent color for skeleton gradient */
const GridSkeleton = () => (
  <div className="bg-[#0d0d18] border border-purple-900/20 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-[260px] bg-gradient-to-br from-purple-900/10 via-purple-800/20 to-purple-900/10" />
    <div className="p-3.5 space-y-2">
      <div className="h-3 bg-purple-900/20 rounded w-3/4" />
      <div className="h-2 bg-purple-900/10 rounded w-1/2" />
    </div>
  </div>
);
```

---

## 🪟 Modals & Overlays

### Modal Template

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>

  {/* Backdrop: always black/85 + backdrop-blur-md (NOT xl — too heavy) */}
  <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

  <div
    className="relative z-10 bg-[#0d0d18] border border-purple-900/40 rounded-3xl
               overflow-hidden shadow-2xl shadow-purple-900/50 max-w-2xl w-full"
    onClick={e => e.stopPropagation()}
  >
    {/* Backdrop hero (220px) */}
    {/* Scrollable body with -mt-14 poster overlap trick */}
    {/* Footer with CTA buttons */}
  </div>
</div>
```

### Search Overlay

```jsx
/* Use opacity, never display:none — allows smooth animation */
className={`fixed inset-0 z-[100] transition-all duration-300
  ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
```

### Z-Index Scale

| Layer | z-index | Elements |
|-------|---------|----------|
| Page content | 0–10 | Cards, sections, images |
| Card overlays | 10–20 | Badges, hover tooltips |
| Sticky controls | 20–30 | Sticky filter bars, sticky tabs |
| Navbar | 50 | Always `z-50` |
| Search overlay | 100 | `z-[100]` |
| Detail modals | 200 | `z-[200]` — sits above search |

---

## ✨ Motion & Animation

| Animation | Usage | Duration |
|-----------|-------|----------|
| Pulse | Live badges, status dots, trending indicators | `2s ease-in-out infinite` |
| Spin | Loading state in search input | `1.5s linear infinite` |
| Fade | Hero carousel transitions | `350–500ms ease` |
| Slide Up | Cards entering on page/tab load — staggered | `400ms ease forwards` |
| Shimmer | Skeleton loading state | `200% bg-size sweep, 2s` |
| Glow Pulse | Active hero thumbnail, neon borders | `2s ease-in-out infinite` |

### Staggered Card Entrance (The Cascade Effect)

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card-enter { animation: fadeSlideUp 0.4s ease forwards; opacity: 0; }
```

```jsx
{items.map((item, i) => (
  <div className="card-enter" style={{ animationDelay: `${i * 40}ms` }}>
    <Card />
  </div>
))}
```

### Gold Shimmer Text (Awards Page)

```css
.gold-shimmer {
  background: linear-gradient(105deg, #78350f 0%, #d97706 30%, #fbbf24 50%, #d97706 70%, #78350f 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: goldshine 4s linear infinite;
}
@keyframes goldshine {
  0%   { background-position: 0% center; }
  100% { background-position: 200% center; }
}
```

### Transition Timing Reference

| Interaction | Duration | Easing |
|-------------|----------|--------|
| All micro-interactions (hover, focus) | `200ms` | `ease` |
| Card hover lift + border glow | `200–300ms` | `ease` |
| Image scale on card hover | `400–500ms` | `ease` |
| Hero carousel slide/fade | `450–500ms` | `ease` |
| Modal open/close | `300ms` | `ease` |
| Search overlay | `300ms` | `ease` |
| Stagger per card | `35–80ms` delay step | Card entrance only |
| Progress bar fill | `500–700ms` | `ease` |

---

## ⏳ Loading States

Every async data fetch shows a skeleton loader that **exactly matches the shape of the final content**.

> ✅ **Rule:** Skeleton color = page accent + very low opacity.  
> Movies: `from-purple-900/10 via-purple-800/20`  
> Awards: `from-yellow-900/10 via-yellow-700/15`  
> Community: `from-emerald-900/10 via-teal-700/12`  
> **Never use generic gray skeletons.**

```jsx
const Shimmer = ({ className }) => (
  <div className={`${className} bg-gradient-to-r
    from-purple-900/10 via-purple-800/20 to-purple-900/10
    animate-pulse rounded-xl`} />
);
```

### Page-Level Loading

```jsx
{loading
  ? <div className="w-full h-[420px] bg-gradient-to-br from-purple-900/10 via-purple-800/5 to-[#0a0a0f] animate-pulse" />
  : <HeroSpotlight movie={heroMovie} />
}
```

---

## 🗺️ Page Identities

Each page was designed with a distinct **aesthetic persona** — a concept beyond just a color.

| Page | Aesthetic Persona | Unique Feature | Background |
|------|-------------------|----------------|------------|
| Movies | Cinema marquee / Hollywood foyer | Left/right split hero + thumbnail strip | `#0a0a0f` |
| TV Shows | Same as Movies, violet-shifted | Green "LIVE" badge on airing panel | `#0a0a0f` |
| Top Rated | Hall of fame / championship podium | Gold/silver/bronze podium component | `#0a0a0f` |
| Coming Soon | Mission control countdown | Auto-rotating hero + urgency strip | `#0a0812` |
| Celebrities | Editorial magazine / Hollywood noir | Masonry grid + scrolling marquee | `#0a0908` |
| Awards | Oscar ceremony / Variety magazine | Animated gold shimmer headline text | `#0a0908` |
| Community | Arthouse cinema velvet seats | Film grain overlay + Georgia serif throughout | `#09080a` |
| For You | Personal AI cinema concierge | 11 mood cards with gradient glow + reasoning | `#0a0a0f` |
| Watchlist | Personal film journal | Grid/list toggle + grouping + detail modal | `#0a0a0f` |

> **Background subtlety:** Awards/Community use slightly warmer darks (`#0a0908`, `#09080a`) while Coming Soon uses purple-tinted dark (`#0a0812`). These 1–2% tonal shifts dramatically reinforce each page's feel without being noticeable to users.

---

## 🎞️ Hero Patterns

### Pattern 1 — Full-Viewport Auto-Rotating Carousel

Used on Coming Soon. 5 films cycle every 7s.

- 3-layer backdrop (blur ambient + crisp image + gradients)
- Scanline texture overlay at `opacity-[0.025]`
- Floating gradient orbs behind content for depth
- Poster thumbnail strip bottom-right (desktop only)
- Content fades with `opacity + translate-y` during slide transition
- `clearInterval` on manual navigation, restart after

### Pattern 2 — Left-Right Split Banner

Used on Movies/TV. Fixed height `calc(100vh - 64px)` capped at 580px. Left side is the hero film, right side is a supplementary list.

### Pattern 3 — Cinematic Feature Spread

Used on Top Rated (#1 film), Awards, Coming Soon. Full-bleed backdrop, content bottom-left, large ghost rank number as watermark:

```jsx
<div
  className="absolute right-8 bottom-6 z-20 font-black text-white/4 pointer-events-none select-none"
  style={{ fontSize: '10rem', fontFamily: "'Georgia', serif" }}
>
  01
</div>
```

### Pattern 4 — Asymmetric Editorial Hero

Used on Celebrities. Portrait bleeds in from the right at 55% width. Creates a magazine double-page spread:

```jsx
{/* Portrait bleeds right */}
<img className="absolute right-0 top-0 h-full w-auto opacity-60"
     style={{ maxWidth: '55%', objectFit: 'cover' }} />

{/* Text covers left with heavy gradient */}
<div className="absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/85 to-transparent" />
```

---

## 📐 Layout Patterns

### Sticky Filter Bar

```jsx
<div className="sticky top-16 z-20 -mx-6 px-6 py-3 bg-[#0a0a0f]/92 backdrop-blur-md border-b border-white/5">
  {/* filter chips + sort + view toggle */}
</div>
```

### Grouped Content by Month/Category

```jsx
{Object.entries(groupedMap).map(([key, items]) => (
  <div key={key}>
    <MonthHeader label={key} count={items.length} />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item, i) => (
        <div className="card-enter" style={{ animationDelay: `${i*35}ms` }}>
          <Card item={item} />
        </div>
      ))}
    </div>
  </div>
))}
```

### Urgency Color System (Coming Soon)

| Urgency | Condition | Color |
|---------|-----------|-------|
| Out Now | `release_date ≤ today` | 🟢 green |
| Tomorrow | `diff ≤ 24h` | 🔴 red + pulse |
| This Week | `diff ≤ 3 days` | 🟠 orange |
| This Week | `diff ≤ 7 days` | 🟣 fuchsia |
| This Month | `diff ≤ 30 days` | 🟣 violet |
| Later | `diff > 30 days` | 🩵 cyan |

---

## ✅ Do's & Don'ts

### ✅ Always Do

- Use `transition-all duration-200` on every interactive element
- Add `group` to card parents and use `group-hover:` for inner animations
- Hide scrollbars on all horizontal scroll containers
- Use `backdrop-blur` for overlaid text panels on images
- Use `object-top` for portrait photos (shows face, not torso)
- Add `line-clamp-1` or `line-clamp-2` on all card titles
- Fetch data independently in each component (no prop-drilling)
- Define `ImageOrFallback` locally in each component file
- Use `clearInterval` when manually navigating a carousel
- Show skeletons that exactly match the shape of final content
- Use `flex-shrink-0` on all fixed-width elements inside flex rows

### ❌ Never Do

- Never use Inter, Roboto, or system-ui as a display font
- Never use pure black (`#000000`) as a background
- Never use `display:none` for overlay fade animations — use opacity
- Never use the same accent color on a different page
- Never place white text on an image without a gradient overlay
- Never use generic gray skeletons — always tint with page accent
- Never use `backdrop-blur-xl` for modals — `blur-md` performs better
- Never stack more than 2 horizontal scroll rows without a section header
- Never use full-opacity borders — always alpha (e.g. `border-purple-900/30`)
- Never use black box-shadows — always use a tinted shadow matching the page accent

---

## ♻️ Reusable Patterns

These patterns work in **any dark-themed web app**, not just CineRank.

### 1. The Page Identity System

Before building any multi-page app, assign one accent color per page. Each page needs: a unique accent color, a gradient pair, a border opacity, and a text color. This creates instant wayfinding and a sense that the app has been *designed*, not assembled.

### 2. Glassmorphism Sticky Header

```css
"backdrop-blur-md bg-[PAGE_BG]/80 border-b border-[ACCENT]-900/30"
/* Works for: navbars, sticky filter bars, modal headers, bottom sheets */
```

### 3. The Ambient Backdrop Hero

```
1. Blurred ambient layer (scale-110 to cover edges)
2. Crisp image at 40–50% opacity
3. from-[BG] gradient top-to-bottom for text readability
4. from-[BG]/95 gradient left-to-right for side content
```

### 4. Hover Card Group Pattern

```jsx
"group border border-white/5 hover:border-[ACCENT]/40 rounded-2xl
  transition-all duration-200 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[ACCENT]/15"

// Inside: images scale, text changes color, hidden elements appear
"group-hover:scale-105 group-hover:text-[ACCENT] opacity-0 group-hover:opacity-100"
```

### 5. Colored Shadow System

```css
/* Replace ALL box-shadows with accent-colored ones */
/* Generic:  shadow-purple-900/40 */
/* Per-page: shadow-rose-900/25, shadow-emerald-900/20, shadow-yellow-500/30 */
/* This alone makes UIs feel 10x more designed */
```

### 6. Stagger Entrance Pattern

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card-enter { animation: fadeSlideUp 0.4s ease forwards; opacity: 0; }
/* Apply with: animationDelay: `${index * 50}ms` */
/* Use 35–80ms steps — lower for small cards, higher for large */
```

### 7. Smart Ellipsis Pagination

```js
Array.from({ length: totalPages }, (_, i) => i + 1)
  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
  .reduce((acc, p, idx, arr) => {
    if (idx > 0 && arr[idx-1] !== p - 1) acc.push('…');
    acc.push(p);
    return acc;
  }, [])
```

### 8. Responsive Clamp Title

```jsx
style={{
  fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
  fontFamily: "'Georgia', serif",
  letterSpacing: '-0.025em',
  lineHeight: '0.9'
}}
```

---

## 📋 New Project Checklist

### Foundation Setup

- [ ] Set root background to a near-black with a tint (not pure black)
- [ ] Define a page identity system — assign one accent color per page before writing any components
- [ ] Pick a display serif font for headings (Georgia, Playfair Display, etc.)
- [ ] Set up the `scrollbar-hide` CSS utility globally
- [ ] Create the `ImageOrFallback` component template

### Every New Component

- [ ] Loading skeleton that matches its final shape?
- [ ] Skeleton uses the page accent color tinted at ~10%?
- [ ] Every interactive element has `transition-all duration-200`?
- [ ] Card grids stagger their entrance animations?
- [ ] Images with overlaid text have a gradient overlay?
- [ ] Horizontal scroll containers use `scrollbar-hide`?

### Every New Page

- [ ] Unique accent color distinct from other pages?
- [ ] Cinematic hero section (min 400px, full-bleed imagery)?
- [ ] Serif font used for all display text?
- [ ] Section headers using the "accent bar + title + count badge" pattern?
- [ ] Background color slightly different shade to reinforce page identity?
- [ ] Sticky filter bar uses `top-16` (below the fixed navbar)?

---

> **The 3-Second Rule:** If you can't tell which page you're on within 3 seconds (from color, hero, and typography alone), the page identity system isn't working. Each page should be instantly recognisable.

> **The "Is it cinematic?" Test:** After building any component, ask: does it feel like it belongs in a movie database app, or does it feel like a generic SaaS dashboard? If it's the latter — add a backdrop image, increase the font size of the title, add a gradient, darken the background. The answer is almost always "needs more depth and scale."

---

*CineRank Design System v1.0 — Built with React + Vite + Tailwind CSS*

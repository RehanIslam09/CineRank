<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CineRank — Design System & Frontend Bible</title>
<style>
  /* ═══════════════════════════════════════
     RESET & BASE
  ═══════════════════════════════════════ */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg:        #09080d;
    --surface:   #0f0d17;
    --surface2:  #161228;
    --border:    rgba(139,92,246,0.18);
    --border2:   rgba(255,255,255,0.06);
    --text:      #f1f0f8;
    --muted:     #8b85a8;
    --subtle:    #3d3758;
    --purple:    #a855f7;
    --violet:    #8b5cf6;
    --fuchsia:   #e879f9;
    --cyan:      #22d3ee;
    --rose:      #fb7185;
    --amber:     #fbbf24;
    --emerald:   #34d399;
    --font-serif: 'Georgia', 'Times New Roman', serif;
    --font-mono:  'Courier New', Courier, monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, 'Segoe UI', sans-serif;
    font-size: 15px;
    line-height: 1.7;
    min-height: 100vh;
  }

  /* ═══════════════════════════════════════
     LAYOUT
  ═══════════════════════════════════════ */
  .layout {
    display: flex;
    min-height: 100vh;
  }

  /* Sidebar */
  .sidebar {
    width: 260px;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 28px 0 40px;
    scrollbar-width: none;
  }
  .sidebar::-webkit-scrollbar { display: none; }

  .sidebar-logo {
    padding: 0 24px 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 20px;
  }
  .sidebar-logo-mark {
    font-size: 22px;
    font-weight: 900;
    background: linear-gradient(135deg, #a855f7, #e879f9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: var(--font-serif);
    letter-spacing: -0.02em;
  }
  .sidebar-logo-sub {
    font-size: 11px;
    color: var(--subtle);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-top: 2px;
  }

  .nav-section {
    padding: 0 16px 6px;
    margin-bottom: 2px;
  }
  .nav-section-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--subtle);
    padding: 10px 8px 4px;
  }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 8px;
    border-radius: 8px;
    font-size: 13px;
    color: var(--muted);
    text-decoration: none;
    transition: all 0.15s;
    cursor: pointer;
  }
  .nav-link:hover { background: rgba(168,85,247,0.1); color: var(--text); }
  .nav-link.active { background: rgba(168,85,247,0.15); color: #c4b5fd; }
  .nav-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Main content */
  .main {
    flex: 1;
    min-width: 0;
    padding: 0;
  }

  /* ═══════════════════════════════════════
     HERO SECTION
  ═══════════════════════════════════════ */
  .hero {
    position: relative;
    overflow: hidden;
    padding: 80px 64px 72px;
    border-bottom: 1px solid var(--border);
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 50%, rgba(139,92,246,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 80% 20%, rgba(232,121,249,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 60% 90%, rgba(34,211,238,0.05) 0%, transparent 60%);
  }
  /* Scanline texture */
  .hero-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 3px);
    background-size: 100% 3px;
    pointer-events: none;
  }
  .hero-content { position: relative; z-index: 1; max-width: 760px; }
  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #c4b5fd;
    background: rgba(168,85,247,0.12);
    border: 1px solid rgba(168,85,247,0.28);
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 24px;
  }
  .hero-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #a855f7;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }

  .hero-title {
    font-family: var(--font-serif);
    font-size: clamp(2.6rem, 5vw, 4.4rem);
    font-weight: 900;
    line-height: 0.92;
    letter-spacing: -0.025em;
    margin-bottom: 20px;
  }
  .hero-title-gradient {
    background: linear-gradient(135deg, #a855f7 0%, #e879f9 40%, #22d3ee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .hero-desc {
    font-size: 16px;
    color: var(--muted);
    max-width: 560px;
    line-height: 1.75;
    margin-bottom: 32px;
  }
  .hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .hero-tag {
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 100px;
    border: 1px solid var(--border2);
    color: var(--muted);
    background: rgba(255,255,255,0.03);
  }

  /* ═══════════════════════════════════════
     CONTENT SECTIONS
  ═══════════════════════════════════════ */
  .section {
    padding: 60px 64px;
    border-bottom: 1px solid var(--border);
  }
  .section:last-child { border-bottom: none; }

  .section-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 36px;
  }
  .section-bar {
    width: 3px;
    height: 32px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .section-title {
    font-family: var(--font-serif);
    font-size: 26px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--text);
  }
  .section-num {
    font-size: 11px;
    font-weight: 700;
    color: var(--subtle);
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 3px 10px;
    border-radius: 100px;
  }

  /* ═══════════════════════════════════════
     TYPOGRAPHY
  ═══════════════════════════════════════ */
  h3 {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin: 28px 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  h3::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--purple);
    flex-shrink: 0;
  }
  p { color: var(--muted); font-size: 14px; line-height: 1.8; margin-bottom: 12px; }
  strong { color: var(--text); font-weight: 600; }

  /* ═══════════════════════════════════════
     CALLOUT BOXES
  ═══════════════════════════════════════ */
  .callout {
    border-radius: 14px;
    padding: 18px 20px;
    margin: 16px 0;
    border-left: 3px solid;
    font-size: 13.5px;
    line-height: 1.7;
  }
  .callout-rule { background: rgba(168,85,247,0.08); border-color: #a855f7; color: #d4bbff; }
  .callout-tip  { background: rgba(34,211,238,0.07);  border-color: #22d3ee; color: #a5f3fc; }
  .callout-warn { background: rgba(251,191,36,0.07);  border-color: #fbbf24; color: #fde68a; }
  .callout-good { background: rgba(52,211,153,0.07);  border-color: #34d399; color: #a7f3d0; }
  .callout strong { color: inherit; }

  /* ═══════════════════════════════════════
     COLOR PALETTE
  ═══════════════════════════════════════ */
  .palette-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin: 16px 0 24px;
  }
  .color-card {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--border2);
    transition: transform 0.15s;
  }
  .color-card:hover { transform: translateY(-2px); }
  .color-swatch {
    height: 72px;
    position: relative;
  }
  .color-swatch-label {
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-size: 9px;
    font-family: var(--font-mono);
    background: rgba(0,0,0,0.5);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    backdrop-filter: blur(4px);
  }
  .color-info {
    padding: 10px 12px;
    background: var(--surface);
  }
  .color-name { font-size: 12px; font-weight: 700; color: var(--text); }
  .color-hex  { font-size: 10px; font-family: var(--font-mono); color: var(--subtle); margin-top: 1px; }
  .color-use  { font-size: 10px; color: var(--muted); margin-top: 4px; line-height: 1.4; }

  /* Page accent colors */
  .page-accents {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin: 16px 0;
  }
  .page-accent-card {
    border-radius: 12px;
    border: 1px solid;
    padding: 14px 16px;
    font-size: 12px;
  }
  .page-accent-name { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
  .page-accent-colors { font-family: var(--font-mono); font-size: 10px; opacity: 0.7; }

  /* ═══════════════════════════════════════
     TYPOGRAPHY SPECIMENS
  ═══════════════════════════════════════ */
  .type-specimen {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 32px;
    margin: 12px 0;
  }
  .type-role {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--subtle);
    margin-bottom: 6px;
  }
  .type-example-label {
    font-size: 10px;
    color: var(--subtle);
    font-family: var(--font-mono);
    margin-top: 10px;
  }

  /* ═══════════════════════════════════════
     COMPONENT SHOWCASE
  ═══════════════════════════════════════ */
  .component-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin: 16px 0;
  }
  .component-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
  }
  .component-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--subtle);
    margin-bottom: 14px;
  }

  /* Mock button styles */
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; }
  .btn-primary { background: linear-gradient(135deg, #a855f7, #7c3aed); color: white; box-shadow: 0 8px 24px rgba(168,85,247,0.35); }
  .btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.8); }
  .btn-ghost { background: transparent; border: 1px solid rgba(168,85,247,0.3); color: #c4b5fd; }
  .btn-danger { background: rgba(251,113,133,0.15); border: 1px solid rgba(251,113,133,0.3); color: #fb7185; }

  /* Mock badge */
  .badge { display: inline-flex; align-items: center; gap: 5px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 3px 10px; border-radius: 100px; border: 1px solid; }
  .badge-purple { background: rgba(168,85,247,0.15); border-color: rgba(168,85,247,0.3); color: #c4b5fd; }
  .badge-violet { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.3); color: #a78bfa; }
  .badge-emerald{ background: rgba(52,211,153,0.15); border-color: rgba(52,211,153,0.3); color: #34d399; }
  .badge-rose   { background: rgba(251,113,133,0.15); border-color: rgba(251,113,133,0.3); color: #fb7185; }
  .badge-amber  { background: rgba(251,191,36,0.15);  border-color: rgba(251,191,36,0.3);  color: #fbbf24; }
  .badge-cyan   { background: rgba(34,211,238,0.15);  border-color: rgba(34,211,238,0.3);  color: #22d3ee; }

  /* Mock card */
  .mock-card {
    background: #0d0d18;
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
  }
  .mock-card:hover { border-color: rgba(168,85,247,0.4); transform: translateY(-2px); box-shadow: 0 16px 40px rgba(139,92,246,0.15); }
  .mock-card-img { height: 100px; background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(232,121,249,0.08)); }
  .mock-card-body { padding: 14px; }
  .mock-card-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .mock-card-meta { font-size: 11px; color: var(--subtle); }

  /* Glassmorphism demo */
  .glass-demo {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px;
  }

  /* ═══════════════════════════════════════
     CODE BLOCKS
  ═══════════════════════════════════════ */
  pre {
    background: #0a0812;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 22px;
    overflow-x: auto;
    margin: 12px 0 20px;
    font-size: 12.5px;
    line-height: 1.7;
    scrollbar-width: none;
  }
  pre::-webkit-scrollbar { display: none; }
  code {
    font-family: var(--font-mono);
    color: #d4bbff;
  }
  .code-comment { color: #4a4568; }
  .code-key     { color: #93c5fd; }
  .code-val     { color: #86efac; }
  .code-str     { color: #fca5a5; }
  .code-class   { color: #fde68a; }
  .code-tag     { color: #c4b5fd; }

  /* Inline code */
  code.inline {
    background: rgba(168,85,247,0.12);
    border: 1px solid rgba(168,85,247,0.2);
    padding: 1px 6px;
    border-radius: 5px;
    font-size: 12px;
    color: #c4b5fd;
  }

  /* ═══════════════════════════════════════
     TABLE
  ═══════════════════════════════════════ */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 24px;
    font-size: 13px;
  }
  .data-table th {
    text-align: left;
    padding: 10px 14px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--subtle);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  .data-table td {
    padding: 11px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: var(--muted);
    vertical-align: top;
    line-height: 1.5;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: rgba(168,85,247,0.04); }
  .data-table td:first-child { color: var(--text); font-weight: 600; }
  .data-table code.inline { font-size: 11px; }

  /* ═══════════════════════════════════════
     ANIMATION SHOWCASE
  ═══════════════════════════════════════ */
  .anim-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    margin: 16px 0;
  }
  .anim-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px;
    text-align: center;
  }
  .anim-demo {
    width: 48px; height: 48px;
    border-radius: 12px;
    margin: 0 auto 12px;
    background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(232,121,249,0.2));
    border: 1px solid rgba(168,85,247,0.3);
  }
  .anim-name { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .anim-desc { font-size: 11px; color: var(--subtle); line-height: 1.4; }

  /* Demo animations */
  .demo-pulse { animation: demoPulse 2s ease-in-out infinite; }
  @keyframes demoPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(0.9);opacity:0.6} }
  .demo-spin { animation: demoSpin 1.5s linear infinite; border-radius: 50% !important; border: 2px solid rgba(168,85,247,0.2) !important; border-top-color: #a855f7 !important; background: transparent !important; }
  @keyframes demoSpin { to{ transform: rotate(360deg) } }
  .demo-fade { animation: demoFade 2.5s ease-in-out infinite; }
  @keyframes demoFade { 0%,100%{opacity:0.2} 50%{opacity:1} }
  .demo-slide { animation: demoSlide 2.5s ease-in-out infinite; }
  @keyframes demoSlide { 0%{transform:translateY(6px);opacity:0} 20%,80%{transform:translateY(0);opacity:1} 100%{transform:translateY(-6px);opacity:0} }
  .demo-shimmer {
    background: linear-gradient(90deg, rgba(168,85,247,0.08) 0%, rgba(168,85,247,0.22) 50%, rgba(168,85,247,0.08) 100%);
    background-size: 200% auto;
    animation: demoShimmer 2s linear infinite;
    border: none !important;
  }
  @keyframes demoShimmer { to { background-position: 200% center } }
  .demo-glow { animation: demoGlow 2s ease-in-out infinite; }
  @keyframes demoGlow { 0%,100%{box-shadow:0 0 8px rgba(168,85,247,0.2)} 50%{box-shadow:0 0 24px rgba(168,85,247,0.6)} }

  /* ═══════════════════════════════════════
     SPACING SCALE
  ═══════════════════════════════════════ */
  .spacing-scale {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 14px 0;
  }
  .spacing-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .spacing-bar-wrap { flex: 1; height: 20px; display: flex; align-items: center; }
  .spacing-bar {
    height: 8px;
    border-radius: 100px;
    background: linear-gradient(90deg, #a855f7, #e879f9);
    opacity: 0.7;
  }
  .spacing-label { font-size: 11px; font-family: var(--font-mono); color: var(--subtle); width: 100px; flex-shrink: 0; }
  .spacing-px    { font-size: 11px; color: var(--muted); width: 50px; flex-shrink: 0; }

  /* ═══════════════════════════════════════
     SHADOW SCALE
  ═══════════════════════════════════════ */
  .shadow-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
    margin: 14px 0;
  }
  .shadow-box {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 14px;
    padding: 22px 18px;
    text-align: center;
  }
  .shadow-name { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .shadow-code { font-size: 10px; font-family: var(--font-mono); color: var(--subtle); line-height: 1.4; }

  /* ═══════════════════════════════════════
     PAGE IDENTITY CARDS
  ═══════════════════════════════════════ */
  .page-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
    margin: 16px 0;
  }
  .page-id-card {
    border-radius: 16px;
    border: 1px solid;
    padding: 18px 20px;
    transition: transform 0.15s;
  }
  .page-id-card:hover { transform: translateY(-2px); }
  .page-name { font-weight: 800; font-size: 15px; margin-bottom: 5px; }
  .page-accent-pill { display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 9px; border-radius: 100px; border: 1px solid; margin-bottom: 8px; }
  .page-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }

  /* ═══════════════════════════════════════
     DESIGN PRINCIPLE CARDS
  ═══════════════════════════════════════ */
  .principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
    margin: 16px 0;
  }
  .principle-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    transition: all 0.2s;
  }
  .principle-card:hover { border-color: rgba(168,85,247,0.35); background: var(--surface2); }
  .principle-num {
    font-size: 11px;
    font-weight: 800;
    font-family: var(--font-serif);
    color: var(--purple);
    margin-bottom: 8px;
  }
  .principle-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .principle-desc { font-size: 12.5px; color: var(--muted); line-height: 1.65; }

  /* ═══════════════════════════════════════
     CHECKLIST
  ═══════════════════════════════════════ */
  .checklist { list-style: none; margin: 12px 0; }
  .checklist li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 7px 0;
    font-size: 13.5px;
    color: var(--muted);
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .checklist li:last-child { border-bottom: none; }
  .check-icon { color: var(--emerald); flex-shrink: 0; margin-top: 1px; font-size: 14px; }
  .cross-icon { color: var(--rose); flex-shrink: 0; margin-top: 1px; font-size: 14px; }

  /* ═══════════════════════════════════════
     MISC UTILITIES
  ═══════════════════════════════════════ */
  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 28px 0;
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 16px 0;
  }
  @media (max-width: 800px) {
    .two-col { grid-template-columns: 1fr; }
    .section { padding: 40px 28px; }
    .hero { padding: 48px 28px; }
    .sidebar { display: none; }
  }

  .pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 10px 0;
  }

  .tag-section {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    margin: 12px 0;
    font-size: 13px;
    color: var(--muted);
  }
  .tag-section strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--subtle); margin-bottom: 8px; }

  /* Gradient border shimmer for important boxes */
  .shimmer-border {
    position: relative;
    border-radius: 16px;
    padding: 20px;
    margin: 16px 0;
    background: var(--surface);
  }
  .shimmer-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 17px;
    background: linear-gradient(135deg, rgba(168,85,247,0.5), rgba(232,121,249,0.3), rgba(34,211,238,0.2));
    z-index: -1;
  }

  /* TOC progress indicator */
  .toc-progress {
    position: fixed;
    top: 0;
    left: 260px;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #a855f7, #e879f9, #22d3ee);
    transform-origin: left;
    z-index: 100;
    opacity: 0.8;
  }
</style>
</head>
<body>

<div class="layout">

  <!-- ══════════════════════════════════════
       SIDEBAR NAV
  ══════════════════════════════════════ -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-mark">🎬 CineRank</div>
      <div class="sidebar-logo-sub">Design System v1.0</div>
    </div>

    <nav>
      <div class="nav-section">
        <div class="nav-section-label">Foundation</div>
        <a href="#philosophy" class="nav-link"><span class="nav-dot" style="background:#a855f7"></span>Design Philosophy</a>
        <a href="#colors" class="nav-link"><span class="nav-dot" style="background:#e879f9"></span>Color System</a>
        <a href="#typography" class="nav-link"><span class="nav-dot" style="background:#22d3ee"></span>Typography</a>
        <a href="#spacing" class="nav-link"><span class="nav-dot" style="background:#34d399"></span>Spacing & Layout</a>
        <a href="#shadows" class="nav-link"><span class="nav-dot" style="background:#fbbf24"></span>Shadows & Depth</a>
      </div>

      <div class="nav-section">
        <div class="nav-section-label">Components</div>
        <a href="#components" class="nav-link"><span class="nav-dot" style="background:#fb7185"></span>Core Components</a>
        <a href="#cards" class="nav-link"><span class="nav-dot" style="background:#c084fc"></span>Card Patterns</a>
        <a href="#modals" class="nav-link"><span class="nav-dot" style="background:#818cf8"></span>Modals & Overlays</a>
        <a href="#animations" class="nav-link"><span class="nav-dot" style="background:#f472b6"></span>Motion & Animation</a>
        <a href="#skeletons" class="nav-link"><span class="nav-dot" style="background:#7dd3fc"></span>Loading States</a>
      </div>

      <div class="nav-section">
        <div class="nav-section-label">Pages</div>
        <a href="#page-identities" class="nav-link"><span class="nav-dot" style="background:#a3e635"></span>Page Identities</a>
        <a href="#hero-patterns" class="nav-link"><span class="nav-dot" style="background:#fb923c"></span>Hero Patterns</a>
        <a href="#layout-patterns" class="nav-link"><span class="nav-dot" style="background:#e879f9"></span>Layout Patterns</a>
      </div>

      <div class="nav-section">
        <div class="nav-section-label">Guidelines</div>
        <a href="#dos-donts" class="nav-link"><span class="nav-dot" style="background:#34d399"></span>Do's & Don'ts</a>
        <a href="#reusable-patterns" class="nav-link"><span class="nav-dot" style="background:#a855f7"></span>Reusable Patterns</a>
        <a href="#export" class="nav-link"><span class="nav-dot" style="background:#fbbf24"></span>Export Checklist</a>
      </div>
    </nav>
  </aside>

  <!-- ══════════════════════════════════════
       MAIN CONTENT
  ══════════════════════════════════════ -->
  <main class="main">

    <!-- HERO -->
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-eyebrow"><span class="hero-eyebrow-dot"></span> Design System Documentation</div>
        <h1 class="hero-title">
          CineRank<br/>
          <span class="hero-title-gradient">Frontend Bible</span>
        </h1>
        <p class="hero-desc">
          The complete design system, principles, patterns, and component library extracted from the most beautiful project you've built. Everything documented so you can replicate this quality in any future project.
        </p>
        <div class="hero-tags">
          <span class="hero-tag">React + Vite</span>
          <span class="hero-tag">Tailwind CSS</span>
          <span class="hero-tag">8 Pages</span>
          <span class="hero-tag">40+ Components</span>
          <span class="hero-tag">TMDB API</span>
          <span class="hero-tag">Dark Theme</span>
          <span class="hero-tag">Cinematic Aesthetic</span>
        </div>
      </div>
    </div>

    <!-- ══════════════════════
         1. DESIGN PHILOSOPHY
    ══════════════════════ -->
    <section class="section" id="philosophy">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#a855f7,#e879f9)"></div>
        <h2 class="section-title">Design Philosophy</h2>
        <span class="section-num">01</span>
      </div>

      <p>CineRank was built around one north star: <strong>every page should feel like it was designed for cinema, not for software.</strong> The goal was to make a web app that felt as cinematic and premium as the content it showcases.</p>

      <div class="principles-grid">
        <div class="principle-card">
          <div class="principle-num">01 —</div>
          <div class="principle-title">Cinematic First</div>
          <div class="principle-desc">Every page references the visual language of the content it serves. Film pages feel like opening titles. Award pages feel like ceremony programs. Celebrity pages feel like editorial magazines.</div>
        </div>
        <div class="principle-card">
          <div class="principle-num">02 —</div>
          <div class="principle-title">Each Page Has Its Own Identity</div>
          <div class="principle-desc">A different accent color, a different typographic mood, a different layout rhythm for every page. The navbar ties it all together, but each page is its own world with a distinct personality.</div>
        </div>
        <div class="principle-card">
          <div class="principle-num">03 —</div>
          <div class="principle-title">Content Is the Design</div>
          <div class="principle-desc">Movie posters, actor portraits, and backdrops ARE the visual design. The UI frames them without competing — using darkness, gradients, and negative space to let media breathe and dominate.</div>
        </div>
        <div class="principle-card">
          <div class="principle-num">04 —</div>
          <div class="principle-title">Depth Over Flatness</div>
          <div class="principle-desc">Layers of blur, glassmorphism, ambient backdrops, and gradient overlays create the sense of depth and cinematic atmosphere. Nothing is ever flat or purely solid.</div>
        </div>
        <div class="principle-card">
          <div class="principle-num">05 —</div>
          <div class="principle-title">Motion With Purpose</div>
          <div class="principle-desc">Every animation has a reason: hover lifts communicate interactivity, staggered card reveals create a sense of loading the world, and fade transitions between hero slides feel like a projector changing reels.</div>
        </div>
        <div class="principle-card">
          <div class="principle-num">06 —</div>
          <div class="principle-title">Information Hierarchy Through Scale</div>
          <div class="principle-desc">Hero sections dominate at viewport height. Section titles are bold serif. Cards are secondary. Meta text (year, rating) is minimal. You always know what's most important by size alone.</div>
        </div>
      </div>

      <div class="callout callout-tip">
        <strong>The Golden Rule:</strong> Before building any component, ask: "What emotion should a user feel when they see this?" — Excitement? Luxury? Anticipation? Then design backwards from that emotion using texture, scale, color temperature, and motion.
      </div>
    </section>

    <!-- ══════════════════════
         2. COLOR SYSTEM
    ══════════════════════ -->
    <section class="section" id="colors">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#e879f9,#a855f7)"></div>
        <h2 class="section-title">Color System</h2>
        <span class="section-num">02</span>
      </div>

      <h3>Global Background & Surface Scale</h3>
      <p>The background system uses a very dark near-black with a subtle purple tint — never pure black. This creates warmth and lets colored elements pop without harsh contrast.</p>

      <div class="palette-grid">
        <div class="color-card">
          <div class="color-swatch" style="background:#0a0a0f"><span class="color-swatch-label">#0a0a0f</span></div>
          <div class="color-info"><div class="color-name">Page Background</div><div class="color-hex">--bg-page</div><div class="color-use">Root background of every page</div></div>
        </div>
        <div class="color-card">
          <div class="color-swatch" style="background:#09090b"><span class="color-swatch-label">#09090b</span></div>
          <div class="color-info"><div class="color-name">Navbar BG</div><div class="color-hex">--bg-nav</div><div class="color-use">Navbar, with 80% opacity for glass effect</div></div>
        </div>
        <div class="color-card">
          <div class="color-swatch" style="background:#0d0d18"><span class="color-swatch-label">#0d0d18</span></div>
          <div class="color-info"><div class="color-name">Surface</div><div class="color-hex">--surface</div><div class="color-use">Card backgrounds, panels, right sidebars</div></div>
        </div>
        <div class="color-card">
          <div class="color-swatch" style="background:#1a1a2e"><span class="color-swatch-label">#1a1a2e</span></div>
          <div class="color-info"><div class="color-name">Surface Raised</div><div class="color-hex">--surface-raised</div><div class="color-use">Fallback images, elevated surfaces</div></div>
        </div>
        <div class="color-card">
          <div class="color-swatch" style="background:rgba(139,92,246,0.15)"><span class="color-swatch-label">purple/15%</span></div>
          <div class="color-info"><div class="color-name">Surface Active</div><div class="color-hex">--surface-active</div><div class="color-use">Active nav items, selected states</div></div>
        </div>
      </div>

      <h3>Primary Accent Palette</h3>
      <p>The global accent is <strong>purple → fuchsia</strong>. Used in the navbar, section headers, pagination, and cross-page interactive elements.</p>

      <div class="palette-grid">
        <div class="color-card">
          <div class="color-swatch" style="background:#a855f7"><span class="color-swatch-label">#a855f7</span></div>
          <div class="color-info"><div class="color-name">Purple 500</div><div class="color-hex">purple-500</div><div class="color-use">Primary accent, section bars, active states</div></div>
        </div>
        <div class="color-card">
          <div class="color-swatch" style="background:linear-gradient(135deg,#a855f7,#e879f9)"></div>
          <div class="color-info"><div class="color-name">Purple → Fuchsia</div><div class="color-hex">gradient-primary</div><div class="color-use">Primary buttons, active pills, gradients</div></div>
        </div>
        <div class="color-card">
          <div class="color-swatch" style="background:#7c3aed"></div>
          <div class="color-info"><div class="color-name">Violet 700</div><div class="color-hex">violet-700</div><div class="color-use">Button hover shadows, deep accents</div></div>
        </div>
        <div class="color-card">
          <div class="color-swatch" style="background:rgba(139,92,246,0.3)"></div>
          <div class="color-info"><div class="color-name">Purple/30% Alpha</div><div class="color-hex">purple-500/30</div><div class="color-use">Card borders on hover, subtle highlights</div></div>
        </div>
        <div class="color-card">
          <div class="color-swatch" style="background:rgba(139,92,246,0.08)"></div>
          <div class="color-info"><div class="color-name">Purple/8% Alpha</div><div class="color-hex">purple-500/8</div><div class="color-use">Hover backgrounds, gentle fills</div></div>
        </div>
      </div>

      <h3>Per-Page Accent Identity</h3>
      <p>Every page has a unique accent color so users instantly know where they are. This is the single most impactful design decision in CineRank.</p>

      <div class="page-cards">
        <div class="page-id-card" style="background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.3)">
          <div class="page-name" style="color:#c4b5fd">🎬 Movies</div>
          <div class="page-accent-pill" style="border-color:rgba(168,85,247,0.4);color:#c4b5fd;background:rgba(168,85,247,0.12)">Purple + Fuchsia</div>
          <div class="page-desc">The home accent. Purple-500 / Fuchsia-500. Sets the base identity for the whole app.</div>
        </div>
        <div class="page-id-card" style="background:rgba(139,92,246,0.06);border-color:rgba(139,92,246,0.25)">
          <div class="page-name" style="color:#a78bfa">📺 TV Shows</div>
          <div class="page-accent-pill" style="border-color:rgba(139,92,246,0.4);color:#a78bfa;background:rgba(139,92,246,0.12)">Violet</div>
          <div class="page-desc">One shade cooler than Movies. Violet-500 / Violet-400. Feels like prime-time TV blue.</div>
        </div>
        <div class="page-id-card" style="background:rgba(251,191,36,0.06);border-color:rgba(251,191,36,0.25)">
          <div class="page-name" style="color:#fde68a">🏆 Top Rated</div>
          <div class="page-accent-pill" style="border-color:rgba(251,191,36,0.4);color:#fde68a;background:rgba(251,191,36,0.12)">Gold / Amber</div>
          <div class="page-desc">Yellow-400 / Amber-500. Gold = prestige, rankings, the best. Never use yellow elsewhere.</div>
        </div>
        <div class="page-id-card" style="background:rgba(232,121,249,0.06);border-color:rgba(232,121,249,0.25)">
          <div class="page-name" style="color:#f5d0fe">🕐 Coming Soon</div>
          <div class="page-accent-pill" style="border-color:rgba(232,121,249,0.4);color:#f5d0fe;background:rgba(232,121,249,0.12)">Fuchsia + Cyan</div>
          <div class="page-desc">Fuchsia-500 for urgency, Cyan for contrast. The most electric duo — for hype and anticipation.</div>
        </div>
        <div class="page-id-card" style="background:rgba(251,113,133,0.06);border-color:rgba(251,113,133,0.25)">
          <div class="page-name" style="color:#fecdd3">🌟 Celebrities</div>
          <div class="page-accent-pill" style="border-color:rgba(251,113,133,0.4);color:#fecdd3;background:rgba(251,113,133,0.12)">Rose / Pink</div>
          <div class="page-desc">Rose-500 / Pink-600. Warm, human, glamorous. Matches the Hollywood editorial magazine feel.</div>
        </div>
        <div class="page-id-card" style="background:rgba(251,191,36,0.06);border-color:rgba(180,120,20,0.3)">
          <div class="page-name" style="color:#fef3c7">🏅 Awards</div>
          <div class="page-accent-pill" style="border-color:rgba(217,119,6,0.4);color:#fde68a;background:rgba(217,119,6,0.12)">Metallic Gold</div>
          <div class="page-desc">Deep amber bg (#0a0908). Yellow-600 → Amber-400 animated shimmer. Background is warm, not purple.</div>
        </div>
        <div class="page-id-card" style="background:rgba(52,211,153,0.06);border-color:rgba(52,211,153,0.25)">
          <div class="page-name" style="color:#a7f3d0">🎭 Community</div>
          <div class="page-accent-pill" style="border-color:rgba(52,211,153,0.4);color:#a7f3d0;background:rgba(52,211,153,0.12)">Emerald + Teal</div>
          <div class="page-desc">Emerald-500 / Teal-400. The green EXIT sign glow of an arthouse cinema. Warm analog feel.</div>
        </div>
        <div class="page-id-card" style="background:rgba(232,121,249,0.06);border-color:rgba(232,121,249,0.25)">
          <div class="page-name" style="color:#f5d0fe">✦ For You</div>
          <div class="page-accent-pill" style="border-color:rgba(232,121,249,0.4);color:#f5d0fe;background:rgba(232,121,249,0.12)">Fuchsia (Special)</div>
          <div class="page-desc">The only nav link styled in fuchsia instead of gray — signalling it's the premium personalisation feature.</div>
        </div>
      </div>

      <h3>Semantic Colors</h3>
      <table class="data-table">
        <thead><tr><th>Token</th><th>Color</th><th>Usage</th></tr></thead>
        <tbody>
          <tr><td>Rating / Score</td><td><code class="inline">yellow-400 / #fbbf24</code></td><td>Star ratings, vote averages — always yellow, on every page</td></tr>
          <tr><td>Out Now / Released</td><td><code class="inline">green-400 / #34d399</code></td><td>Release status badges, "Out Now" indicators</td></tr>
          <tr><td>Imminent / Tomorrow</td><td><code class="inline">red-400 / #f87171</code></td><td>Films releasing within 24h, urgent urgency strips</td></tr>
          <tr><td>This Week</td><td><code class="inline">orange-400 / #fb923c</code></td><td>Films releasing within 7 days</td></tr>
          <tr><td>Saved to Watchlist</td><td><code class="inline">purple-300 / #d8b4fe</code></td><td>Filled bookmark icon state — consistent globally</td></tr>
          <tr><td>Error / Remove</td><td><code class="inline">red-500 / #ef4444</code></td><td>Error states, destructive actions only</td></tr>
          <tr><td>Live / Active feed</td><td><code class="inline">emerald-400 animate-pulse</code></td><td>Live badges, community activity dots</td></tr>
        </tbody>
      </table>

      <div class="callout callout-warn">
        <strong>Color Discipline:</strong> Never reuse a page accent color on a different page. If you see amber on anything other than the Awards / Top Rated pages, it breaks the identity system. Each color owns its page.
      </div>
    </section>

    <!-- ══════════════════════
         3. TYPOGRAPHY
    ══════════════════════ -->
    <section class="section" id="typography">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#22d3ee,#818cf8)"></div>
        <h2 class="section-title">Typography</h2>
        <span class="section-num">03</span>
      </div>

      <p>CineRank uses a <strong>dual-font strategy</strong>: a <em>display serif</em> for hero headings and large editorial moments, and the <em>system sans-serif stack</em> for all body text and UI copy. The serif brings cinematic gravitas; the sans-serif keeps UI crisp and scannable.</p>

      <div class="type-specimen">
        <div class="type-role">Display / Hero Headlines — Georgia Serif</div>
        <div style="font-family:'Georgia',serif;font-size:48px;font-weight:900;letter-spacing:-0.025em;line-height:0.9;color:white;margin-bottom:8px">Awards Central</div>
        <div style="font-family:'Georgia',serif;font-size:36px;font-weight:900;letter-spacing:-0.02em;color:white;line-height:0.95">The Screening Room</div>
        <div class="type-example-label">font-family: 'Georgia', 'Times New Roman', serif — font-weight: 900 — letter-spacing: -0.025em</div>
      </div>

      <div class="type-specimen">
        <div class="type-role">Section Headers — System Sans Bold</div>
        <div style="font-size:22px;font-weight:800;color:white;letter-spacing:-0.01em;margin-bottom:6px">Upcoming Releases</div>
        <div style="font-size:18px;font-weight:700;color:white;letter-spacing:-0.005em">Best Picture Contenders</div>
        <div class="type-example-label">text-xl/2xl — font-black — tracking-tight</div>
      </div>

      <div class="type-specimen">
        <div class="type-role">Card Titles — Serif for Premium, Sans for Standard</div>
        <div style="font-family:'Georgia',serif;font-size:16px;font-weight:700;color:white;margin-bottom:4px">Oppenheimer</div>
        <div style="font-size:14px;font-weight:600;color:white;opacity:0.85">The Bear — Season 3</div>
        <div class="type-example-label">Serif cards: AwardsPage, CelebritiesPage, CommunityPage. Sans cards: MoviesPage, TVPage</div>
      </div>

      <div class="type-specimen">
        <div class="type-role">Meta / Secondary Text</div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:8px">
          <span style="font-size:12px;color:#8b85a8">2024 · Drama · 3h</span>
          <span style="font-size:11px;color:#4a4568;font-family:'Courier New',monospace">#1 Trending</span>
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#6b7280">Coming Soon</span>
        </div>
        <div class="type-example-label">text-xs/[10px] — text-gray-500/600 — uppercase tracking-wider for labels</div>
      </div>

      <h3>Type Scale Reference</h3>
      <table class="data-table">
        <thead><tr><th>Role</th><th>Size</th><th>Weight</th><th>Font</th><th>Where Used</th></tr></thead>
        <tbody>
          <tr><td>Hero Title</td><td><code class="inline">clamp(2.8rem, 7vw, 5.5rem)</code></td><td>900</td><td>Serif</td><td>Page hero sections, carousel titles</td></tr>
          <tr><td>Page Title</td><td><code class="inline">clamp(2.5rem, 5.5vw, 4.5rem)</code></td><td>900</td><td>Serif</td><td>ForYouPage, CommunityPage heroes</td></tr>
          <tr><td>Section Title</td><td><code class="inline">text-xl / 1.25rem</code></td><td>800</td><td>Sans</td><td>Section headers throughout</td></tr>
          <tr><td>Card Title</td><td><code class="inline">text-sm / 0.875rem</code></td><td>700</td><td>Serif or Sans</td><td>Movie/show card titles</td></tr>
          <tr><td>UI Label</td><td><code class="inline">text-xs / 0.75rem</code></td><td>500-600</td><td>Sans</td><td>Button labels, badge text</td></tr>
          <tr><td>Micro Label</td><td><code class="inline">text-[10px]</code></td><td>700</td><td>Sans</td><td>Badges, status chips, category labels</td></tr>
          <tr><td>Mono / Code</td><td><code class="inline">text-[10px]-text-sm</code></td><td>700</td><td>Monospace</td><td>Countdowns, rank numbers, codes</td></tr>
          <tr><td>Body / Overview</td><td><code class="inline">text-sm / 0.875rem</code></td><td>400</td><td>Sans</td><td>Movie overviews, bios, descriptions</td></tr>
        </tbody>
      </table>

      <h3>Key Typography Rules</h3>
      <ul class="checklist">
        <li><span class="check-icon">✓</span><div>Always use <code class="inline">letter-spacing: -0.02em to -0.025em</code> on large serif headlines — it tightens them and makes them look designed, not default.</div></li>
        <li><span class="check-icon">✓</span><div>Use <code class="inline">line-height: 0.88–0.95</code> on hero titles (not 1.0+) — condensed line height reads as premium and editorial.</div></li>
        <li><span class="check-icon">✓</span><div>Uppercase micro-labels always get <code class="inline">tracking-widest (0.12em+)</code> — lowercase labels look informal.</div></li>
        <li><span class="check-icon">✓</span><div>Use <code class="inline">font-black (900)</code> for all display text, <code class="inline">font-bold (700)</code> for UI, <code class="inline">font-medium (500)</code> for secondary text — never 400 on dark backgrounds for small text.</div></li>
        <li><span class="cross-icon">✗</span><div>Never use Inter, Roboto, or Arial as display fonts. They kill the cinematic feel instantly.</div></li>
        <li><span class="cross-icon">✗</span><div>Never use <code class="inline">line-height: 1.5+</code> on headings — it makes them look like body text.</div></li>
      </ul>
    </section>

    <!-- ══════════════════════
         4. SPACING & LAYOUT
    ══════════════════════ -->
    <section class="section" id="spacing">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#34d399,#22d3ee)"></div>
        <h2 class="section-title">Spacing & Layout</h2>
        <span class="section-num">04</span>
      </div>

      <h3>The Spacing Scale</h3>
      <div class="spacing-scale">
        <div class="spacing-row"><span class="spacing-label">px / 0.5</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:2px"></div></div><span class="spacing-px">1–2px</span></div>
        <div class="spacing-row"><span class="spacing-label">1 / 4px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:16px"></div></div><span class="spacing-px">4px</span></div>
        <div class="spacing-row"><span class="spacing-label">1.5 / 6px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:24px"></div></div><span class="spacing-px">6px</span></div>
        <div class="spacing-row"><span class="spacing-label">2 / 8px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:32px"></div></div><span class="spacing-px">8px</span></div>
        <div class="spacing-row"><span class="spacing-label">3 / 12px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:48px"></div></div><span class="spacing-px">12px</span></div>
        <div class="spacing-row"><span class="spacing-label">4 / 16px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:64px"></div></div><span class="spacing-px">16px</span></div>
        <div class="spacing-row"><span class="spacing-label">5 / 20px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:80px"></div></div><span class="spacing-px">20px</span></div>
        <div class="spacing-row"><span class="spacing-label">6 / 24px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:96px"></div></div><span class="spacing-px">24px</span></div>
        <div class="spacing-row"><span class="spacing-label">8 / 32px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:128px"></div></div><span class="spacing-px">32px</span></div>
        <div class="spacing-row"><span class="spacing-label">10 / 40px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:160px"></div></div><span class="spacing-px">40px</span></div>
        <div class="spacing-row"><span class="spacing-label">14 / 56px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:224px"></div></div><span class="spacing-px">56px</span></div>
        <div class="spacing-row"><span class="spacing-label">16 / 64px</span><div class="spacing-bar-wrap"><div class="spacing-bar" style="width:256px"></div></div><span class="spacing-px">64px</span></div>
      </div>

      <h3>Layout Containers</h3>
      <table class="data-table">
        <thead><tr><th>Element</th><th>Class / Value</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Max content width</td><td><code class="inline">max-w-7xl mx-auto</code></td><td>80rem / 1280px — used on every page's main content wrapper</td></tr>
          <tr><td>Section padding</td><td><code class="inline">px-6 py-8 to py-10</code></td><td>24px horizontal, 32–40px vertical for most sections</td></tr>
          <tr><td>Navbar height</td><td><code class="inline">h-16 (64px)</code></td><td>All pages offset with <code class="inline">pt-16</code></td></tr>
          <tr><td>Hero height</td><td><code class="inline">85vh, max 700px, min 520px</code></td><td>Carousel heroes. Single-film heroes use 420–480px fixed</td></tr>
          <tr><td>Card grid gap</td><td><code class="inline">gap-4</code></td><td>16px between cards in all grids</td></tr>
          <tr><td>Section gap</td><td><code class="inline">space-y-8 to space-y-14</code></td><td>Between major sections within a page</td></tr>
          <tr><td>Grid columns</td><td><code class="inline">grid-cols-2 sm:3 md:4 lg:5</code></td><td>Standard movie card grid — always responsive</td></tr>
        </tbody>
      </table>

      <h3>The Two-Column Page Pattern</h3>
      <p>Used on Community and Awards pages. The content-to-sidebar ratio is always <code class="inline">1fr 320px</code> — never equal columns. The sidebar is always exactly 320px for a consistent reading pattern.</p>
      <pre><code><span class="code-comment">/* Standard 2-col layout with fixed sidebar */</span>
<span class="code-key">className</span>=<span class="code-str">"grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8"</span></code></pre>

      <h3>Horizontal Scroll Rows</h3>
      <p>Used throughout: TrendingToday, PopularMovies genre rows, celebrity strips, cast scrolls. Always hide the scrollbar with:</p>
      <pre><code><span class="code-comment">/* In every component with horizontal scroll */</span>
&lt;<span class="code-tag">style</span>&gt;<span class="code-str">{'.scrollbar-hide::-webkit-scrollbar{display:none}'}</span>&lt;/<span class="code-tag">style</span>&gt;

<span class="code-comment">/* Apply to the scrollable div */</span>
<span class="code-key">className</span>=<span class="code-str">"flex gap-4 overflow-x-auto scrollbar-hide pb-2"</span></code></pre>
    </section>

    <!-- ══════════════════════
         5. SHADOWS & DEPTH
    ══════════════════════ -->
    <section class="section" id="shadows">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#fbbf24,#fb923c)"></div>
        <h2 class="section-title">Shadows & Depth</h2>
        <span class="section-num">05</span>
      </div>

      <p>Shadows in CineRank are always <strong>colored, not black</strong>. Using the page accent color as the shadow tint ties the depth to the brand and creates atmosphere rather than just separation.</p>

      <div class="shadow-grid">
        <div class="shadow-box" style="box-shadow:0 4px 16px rgba(139,92,246,0.2)">
          <div class="shadow-name">Card Hover</div>
          <div class="shadow-code">shadow-xl<br/>shadow-purple-900/30</div>
        </div>
        <div class="shadow-box" style="box-shadow:0 8px 24px rgba(139,92,246,0.35)">
          <div class="shadow-name">Primary Button</div>
          <div class="shadow-code">shadow-lg<br/>shadow-purple-900/50</div>
        </div>
        <div class="shadow-box" style="box-shadow:0 16px 48px rgba(139,92,246,0.5)">
          <div class="shadow-name">Modal</div>
          <div class="shadow-code">shadow-2xl<br/>shadow-purple-900/50</div>
        </div>
        <div class="shadow-box" style="box-shadow:0 0 24px rgba(168,85,247,0.4)">
          <div class="shadow-name">Glow Accent</div>
          <div class="shadow-code">Active thumbnail<br/>ring-1 + shadow-fuchsia</div>
        </div>
        <div class="shadow-box" style="box-shadow:0 2px 8px rgba(0,0,0,0.6)">
          <div class="shadow-name">Subtle Lift</div>
          <div class="shadow-code">Posters, profile pics<br/>shadow-lg (neutral)</div>
        </div>
        <div class="shadow-box" style="box-shadow:0 0 40px rgba(251,191,36,0.25)">
          <div class="shadow-name">Gold (Awards)</div>
          <div class="shadow-code">Award page only<br/>shadow-yellow-500/25</div>
        </div>
      </div>

      <h3>The Glassmorphism Navbar</h3>
      <p>The navbar uses the exact same pattern throughout the app. Never change it:</p>
      <pre><code><span class="code-comment">/* Navbar glass effect */</span>
<span class="code-key">backdrop-blur-md bg-[#09090b]/80 border-b border-purple-900/30</span>

<span class="code-comment">/* Gradient accent line below navbar */</span>
<span class="code-str">h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70</span></code></pre>

      <h3>Layered Backdrop Pattern</h3>
      <p>Every hero section uses 3 layers to create cinematic depth:</p>
      <pre><code><span class="code-comment">/* Layer 1: Ambient blur — blurred at 2x scale, very low opacity */</span>
<span class="code-key">className</span>=<span class="code-str">"absolute inset-0 object-cover scale-110 blur-2xl opacity-25"</span>

<span class="code-comment">/* Layer 2: Crisp image at medium opacity */</span>
<span class="code-key">className</span>=<span class="code-str">"absolute inset-0 object-cover opacity-45"</span>

<span class="code-comment">/* Layer 3: Gradient overlays for readability */</span>
<span class="code-str">"bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/55 to-transparent"</span>  <span class="code-comment">// bottom fade</span>
<span class="code-str">"bg-gradient-to-r from-[#0a0a0f]/95 via-[#0a0a0f]/35 to-transparent"</span> <span class="code-comment">// left fade for text</span></code></pre>

      <div class="callout callout-good">
        <strong>Rule:</strong> Text on top of an image always needs at minimum the bottom gradient (from-black via-black/50 to-transparent). Never place white text directly on an image without a gradient — it becomes unreadable on light frames.
      </div>
    </section>

    <!-- ══════════════════════
         6. CORE COMPONENTS
    ══════════════════════ -->
    <section class="section" id="components">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#fb7185,#e879f9)"></div>
        <h2 class="section-title">Core Components</h2>
        <span class="section-num">06</span>
      </div>

      <h3>Buttons</h3>
      <div class="component-grid">
        <div class="component-card">
          <div class="component-label">Primary Action</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary">▶ Watch Trailer</button>
            <button class="btn btn-primary" style="background:linear-gradient(135deg,#fbbf24,#d97706);box-shadow:0 8px 24px rgba(251,191,36,0.35)">🏆 View Winners</button>
          </div>
          <p style="margin-top:12px;font-size:11px">bg-gradient-to-r + shadow-lg with accent color. hover:scale-[1.02] hover:from/to lighter shade.</p>
        </div>
        <div class="component-card">
          <div class="component-label">Secondary / Ghost</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-secondary">🔖 Add to Watchlist</button>
            <button class="btn btn-ghost">Browse all →</button>
          </div>
          <p style="margin-top:12px;font-size:11px">bg-white/8 border-white/15 for secondary. bg-transparent border-accent/30 for ghost.</p>
        </div>
      </div>

      <h3>Badges & Chips</h3>
      <div class="pill-row">
        <span class="badge badge-purple">🎬 Movie</span>
        <span class="badge badge-violet">📺 TV Show</span>
        <span class="badge badge-emerald"><span style="width:6px;height:6px;border-radius:50%;background:#34d399;display:inline-block;animation:pulse 2s infinite"></span> Live</span>
        <span class="badge badge-rose">🌶 Hot Take</span>
        <span class="badge badge-amber">🏆 97th</span>
        <span class="badge badge-cyan">✦ For You</span>
        <span class="badge" style="background:rgba(34,197,94,0.15);border-color:rgba(34,197,94,0.3);color:#86efac">Out Now</span>
        <span class="badge" style="background:rgba(239,68,68,0.2);border-color:rgba(239,68,68,0.4);color:#fca5a5">Tomorrow!</span>
      </div>
      <p>All badges share the same structure: <code class="inline">text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider</code>. Only the color changes.</p>

      <h3>Section Headers (The "Accent Bar" Pattern)</h3>
      <p>The single most reused pattern in the entire app. A 1px wide colored bar on the left, bold title, and a count badge:</p>
      <div style="display:flex;align-items:center;gap:14px;background:var(--surface);padding:16px 20px;border-radius:12px;margin:12px 0">
        <div style="width:3px;height:28px;background:linear-gradient(180deg,#a855f7,#e879f9);border-radius:2px;flex-shrink:0"></div>
        <span style="font-weight:800;font-size:18px;color:white">Trending Today</span>
        <span class="badge badge-purple">10 films</span>
      </div>
      <pre><code><span class="code-comment">/* The section header pattern — use on every section */</span>
&lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"flex items-center gap-3 mb-6"</span>&gt;
  &lt;<span class="code-tag">span</span> <span class="code-key">className</span>=<span class="code-str">"w-1 h-7 bg-purple-500 rounded-full"</span> /&gt;   <span class="code-comment">{/* accent bar */}</span>
  &lt;<span class="code-tag">h2</span> <span class="code-key">className</span>=<span class="code-str">"text-white font-bold text-xl"</span>&gt;Section Name&lt;/<span class="code-tag">h2</span>&gt;
  &lt;<span class="code-tag">span</span> <span class="code-key">className</span>=<span class="code-str">"bg-purple-500/15 border border-purple-500/25 text-purple-400 text-xs px-2.5 py-0.5 rounded-full font-semibold"</span>&gt;
    {count} items
  &lt;/<span class="code-tag">span</span>&gt;
&lt;/<span class="code-tag">div</span>&gt;</code></pre>

      <h3>The ImageOrFallback Component</h3>
      <p>Used in every single component in the app. Never render a raw <code class="inline">&lt;img&gt;</code> — always wrap it:</p>
      <pre><code><span class="code-comment">/* Every component defines its own local copy of this */</span>
<span class="code-key">const</span> <span class="code-class">ImageOrFallback</span> = ({ src, alt, className }) =&gt; {
  <span class="code-key">const</span> [error, setError] = <span class="code-class">useState</span>(<span class="code-val">false</span>);
  <span class="code-key">if</span> (!src || error) {
    <span class="code-key">return</span> (
      &lt;<span class="code-tag">div</span> className={<span class="code-str">`${className} bg-[#1a1a2e] relative overflow-hidden`</span>}&gt;
        <span class="code-comment">/* Diagonal repeating watermark text + centered label */</span>
        &lt;<span class="code-tag">div</span> style={{ transform: <span class="code-str">'rotate(-35deg) scale(2)'</span> }}&gt;
          <span class="code-comment">/* 80x "Illustration Not Available •" spans */</span>
        &lt;/<span class="code-tag">div</span>&gt;
      &lt;/<span class="code-tag">div</span>&gt;
    );
  }
  <span class="code-key">return</span> &lt;<span class="code-tag">img</span> src={src} alt={alt} className={className} onError={() =&gt; setError(<span class="code-val">true</span>)} /&gt;;
};</code></pre>
    </section>

    <!-- ══════════════════════
         7. CARD PATTERNS
    ══════════════════════ -->
    <section class="section" id="cards">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#c084fc,#818cf8)"></div>
        <h2 class="section-title">Card Patterns</h2>
        <span class="section-num">07</span>
      </div>

      <h3>The Standard Movie Card</h3>
      <div class="component-grid">
        <div>
          <div class="mock-card" style="max-width:180px">
            <div class="mock-card-img" style="height:240px;position:relative">
              <div style="position:absolute;top:8px;left:8px;font-size:10px;font-weight:800;background:rgba(0,0,0,0.7);color:white;padding:2px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.1)">#1</div>
              <div style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:11px">🔖</div>
              <div style="position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,#0d0d18,transparent)"></div>
              <div style="position:absolute;bottom:8px;left:8px;width:36px;height:52px;border-radius:8px;background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.4)"></div>
            </div>
            <div class="mock-card-body">
              <div class="mock-card-title">Movie Title</div>
              <div style="display:flex;gap:4px;margin-bottom:8px">
                <span style="font-size:9px;padding:2px 6px;border-radius:100px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);color:#c4b5fd">Action</span>
                <span style="font-size:9px;padding:2px 6px;border-radius:100px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:#6b7280">2024</span>
              </div>
              <div class="mock-card-meta" style="display:flex;align-items:center;gap:4px">⭐ <span style="color:#fbbf24;font-weight:700;font-size:11px">8.7</span></div>
            </div>
          </div>
        </div>
        <div>
          <h3 style="margin-top:0">Card Anatomy Rules</h3>
          <ul class="checklist">
            <li><span class="check-icon">✓</span>Rank badge top-left: <code class="inline">bg-black/80 backdrop-blur-sm</code></li>
            <li><span class="check-icon">✓</span>Watchlist btn top-right: <code class="inline">opacity-0 group-hover:opacity-100</code></li>
            <li><span class="check-icon">✓</span>Gradient bottom fade always from page bg color</li>
            <li><span class="check-icon">✓</span>Poster thumbnail bleeds out of image area with <code class="inline">-mt-8</code></li>
            <li><span class="check-icon">✓</span>Hover: <code class="inline">hover:-translate-y-1.5 hover:border-purple-500/40</code></li>
            <li><span class="check-icon">✓</span>Default border: <code class="inline">border-purple-900/30</code></li>
            <li><span class="check-icon">✓</span>Image scales on hover: <code class="inline">group-hover:scale-105 duration-500</code></li>
            <li><span class="cross-icon">✗</span>Never use box borders without the <code class="inline">group</code> parent pattern</li>
          </ul>
        </div>
      </div>

      <h3>The Tooltip Pattern</h3>
      <pre><code><span class="code-comment">/* Tooltip on any card — appears on hover */</span>
&lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"absolute ... opacity-0 group-hover:opacity-100 transition-opacity duration-200
           bg-[#13131f] border border-purple-500/25 rounded-2xl p-3 shadow-xl"</span>&gt;
  <span class="code-comment">/* Tooltip content */</span>
&lt;/<span class="code-tag">div</span>&gt;</code></pre>

      <h3>Skeleton Loading Cards</h3>
      <p>Skeletons must match the exact shape of the final content. Never use generic rectangles:</p>
      <pre><code><span class="code-comment">/* Always use the page accent color for skeleton gradient */</span>
<span class="code-key">const</span> GridSkeleton = () =&gt; (
  &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"bg-[#0d0d18] border border-purple-900/20 rounded-2xl overflow-hidden animate-pulse"</span>&gt;
    &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"h-[260px] bg-gradient-to-br from-purple-900/10 via-purple-800/20 to-purple-900/10"</span> /&gt;
    &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"p-3.5 space-y-2"</span>&gt;
      &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"h-3 bg-purple-900/20 rounded w-3/4"</span> /&gt;
      &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"h-2 bg-purple-900/10 rounded w-1/2"</span> /&gt;
    &lt;/<span class="code-tag">div</span>&gt;
  &lt;/<span class="code-tag">div</span>&gt;
);</code></pre>
    </section>

    <!-- ══════════════════════
         8. MODALS & OVERLAYS
    ══════════════════════ -->
    <section class="section" id="modals">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#818cf8,#c084fc)"></div>
        <h2 class="section-title">Modals & Overlays</h2>
        <span class="section-num">08</span>
      </div>

      <h3>The Modal Template</h3>
      <p>Every modal in CineRank follows the same structural pattern. Only content and accent color change:</p>
      <pre><code><span class="code-comment">/* Standard modal structure */</span>
&lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"fixed inset-0 z-50 flex items-center justify-center p-4"</span> onClick={onClose}&gt;
  
  <span class="code-comment">/* Backdrop: always black/85 + backdrop-blur-md (NOT xl — too heavy) */</span>
  &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"absolute inset-0 bg-black/85 backdrop-blur-md"</span> /&gt;
  
  &lt;<span class="code-tag">div</span>
    <span class="code-key">className</span>=<span class="code-str">"relative z-10 bg-[#0d0d18] border border-purple-900/40 rounded-3xl
             overflow-hidden shadow-2xl shadow-purple-900/50 max-w-2xl w-full"</span>
    onClick={e =&gt; e.stopPropagation()}  <span class="code-comment">/* Prevent backdrop click */</span>
  &gt;
    <span class="code-comment">/* Backdrop hero at top (220px) */</span>
    <span class="code-comment">/* Scrollable body with -mt-14 poster overlap trick */</span>
    <span class="code-comment">/* Footer with CTA buttons */</span>
  &lt;/<span class="code-tag">div</span>&gt;
&lt;/<span class="code-tag">div</span>&gt;</code></pre>

      <h3>The Search Overlay</h3>
      <p>The search overlay uses <code class="inline">opacity-0 pointer-events-none</code> (not <code class="inline">display:none</code>) so it can animate in smoothly:</p>
      <pre><code><span class="code-key">className</span>={<span class="code-str">`fixed inset-0 z-[100] transition-all duration-300
  ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`</span>}</code></pre>

      <h3>Z-Index Scale</h3>
      <table class="data-table">
        <thead><tr><th>Layer</th><th>z-index</th><th>Elements</th></tr></thead>
        <tbody>
          <tr><td>Page content</td><td>0–10</td><td>Cards, sections, images</td></tr>
          <tr><td>Card overlays</td><td>10–20</td><td>Badges, hover tooltips, rank numbers</td></tr>
          <tr><td>Sticky controls</td><td>20–30</td><td>Sticky filter bars, sticky tabs</td></tr>
          <tr><td>Navbar</td><td>50</td><td>Always <code class="inline">z-50</code></td></tr>
          <tr><td>Search overlay</td><td>100</td><td><code class="inline">z-[100]</code></td></tr>
          <tr><td>Detail modals</td><td>200</td><td><code class="inline">z-[200]</code> so it sits above search</td></tr>
        </tbody>
      </table>
    </section>

    <!-- ══════════════════════
         9. ANIMATION
    ══════════════════════ -->
    <section class="section" id="animations">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#f472b6,#fb7185)"></div>
        <h2 class="section-title">Motion & Animation</h2>
        <span class="section-num">09</span>
      </div>

      <div class="anim-grid">
        <div class="anim-box">
          <div class="anim-demo demo-pulse"></div>
          <div class="anim-name">Pulse</div>
          <div class="anim-desc">Live badges, status dots, trending indicators</div>
        </div>
        <div class="anim-box">
          <div class="anim-demo demo-spin"></div>
          <div class="anim-name">Spin</div>
          <div class="anim-desc">Loading state in search input, data fetches</div>
        </div>
        <div class="anim-box">
          <div class="anim-demo demo-fade"></div>
          <div class="anim-name">Fade</div>
          <div class="anim-desc">Hero carousel transitions — 350–500ms ease</div>
        </div>
        <div class="anim-box">
          <div class="anim-demo demo-slide"></div>
          <div class="anim-name">Slide Up</div>
          <div class="anim-desc">Cards entering on page/tab load — staggered</div>
        </div>
        <div class="anim-box">
          <div class="anim-demo demo-shimmer" style="border-radius:12px"></div>
          <div class="anim-name">Shimmer</div>
          <div class="anim-desc">Skeleton loading state — 200% bg-size sweep</div>
        </div>
        <div class="anim-box">
          <div class="anim-demo demo-glow"></div>
          <div class="anim-name">Glow Pulse</div>
          <div class="anim-desc">Active hero thumbnail, neon borders</div>
        </div>
      </div>

      <h3>Staggered Card Entrance (The Cascade Effect)</h3>
      <p>When a grid of cards appears, they don't all load at once. Each card delays slightly, creating a cascade that feels alive:</p>
      <pre><code><span class="code-comment">/* CSS keyframe — define once in a &lt;style&gt; tag in the component */</span>
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card-enter { animation: fadeSlideUp 0.4s ease forwards; opacity: 0; }

<span class="code-comment">/* Apply with staggered animation-delay on each card */</span>
{items.map((item, i) =&gt; (
  &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"card-enter"</span> style={{ animationDelay: `${i * 40}ms` }}&gt;
    &lt;<span class="code-class">Card</span> /&gt;
  &lt;/<span class="code-tag">div</span>&gt;
))}</code></pre>

      <h3>The Gold Shimmer Text Animation (Awards Page)</h3>
      <pre><code><span class="code-comment">/* Animated metallic text — Awards page hero title */</span>
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
}</code></pre>

      <h3>Transition Timing Reference</h3>
      <table class="data-table">
        <thead><tr><th>Interaction</th><th>Duration</th><th>Easing</th></tr></thead>
        <tbody>
          <tr><td>All micro-interactions (hover, focus)</td><td><code class="inline">200ms</code></td><td><code class="inline">ease</code></td></tr>
          <tr><td>Card hover lift + border glow</td><td><code class="inline">200–300ms</code></td><td><code class="inline">ease</code></td></tr>
          <tr><td>Image scale on card hover</td><td><code class="inline">400–500ms</code></td><td><code class="inline">ease</code></td></tr>
          <tr><td>Hero carousel slide/fade</td><td><code class="inline">450–500ms</code></td><td><code class="inline">ease</code></td></tr>
          <tr><td>Modal open/close</td><td><code class="inline">300ms</code></td><td><code class="inline">ease</code></td></tr>
          <tr><td>Search overlay</td><td><code class="inline">300ms</code></td><td><code class="inline">ease</code></td></tr>
          <tr><td>Stagger per card</td><td><code class="inline">35–80ms</code> delay step</td><td>Card entrance only</td></tr>
          <tr><td>Progress bar fill</td><td><code class="inline">500–700ms</code></td><td><code class="inline">ease</code></td></tr>
        </tbody>
      </table>
    </section>

    <!-- ══════════════════════
         10. LOADING STATES
    ══════════════════════ -->
    <section class="section" id="skeletons">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#7dd3fc,#818cf8)"></div>
        <h2 class="section-title">Loading States</h2>
        <span class="section-num">10</span>
      </div>

      <p>Every async data fetch in CineRank shows a skeleton loader that <strong>exactly matches the shape of the final content</strong>. The skeleton uses the page's accent color at very low opacity so it feels intentional.</p>

      <div class="callout callout-rule">
        <strong>Rule:</strong> Skeleton color = page accent + very low opacity. Movies page: <code class="inline">from-purple-900/10 via-purple-800/20</code>. Awards page: <code class="inline">from-yellow-900/10 via-yellow-700/15</code>. Community page: <code class="inline">from-emerald-900/10 via-teal-700/12</code>. Never use generic gray skeletons.
      </div>

      <h3>Skeleton Shimmer Class</h3>
      <pre><code><span class="code-comment">/* Generic shimmer — reuse in every page */</span>
<span class="code-key">const</span> <span class="code-class">Shimmer</span> = ({ className }) =&gt; (
  &lt;<span class="code-tag">div</span> className={<span class="code-str">`${className} bg-gradient-to-r
    from-purple-900/10 via-purple-800/20 to-purple-900/10
    animate-pulse rounded-xl`</span>} /&gt;
);</code></pre>

      <h3>Page-Level Loading</h3>
      <p>Heroes get a full-height shimmer while the rest of the page below waits. Never block the entire screen with a spinner — always show at least the skeleton shape:</p>
      <pre><code>{loading
  ? &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"w-full h-[420px] bg-gradient-to-br from-purple-900/10 via-purple-800/5 to-[#0a0a0f] animate-pulse"</span> /&gt;
  : &lt;<span class="code-class">HeroSpotlight</span> movie={heroMovie} /&gt;
}</code></pre>
    </section>

    <!-- ══════════════════════
         11. PAGE IDENTITIES
    ══════════════════════ -->
    <section class="section" id="page-identities">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#a3e635,#34d399)"></div>
        <h2 class="section-title">Page Identities</h2>
        <span class="section-num">11</span>
      </div>

      <p>Each page was designed with a distinct <em>aesthetic persona</em> — a concept beyond just a color. Here's the full design brief for each:</p>

      <table class="data-table">
        <thead><tr><th>Page</th><th>Aesthetic Persona</th><th>Unique Feature</th><th>Background</th></tr></thead>
        <tbody>
          <tr><td>Movies</td><td>Cinema marquee / Hollywood foyer</td><td>Left/right split hero + thumbnail strip</td><td><code class="inline">#0a0a0f</code></td></tr>
          <tr><td>TV Shows</td><td>Same as Movies, violet-shifted</td><td>Green "LIVE" badge on airing panel</td><td><code class="inline">#0a0a0f</code></td></tr>
          <tr><td>Top Rated</td><td>Hall of fame / championship podium</td><td>Gold/silver/bronze podium component</td><td><code class="inline">#0a0a0f</code></td></tr>
          <tr><td>Coming Soon</td><td>Mission control countdown</td><td>Auto-rotating hero carousel + urgency strip</td><td><code class="inline">#0a0812</code> (warmer)</td></tr>
          <tr><td>Celebrities</td><td>Editorial magazine / Hollywood noir</td><td>Masonry height-varying grid + scrolling marquee</td><td><code class="inline">#0a0908</code></td></tr>
          <tr><td>Awards</td><td>Oscar ceremony program / Variety magazine</td><td>Animated gold shimmer headline text</td><td><code class="inline">#0a0908</code> (warmest)</td></tr>
          <tr><td>Community</td><td>Arthouse cinema velvet seats</td><td>Film grain overlay + Georgia serif throughout</td><td><code class="inline">#09080a</code></td></tr>
          <tr><td>For You</td><td>Personal AI cinema concierge</td><td>11 mood cards with gradient glow + reasoning text</td><td><code class="inline">#0a0a0f</code></td></tr>
          <tr><td>Watchlist</td><td>Personal film journal</td><td>Grid/list toggle + grouping + detail modal</td><td><code class="inline">#0a0a0f</code></td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <strong>Background subtlety:</strong> Notice that not all pages use the exact same background. The Awards/Community pages use slightly warmer darks (#0a0908, #09080a) while Coming Soon uses a purple-tinted dark (#0a0812). These 1–2% tonal shifts dramatically reinforce each page's feel without being noticeable to users.
      </div>
    </section>

    <!-- ══════════════════════
         12. HERO PATTERNS
    ══════════════════════ -->
    <section class="section" id="hero-patterns">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#fb923c,#fbbf24)"></div>
        <h2 class="section-title">Hero Patterns</h2>
        <span class="section-num">12</span>
      </div>

      <h3>Pattern 1: Full-Viewport Auto-Rotating Carousel</h3>
      <p>Used on Coming Soon. 5 films cycle every 7s. Key features:</p>
      <ul class="checklist">
        <li><span class="check-icon">✓</span>3-layer backdrop (blur ambient + crisp image + gradients)</li>
        <li><span class="check-icon">✓</span>Scanline texture overlay at <code class="inline">opacity-[0.025]</code></li>
        <li><span class="check-icon">✓</span>Floating gradient orbs behind content for depth</li>
        <li><span class="check-icon">✓</span>Poster thumbnail strip bottom-right (desktop only)</li>
        <li><span class="check-icon">✓</span>Content fades with <code class="inline">opacity + translate-y</code> during slide transition</li>
        <li><span class="check-icon">✓</span><code class="inline">clearInterval</code> on manual navigation, restart after</li>
      </ul>

      <h3>Pattern 2: Left-Right Split Banner</h3>
      <p>Used on Movies/TV. Fixed height <code class="inline">calc(100vh - 64px)</code> capped at 580px. Left side is the hero film, right side is a supplementary list (Coming Soon / Airing Today).</p>

      <h3>Pattern 3: Cinematic Feature Spread</h3>
      <p>Used on Top Rated (#1 film), Awards, Coming Soon. Full-bleed backdrop, content sits at bottom-left, large ghost rank number floats as watermark.</p>
      <pre><code><span class="code-comment">/* Ghost rank watermark — seen in Awards, TopRated */</span>
&lt;<span class="code-tag">div</span>
  <span class="code-key">className</span>=<span class="code-str">"absolute right-8 bottom-6 z-20 font-black text-white/4 pointer-events-none select-none"</span>
  style={{ fontSize: <span class="code-str">'10rem'</span>, fontFamily: <span class="code-str">"'Georgia', serif"</span> }}
&gt;
  01
&lt;/<span class="code-tag">div</span>&gt;</code></pre>

      <h3>Pattern 4: Asymmetric Editorial Hero</h3>
      <p>Used on Celebrities. Portrait image bleeds in from the RIGHT at 55% width. Text overlays LEFT at 95% opacity background. Creates a magazine double-page spread feel:</p>
      <pre><code><span class="code-comment">/* Portrait bleeds right side */</span>
&lt;<span class="code-tag">img</span> <span class="code-key">className</span>=<span class="code-str">"absolute right-0 top-0 h-full w-auto opacity-60"</span>
     style={{ maxWidth: <span class="code-str">'55%'</span>, objectFit: <span class="code-str">'cover'</span> }} /&gt;

<span class="code-comment">/* Text covers left with heavy gradient */</span>
&lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/85 to-transparent"</span> /&gt;</code></pre>
    </section>

    <!-- ══════════════════════
         13. LAYOUT PATTERNS
    ══════════════════════ -->
    <section class="section" id="layout-patterns">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#e879f9,#c084fc)"></div>
        <h2 class="section-title">Layout Patterns</h2>
        <span class="section-num">13</span>
      </div>

      <h3>The Sticky Filter Bar</h3>
      <p>Genre filter chips + sort controls stick below the navbar at <code class="inline">top-16</code> with glassmorphism background:</p>
      <pre><code>&lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"sticky top-16 z-20 -mx-6 px-6 py-3 bg-[#0a0a0f]/92 backdrop-blur-md border-b border-white/5"</span>&gt;
  <span class="code-comment">/* filter chips + sort + view toggle */</span>
&lt;/<span class="code-tag">div</span>&gt;</code></pre>

      <h3>The Podium Layout (Top Rated)</h3>
      <p>Ranks 2, 1, 3 are displayed in gold/silver/bronze with center (rank 1) raised higher. Achieved with <code class="inline">items-end</code> on the flex container and different heights per card.</p>

      <h3>Grouped Content by Month/Category</h3>
      <p>Used in Coming Soon and PopularMovies. Each group has a <strong>MonthHeader</strong> with the accent bar pattern, then a grid below:</p>
      <pre><code>{Object.entries(groupedMap).map(([key, items]) =&gt; (
  &lt;<span class="code-tag">div</span> key={key}&gt;
    &lt;<span class="code-class">MonthHeader</span> label={key} count={items.length} /&gt;
    &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"</span>&gt;
      {items.map((item, i) =&gt; (
        &lt;<span class="code-tag">div</span> <span class="code-key">className</span>=<span class="code-str">"card-enter"</span> style={{ animationDelay: `${i*35}ms` }}&gt;
          &lt;<span class="code-class">Card</span> item={item} /&gt;
        &lt;/<span class="code-tag">div</span>&gt;
      ))}
    &lt;/<span class="code-tag">div</span>&gt;
  &lt;/<span class="code-tag">div</span>&gt;
))}</code></pre>

      <h3>The Urgency Color System (Coming Soon)</h3>
      <p>Every time-sensitive release gets a color based on proximity to release date. Applied consistently to card badges, countdown timers, and the urgency strip:</p>
      <table class="data-table">
        <thead><tr><th>Urgency</th><th>Condition</th><th>Color</th></tr></thead>
        <tbody>
          <tr><td>Out Now</td><td>release_date ≤ today</td><td><span class="badge" style="background:rgba(34,197,94,0.15);border-color:rgba(34,197,94,0.3);color:#86efac">green</span></td></tr>
          <tr><td>Tomorrow</td><td>diff ≤ 24h</td><td><span class="badge" style="background:rgba(239,68,68,0.2);border-color:rgba(239,68,68,0.4);color:#fca5a5">red + pulse</span></td></tr>
          <tr><td>This Week</td><td>diff ≤ 3 days</td><td><span class="badge" style="background:rgba(251,146,60,0.15);border-color:rgba(251,146,60,0.3);color:#fed7aa">orange</span></td></tr>
          <tr><td>This Week</td><td>diff ≤ 7 days</td><td><span class="badge badge-purple">fuchsia</span></td></tr>
          <tr><td>This Month</td><td>diff ≤ 30 days</td><td><span class="badge badge-violet">violet</span></td></tr>
          <tr><td>Later</td><td>diff > 30 days</td><td><span class="badge badge-cyan">cyan</span></td></tr>
        </tbody>
      </table>
    </section>

    <!-- ══════════════════════
         14. DO'S & DON'TS
    ══════════════════════ -->
    <section class="section" id="dos-donts">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#34d399,#22d3ee)"></div>
        <h2 class="section-title">Do's & Don'ts</h2>
        <span class="section-num">14</span>
      </div>

      <div class="two-col">
        <div>
          <h3 style="color:#34d399">✓ Always Do</h3>
          <ul class="checklist">
            <li><span class="check-icon">✓</span>Use <code class="inline">transition-all duration-200</code> on every interactive element</li>
            <li><span class="check-icon">✓</span>Add <code class="inline">group</code> to card parents and use <code class="inline">group-hover:</code> for inner animations</li>
            <li><span class="check-icon">✓</span>Hide scrollbars on all horizontal scroll containers</li>
            <li><span class="check-icon">✓</span>Always use backdrop-blur for overlaid text panels (ratings, badges on images)</li>
            <li><span class="check-icon">✓</span>Use <code class="inline">object-top</code> for portrait photos (shows face, not torso)</li>
            <li><span class="check-icon">✓</span>Add <code class="inline">line-clamp-1</code> or <code class="inline">line-clamp-2</code> on all card titles</li>
            <li><span class="check-icon">✓</span>Fetch data independently in each component (no prop-drilling of API data)</li>
            <li><span class="check-icon">✓</span>Define ImageOrFallback locally in each component file</li>
            <li><span class="check-icon">✓</span>Use <code class="inline">clearInterval</code> when manually navigating a carousel</li>
            <li><span class="check-icon">✓</span>Show skeletons that exactly match the shape of final content</li>
            <li><span class="check-icon">✓</span>Use <code class="inline">flex-shrink-0</code> on all fixed-width elements inside flex rows</li>
          </ul>
        </div>
        <div>
          <h3 style="color:#fb7185">✗ Never Do</h3>
          <ul class="checklist">
            <li><span class="cross-icon">✗</span>Never use Inter, Roboto, or system-ui as a display font</li>
            <li><span class="cross-icon">✗</span>Never use pure black (#000000) as a background</li>
            <li><span class="cross-icon">✗</span>Never use <code class="inline">display:none</code> for overlay fade animations — use opacity</li>
            <li><span class="cross-icon">✗</span>Never use the same accent color on a different page (breaks identity)</li>
            <li><span class="cross-icon">✗</span>Never place white text on an image without a gradient overlay</li>
            <li><span class="cross-icon">✗</span>Never use generic gray skeletons — always tint with page accent</li>
            <li><span class="cross-icon">✗</span>Never use <code class="inline">backdrop-blur-xl</code> for modals — <code class="inline">blur-md</code> is enough and performs better</li>
            <li><span class="cross-icon">✗</span>Never stack more than 2 horizontal scroll rows without a section header separator</li>
            <li><span class="cross-icon">✗</span>Never use <code class="inline">border-solid</code> borders with full opacity — always alpha (border-purple-900/30)</li>
            <li><span class="cross-icon">✗</span>Never use box-shadow black — always use a tinted shadow matching the page accent</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ══════════════════════
         15. REUSABLE PATTERNS
    ══════════════════════ -->
    <section class="section" id="reusable-patterns">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#a855f7,#818cf8)"></div>
        <h2 class="section-title">Reusable Patterns for Future Projects</h2>
        <span class="section-num">15</span>
      </div>

      <p>These patterns work in any dark-themed web app, not just CineRank. Copy them wholesale:</p>

      <h3>1. The Page Identity System</h3>
      <p>Before building any multi-page app, define a color per page. Each page gets: a unique <strong>accent color</strong>, a <strong>gradient pair</strong>, a <strong>border opacity</strong>, and a <strong>text color</strong>. This creates instant wayfinding and a sense that the app has been designed, not assembled.</p>

      <h3>2. The Glassmorphism Sticky Header</h3>
      <pre><code><span class="code-str">"backdrop-blur-md bg-[PAGE_BG]/80 border-b border-[ACCENT]-900/30"</span>
<span class="code-comment">/* Works for: navbars, sticky filter bars, modal headers, bottom sheets */</span></code></pre>

      <h3>3. The Ambient Backdrop Hero</h3>
      <pre><code><span class="code-comment">/* Use on any page with a featured image */</span>
<span class="code-comment">/* 1. Blurred ambient layer (scale-110 to cover edges) */</span>
<span class="code-comment">/* 2. Crisp image at 40–50% opacity */</span>
<span class="code-comment">/* 3. from-[BG] gradient top-to-bottom for text readability */</span>
<span class="code-comment">/* 4. from-[BG]/95 gradient left-to-right for side content */</span></code></pre>

      <h3>4. The Hover Card Group Pattern</h3>
      <pre><code><span class="code-str">"group border border-white/5 hover:border-[ACCENT]/40 rounded-2xl
  transition-all duration-200 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[ACCENT]/15"</span>

<span class="code-comment">/* Inside: images scale, text changes color, hidden elements appear */</span>
<span class="code-str">"group-hover:scale-105 group-hover:text-[ACCENT] opacity-0 group-hover:opacity-100"</span></code></pre>

      <h3>5. The Colored Shadow System</h3>
      <pre><code><span class="code-comment">/* Replace ALL box shadows with accent-colored ones */</span>
<span class="code-comment">/* Generic: shadow-purple-900/40 */</span>
<span class="code-comment">/* Per-page: shadow-rose-900/25, shadow-emerald-900/20, shadow-yellow-500/30 */</span>
<span class="code-comment">/* This alone makes UIs feel 10x more designed */</span></code></pre>

      <h3>6. The Stagger Entrance Pattern</h3>
      <pre><code><span class="code-comment">/* Add to any rendered list for a cascade reveal effect */</span>
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card-enter { animation: fadeSlideUp 0.4s ease forwards; opacity: 0; }

<span class="code-comment">/* Apply with stagger: animationDelay: `${index * 50}ms` */</span>
<span class="code-comment">/* Use 35–80ms steps — lower for small cards, higher for large ones */</span></code></pre>

      <h3>7. The Smart Pagination Component</h3>
      <pre><code><span class="code-comment">/* Ellipsis-aware pagination — copy this pattern for any paginated list */</span>
Array.from({ length: totalPages }, (_, i) =&gt; i + 1)
  .filter(p =&gt; p === 1 || p === totalPages || Math.abs(p - currentPage) &lt;= 2)
  .reduce((acc, p, idx, arr) =&gt; {
    if (idx &gt; 0 && arr[idx-1] !== p - 1) acc.push('…');
    acc.push(p);
    return acc;
  }, [])</code></pre>

      <h3>8. The Responsive Clamp Title</h3>
      <pre><code><span class="code-comment">/* Hero title that scales perfectly from mobile to 4K */</span>
style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontFamily: "'Georgia', serif",
         letterSpacing: '-0.025em', lineHeight: '0.9' }}</code></pre>
    </section>

    <!-- ══════════════════════
         16. EXPORT CHECKLIST
    ══════════════════════ -->
    <section class="section" id="export">
      <div class="section-header">
        <div class="section-bar" style="background:linear-gradient(180deg,#fbbf24,#fb923c)"></div>
        <h2 class="section-title">New Project Checklist</h2>
        <span class="section-num">16</span>
      </div>

      <p>When starting a new project using the CineRank design system, run through this checklist:</p>

      <div class="shimmer-border">
        <h3 style="margin-top:0">Foundation Setup</h3>
        <ul class="checklist">
          <li><span class="check-icon">✓</span>Set root background to a near-black with a tint (not pure black)</li>
          <li><span class="check-icon">✓</span>Define a page identity system — assign one accent color per page before writing any components</li>
          <li><span class="check-icon">✓</span>Pick a display serif font for headings (Georgia, Playfair Display, etc.)</li>
          <li><span class="check-icon">✓</span>Set up the <code class="inline">scrollbar-hide</code> CSS utility globally</li>
          <li><span class="check-icon">✓</span>Create the ImageOrFallback component template to copy into each component</li>
        </ul>

        <h3>Every New Component</h3>
        <ul class="checklist">
          <li><span class="check-icon">✓</span>Does it have loading skeleton that matches its final shape?</li>
          <li><span class="check-icon">✓</span>Does the skeleton use the page accent color tinted at ~10%?</li>
          <li><span class="check-icon">✓</span>Does every interactive element have <code class="inline">transition-all duration-200</code>?</li>
          <li><span class="check-icon">✓</span>Do card grids stagger their entrance animations?</li>
          <li><span class="check-icon">✓</span>Does any image have a gradient overlay before text is placed on it?</li>
          <li><span class="check-icon">✓</span>Are all horizontal scroll containers using <code class="inline">scrollbar-hide</code>?</li>
        </ul>

        <h3>Every New Page</h3>
        <ul class="checklist">
          <li><span class="check-icon">✓</span>Does the page have its own unique accent color distinct from other pages?</li>
          <li><span class="check-icon">✓</span>Does it have a cinematic hero section (min 400px, uses full-bleed imagery)?</li>
          <li><span class="check-icon">✓</span>Is the serif font used for all display text on this page?</li>
          <li><span class="check-icon">✓</span>Are section headers using the "accent bar + title + count badge" pattern?</li>
          <li><span class="check-icon">✓</span>Is the background color a slightly different shade to reinforce page identity?</li>
          <li><span class="check-icon">✓</span>Does the sticky filter bar use <code class="inline">top-16</code> (below the fixed navbar)?</li>
        </ul>
      </div>

      <div class="callout callout-good">
        <strong>The 3-Second Rule:</strong> If you can't tell which page of your app you're on within 3 seconds (from the color, hero, and typography alone), the page identity system isn't working. Each page should be instantly recognisable.
      </div>

      <div class="callout callout-tip">
        <strong>The "Is it cinematic?" Test:</strong> After building any component, ask: does it feel like it belongs in a movie database app, or does it feel like a generic SaaS dashboard? If it's the latter — add a backdrop image, increase the font size of the title, add a gradient, darken the background. The answer is almost always "needs more depth and scale."
      </div>
    </section>

  </main>
</div>

<script>
  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
</script>
</body>
</html>

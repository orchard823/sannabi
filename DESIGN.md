# Wirefall Design System

## 0. Research Log (greenfield only)

- Embedded refs: shortlisted `playstation.md`, `raycast.md`, `runwayml.md` -> picked `gpt-tasteskill.md` + `playstation.md` because a side-scrolling action roguelike needs console-grade dark presentation, cinematic motion, and clear hover/focus states.
- Lazyweb: skipped because external screen research is not required for this original game prototype and network/tooling is restricted in this workspace.
- Imagen drafts: skipped because the game uses live canvas-drawn assets and procedural effects instead of a static mockup contract.
- Skipped lanes: no third-party assets, no brand copying, no external game library install.

## 1. Atmosphere & Identity

Wirefall is a neon industrial descent: fast, tense, and readable under pressure. The signature is a cyan grappling wire that turns navigation into combat, with console-black staging, electric focus states, and white-blue HUD panels that feel like a game running on a premium console dev kit.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | --surface-primary | #ffffff | #05070b | Page background and canvas surround |
| Surface/secondary | --surface-secondary | #f5f7fa | #0d121a | Panels and modal surfaces |
| Surface/elevated | --surface-elevated | #ffffff | #121a26 | Upgrade and start overlays |
| Surface/game-black | --surface-game-black | #000000 | #000000 | Main playable canvas |
| Text/primary | --text-primary | #000000 | #ffffff | Titles, HUD values |
| Text/secondary | --text-secondary | #6b6b6b | #aeb8c8 | Captions and help text |
| Text/tertiary | --text-tertiary | #cccccc | #6b7484 | Disabled and low-signal text |
| Border/default | --border-default | #d8e0ea | #263244 | Panel borders |
| Border/focus | --border-focus | #0070cc | #0070cc | Focus rings |
| Accent/primary | --accent-primary | #0070cc | #0070cc | Primary actions, ally HUD |
| Accent/hover | --accent-hover | #1eaedb | #1eaedb | Hover, focus, grappling wire |
| Accent/commerce | --accent-commerce | #d53b00 | #d53b00 | Danger, boss markers, low HP |
| Accent/plasma | --accent-plasma | #7c4dff | #7c4dff | Enemy shots and rare upgrades |
| Status/success | --status-success | #2fd36b | #2fd36b | Heal and clear feedback |
| Status/warning | --status-warning | #f6c343 | #f6c343 | Ammo and warning feedback |
| Status/error | --status-error | #c81b3a | #c81b3a | Damage and fail states |

### Rules
- Cyan appears at rest only for the grappling wire and focus indicators; interface controls use it on hover and active states.
- Warm colors are reserved for danger, low health, enemy telegraphs, and the boss lane.
- Canvas effects may use alpha variants of these tokens only.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | 54px | 300 | 1.12 | 0 | Start title |
| H1 | 35px | 300 | 1.2 | 0 | Overlay headings |
| H2 | 28px | 300 | 1.25 | 0 | Upgrade title |
| H3 | 22px | 500 | 1.25 | 0 | HUD group title |
| Body/lg | 18px | 400 | 1.5 | 0 | Overlay body |
| Body | 16px | 400 | 1.5 | 0 | Help and labels |
| Body/sm | 14px | 500 | 1.4 | 0 | HUD captions |
| Caption | 12px | 600 | 1.35 | 0 | Small controls and telemetry |
| Mono | 13px | 600 | 1.35 | 0 | Numeric HUD |

### Font Stack
- Primary: Arial, Helvetica, system-ui, sans-serif
- Mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace

### Rules
- Korean UI text must avoid tiny labels below 12px.
- Letter spacing is 0 for all visible text to preserve CJK legibility.

## 4. Spacing & Layout

### Base Unit
All spacing derives from a base of 4px.

| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Tight icon-to-label spacing |
| --space-2 | 8px | HUD inline spacing |
| --space-3 | 12px | Compact panel padding |
| --space-4 | 16px | Standard panel padding |
| --space-5 | 20px | Canvas chrome spacing |
| --space-6 | 24px | Overlay inner spacing |
| --space-8 | 32px | Upgrade card gaps |
| --space-10 | 40px | Section spacing |

### Grid
- Max content width: 1440px.
- Primary surface: full-viewport shell with a centered 16:9 canvas.
- Breakpoints: 375px, 768px, 1280px, 1600px.

### Rules
- Game controls remain visible above the fold on desktop and below the canvas on narrow screens.
- The canvas uses a stable aspect ratio so resizing never changes gameplay coordinates.

## 5. Components

### Game Shell
- **Structure**: `main` shell, canvas stage, HUD overlay, footer controls.
- **Variants**: running, start, upgrade, game over.
- **Spacing**: --space-4 to --space-8.
- **States**: focused canvas, paused overlays, disabled cards when not selectable.
- **Accessibility**: keyboard focus on canvas, visible start/restart buttons, Korean control text.
- **Motion**: opacity and transform for overlays.
- **Layout**: centered stage with responsive chrome.

### Command Button
- **Structure**: native `button` with text label.
- **Variants**: primary, ghost, upgrade.
- **Spacing**: --space-3 horizontal, --space-2 vertical for compact, --space-4/--space-3 for primary.
- **States**: default, hover, active, focus, disabled.
- **Accessibility**: visible focus ring and minimum 44px touch target.
- **Motion**: 180ms transform, background, and shadow.
- **Layout**: cluster primitive.

### Telemetry Chip
- **Structure**: label plus value.
- **Variants**: health, sector, ammo, score.
- **Spacing**: --space-2/--space-3.
- **States**: normal, warning, critical.
- **Accessibility**: high contrast text, no color-only meaning.
- **Motion**: damage pulse via transform and opacity.
- **Layout**: inline cluster.

### Upgrade Card
- **Structure**: button card with title, description, stat tag.
- **Variants**: damage, speed, health, fire-rate.
- **Spacing**: --space-4.
- **States**: default, hover, active, focus, disabled.
- **Accessibility**: keyboard selectable, full label text.
- **Motion**: hover scale and cyan ring.
- **Layout**: responsive grid.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 100ms | ease-out | Button press and HUD pulse |
| Standard | 180ms | ease-in-out | Hover and focus |
| Emphasis | 420ms | cubic-bezier(0.16, 1, 0.3, 1) | Overlay entry |
| Gameplay | frame-based | linear | Bullets, grapple, enemies |

### Rules
- Interface animation uses `transform`, `opacity`, and `filter`.
- Gameplay motion is continuous while the canvas is focused.
- Reduced motion disables overlay transitions and background shimmer, but gameplay remains functional.

## 7. Depth & Surface

### Strategy
Mixed: strong dark canvas, restrained panel shadows, cyan focus rings, and canvas lighting effects.

| Level | Value | Usage |
|-------|-------|-------|
| Surface | 0 5px 9px rgba(0, 0, 0, 0.08) | Panels |
| Raised | 0 5px 9px rgba(0, 0, 0, 0.16) | Upgrade cards and active HUD |
| Hero | 0 5px 9px rgba(0, 0, 0, 0.8) | Stage frame |
| Focus | 0 0 0 2px var(--border-focus) | Focus and hover rings |

## 8. Accessibility Constraints & Accepted Debt

### Constraints
- WCAG target: 2.2 AA for DOM UI, with visible focus on all controls.
- Keyboard: movement, jump, grapple, pause, start, restart, and upgrade selection must be reachable.
- Motion: respect `prefers-reduced-motion` for non-gameplay interface effects.
- CJK: Korean text must avoid cramped fixed-width labels and negative tracking.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|------|----------|--------------|--------------|
| None | N/A | N/A | N/A |

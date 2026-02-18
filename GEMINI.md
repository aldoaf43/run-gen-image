# GEMINI.md

This file provides guidance to the Gemini CLI (and other AI agents) when working with the PathCanvas repository. It defines the standards for code quality, architecture, and the specific logic required for geographic data visualization.

---

## Build & Development Commands

```bash
bun dev          # Start development server (localhost:3000)
bun build        # Production build
bun start        # Start production server
bun lint         # Run ESLint
```

---

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (Strict Mode)
- **Runtime:** Bun
- **Styling:** Tailwind CSS 4 (Mobile-first)
- **Icons:** Lucide React (always use `lucide-react` for icons)
- **Forms:** TanStack Form (`@tanstack/react-form`) — always use for all forms
- **Validation:** Zod (`zod`) — always use for form validation schemas
- **Parsing:** `gpxparser` (Standard for GPX/XML processing)
- **Rendering:** HTML5 Canvas API (High-performance 2D rendering)
- **React:** v19

---

## Architecture

This project follows a modular **"Container-Component-Module"** pattern to separate page-level logic from atomic UI and business logic. All routes live in the `app/` directory.

- **`app/`**: Next.js routing, layouts, and server components.
- **`containers/`**: Screens, full page content, and complex modal dialogs.
- **`modules/`**: Persistent layout components (Header, Sidebar, Navigation).
- **`components/`**: Reusable, atomic UI elements (Buttons, Sliders, Cards).
- **`lib/`**: Core business logic, engine logic, and utility functions.
    - `lib/gpx-utils.ts`: Parsing, scaling, and normalization.
    - `lib/canvas-engine.ts`: Pure drawing functions for the Canvas API.
- **`types/`**: Centralized TypeScript definitions.

**Rule:** Always extract reusable UI elements into their own folder under `components/` (e.g., `components/Button/index.tsx`). Never define reusable components inline inside containers or modules.

---

## Folder Structure

```
├── app/                 # Next.js App Router & Server Components
├── containers/          # Full screen views and page-specific content
│   ├── HomeScreen/
│   └── EditorScreen/
├── modules/             # Layout-level modules (Sidebar, Navbar)
├── components/          # Reusable atomic UI components
├── lib/                 # Logic engines (Parsing, Canvas Drawing)
├── types/               # TypeScript interfaces (centralized)
├── utils/               # General utility functions and validation schemas
├── public/              # Static assets, fonts, and images
```

---

## GPX & Coordinate Logic

Handling GPS data is the technical "core" of the app. Follow these rules strictly:

1.  **Normalization:** GPS coordinates (Latitude/Longitude) must be scaled to fit a 2:3 aspect ratio (standard poster size).
2.  **Axis Flipping:** In the Canvas API, Y=0 is the top. In geographic coordinates, Latitude values increase going North (Up). You must flip the Y-coordinates during normalization to prevent the route from appearing upside down.
3.  **Bounding Box:** Calculate the bounds (min/max Lat/Lon) of the route to center it perfectly on the canvas with a consistent margin.
4.  **Smoothing:** Use the Ramer-Douglas-Peucker algorithm or a simple moving average to reduce "jitter" in raw GPS data.

---

## Mobile-First Design

Always design and implement mobile-first. This is a critical requirement for all components.

### Approach:

- Start with mobile layout as the default (no breakpoint prefix).
- Add tablet styles with `md:` prefix (768px+).
- Add desktop styles with `lg:` prefix (1024px+).

### Patterns:

- Use `hidden md:flex` to show elements only on tablet+.
- Touch-friendly tap targets (minimum 44px).
- On mobile, the `EditorSidebar` should transform into a bottom drawer or a toggleable overlay.

---

## TypeScript Rules

All types and interfaces must be defined in the `types/` folder and imported from `@/types`.

### Structure:

```
├── types/
│   ├── index.ts        # Re-exports all types
│   ├── gpx.ts          # GPS and Route-related types
│   ├── poster.ts       # Canvas, Theme, and Typography settings
│   └── components.ts   # Component prop types
```

### Rules:

1.  Never define interfaces or types locally in component files.
2.  Always import types from `@/types`.
3.  Use strict typing; avoid the `any` keyword.

---

## Icons

Always use Lucide React for icons. Never use emojis or other icon libraries.

```jsx
import { Map, Download, Settings } from "lucide-react";

<Map size={22} strokeWidth={1.5} />
```

---

## Code Comments

- Never comment simple components or self-explanatory code.
- Only add comments to complex functions requiring explanation (e.g., math-heavy normalization).
- Comments should explain "why", not "what".

---

## Performance Requirements

- **Canvas Optimization:** Use `requestAnimationFrame` for interactive updates.
- **Memoization:** Wrap the `CanvasRenderer` in `React.memo` to prevent re-drawing unless the route or settings change.
- **Debouncing:** Debounce slider inputs (like "Stroke Weight") to avoid excessive canvas re-paints.

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
│   ├── EditorScreen/
│   └── GuideDrawer/     # GPX Export instructions
├── modules/             # Layout-level modules (Sidebar, Navbar)
├── components/          # Reusable atomic UI components
│   ├── Button/
│   ├── Drawer/          # Responsive Drawer/Modal system
│   └── Poster/
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
5.  **Indicators:** Start and finish markers must use a **fixed relative size** (relative to canvas width) rather than a multiple of the stroke width. For overlapping points (loops), use the **"Visual Cutout" pattern** (background-colored halo) to distinguish them.

---

## Metric & Sensor Data Handling

1.  **Regex Extraction:** Since standard GPX parsers often ignore device-specific extensions, use Regex to extract and average sensor data (Heart Rate, Cadence, Power) from XML tags like `gpxtpx:hr` or `power`.
2.  **Smart UI Filtering:** In the Editor Screen, only display metric selection options that have valid data in the uploaded file. Never show options for data points (like Power) if the file doesn't contain them.
3.  **Dynamic Layout:** The poster stats grid must dynamically adjust its column count based on the number of selected metrics (1 to 4) to ensure optimal spacing.

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

- **Minimize Comments:** Do not add comments unless they are crucial and completely necessary for understanding complex logic that cannot be made self-explanatory.
- Never comment simple components, standard hooks, or self-explanatory code.
- If a comment is necessary, it should explain "why" a specific approach was taken, not "what" the code is doing.

---

## Performance Requirements

- **Canvas Optimization:** Use `requestAnimationFrame` for interactive updates.
- **Memoization:** Wrap the `CanvasRenderer` in `React.memo` to prevent re-drawing unless the route or settings change.
- **Debouncing:** Debounce slider inputs (like "Stroke Weight") to avoid excessive canvas re-paints.

---

## Animation Standards (Framer Motion)

To ensure high performance and accessibility (WCAG), follow these rules for animations:

1.  **Hardware Acceleration:** Always animate `opacity` and `transform` (scale, translate, rotate) to utilize the GPU. Avoid animating layout properties like `width`, `height`, or `top/left`.
2.  **Viewport Efficiency:** Use `onViewportEnter` and `onViewportLeave` (or `whileInView`) to pause heavy animations (like the Poster Morphing) when they are not visible to the user.
3.  **Infinite Animation Limits:** Any "infinite" decorative animation must have a logical stop point (e.g., stopping after 12 cycles) to reduce long-term CPU usage and prevent user distraction.
4.  **Orchestration:** Use `AnimatePresence` with `mode="wait"` for smooth component swapping (morphing effects).

---

## Theming & UI Consistency

1.  **Single Source of Truth:** All color palettes must be defined in `types/poster.ts`. Components (HomeScreen, Editor, etc.) must import from this central registry to ensure the landing page accurately reflects the product.
2.  **Subtext Standardization:** For activity metadata, always use the format: `Month Day, Year • HH:MM AM/PM` (e.g., `February 3, 2026 • 06:43 PM`).
3.  **Unit Consistency:** Distances should be in `KM` and elevation in `M` unless a user setting specifically overrides this in the future.

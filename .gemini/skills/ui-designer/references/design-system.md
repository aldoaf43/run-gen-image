# Design System Guidelines

This document defines the visual language for the project, ensuring consistency across all containers, modules, and components.

## 1. Color Palette

Standardize color names and usage to ensure high accessibility (WCAG 2.1 AA+).

- **Primary**: Brand identity (e.g., #3b82f6 - Blue 500). Use for primary CTAs and active states.
- **Secondary**: Supporting brand colors (e.g., #6366f1 - Indigo 500).
- **Neutral**: Grayscale for text, backgrounds, and borders.
  - Text: `text-slate-900` (Title), `text-slate-600` (Body), `text-slate-400` (Muted).
  - Background: `bg-white` (Surface), `bg-slate-50` (App background).
- **Semantic**:
  - Success: `text-emerald-600` / `bg-emerald-50`
  - Warning: `text-amber-600` / `bg-amber-50`
  - Error: `text-rose-600` / `bg-rose-50`

## 2. Typography

Use a clear hierarchy with readable font sizes.

- **Headings**: Semibold/Bold.
  - H1: `text-3xl md:text-4xl`
  - H2: `text-2xl md:text-3xl`
  - H3: `text-xl md:text-2xl`
- **Body**: Medium (16px).
  - Primary: `text-base`
  - Small: `text-sm`
  - Caption: `text-xs`

## 3. Spacing & Grid

Strictly follow the 8px/4px rule for margins and padding.

- **Standard Spacing**: `p-4` (16px), `p-8` (32px), `gap-4`.
- **Containers**: Max-width of `max-w-7xl` with `px-4 md:px-8` for padding.
- **Border Radius**: Consistent usage.
  - Buttons/Small inputs: `rounded-md` (6px) or `rounded-lg` (8px).
  - Cards/Modals: `rounded-xl` (12px) or `rounded-2xl` (16px).

## 4. Shadows & Elevation

Use shadows to convey depth and focus.

- **Flat**: Subtle borders (`border border-slate-200`).
- **Raised**: `shadow-sm` for cards.
- **Overlay**: `shadow-xl` for modals and dropdowns.

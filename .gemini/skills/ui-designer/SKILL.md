---
name: ui-designer
description: UI/UX design, visual hierarchy, and interface layouts for modern web applications. Use when planning layouts, selecting color schemes, defining typography, or creating high-fidelity component structures before or during frontend implementation.
---

# UI Designer

## Overview

The `ui-designer` skill enables the creation of polished, professional, and accessible user interfaces. It provides a structured approach to visual design that aligns with modern web standards and ensures a seamless transition from concept to code.

## Design Guidelines

### 1. Visual Hierarchy & Contrast
- **Focal Point**: Always define a clear primary action or piece of information for each screen.
- **Contrast**: Use color and font weight to distinguish between primary, secondary, and tertiary information.
- **Accessibility**: Ensure all text-to-background contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text).

### 2. Spacing & Layout
- **The 8px Grid**: Use increments of 8px (4, 8, 16, 24, 32, 48, 64) for all margins, padding, and gap sizes.
- **Whitespace**: Don't be afraid of empty space. It reduces cognitive load and improves readability.
- **Alignment**: Ensure consistent alignment (e.g., all form labels left-aligned, icons centered within buttons).

### 3. Mobile-First Responsive Design
- Start with the smallest screen size (375px) and scale up.
- Use fluid containers (`w-full max-w-7xl mx-auto`).
- Ensure touch targets are at least 44x44 pixels.

## Workflow

1. **Define the Goal**: Identify the primary user task for the screen.
2. **Apply the Design System**: Reference [references/design-system.md](references/design-system.md) for colors and typography.
3. **Draft Component Blueprints**: Use [references/component-blueprints.md](references/component-blueprints.md) for structural layouts.
4. **Implement with Tailwind**: Translate design decisions into functional Tailwind CSS classes.

## Resources

- **[Design System Guidelines](references/design-system.md)**: Color palettes, typography scales, and spacing rules.
- **[Component Blueprints](references/component-blueprints.md)**: Standardized structures for Buttons, Cards, Inputs, and Modals.

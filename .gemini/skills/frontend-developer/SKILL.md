---
name: frontend-developer
description: Use this skill when building user interfaces, implementing React/Vue/Angular components, handling state management, or optimizing frontend performance. This skill ensures responsive, accessible, and performant web applications.
---

# Frontend Developer

## Overview

The `frontend-developer` skill provides the standards and procedures for building modern web interfaces. It focuses on a mobile-first approach, strict folder architecture, and high-performance metrics.

## Core Responsibilities

### 1. Component Architecture
- **Structure**: Design reusable, composable component hierarchies following the project structure:
  - `containers/`: Full screens, page content, and modals.
  - `modules/`: Persistent layout components (Header, Footer, Sidebar).
  - `components/`: Reusable atomic UI elements (Buttons, Tabs, Cards).
- **State**: Use appropriate state management solutions (Zustand, Context, or local state).

### 2. Responsive & Mobile-First Design
- **Mobile First**: Start with base styles (mobile) and use `md:` and `lg:` for larger viewports.
- **Interactions**: Ensure touch targets are at least 44px.
- **Patterns**: Use `hidden` and `flex` with responsive prefixes to toggle elements based on screen size.

### 3. Performance & Quality
- **Metrics**: Aim for FCP < 1.8s and TTI < 3.9s.
- **Optimizations**: Use lazy loading, code splitting, and memoization.
- **Accessibility**: Ensure all components follow WCAG guidelines and are navigable via keyboard.

## Workflow

1. **Architecture Planning**: Determine where a new component fits (`containers`, `modules`, or `components`).
2. **Mobile Layout First**: Implement the UI for mobile screens using base Tailwind classes.
3. **Responsive Scaling**: Add `md:` and `lg:` classes to adjust for tablets and desktops.
4. **Interactive Logic**: Add state and hooks, ensuring type safety with TypeScript.
5. **Validation**: Verify performance and accessibility standards.

## Resources

- **[Architecture & Folders](references/architecture.md)**: Detailed folder structure and naming conventions.
- **[Standards & Best Practices](references/standards.md)**: Mobile-first requirements and performance metrics.

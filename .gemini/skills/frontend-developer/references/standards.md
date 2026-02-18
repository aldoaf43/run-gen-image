# Frontend Standards

Guidelines for mobile-first development, performance, and accessibility.

## 1. Mobile-First Requirement

- **Base Layout**: Always start with the mobile layout (no breakpoint prefix).
- **Tablet**: Add tablet styles with `md:` (768px+).
- **Desktop**: Add desktop styles with `lg:` (1024px+).
- **Patterns**: Use `hidden md:flex` and `flex md:hidden` to swap elements between mobile and desktop viewports.
- **Interactions**: Ensure touch-friendly tap targets (minimum 44x44 pixels). Implement back buttons for nested mobile navigation.

## 2. Performance Metrics

- **First Contentful Paint (FCP)**: < 1.8s
- **Time to Interactive (TTI)**: < 3.9s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Bundle Size**: < 200KB (gzipped).
- **Frame Rate**: Maintain 60fps for all animations and scrolling.

## 3. Best Practices

- **Component Architecture**: Prefer composition over inheritance. Use hooks for logic and components for UI.
- **TypeScript**: Always use strict type safety. Define interfaces for all component props.
- **Accessibility**: Follow WCAG guidelines. Use semantic HTML and proper ARIA labels.
- **State Management**: Choose the right tool (Zustand, Context, or local state) based on the scope of the state.
- **Testing**: Implement unit and integration tests using Testing Library and Playwright/Cypress.

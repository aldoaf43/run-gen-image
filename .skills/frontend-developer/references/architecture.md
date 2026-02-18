# Frontend Architecture & Folder Structure

All frontend code MUST follow this specific directory structure to maintain consistency across the project.

## 1. Directory Structure

```text
├── containers/          # Screens, pages content, and modals
│   ├── HomeScreen/
│   ├── ProfileScreen/
│   └── modals/
│       └── CreatePostModal/
│
├── modules/             # Layout components (header, footer, sidebar, navigation)
│   ├── Header/
│   ├── Footer/
│   ├── Sidebar/
│   └── Navigation/
│
├── components/          # Reusable UI components
│   ├── Cards/
│   ├── Tabs/
│   └── Button/
```

## 2. Component Categories

- **Containers**: Full screens, page content, and modals. These often handle data fetching and major state orchestration.
- **Modules**: Persistent layout components that stay consistent across different pages (e.g., Header, Sidebar).
- **Components**: Atomic, reusable UI elements. They should be "dumb" or "pure" as much as possible, focusing on display and interaction.

## 3. Naming Conventions

- Folders: PascalCase (e.g., `ProfileScreen`)
- Files: PascalCase (e.g., `ProfileScreen.tsx`)
- Props: camelCase
- Constants: UPPER_SNAKE_CASE

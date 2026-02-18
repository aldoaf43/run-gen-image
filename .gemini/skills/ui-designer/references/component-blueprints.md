# Component Blueprints

These blueprints provide structural and aesthetic guidelines for common UI components, ensuring they align with the project's design system.

## 1. Buttons

Standardized button states and sizes.

- **Primary**: `bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all px-4 py-2 rounded-lg`.
- **Secondary**: `bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all px-4 py-2 rounded-lg`.
- **Ghost**: `text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all px-4 py-2 rounded-lg`.

## 2. Cards

Consistent card structure for data presentation.

- **Base Structure**: `bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden`.
- **Header**: `px-4 py-3 border-b border-slate-100 font-semibold text-slate-900`.
- **Content**: `p-4 text-slate-600`.
- **Footer**: `px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2`.

## 3. Form Inputs

Clean, accessible, and interactive form controls.

- **Text Input**: `w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`.
- **Labels**: `block text-sm font-medium text-slate-700 mb-1`.
- **Helper Text**: `text-xs text-slate-500 mt-1`.

## 4. Modals

Standardized overlay structure for focus tasks.

- **Backdrop**: `fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4`.
- **Modal Container**: `bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden`.
- **Animation**: `animate-in fade-in zoom-in duration-200`.

## 5. Navigation Items

Interactive navigation links.

- **Desktop**: `px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors`.
- **Mobile**: `block px-4 py-3 text-base font-medium text-slate-700 active:bg-slate-100 rounded-lg transition-colors`.

# AI Rules for Application Development

This document outlines the core technologies and best practices for developing this application. Adhering to these guidelines ensures consistency, maintainability, and efficient collaboration.

## Tech Stack Overview

*   **Frontend Framework**: React.js for building interactive user interfaces.
*   **Language**: TypeScript for type safety and improved code quality.
*   **Build Tool**: Vite for a fast development experience and optimized builds.
*   **Styling**: Tailwind CSS for utility-first CSS styling, enabling rapid UI development and responsive designs.
*   **UI Component Library**: shadcn/ui for pre-built, accessible, and customizable UI components.
*   **Routing**: React Router for declarative navigation within the application.
*   **Icons**: Lucide React for a comprehensive set of customizable SVG icons.
*   **State Management**: React's built-in state management (useState, useContext) for local and global state.
*   **Project Structure**: Organized into `src/pages` for views and `src/components` for reusable UI elements.

## Library Usage Rules

To maintain consistency and leverage the strengths of our chosen libraries, please follow these rules:

*   **UI Components**: Always prioritize `shadcn/ui` components for all common UI elements (buttons, inputs, cards, dialogs, etc.). If a specific component is not available in `shadcn/ui`, create a new custom component following the existing styling conventions.
*   **Styling**: Use Tailwind CSS classes exclusively for all styling. Avoid writing custom CSS or using other styling solutions. Ensure responsive design is considered for all components.
*   **Icons**: Use icons from `lucide-react`. Import them directly and apply styling via Tailwind CSS.
*   **Routing**: Manage all application navigation using `react-router-dom`. Define routes in `src/App.tsx` and use `Link` or `useNavigate` for navigation.
*   **State Management**: For component-level state, use React's `useState` hook. For global state that needs to be shared across many components, consider `useContext` or discuss the need for a dedicated state management library if complexity grows.
*   **New Components**: Every new component, no matter how small, should reside in its own file within the `src/components` directory.
*   **File Naming**: Directory names should be all lowercase (e.g., `src/pages`, `src/components`). File names can use mixed-case (e.g., `MyComponent.tsx`).
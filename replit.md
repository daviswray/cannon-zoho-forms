# Real Estate Transaction Management System

## Overview

A comprehensive real estate transaction form system built with React, Express, and PostgreSQL. This application streamlines property transactions by providing a professional form interface that integrates with Follow-up Boss CRM to manage agents, clients, and deal progress efficiently. The system features conditional validation, real-time data fetching, and a Material Design-inspired interface optimized for real estate professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, professional interfaces
- **Styling**: Tailwind CSS with custom design system following Material Design principles
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API structure with centralized error handling
- **Session Management**: PostgreSQL session store with connect-pg-simple

### Database Design
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Migration System**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL adapter
- **Schema Validation**: Drizzle-Zod integration for runtime schema validation

### Form System Architecture
- **Validation Strategy**: Zod schemas with conditional validation rules based on buyer/seller selection
- **Transaction Types**: Support for Buyer Broker Agreement (BBA), Listing Agreement (LA), and Under Contract (UC)
- **Progressive Disclosure**: Form fields appear conditionally based on user selections
- **Real-time Validation**: Client-side validation with server-side verification

### Design System
- **Theme System**: Custom CSS variables supporting light/dark modes with professional color palette
- **Typography**: Inter font family optimized for form readability
- **Component Library**: Consistent component variants using class-variance-authority
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Accessibility**: High contrast ratios, keyboard navigation, and ARIA-compliant components

## External Dependencies

### Third-Party Integrations
- **Follow-up Boss CRM**: RESTful API integration for agent and deal data retrieval
  - Agent management and selection
  - Deal filtering based on transaction types
  - Real-time data synchronization

### Development Tools
- **Vite**: Development server with hot module replacement and optimized builds
- **Replit Integration**: Runtime error modal and cartographer for development environment
- **PostCSS**: CSS processing with Autoprefixer for cross-browser compatibility

### UI Component Libraries
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Lucide React**: Consistent icon system throughout the application
- **Embla Carousel**: Touch-friendly carousel component for data display

### Database Services
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle Kit**: Database migration tooling and schema management

### Validation and Type Safety
- **Zod**: Runtime schema validation with TypeScript integration
- **React Hook Form**: Performance-optimized form handling with minimal re-renders
- **TypeScript**: Full type safety across client, server, and shared schemas
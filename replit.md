# PeriodBox - Personalized Period Product Recommendations

## Overview

PeriodBox is a web application that helps users discover period products perfectly matched to their lifestyle and needs through a personalized survey experience. The platform features a vibrant, empowering design that breaks period stigma while providing expert product recommendations. Users complete a multi-step survey about their flow, lifestyle, and preferences, then receive tailored product suggestions with detailed information to make confident purchasing decisions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with custom design system

**Design System:**
The application implements a vibrant, empowering design following guidelines in `design_guidelines.md`:
- Custom color palette with brand pink (340 85% 65%) and deep purple (270 60% 45%) as primary colors
- Typography using Plus Jakarta Sans for headings, Inter for body text, and DM Sans for accents
- Consistent spacing system using Tailwind units (4, 6, 8, 12, 16, 20, 24, 32)
- Dark mode support with automatic color adaptations

**Component Architecture:**
- Reusable UI components in `/client/src/components/ui/` (buttons, cards, forms, etc.)
- Feature-specific components in `/client/src/components/` (Header, Footer, ProductCard, SurveyQuestion, etc.)
- Page components in `/client/src/pages/` (Home, Survey, Products, About)
- Path aliases configured for clean imports (@/, @shared/, @assets/)

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Neon serverless driver)
- **Validation**: Zod schemas integrated with Drizzle

**API Structure:**
- RESTful API endpoints under `/api` prefix
- Survey response submission and retrieval
- Product catalog management and retrieval
- Product recommendation engine based on survey answers
- Session-based tracking using sessionId

**Data Models:**
- `surveyResponses`: Stores user survey answers with session tracking (id, sessionId, answers as JSON, createdAt)
- `products`: Product catalog with name, description, price, category, features, imageUrl, and tags for matching

**Storage Strategy:**
- Abstract storage interface (`IStorage`) for flexibility
- In-memory storage implementation (`MemStorage`) for development
- Database storage ready via Drizzle ORM with PostgreSQL
- Product seeding mechanism for initial data population

### Recommendation Algorithm

The application uses a tag-based matching system:
- Survey answers are converted to preference tags (flow type, product preferences, lifestyle factors)
- Products have associated tags describing their characteristics
- Matching algorithm scores products based on tag overlap with user preferences
- Results include match scores and reasons for recommendations
- Products are ranked and filtered based on relevance

### Development Workflow

**Build Process:**
- Development: Vite dev server with HMR, Express backend runs concurrently
- Production: Vite builds frontend to `dist/public`, esbuild bundles backend to `dist`
- TypeScript compilation checking without emitting files
- Database migrations managed via Drizzle Kit

**Development Tools:**
- Replit-specific plugins for runtime error overlay and dev banner
- Custom logging middleware for API request tracking
- Path mapping for clean imports across client and server code

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Headless UI primitives for accessible components (accordion, dialog, dropdown, select, etc.)
- **shadcn/ui**: Pre-built component patterns following Radix UI and Tailwind CSS conventions
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel/slider functionality

### Database & ORM
- **Neon Serverless**: PostgreSQL database provider (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe ORM for database operations (drizzle-orm v0.39.1)
- **Drizzle Kit**: Database migration and schema management tool
- **Drizzle Zod**: Integration between Drizzle schemas and Zod validation

### Form Handling & Validation
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Validation resolver for Zod schemas
- **Zod**: Runtime type validation and schema definition

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx / tailwind-merge**: Conditional className handling

### Fonts
- **Google Fonts**: Plus Jakarta Sans (headings), Inter (body), DM Sans (accents)

### Development Dependencies
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Fast JavaScript bundler for backend
- **TypeScript**: Type safety across the stack
- **tsx**: TypeScript execution for development

### Session Management
- **connect-pg-simple**: PostgreSQL session store (configured but may not be actively used with current in-memory storage)

### Query & Data Fetching
- **TanStack Query**: Server state management with caching, refetching disabled by default for static product data
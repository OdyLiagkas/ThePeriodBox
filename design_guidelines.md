# The Period Box Design Guidelines

## Design Approach
**Reference-Based Approach** drawing inspiration from modern e-commerce (Shopify, Etsy) and wellness platforms (Calm, Headspace), creating a vibrant, empowering experience that makes period product discovery feel positive and personalized.

## Core Design Principles
1. **Empowering Positivity**: Break stigma through vibrant colors and confident design
2. **Playful Professionalism**: Fun without compromising trust and credibility
3. **Personal Journey**: Survey feels like self-discovery, not a questionnaire
4. **Approachable Expertise**: Knowledgeable but never clinical or intimidating

## Color Palette (Based on Brand Logo)

**Primary Colors:**
- Coral Red: 10 85% 55% (warm, confident coral from logo)
- Peach Accent: 35 85% 70% (friendly, approachable peach from logo background)

**Secondary Colors:**
- Deep Rose: 350 75% 45% (sophisticated complement)
- Warm Orange: 20 80% 60% (energetic accent)

**Neutrals:**
- Dark: 240 10% 15% (text, headers)
- Light: 240 6% 98% (backgrounds)
- Mid Gray: 240 5% 40% (secondary text)

**Dark Mode:**
- Background: 240 15% 12%
- Surface: 240 12% 18%
- Adapt primaries to maintain brand identity in dark mode

## Typography

**Font Families:**
- **Headings**: 'Plus Jakarta Sans' (Google Fonts) - modern, friendly, slightly rounded
- **Body**: 'Inter' (Google Fonts) - clean, readable
- **Accents**: 'DM Sans' - survey questions, card titles

**Scale:**
- Hero H1: text-5xl to text-7xl, font-bold
- Section H2: text-4xl, font-bold
- Card H3: text-2xl, font-semibold
- Body: text-base to text-lg
- Small: text-sm (form labels, captions)

## Layout System

**Spacing Primitives:** Consistent use of Tailwind units: 4, 6, 8, 12, 16, 20, 24, 32
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8

**Container Strategy:**
- Full-width sections with inner max-w-7xl
- Content sections: max-w-6xl
- Survey container: max-w-3xl (focused experience)

## Component Library

### Navigation
- Sticky header with logo left, nav center, CTA button right
- Transparent on landing hero, white/dark surface on scroll
- Mobile: Hamburger menu with slide-in drawer

### Hero Section (Landing Page)
- Full-width vibrant gradient background (pink to purple)
- Large, empowering headline: "Discover Your Perfect Period Products"
- Subheading explaining the personalized approach
- Prominent CTA: "Start Your Journey" (large, rounded button)
- Hero illustration/image: Diverse women, colorful, confident aesthetic
- Include trust indicators: "Join 10,000+ women" with small avatars

### Survey Components
- **Progress Bar**: Colorful gradient-filled bar showing completion
- **Question Cards**: White cards with generous padding, shadow-sm, rounded-2xl
- **Input Styles**: 
  - Radio buttons: Custom styled with pink checkmarks
  - Checkboxes: Rounded squares with gradient when selected
  - Range sliders: Pink/purple gradient track
- **Navigation**: "Previous" and "Next" buttons with clear visual hierarchy
- **Result Cards**: Gradient backgrounds, product images, personalized messaging

### Product Cards
- 2-column mobile, 3-column desktop grid
- Image at top (square ratio)
- Product name in DM Sans, semibold
- Brief description in Inter
- Price tag with gradient background
- Subtle hover: lift effect (transform scale-105)

### About Team
- Team member cards with circular profile images
- Name, role, fun fact about their period journey
- 2-column on tablet, 3-column on desktop
- Vibrant accent borders or gradient overlays

### Footer
- Multi-column layout with brand info, quick links, newsletter signup
- Social media icons with gradient hover states
- Trust badges: "Women-owned", "Eco-friendly partners"

## Animations
**Use sparingly:**
- Hero CTA: Subtle pulse effect
- Survey progression: Smooth slide transitions between questions
- Product cards: Gentle hover lift
- Avoid excessive scroll animations

## Images

**Hero Image:**
- Large, vibrant illustration or photo of diverse women
- Colorful, abstract period-positive artwork
- Placement: Right side of hero on desktop, full-width on mobile

**Survey Images:**
- Small, friendly icons accompanying question categories
- Celebratory illustration on results page

**Product Images:**
- Clean, well-lit product photography
- Consistent white backgrounds
- Square aspect ratio (1:1)

**Team Photos:**
- Authentic, casual team photos
- Circular crops for profile pictures
- Colorful backgrounds or gradient overlays

**Throughout Site:**
- Abstract geometric patterns in brand colors as section dividers
- Playful spot illustrations for empty states

## Accessibility
- WCAG AA contrast ratios maintained
- Focus states: 2px pink outline with offset
- Alt text for all images
- Survey keyboard navigable
- Dark mode toggle in header

## Page-Specific Notes

**Landing:** Hero + How It Works (3 steps with icons) + Social Proof + CTA
**Survey:** Full-screen focused experience, minimal distractions, encouraging copy
**Products:** Filterable grid, search functionality, category tags with gradient backgrounds
**About:** Mission statement + team grid + company values with icons

This design creates a confident, colorful experience that transforms period product discovery into an empowering, personalized journey.
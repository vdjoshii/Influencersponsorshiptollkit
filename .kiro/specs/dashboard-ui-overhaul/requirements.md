# Requirements Document

## Introduction

This feature transforms the SponsorLink Influencer Sponsorship Coordination Platform from a functional college-project CRUD app into a modern SaaS-style dashboard experience. The overhaul is **frontend-only** — it reuses all existing REST APIs and JWT authentication without adding new backend endpoints. The target aesthetic is inspired by platforms like Upfluence, CreatorIQ, and Aspire: clean analytics cards, professional admin panels, smooth micro-interactions, dark mode, and full mobile responsiveness.

The work is scoped to eight areas: (1) design system / Tailwind token unification, (2) analytics cards and charts, (3) responsive layout, (4) dark mode, (5) sidebar / navigation, (6) status chips and badges, (7) loading skeletons and spinners, and (8) creator profile pages.

---

## Glossary

- **Dashboard_UI**: The React + Vite + Tailwind CSS frontend application located in `frontend/src`.
- **Design_System**: The shared set of Tailwind CSS tokens, component classes, and typography rules that govern visual consistency across the app.
- **Brand_Dashboard**: The page rendered for users with role `BRAND` at `/dashboard` (`BrandDashboard.jsx`).
- **Influencer_Dashboard**: The page rendered for users with role `INFLUENCER` at `/dashboard` (`InfluencerDashboard.jsx`).
- **Sidebar**: The persistent left-hand navigation component (`Sidebar.jsx`).
- **AppLayout**: The root layout wrapper that composes the Sidebar and main content area (`AppLayout.jsx`).
- **StatCard**: The reusable metric card component (`StatCard.jsx`).
- **Chart**: A lightweight SVG or canvas-based data visualisation rendered by a third-party React chart library (Recharts or similar).
- **Skeleton**: An animated placeholder element shown while data is loading, implemented in `Loaders.jsx`.
- **Status_Badge**: An inline pill/chip element that communicates offer status (Pending, Accepted, Rejected) with colour coding.
- **Dark_Mode**: A colour scheme where backgrounds are dark (`#0a0a0f` family) and text is light, toggled via a user preference stored in `localStorage`.
- **Light_Mode**: A colour scheme where backgrounds are white/light-grey and text is dark slate.
- **Theme_Toggle**: The UI control that switches between Dark_Mode and Light_Mode.
- **Creator_Profile**: A read-only view of an influencer's public stats, accessible from the Influencers list page.
- **Token**: A named Tailwind CSS colour or spacing value defined in `tailwind.config.js`.
- **Responsive_Breakpoint**: A Tailwind screen size prefix (`sm`, `md`, `lg`, `xl`) at which layout adapts.
- **Micro_Interaction**: A subtle CSS transition or animation (hover lift, colour shift, scale) applied to interactive elements.

---

## Requirements

### Requirement 1: Design System Unification

**User Story:** As a developer, I want a single coherent set of Tailwind tokens and component utility classes, so that every page uses consistent colours, spacing, and typography without conflicting definitions.

#### Acceptance Criteria

1. THE Design_System SHALL define all colour tokens in `tailwind.config.js` under a single `theme.extend.colors` block that covers both light-mode surface colours (`surface-50` through `surface-300`) and dark-mode background colours (`bg-primary`, `bg-secondary`, `bg-card`, `bg-hover`, `bg-border`), brand accent colours (`brand-purple`, `brand-purpleLight`, `brand-green`, `brand-greenLight`, `brand-blue`, `brand-blueLight`), and semantic status colours (`success`, `warning`, `danger` with their soft variants).
2. THE Design_System SHALL define reusable component classes (`.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.label`, `.badge-pending`, `.badge-accepted`, `.badge-rejected`) in `index.css` under `@layer components` so that all pages reference these classes rather than inline Tailwind strings.
3. WHEN a component references a colour token (e.g. `text-brand-purple`, `bg-surface-50`), THE Design_System SHALL resolve that token to a defined value without producing a Tailwind "unknown utility" warning.
4. THE Design_System SHALL specify a primary font stack in `tailwind.config.js` (`fontFamily.sans`) and load the chosen font via `index.html` or `index.css` so that all body text renders in that font.
5. THE Design_System SHALL define a `shadow-card` and `shadow-card-hover` box-shadow token in `tailwind.config.js` so that card elevation states are consistent.

---

### Requirement 2: Analytics Cards and Charts

**User Story:** As a brand or influencer user, I want to see key metrics visualised as polished stat cards and trend charts on my dashboard, so that I can understand my campaign performance at a glance.

#### Acceptance Criteria

1. THE StatCard SHALL display a metric label, a formatted value, an optional sub-label, and a coloured icon container, and SHALL apply a `shadow-card-hover` elevation on hover via a CSS transition.
2. THE Brand_Dashboard SHALL render four StatCards showing: marketing budget, total amount spent on accepted offers, count of pending offers, and count of accepted offers — all derived from existing API responses without new endpoints.
3. THE Influencer_Dashboard SHALL render four StatCards showing: total earnings, follower count with platform label, count of pending offers, and count of accepted deals — all derived from existing API responses.
4. WHEN the Brand_Dashboard loads, THE Dashboard_UI SHALL render a bar chart or line chart showing offer amounts grouped by status (Pending, Accepted, Rejected) using data already fetched from `offersApi.getByBrand`.
5. WHEN the Influencer_Dashboard loads, THE Dashboard_UI SHALL render a chart showing earnings over accepted deals (deal index vs. amount) using data already fetched from `offersApi.getByInfluencer`.
6. THE Dashboard_UI SHALL use a chart library that is compatible with React 19 and Vite 8 (Recharts is the preferred choice) and SHALL be added as a production dependency in `package.json`.
7. WHEN chart data is empty (zero offers), THE Dashboard_UI SHALL render an empty-state illustration inside the chart container instead of a broken or blank chart.
8. THE StatCard SHALL accept an optional `trend` prop (a signed number) and WHEN provided, SHALL display a coloured trend indicator (green for positive, red for negative) below the value.

---

### Requirement 3: Responsive Layout

**User Story:** As a user on a mobile or tablet device, I want the dashboard to adapt its layout so that all content is readable and interactive without horizontal scrolling.

#### Acceptance Criteria

1. THE AppLayout SHALL collapse the Sidebar into a hidden off-canvas drawer on screens narrower than the `md` breakpoint (768 px) and SHALL display a hamburger menu button in a top bar to open it.
2. WHEN the off-canvas Sidebar is open on a mobile screen, THE AppLayout SHALL render a semi-transparent overlay behind the Sidebar and SHALL close the Sidebar when the overlay is tapped.
3. THE AppLayout SHALL render a top bar on mobile screens (below `md`) containing the app logo, the current page title, and the hamburger menu button.
4. THE Dashboard_UI SHALL use CSS Grid with responsive column counts so that StatCard grids render as 1 column on `sm`, 2 columns on `md`, and 4 columns on `lg` and above.
5. WHEN rendered on a screen narrower than `md`, THE Dashboard_UI SHALL replace data tables (offers table, influencers table, earnings table) with stacked card-list layouts so that each row becomes a self-contained card.
6. THE Dashboard_UI SHALL ensure that all interactive touch targets (buttons, nav links, tab pills) have a minimum height of 44 px on mobile screens to meet touch accessibility guidelines.
7. THE Dashboard_UI SHALL ensure that no page requires horizontal scrolling on a 375 px wide viewport.

---

### Requirement 4: Dark Mode

**User Story:** As a user, I want to switch between dark and light colour schemes, so that I can use the platform comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL implement dark mode using Tailwind's `class` strategy (setting `darkMode: 'class'` in `tailwind.config.js`) so that adding the `dark` class to the `<html>` element activates dark styles.
2. THE Theme_Toggle SHALL be a button rendered in the Sidebar (desktop) and in the top bar (mobile) that switches between Dark_Mode and Light_Mode.
3. WHEN the user activates Dark_Mode, THE Dashboard_UI SHALL persist the preference in `localStorage` under the key `"theme"` so that the chosen mode is restored on the next page load.
4. WHEN the page loads and no `"theme"` key exists in `localStorage`, THE Dashboard_UI SHALL default to the user's OS preference via the `prefers-color-scheme` media query.
5. THE Design_System SHALL provide `dark:` variants for all component classes (`.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.label`) so that every surface, text, and border colour adapts correctly in Dark_Mode.
6. THE Theme_Toggle SHALL display a sun icon in Dark_Mode and a moon icon in Light_Mode to communicate the action that will be taken on click.
7. WHEN Dark_Mode is active, THE Dashboard_UI SHALL ensure a minimum contrast ratio of 4.5:1 between body text and its background colour to meet WCAG AA accessibility standards.

---

### Requirement 5: Sidebar and Navigation

**User Story:** As a user, I want a clear, well-structured navigation sidebar that shows my current location and provides quick access to all sections, so that I can move through the platform efficiently.

#### Acceptance Criteria

1. THE Sidebar SHALL display the app logo, the authenticated user's display name, and the user's role label (Brand Account / Influencer Account) in a dedicated header section.
2. THE Sidebar SHALL render role-specific navigation links: Brand users see Dashboard, Find Influencers, My Offers; Influencer users see Dashboard, My Offers, Earnings.
3. WHEN a navigation link matches the current route, THE Sidebar SHALL apply an active style (accent background, accent text colour) to that link and SHALL NOT apply the active style to any other link simultaneously.
4. THE Sidebar SHALL display a logout button at the bottom that, when clicked, clears the JWT token and user data from `localStorage` and redirects to `/login`.
5. THE Sidebar SHALL apply smooth CSS transitions (150 ms) to hover and active state changes on navigation links.
6. WHERE the user's role is `BRAND`, THE Sidebar SHALL display a "New Offer" shortcut button below the navigation links that navigates to `/offers/new`.
7. THE Sidebar SHALL be 224 px wide on desktop (`lg` and above) and SHALL collapse to an off-canvas drawer on smaller screens as specified in Requirement 3.
8. WHEN the Sidebar is in collapsed/drawer mode on mobile, THE Sidebar SHALL animate open and closed using a slide-in transition of 200 ms or less.

---

### Requirement 6: Status Chips and Badges

**User Story:** As a user, I want offer statuses to be immediately recognisable through consistent colour-coded badges, so that I can scan lists and tables quickly.

#### Acceptance Criteria

1. THE Design_System SHALL define three badge utility classes in `index.css`: `.badge-pending` (amber background, amber text), `.badge-accepted` (green background, green text), and `.badge-rejected` (red background, red text).
2. WHEN an offer has status `PENDING`, THE Dashboard_UI SHALL render the Status_Badge using `.badge-pending`.
3. WHEN an offer has status `ACCEPTED`, THE Dashboard_UI SHALL render the Status_Badge using `.badge-accepted`.
4. WHEN an offer has status `REJECTED`, THE Dashboard_UI SHALL render the Status_Badge using `.badge-rejected`.
5. THE Status_Badge SHALL be rendered as a pill shape (fully rounded, `rounded-full`) with consistent horizontal padding of 10 px and vertical padding of 2 px across all pages that display offer status.
6. THE `getStatusBadgeClass` utility function in `formatters.js` SHALL return the correct badge class string for each status value so that all pages that call this function receive consistent styling.
7. THE Dashboard_UI SHALL render platform badges (Instagram, YouTube, TikTok) on the Influencers page and Creator_Profile using platform-specific colour tokens defined in `PLATFORM_COLORS` in `formatters.js`.

---

### Requirement 7: Loading Skeletons and Spinners

**User Story:** As a user, I want to see meaningful loading placeholders while data is being fetched, so that the interface feels responsive and I understand that content is on its way.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL display skeleton placeholders (not a blank screen or a full-page spinner) while the initial data for the Brand_Dashboard and Influencer_Dashboard is loading.
2. THE Dashboard_UI SHALL display `CardSkeleton` components in the StatCard grid positions while dashboard stats are loading.
3. THE Dashboard_UI SHALL display `TableRowSkeleton` components in table bodies while offer, influencer, and earnings list data is loading.
4. THE Skeleton component SHALL use a `bg-surface-200` base colour and an `animate-pulse` CSS animation, and SHALL adapt to `dark:bg-bg-hover` in Dark_Mode.
5. WHEN an API call completes (success or error), THE Dashboard_UI SHALL replace all skeleton placeholders with either the fetched content or an `EmptyState` component within one render cycle.
6. THE Spinner component SHALL be used for inline loading states (form submission buttons, action buttons) and SHALL NOT be used as the sole loading indicator for full-page data fetches.
7. THE Dashboard_UI SHALL display a `PageSpinner` only for route-level transitions where no skeleton layout is defined (e.g. the CreateOfferPage while the influencer list loads).

---

### Requirement 8: Creator Profile Pages

**User Story:** As a brand user, I want to view a detailed profile page for each influencer, so that I can evaluate their stats before sending an offer.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL provide a Creator_Profile route at `/influencers/:id` that fetches influencer data from `influencersApi.getById(id)` without requiring new backend endpoints.
2. THE Creator_Profile SHALL display the influencer's name, platform badge, follower count, and total earnings in a profile header section.
3. THE Creator_Profile SHALL display a stat summary section with at least three StatCards: Followers, Total Earnings, and Accepted Deals count — derived from the existing influencer and offers API responses.
4. THE Creator_Profile SHALL display a list or table of the influencer's accepted offers (brand name and amount) fetched from `offersApi.getByInfluencer` filtered to `status === "ACCEPTED"`.
5. THE Creator_Profile SHALL include a prominent "Send Offer" button that navigates to `/offers/new` with the influencer's id and name pre-populated via React Router `state`.
6. WHEN the Creator_Profile data is loading, THE Dashboard_UI SHALL display skeleton placeholders for the header and stat cards.
7. IF the influencer id in the route parameter does not correspond to an existing record, THEN THE Dashboard_UI SHALL display an `EmptyState` component with a "Influencer not found" message and a back-navigation link.
8. THE Influencers list page SHALL make each influencer row clickable (navigating to `/influencers/:id`) in addition to retaining the existing "Send Offer" action button.

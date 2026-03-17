# Studio Scope: WBSTT Social Growth Forecasting Dashboard

## OVERVIEW

You are building "Studio Scope", a social media growth forecasting dashboard for Warner Bros. Studio Tour Tokyo (WBSTT). This is a pitch tool for Ralph (a creative social agency) to demonstrate strategic thinking and analytical capability. If Ralph wins the account, it becomes a live operational tool.

This follows a proven pattern from two previous dashboards: "Care-A-Lytics" (Care Bears follower growth) and "HayStack" (Supercell player reactivation). The pattern: pre-loaded historical data, interactive strategy controls, a forecast model that responds to those controls, and an "Under the Hood" methodology section that builds client trust through transparency.

**What makes this one different:** WBSTT is a physical venue. Social followers convert to ticket buyers. The social-to-attendance connection is the unique strategic angle. Also: the audience is shifting from core Harry Potter fans (saturated) to casual fans and inbound tourists (growth opportunity).

## DESIGN SYSTEM

### Aesthetic: Cinematic, premium, dark mode. NOT cheesy Harry Potter theme.

Think: Warner Bros. studio title card. Gold on dark. Elegant, editorial. The dashboard should feel like looking at a sophisticated film industry analytics tool, not a Hogwarts fan site.

### Colors

```
--bg-primary: #0d0d1a          /* Near-black with blue undertone */
--bg-secondary: #141428         /* Card/panel backgrounds */
--bg-tertiary: #1c1c3a          /* Elevated surfaces, hover states */
--border: #2a2a4a               /* Subtle borders */

--gold-primary: #d4a843         /* WB Gold - primary accent */
--gold-light: #e8c86a           /* Gold highlight/hover */
--gold-dim: #8a7030             /* Gold muted/disabled */

--text-primary: #f5f0e8         /* Warm white */
--text-secondary: #a0a0b8       /* Muted text */
--text-dim: #5a5a72             /* Tertiary text */

--ig: #E1306C                   /* Instagram */
--x: #f5f5f5                    /* X/Twitter (white on dark) */
--tt: #00F2EA                   /* TikTok cyan */
--fb: #1877F2                   /* Facebook */
--yt: #FF0000                   /* YouTube */

--success: #4ade80              /* Green - positive growth */
--warning: #fbbf24              /* Amber - caution */
--danger: #ef4444               /* Red - negative/alert */

--forecast-base: #d4a843        /* Gold - base forecast line */
--forecast-optimistic: #4ade80  /* Green - optimistic band */
--forecast-pessimistic: #ef4444 /* Red - pessimistic band */
--forecast-actuals: #f5f0e8     /* White - actual data points */
```

### Typography

- Headers: `Playfair Display` (Google Fonts) - editorial, cinematic gravitas
- Body/Data: `Inter` (Google Fonts) - clean, excellent for numbers
- Monospace (data labels, Under the Hood): `JetBrains Mono` or `IBM Plex Mono`
- Japanese support: `Noto Sans JP` as fallback for JP text

### Spacing & Layout

- Desktop-first, single page scrollable with sticky nav
- Max content width: 1400px, centered
- Card-based modules with subtle border (--border color), no heavy shadows
- Module spacing: 48px between modules
- Internal card padding: 24px-32px
- Border radius: 12px for cards, 8px for internal elements

### Animation

- Subtle. No bouncing, no particle effects. Think: value transitions, smooth slider movement, chart line drawing
- Use CSS transitions (300ms ease) for interactive state changes
- Recharts animationDuration: 800ms for chart renders
- Tab/module transitions: fade, 200ms

### Key Design Rules

- NO emojis anywhere
- NO cheesy magical language or Harry Potter fonts
- NO gradient borders (unlike some other Ralph dashboards, this one is more restrained)
- Gold accent used sparingly: active states, key metrics, the forecast line
- Data density is high but readable. Prioritize clarity over visual flair.
- Platform colors ONLY used for platform-specific data, never for decoration

## TECH STACK

- **Framework:** React 18+ with TypeScript (Vite)
- **Styling:** Tailwind CSS with custom theme extending the design tokens above
- **Charts:** Recharts (primary), with D3 only if Recharts can't handle a specific visualization
- **Icons:** Lucide React
- **State:** React hooks (useState, useReducer, useContext). No external state management needed.
- **Fonts:** Google Fonts (Playfair Display, Inter, Noto Sans JP)
- **Build:** Vite, deployable to Vercel/Netlify or local dev server

## DATA

All historical data is pre-processed and lives in `src/data/historicalData.ts`. This covers June 2023 through December 2025 (the period with meaningful data). January 2026 is partial and should be excluded from trend calculations.

Campaign calendar data is in `src/data/campaigns.ts`.
Audience segment definitions are in `src/data/audiences.ts`.
Forecast model assumptions are in `src/data/assumptions.ts`.
All TypeScript interfaces are in `src/data/types.ts`.

**Do not re-process the CSV.** All data is already cleaned and structured in the TypeScript files.

## ARCHITECTURE: 9 MODULES

The dashboard is a single-page app with a sticky header/nav and 9 scrollable modules. Each module is a self-contained component. A sidebar or top nav allows jumping between modules.

### Module 1: State of Play (Historical Context)

**File:** `src/components/StateOfPlay.tsx`

Show where WBSTT is now and how it got here. This is the "credibility" module.

Components:
- **Multi-platform follower timeline** (line chart, Jun 2023 to Dec 2025). One line per platform, platform colors. Annotate key milestones (Jun 2023 launch, Nov 2024 IG spike, etc.)
- **Current snapshot cards** (4 cards, one per platform): follower count, avg monthly growth, avg engagement, trend arrow
- **Platform split donut** showing current % distribution
- **Monthly engagement heatmap** (small multiples or calendar grid) showing seasonal patterns

Key insight to surface visually: X plateaued after launch. Instagram is the engine. TikTok is underperforming relative to potential. Show this with annotations or callout cards.

### Module 2: Audience Composition Engine

**File:** `src/components/AudienceEngine.tsx`

The strategic control center. Three preset audience mixes plus custom.

- **Preset selector:** 4 buttons/cards - "Core Retention", "Casual Expansion" (highlighted as recommended), "Tourism Push", "Custom"
- **Segment sliders** (3 sliders that sum to 100%): Core Fans, Light Fans, Inbound Tourists
- **Segment detail cards:** Each segment shows description, platform affinity (icon badges), content style, estimated pool size, assumed follow conversion rate
- **Visual: Audience composition donut** that updates in real time as sliders move

Selecting a preset snaps all sliders to that configuration. Custom lets you drag freely (must sum to 100%).

This module's output feeds into Module 3 (platform allocation) and Module 4 (forecast).

### Module 3: Platform Strategy Matrix

**File:** `src/components/PlatformMatrix.tsx`

Translates audience composition into content allocation.

- **Per-platform row:** IG, TikTok, X, Facebook, YouTube
- Each row has: posts/month slider (0-30), content type breakdown (pie or stacked bar), primary audience badge, language allocation toggle
- **Total posts counter** at top showing sum vs 50/month KPI target
- **Language split toggle:** JP Only / JP+EN / JP+EN+ZH+KO (affects content volume multiplier)

When audience composition changes (Module 2), platform defaults shift. But user can override.

Default for "Casual Expansion" preset:
- IG: 18 posts/mo (40% video, 30% static, 20% stories, 10% UGC)
- TikTok: 12 posts/mo (100% video)
- X: 12 posts/mo (20% video, 50% static, 30% UGC)
- Facebook: 4 posts/mo (30% video, 50% static, 10% stories, 10% UGC)
- YouTube: 4 posts/mo (100% video)
- Total: 50

### Module 4: Follower Forecast (The Main Event)

**File:** `src/components/FollowerForecast.tsx`

The star of the dashboard. Projects 12-month follower growth.

Components:
- **Primary chart:** Line chart with confidence bands
  - Gold line = base forecast
  - Green-tinted area above = optimistic scenario
  - Red-tinted area below = pessimistic scenario
  - White dots = actuals (empty for now, populated monthly)
  - Campaign markers along x-axis (toggleable)
- **Target progress gauge:** Progress toward +100K goal
- **Growth breakdown table:** Monthly projected adds by platform
- **Scenario toggle:** "Organic Only" / "With Strategy" / "With Campaigns" to show incremental impact of each layer

Forecast formula (implement in `src/utils/forecastEngine.ts`):

```
monthlyGrowth[platform] = 
  organicBase[platform]
  * contentVolumeMultiplier(postsPerMonth[platform], baselinePosts[platform])
  * audienceCompositionMultiplier(segments, platformAffinity)
  * campaignMultiplier(activeCampaigns[month])
  * seasonalMultiplier(month)
```

Where:
- organicBase comes from historical averages (assumptions.ts)
- contentVolumeMultiplier scales growth based on post count vs baseline
- audienceCompositionMultiplier adjusts based on segment mix (light fans have higher TT conversion, etc.)
- campaignMultiplier applies event-specific lifts
- seasonalMultiplier accounts for Golden Week, summer, Halloween, Xmas patterns

The chart should update in real-time as Modules 2, 3, and 6 are adjusted.

### Module 5: Engagement Forecast

**File:** `src/components/EngagementForecast.tsx`

Tracks the +10% YoY engagement KPI.

- **YoY comparison chart:** 2024 monthly engagement vs 2025 vs 2026 projected (three overlapping lines)
- **Platform engagement breakdown:** Bar chart comparing engagement rates by platform
- **Tension indicator:** Visual showing the tradeoff: shifting to casual fans may lower per-post engagement rate while increasing total engagement volume. Show both metrics.
- **Alert zone:** If projected engagement drops below target threshold, highlight in red

### Module 6: Campaign Calendar

**File:** `src/components/CampaignCalendar.tsx`

Interactive timeline of 2026 events that feed into the forecast.

- **Visual timeline** (horizontal Gantt-style) showing campaign periods across the year
- **Campaign cards** with toggle on/off, editable multiplier, platform focus
- **Special events callout:** 25th Anniversary, HP TV series
- **Seasonal overlay:** Cherry blossom, Golden Week, summer, Halloween, winter holiday periods

Each campaign has a toggle that instantly reflects in the Module 4 forecast. Campaigns have default multipliers from `campaigns.ts` but can be manually adjusted (1.0x to 2.0x slider).

### Module 7: Content Volume Tracker

**File:** `src/components/ContentTracker.tsx`

Operational KPI tracking for the 50 posts/month target.

- **Monthly bar chart:** Posts by platform (stacked), actual vs target line
- **Content type breakdown:** Video / Static / Stories / UGC per platform
- **Historical comparison:** Shows current output (~108/month) vs the 50 KPI target with annotation that this reframes the KPI as quality/strategic allocation rather than volume

This module is simpler than the others. It's operational, not strategic.

### Module 8: Under the Hood

**File:** `src/components/UnderTheHood.tsx`

Full methodology transparency. The trust builder.

Tabbed interface:
1. **Data Sources:** Three columns - Client Data (CSV, platform access), Industry Benchmarks (source citations), Ralph Methodology (proprietary assumptions)
2. **Forecast Formula:** Interactive breakdown, click any variable to see its value and source
3. **Assumptions Log:** Table of every assumption with value, confidence level (High/Medium/Low), and source
4. **Seasonal Model:** Visualization of seasonal adjustment factors by month
5. **Audience Model:** How segment definitions map to conversion rate assumptions

Design: More technical, slightly more monospace font usage. Think documentation/wiki feel but still within the design system.

### Module 9: AI Strategy Assessment

**File:** `src/components/AIAssessment.tsx`

Placeholder for AI-powered analysis (not wired to OpenAI for the pitch prototype).

- **Assessment panel** with pre-written strategic observations based on current configuration
- **Recommendation cards** (3-4 key suggestions)
- **Impact estimate** for each recommendation
- Show a "Generate Assessment" button that reveals the pre-written analysis with a brief loading animation (simulated)

For the prototype, hardcode 3-4 insightful observations:
1. TikTok content volume opportunity (10 posts/mo vs potential 12+)
2. Language expansion ROI (adding EN/KO content could unlock tourist segment)
3. Campaign stacking during peak tourist months
4. X platform diminishing returns vs reallocation to TikTok

## FILE STRUCTURE

```
studio-scope/
  CLAUDE.md
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
  index.html
  public/
  src/
    main.tsx
    App.tsx
    index.css                    (Tailwind imports + custom CSS variables)
    components/
      Header.tsx                 (Logo, title, nav, language toggle)
      ModuleNav.tsx              (Sticky side or top navigation)
      StateOfPlay.tsx            (Module 1)
      AudienceEngine.tsx         (Module 2)
      PlatformMatrix.tsx         (Module 3)
      FollowerForecast.tsx       (Module 4)
      EngagementForecast.tsx     (Module 5)
      CampaignCalendar.tsx       (Module 6)
      ContentTracker.tsx         (Module 7)
      UnderTheHood.tsx           (Module 8)
      AIAssessment.tsx           (Module 9)
      shared/
        MetricCard.tsx           (Reusable stat card)
        SliderControl.tsx        (Reusable labeled slider)
        ToggleSwitch.tsx         (Reusable toggle)
        SectionHeader.tsx        (Module title + description)
        PlatformBadge.tsx        (Platform icon + color)
        Tooltip.tsx              (Hover explanations)
    data/
      types.ts                   (All TypeScript interfaces)
      historicalData.ts          (Pre-processed monthly platform data)
      campaigns.ts               (2026 campaign calendar)
      audiences.ts               (Segment definitions and presets)
      assumptions.ts             (Forecast model assumptions)
    hooks/
      useDashboardState.ts       (Central state management)
      useForecast.ts             (Forecast calculation hook)
    utils/
      forecastEngine.ts          (Core forecast math)
      formatters.ts              (Number formatting, date formatting)
      calculations.ts            (Derived metrics, engagement rates, etc.)
    styles/
      (empty - using Tailwind + index.css)
```

## BUILD PRIORITY

Build in this order. Each phase should be functional before moving to next.

### Phase 1: Foundation
1. Project scaffolding (Vite + React + TS + Tailwind)
2. Design system (CSS variables, Tailwind config, fonts)
3. App shell (Header, ModuleNav, scroll layout)
4. Shared components (MetricCard, SliderControl, SectionHeader, PlatformBadge)

### Phase 2: Data & Historical View
5. Module 1: State of Play (the historical charts and snapshot cards)
6. This proves the data layer works and looks good

### Phase 3: Strategic Controls
7. Module 2: Audience Composition Engine (presets + sliders)
8. Module 3: Platform Strategy Matrix
9. Wire them together (audience changes affect platform defaults)

### Phase 4: The Forecast
10. `forecastEngine.ts` - implement the math
11. Module 4: Follower Forecast (the main chart)
12. Wire forecast to modules 2 and 3 inputs
13. Module 5: Engagement Forecast

### Phase 5: Calendar & Operations
14. Module 6: Campaign Calendar
15. Wire campaigns into forecast
16. Module 7: Content Volume Tracker

### Phase 6: Trust & Intelligence
17. Module 8: Under the Hood
18. Module 9: AI Assessment (hardcoded for prototype)

### Phase 7: Polish
19. Responsive adjustments (1366px+ primary, 1024px secondary)
20. Smooth transitions and micro-interactions
21. Module-to-module cross-references
22. Final visual QA

## IMPORTANT NOTES

- **No em dashes in any text.** Use commas, colons, parentheses, or separate sentences instead.
- **No cheesy Harry Potter theming.** This is a Warner Bros. business tool, not a fan site. The gold-on-dark palette nods to WB brand without being literal.
- **All numbers should be formatted with commas** (e.g., 224,070 not 224070).
- **The forecast is the hero.** Everything else exists to feed into or contextualize the forecast. When in doubt about design priority, make the forecast chart look incredible.
- **Japanese language toggle** is a future feature. For now, build in English only but use a structure that would support i18n later (string constants, not hardcoded text).
- **Performance matters.** Slider interactions should feel instant. Don't re-render the entire dashboard on every slider change. Use React.memo and useMemo appropriately.
- **The dashboard should work locally with `npm run dev`.** No backend, no database, no API calls for the pitch version. Everything is client-side.
- **Footer:** Small Ralph logo + "Built by Ralph Innovation" + current year. Subtle, not prominent.

# DESIGN.md

This file is the design contract for the entire project.
If a screen, component, interaction, or content pattern is not covered here, it must still follow the intent of this document: Apple-style clarity, restraint, and consistency-first execution.

## 1. Design Intent

The product is a Vietnamese quiz-review application for fast study and review. The interface must feel calm, precise, and trustworthy. The visual language should reduce cognitive load, keep the question content dominant, and make progress, mistakes, and review state instantly legible.

The system must optimize for:

- Fast scanning of large question sets.
- Immediate feedback after answer selection.
- Persistent study state across reloads.
- Expandable patterns for future dashboard, analytics, and review workflows.
- Strong readability on desktop and mobile.

The experience should feel closer to a premium learning tool than a decorative website.

## 2. Design Principles

### 2.1 Clarity First

Every screen must answer three questions immediately:

- What is the current question or task?
- What state am I in?
- What action can I take next?

Use clear hierarchy, concise labels, and stable placement for status and controls.

### 2.2 Consistency First

Repeated UI patterns must behave and look the same across the app. Identical states use identical tokens. No component may invent its own colors, spacing, or radius without being declared in this document.

### 2.3 Calm Density

The app can be information-dense, but density must come from structure, not visual noise. Prefer whitespace, alignment, and grouping over borders, shadows, and decorative effects.

### 2.4 One Primary Accent

Use one accent color for primary actions and selected states. Secondary semantic colors are reserved for feedback only. Do not introduce multiple competing brand accents.

### 2.5 State Transparency

Correct, incorrect, unanswered, filtered, selected, disabled, and empty states must be obvious without requiring explanation.

### 2.6 Content Over Chrome

Question text, answer text, explanations, and progress data are the main product. Visual treatment must support reading and decision-making, not compete with it.

## 3. Visual Theme

### 3.1 Overall Mood

Apple-inspired minimalism with study-app pragmatism:

- bright canvas
- soft elevated surfaces
- restrained shadows
- tight typography hierarchy
- precise rounded geometry
- subtle motion

### 3.2 Brand Personality

- trustworthy
- focused
- premium but not luxurious
- modern but not trendy
- educational and low-friction

### 3.3 Color Direction

Primary surfaces should stay neutral. Accent color should be reserved for interactive emphasis, selected navigation, and focus rings. Success and danger colors are semantic, not decorative.

## 4. Design Tokens

Tokens are the canonical source of truth. Implementations may alias them, but they must not create new semantic meanings.

### 4.1 Color Tokens

#### Core Surfaces

| Token | Value | Role |
| --- | --- | --- |
| `color.canvas` | `#fbfbfc` | Page background |
| `color.surface` | `#ffffff` | Default card and panel background |
| `color.surface-elevated` | `#f7f8fa` | Secondary surface, subtle grouping |
| `color.surface-subtle` | `#f2f4f7` | Soft panel fill, input fill |
| `color.surface-inverse` | `#111114` | Dark callout, optional future mode |

#### Text

| Token | Value | Role |
| --- | --- | --- |
| `color.text-primary` | `#111114` | Main headings and body |
| `color.text-secondary` | `#5c6270` | Supporting copy and metadata |
| `color.text-tertiary` | `#8b93a4` | Hints, placeholders, subdued labels |
| `color.text-inverse` | `#ffffff` | Text on dark surfaces |

#### Brand and Interaction

| Token | Value | Role |
| --- | --- | --- |
| `color.brand` | `#0a84ff` | Primary action, selection, links |
| `color.brand-hover` | `#006fe0` | Hover state on primary actions |
| `color.brand-pressed` | `#0059b8` | Pressed state on primary actions |
| `color.focus-ring` | `rgba(10, 132, 255, 0.28)` | Accessible focus halo |

#### Semantic Feedback

| Token | Value | Role |
| --- | --- | --- |
| `color.success` | `#34c759` | Correct answer, success badge |
| `color.success-soft` | `rgba(52, 199, 89, 0.12)` | Soft success background |
| `color.warning` | `#ff9f0a` | Caution, partial attention |
| `color.warning-soft` | `rgba(255, 159, 10, 0.12)` | Soft warning background |
| `color.danger` | `#ff3b30` | Wrong answer, destructive action |
| `color.danger-soft` | `rgba(255, 59, 48, 0.12)` | Soft error background |
| `color.info` | `#64d2ff` | Informational highlights |

#### Hairlines and Borders

| Token | Value | Role |
| --- | --- | --- |
| `color.border-subtle` | `rgba(17, 17, 20, 0.08)` | Default border |
| `color.border-strong` | `rgba(17, 17, 20, 0.14)` | Stronger separation |
| `color.border-focus` | `rgba(10, 132, 255, 0.35)` | Interactive focus border |

#### Utility Overlays

| Token | Value | Role |
| --- | --- | --- |
| `color.scrim` | `rgba(17, 17, 20, 0.48)` | Modal overlay |
| `color.backdrop-soft` | `rgba(255, 255, 255, 0.72)` | Frosted panel background |

### 4.2 Spacing Tokens

Use an 8px-based rhythm, with smaller subdivisions allowed only for fine alignment.

| Token | Value |
| --- | --- |
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `12px` |
| `space-4` | `16px` |
| `space-5` | `20px` |
| `space-6` | `24px` |
| `space-8` | `32px` |
| `space-10` | `40px` |
| `space-12` | `48px` |
| `space-16` | `64px` |
| `space-20` | `80px` |

Use `space-4` and `space-6` for internal component padding, `space-8` to `space-12` for section separation, and `space-16+` for page-level rhythm.

### 4.3 Typography Tokens

#### Font Stack

Preferred stack:

`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Be Vietnam Pro", "Segoe UI", sans-serif`

Rules:

- Prefer SF Pro when available.
- Preserve Vietnamese diacritics and legibility above stylistic purity.
- Do not use novelty display fonts.
- Use monospaced text only for technical metadata or counts if necessary.

#### Type Scale

| Token | Size / Line Height | Use |
| --- | --- | --- |
| `type.display` | `48px / 1.05` | Page hero or major mode title |
| `type.h1` | `36px / 1.12` | Screen title |
| `type.h2` | `28px / 1.18` | Panel title, section title |
| `type.h3` | `22px / 1.25` | Subsection heading |
| `type.body` | `16px / 1.55` | Main reading text |
| `type.body-strong` | `16px / 1.4` | Emphasized reading text |
| `type.caption` | `13px / 1.35` | Helper text, metadata |
| `type.micro` | `12px / 1.3` | Very small labels only |

#### Weight Rules

- `400` for body copy.
- `500` for labels and neutral UI text.
- `600` for controls, headings, and badges.
- `700` for numeric emphasis or KPI values.
- Avoid overuse of `800+`; Apple-style clarity depends more on spacing and weight contrast than heavy bolding.

#### Letter Spacing

- Display headings: slightly negative tracking.
- Body text: zero tracking.
- Labels and all-caps micro-eyebrows: modest positive tracking.

### 4.4 Radius Tokens

| Token | Value | Use |
| --- | --- | --- |
| `radius-xs` | `8px` | Small inputs, tags |
| `radius-sm` | `12px` | Standard controls |
| `radius-md` | `16px` | Cards, panels |
| `radius-lg` | `20px` | Prominent cards, detail containers |
| `radius-xl` | `28px` | Hero surfaces |
| `radius-pill` | `9999px` | Pills, chips, segmented controls |

### 4.5 Shadow and Elevation Tokens

Shadows must be subtle. Do not use heavy blur or multi-directional drop shadows.

| Token | Value | Use |
| --- | --- | --- |
| `shadow-sm` | `0 1px 2px rgba(17, 17, 20, 0.06)` | Tiny elevation |
| `shadow-md` | `0 8px 24px rgba(17, 17, 20, 0.08)` | Floating panels |
| `shadow-lg` | `0 16px 40px rgba(17, 17, 20, 0.12)` | Dialogs, drawers |
| `shadow-focus` | `0 0 0 4px rgba(10, 132, 255, 0.14)` | Focus ring halo |

Depth hierarchy should primarily be created by surface contrast, border weight, and spacing, not by shadow intensity.

### 4.6 Motion Tokens

| Token | Value | Use |
| --- | --- | --- |
| `motion-fast` | `120ms` | Hover, icon shift, small transitions |
| `motion-medium` | `180ms` | Standard button, badge, panel transitions |
| `motion-slow` | `240ms` | Drawer, modal, content reveal |
| `motion-emphasis` | `320ms` | Large layout transitions |

#### Easing

- `ease-out` for entry and reveal.
- `ease-in-out` for state transitions.
- Avoid springy or bouncy motion.

### 4.7 Elevation System

Elevation levels are semantic and must be consistent.

| Level | Meaning |
| --- | --- |
| `elevation-0` | Flat canvas |
| `elevation-1` | Standard cards and controls |
| `elevation-2` | Sticky bars, floating toolbars |
| `elevation-3` | Modals, drawers, overlays |

## 5. Grid and Layout

### 5.1 Page Frame

- Max content width: `1440px`.
- Comfortable reading width for text-heavy areas: `680px` to `760px`.
- Primary app shell should have generous side padding on desktop and compact padding on mobile.

### 5.2 Grid System

Use a responsive grid, but do not force content into a rigid masonry model.

- Desktop: 12-column grid.
- Tablet: 8-column grid.
- Mobile: 4-column grid.

### 5.3 Core App Layout

The main learning flow is a two-panel layout:

- Left panel: question list, filters, review status.
- Right panel: active question, answer options, feedback, explanation.

Recommended desktop split:

- Left panel: `320px` to `420px`.
- Right panel: flexible remainder.

### 5.4 Responsive Behavior

#### Desktop and Large Screens

- Preserve the two-panel learning layout.
- Keep the list scrollable independently from the detail panel when necessary.
- Keep primary actions visible above the fold.

#### Tablet

- Reduce panel density slightly.
- Maintain two-panel layout when space allows.
- Collapse low-priority utilities into a secondary row or overflow menu.

#### Mobile

- Stack into a single-column flow.
- Prioritize the active question and answer choices first.
- Move the question list into a collapsible panel, bottom sheet, or searchable drawer if necessary.
- Keep touch targets large and interactions thumb-friendly.

### 5.5 Layout Rhythm

- Page sections: `space-12` to `space-16`.
- Card internal padding: `space-4` to `space-6`.
- Dense lists: `space-2` to `space-3` between rows.
- Avoid visually cramped vertical stacks.

## 6. Components

Every component must define states for default, hover, pressed, focused, disabled, loading if applicable, and selected or active when relevant.

### 6.1 Button

#### Variants

- Primary: main action.
- Secondary: non-primary action.
- Tertiary / text: low-emphasis action.
- Danger: destructive action.
- Icon-only: compact utility action.

#### Rules

- Primary buttons use `color.brand`.
- Secondary buttons use neutral surfaces with border.
- Danger buttons use danger semantic color only when destructive action is real.
- Icon-only buttons must still have a visible focus state and an accessible label.
- Default minimum touch target: `44px` height.

### 6.2 Input Family

#### Supported Inputs

- Text input
- Search input
- Textarea
- Select
- Checkbox
- Radio
- Toggle
- Filter chips

#### Rules

- Labels stay above fields in study flows.
- Helper text appears below the field.
- Errors use semantic danger state, but copy must explain the fix.
- Search inputs should visually read as a command or filter tool, not a form burden.

### 6.3 Form Layout

- Use vertical label-first forms.
- Keep groups short and purposeful.
- Place action buttons after the final field, aligned to the primary reading direction.
- For dense editor/admin views, use compact grouped forms with strong spacing rules.

### 6.4 Table System

Tables are required for future progress dashboards, question bank management, and review administration.

#### Table Requirements

- sortable columns
- filter row or filter chips
- expandable rows
- sticky header for long tables
- row-level actions in overflow menu
- selection state for batch operations

#### Table Rules

- Data must stay aligned and scannable.
- Use subtle zebra behavior only if it improves readability.
- Use right-aligned numbers for stats.
- Empty and loading states must be explicit.

### 6.5 Navigation

#### Sidebar

- Used for question browsing, filters, review queues, and future sections.
- Active item is visually distinct through fill, accent, or border, not color alone.

#### Topbar

- Used for title, global actions, and session summary.
- Keep topbar compact and stable.

#### Breadcrumb

- Use only where navigation depth exists.
- Do not show decorative breadcrumbs on flat flows.

### 6.6 Modal and Drawer

#### Modal

- Use for confirmations, reset actions, import warnings, and destructive actions.
- Must have accessible focus trapping and an obvious close affordance.

#### Drawer

- Use for settings, detailed question metadata, review explanations, or mobile navigation.
- Drawer should feel like a calm surface extension, not a separate product.

### 6.7 Toast

- Use for lightweight confirmations only.
- Toasts are not a substitute for important persistent state.
- Keep copy short and specific.

### 6.8 Cards and Analytics Blocks

Cards should be the default container for study summary, progress, and detail groups.

#### Card Rules

- Flat or subtly elevated surface.
- Rounded corners from the token scale.
- Clear title, value, and supporting line.
- Do not over-decorate empty analytics boxes.

### 6.9 Avatar, Tag, Badge

#### Avatar

- Use for user identity or profile if introduced later.
- Keep it simple and circular.

#### Tag

- Use for question tags, topics, and metadata.
- Tags are neutral by default; use semantic color only when the tag itself carries a meaning.

#### Badge

- Use for quick status labels like correct, wrong, unanswered, review-only, or count indicators.
- Badge text must be short.

### 6.10 Empty State

Empty state is a first-class component, not a fallback.

- State should explain why the area is empty.
- Offer a clear next action.
- Keep illustration optional and lightweight.

## 7. Product-Specific Patterns

### 7.1 Question List Item

Each question row must communicate:

- question number or short preview
- completion state
- correct or incorrect status
- active selection

Design rules:

- row height must be comfortable to scan
- status chip must be small but legible
- active row must be visually distinct without overwhelming the list

### 7.2 Answer Option Card

Each option must feel tappable and unambiguous.

- full-row hit area
- selected state is obvious
- correct and wrong states are visually distinguishable
- option labels remain readable even on small screens

### 7.3 Feedback Panel

Feedback appears immediately after answer selection.

- Neutral state: invite action.
- Correct state: confirm success and continue.
- Wrong state: explain what happened and point to the correct answer.

The feedback panel must never bury the answer result below decorative content.

### 7.4 Progress Summary

Progress metrics should be readable at a glance:

- total questions
- answered count
- correct count
- wrong count
- progress percentage

Use compact cards or chips rather than dense tables for top-level progress.

### 7.5 Review-Only Mode

Review-only mode is a high-value study shortcut.

- It must be easy to toggle on and off.
- Empty review results must explain what to do next.
- The user should always understand whether the list is filtered or complete.

### 7.6 Reset Flow

Reset is destructive and must require a clear confirmation step when implemented beyond a simple local action.

- Use danger styling sparingly.
- Copy must say exactly what will be cleared.
- After reset, the UI should visibly return to a clean baseline.

## 8. Interaction Rules

### 8.1 Selection

- Selected question state must persist and be obvious.
- Selection changes should not feel jarring.
- If a filter removes the active item, move to the nearest valid item or an explanatory empty state.

### 8.2 Answering

- Result feedback is immediate.
- Correctness must be derived deterministically from the answer key.
- If the same answer is revisited, the prior state must be restored.

### 8.3 Hover and Pressed States

- Hover states are subtle on desktop.
- Pressed states compress the surface slightly or darken the fill.
- Never rely on hover for essential information.

### 8.4 Focus States

- Keyboard focus must be obvious.
- Focus rings must not be hidden.
- Do not replace focus with hover-only styling.

### 8.5 Filtering and Search

- Filters should feel like study controls, not admin controls.
- Active filters must be visible.
- Filtering must always preserve clear exit paths.

## 9. Motion

Motion must be functional, not decorative.

### 9.1 Motion Philosophy

- Use motion to confirm action, focus attention, and communicate state change.
- Motion should never slow the user down.
- Keep transitions short and precise.

### 9.2 Recommended Patterns

- Row hover lift: subtle.
- Panel reveal: gentle fade and translate.
- Modal and drawer: smooth ease-out entry.
- Badge or progress updates: minimal and calm.

### 9.3 Motion Restrictions

- No bounce unless intentionally playful in a non-core surface.
- No exaggerated parallax.
- No looping animations that compete with reading.

### 9.4 Reduced Motion

Honor reduced-motion preferences by removing or simplifying non-essential transitions.

## 10. Accessibility

Accessibility is required, not optional.

### 10.1 Visual Accessibility

- Maintain strong contrast for all text and controls.
- Do not use color alone to convey state.
- Keep focus indicators visible.

### 10.2 Keyboard Accessibility

- Every interactive component must be reachable by keyboard.
- Focus order must follow reading order.
- Common actions should be operable without a mouse.

### 10.3 Screen Reader Support

- Provide meaningful labels for icon buttons.
- Announce state changes for important interactions.
- Empty, loading, and error states must be understandable without visual cues.

### 10.4 Touch Accessibility

- Minimum target size: `44px`.
- Avoid tightly packed tap targets.
- Provide enough spacing for finger input on mobile.

### 10.5 Vietnamese Language Support

- Preserve diacritics in every state.
- Avoid clipping long Vietnamese labels.
- Allow for longer text expansion in buttons, badges, and helper copy.

## 11. Writing Style

### 11.1 Tone

The voice should be:

- clear
- direct
- helpful
- calm
- confident

### 11.2 Content Rules

- Prefer short sentences.
- Use active voice.
- Use concrete labels over abstract marketing language.
- State the result first, then the explanation if needed.

### 11.3 Quiz Feedback Copy

Recommended structure:

- Correct: confirm success in one short sentence.
- Wrong: name the chosen answer, name the correct answer, then optionally show the note.
- Empty: tell the user what to do next.

Example style:

- “Đúng rồi. Lựa chọn của bạn khớp với đáp án chuẩn.”
- “Sai rồi. Bạn đã chọn B, đáp án đúng là D.”
- “Chọn một đáp án để nhận phản hồi ngay lập tức.”

### 11.4 Labels and Buttons

- Button labels should start with the action.
- Avoid vague verbs like “Submit” if a more specific Vietnamese label exists.
- Keep destructive labels explicit.

### 11.5 Numbers and Metrics

- Display numbers clearly and consistently.
- Prefer compact forms for progress counters.
- Do not hide important counts in helper text.

## 12. Content and Information Architecture

### 12.1 Hierarchy

Information must descend in this order:

1. Current task.
2. State and feedback.
3. Supporting explanation.
4. Secondary metadata.

### 12.2 Navigation Model

- Use the question list as the primary navigation model.
- Use filters as a secondary refinement model.
- Use detail panels for deep inspection, not broad navigation.

### 12.3 Density Rules

- Dense lists are acceptable when the content is repetitive and structured.
- Reading-heavy sections should breathe more.
- Do not force every surface into the same density level.

## 13. Deliverable Standards

Any design handoff or future AI-generated UI output must include the following artifact structure when relevant:

- `/design-system` for tokens, type, and reusable primitives.
- `/design-md` for the contract and design rationale.
- `/screens` for hi-fi screen definitions.
- `/assets` for icons, illustrations, and exports.
- `/prototype` for interaction references and motion notes.

If the implementation is code-first, these artifacts may remain conceptual, but their structure and semantics must still be respected.

## 14. Required UI Kit Coverage

The design system must support at minimum:

- Buttons: primary, secondary, danger, text, icon-only.
- Inputs: text, search, textarea, select, checkbox, radio, toggle.
- Forms: single-column and compact grouped layouts.
- Tables: sortable, filterable, expandable.
- Navigation: sidebar, topbar, breadcrumb.
- Modal, drawer, toast.
- Cards and analytics blocks.
- Avatar, tag, badge.
- Empty state.

For this project, the most important custom patterns are:

- question list item
- answer option card
- feedback panel
- progress summary cards
- review-only filter chip
- reset confirmation modal
- study-state empty screen

## 15. UX Rationale

### 15.1 Why This System Works for the Product

This app is about repeated reading, recognition, and correction. A restrained Apple-style system is appropriate because it keeps attention on the study content instead of ornamental interface chrome.

### 15.2 Why Tokens Matter Here

The project will likely evolve: more analytics, more filters, more review states, and possibly more content sources. A strict token system prevents visual drift as features expand.

### 15.3 Why One Accent Is Enough

Study apps benefit from fast recognition. One accent color makes selected state, action state, and focus state consistent. Semantic colors then remain reserved for correctness and warnings.

### 15.4 Why Calm Motion Matters

The user’s main task is learning, not exploring animation. Motion should confirm interactions and keep the interface feeling alive without demanding attention.

## 16. Do and Don’t

### Do

- Do keep the question content dominant.
- Do use consistent cards, chips, and statuses.
- Do keep controls in stable locations.
- Do make empty and error states explanatory.
- Do preserve Vietnamese readability.

### Don’t

- Don’t add decorative gradients to every surface.
- Don’t use multiple unrelated accent colors.
- Don’t hide important state in subtle text alone.
- Don’t let shadows become the main source of hierarchy.
- Don’t rely on hover for essential interactions.

## 17. Source of Truth Rule

If implementation, mockup, or generated output conflicts with this file, this file wins.
If a new pattern is needed, update this contract before shipping the new pattern.

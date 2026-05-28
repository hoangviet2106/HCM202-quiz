# DESIGN.md - Gen Z Edition 🚀

Ứng dụng quiz HCM cho Gen Z - **Bold, Dynamic, Playful nhưng Professional**.

Thiết kế này tối ưu cho:
- Tương tác nhanh, feedback tức thì
- Động lực học tập (gamification feel)
- Văn hóa visual Gen Z (gradients, bold colors, modern typography)
- Mobile-first nhưng desktop qua hay
- Vietnamese diacritics luôn crystal clear

---

## 1. Design Philosophy

### Tone of Voice
- **Energetic** (không boring)
- **Supportive** (chúng tôi ở bên bạn)
- **Real** (không fake marketing)
- **Fast** (mobile + instant feedback)
- **Fun** (nhưng không childish)

### Visual Identity
Kết hợp:
- **Modern gradient colors** (vibrancy)
- **Bold typography** (personality)
- **Smooth animations** (feel alive)
- **Clear micro-interactions** (dopamine hits)
- **Gen Z approved icons & emojis** (relatability)

---

## 2. Color System

### Core Palette - VIBRANT & DYNAMIC

#### Primary Gradient (Main Brand)
```
Gradient: #6366F1 (Indigo) → #8B5CF6 (Purple) → #D946EF (Magenta)
Hex values:
- color.primary-start: #6366F1
- color.primary-mid: #8B5CF6
- color.primary-end: #D946EF
```
*Used for: Main CTAs, highlight, active states, gradients*

#### Secondary Accent (Neon Energy)
```
- color.accent-neon: #00D9FF (Cyan/Electric Blue)
- color.accent-hot: #FF006E (Hot Pink)
- color.accent-lime: #06FFA5 (Lime Green)
```

#### Surface & Background
```
- color.canvas: #0F0F1E (Deep dark navy - optional dark mode vibes)
- color.surface-light: #FFFFFF (Pure white for cards)
- color.surface-elevated: #F8F9FF (Subtle purple tint)
- color.surface-subtle: #F3F4F9 (Soft background)
```

#### Text Colors
```
- color.text-primary: #0F0F1E (Dark navy)
- color.text-secondary: #6B7280 (Medium gray)
- color.text-tertiary: #9CA3AF (Light gray)
- color.text-inverse: #FFFFFF (White on dark)
- color.text-interactive: #6366F1 (Clickable text)
```

#### Semantic Feedback (with POP!)
```
✅ Correct Answer:
   - color.success: #06FFA5 (Bright lime green)
   - color.success-soft: rgba(6, 255, 165, 0.15)
   - color.success-glow: rgba(6, 255, 165, 0.3)

❌ Wrong Answer:
   - color.danger: #FF006E (Hot pink)
   - color.danger-soft: rgba(255, 0, 110, 0.15)
   - color.danger-glow: rgba(255, 0, 110, 0.3)

⚠️ Warning/Neutral:
   - color.warning: #FFA500 (Orange)
   - color.warning-soft: rgba(255, 165, 0, 0.15)

ℹ️ Info:
   - color.info: #00D9FF (Cyan)
   - color.info-soft: rgba(0, 217, 255, 0.15)
```

#### Borders & Separators
```
- color.border-light: rgba(99, 102, 241, 0.2)
- color.border-medium: rgba(99, 102, 241, 0.4)
- color.border-focus: #6366F1
- color.divider-subtle: rgba(0, 0, 0, 0.06)
```

---

## 3. Typography

### Font Stack
```
'Inter', 'Segoe UI', -apple-system, 'Be Vietnam Pro', sans-serif
```
**Why?**
- Inter: Modern, super clean, Gen Z approved
- Be Vietnam Pro: Perfect Vietnamese diacritics
- Fallbacks: macOS/Windows/web safe

### Type Scale (Clean & Bold)

| Token | Size / Weight / Line-height | Usage |
|-------|---------------------------|-------|
| `type.display` | 56px / 700 / 1.1 | Hero/page title |
| `type.h1` | 40px / 700 / 1.2 | Main heading |
| `type.h2` | 32px / 700 / 1.3 | Section title |
| `type.h3` | 24px / 600 / 1.4 | Subsection |
| `type.body` | 16px / 400 / 1.6 | Reading text |
| `type.body-strong` | 16px / 600 / 1.6 | Emphasized |
| `type.label` | 14px / 600 / 1.5 | Button/chip text |
| `type.caption` | 13px / 500 / 1.4 | Helper text |
| `type.micro` | 12px / 500 / 1.3 | Tiny labels |

### Weight Strategy
- **400**: Body copy, neutral text
- **500**: Labels, UI text
- **600**: Buttons, badges, emphasis
- **700**: Headings, strong titles
- *Avoid 800+* - makes it look aggressive

### Letter Spacing
- Display/headings: `-0.02em` (tight, modern)
- Body: `0` (normal)
- Labels: `0.3px` (subtle breathing room)

---

## 4. Spacing & Layout

### Base Unit: 8px Grid
```
space-1: 4px
space-2: 8px
space-3: 12px
space-4: 16px
space-5: 20px
space-6: 24px
space-8: 32px
space-10: 40px
space-12: 48px
space-16: 64px
space-20: 80px
```

### Component Padding
- Buttons: `12px 24px` (space-3 + space-6)
- Cards: `space-6` (24px)
- Input fields: `space-4` (16px)
- List items: `space-4` vertical

### Section Spacing
- Between major sections: `space-12 to space-16`
- Between card groups: `space-8`
- Dense list items: `space-2` to `space-3`

---

## 5. Rounded Corners (Radius)

```
radius-xs: 6px      (tiny buttons, tags)
radius-sm: 10px     (inputs, small cards)
radius-md: 14px     (standard cards)
radius-lg: 18px     (prominent cards)
radius-xl: 24px     (hero surfaces)
radius-pill: 9999px (pill buttons, chips)
```

---

## 6. Shadows & Elevation

### Shadow Tokens
```
shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.06)
shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.08)
shadow-md: 0 8px 24px rgba(0, 0, 0, 0.12)
shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.16)
shadow-focus: 0 0 0 4px rgba(99, 102, 241, 0.25)
```

### Glow Effects (NEW - Gen Z Love)
```
glow-success: 0 0 20px rgba(6, 255, 165, 0.4)
glow-danger: 0 0 20px rgba(255, 0, 110, 0.4)
glow-primary: 0 0 24px rgba(99, 102, 241, 0.35)
```

---

## 7. Motion & Animation

### Timing
```
motion-quick: 100ms    (micro-interactions, icon pulse)
motion-fast: 150ms     (button click, state change)
motion-medium: 220ms   (card reveal, panel slide)
motion-slow: 300ms     (modal open, major layout shift)
```

### Easing
- **ease-out**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy but elegant)
- **ease-in-out**: `cubic-bezier(0.4, 0, 0.2, 1)` (smooth transitions)
- **ease-in**: `cubic-bezier(0.4, 0, 1, 1)` (exits)

### Animation Patterns
- **Pulse**: Correct answer → green glow pulse
- **Shake**: Wrong answer → subtle shake + red glow
- **Slide Up**: Card appear with slight fade-in
- **Scale In**: Badge/counter updates with tiny scale pop
- **Gradient Shift**: Hover on CTAs → subtle gradient animation

---

## 8. Components

### 8.1 Button Styles

#### Primary CTA
```
Background: Gradient #6366F1 → #D946EF
Text: White, 600 weight
Padding: 12px 32px
Radius: 10px
Hover: Gradient shift + lift shadow
Pressed: Scale 0.98
Focus: 4px glow ring
```

#### Secondary
```
Background: rgba(99, 102, 241, 0.1)
Border: 2px solid #6366F1
Text: #6366F1
Hover: Background fill stronger
```

#### Text/Minimal
```
Background: Transparent
Text: #6366F1, 600 weight
Hover: Background rgba(99, 102, 241, 0.05)
Underline on hover (optional)
```

#### Danger CTA
```
Background: #FF006E
Text: White
Only use for destructive actions
```

### 8.2 Input Fields
```
Background: #F8F9FF
Border: 2px solid #E5E7EB
Border radius: 10px
Padding: 12px 16px
Font: 16px/400

States:
- Focus: Border #6366F1 + glow ring
- Error: Border #FF006E + error message below
- Filled: Keep clean, no change
```

### 8.3 Answer Option Cards
```
Background: #FFFFFF
Border: 2px solid #E5E7EB
Radius: 14px
Padding: 16px
Full-width, stacked vertically

Hover State:
- Border color: #6366F1
- Shadow: shadow-sm
- Scale: 1.01

Selected (Before Answering):
- Border: 2px solid #6366F1
- Background: rgba(99, 102, 241, 0.05)

✅ Correct State:
- Background: rgba(6, 255, 165, 0.15)
- Border: 2px solid #06FFA5
- Left border glow: 4px #06FFA5
- Glow effect: 0 0 20px rgba(6, 255, 165, 0.3)

❌ Wrong State:
- Background: rgba(255, 0, 110, 0.15)
- Border: 2px solid #FF006E
- Left border glow: 4px #FF006E
- Shake animation on reveal
- Glow effect: 0 0 20px rgba(255, 0, 110, 0.3)
```

### 8.4 Progress Cards (Summary Stats)
```
Background: Gradient light to lighter
Border: None
Radius: 18px
Padding: 24px
Shadow: shadow-sm

Semantic backgrounds:
- Total: Gradient light purple
- Correct: Gradient light green
- Wrong: Gradient light red
- Progress: Gradient primary colors

Typography:
- Number: 40px / 700 weight (bold!)
- Label: 14px / 500 weight, secondary color
```

### 8.5 Status Badge
```
Correct: Background #06FFA5, Text dark, radius-pill
Wrong: Background #FF006E, Text white, radius-pill
Pending: Background #FFA500, Text dark, radius-pill
Size: 28px height
```

### 8.6 Question List Item
```
Background: #F8F9FF
Border: 1px solid rgba(99, 102, 241, 0.2)
Radius: 12px
Padding: 12px 16px
Margin: 8px 0

Hover: 
- Border color strengthen
- Shadow-xs appear
- Transform: translateX(4px)

Active/Selected:
- Border: 2px solid #6366F1
- Left accent bar: 4px solid #6366F1
- Background: rgba(99, 102, 241, 0.08)
```

---

## 9. Layout Grid

### Page Structure
```
Desktop (1440px max):
- Header/topbar: Full width, sticky
- Content: Two-column (adaptive)
  - Left sidebar: 340px (question list)
  - Right panel: flexible (question detail)
- Footer: Optional

Mobile:
- Stack single column
- Sidebar → collapsible sheet/drawer
- Full width content
```

### Responsive Breakpoints
```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

---

## 10. Logo & Branding

### Logo Placement
```
Top-left of header: 
- Small logo mark + "HCM Quiz" text
- Or just mark if space tight
- Use gradient: Primary indigo to magenta
- Size: 32px height

Alternative: Gradient wordmark
```

### Logo Design (Suggested)
```
Option 1: Gradient circle with "H" monogram
Option 2: Gradient badge with quiz icon
Option 3: Modern "HCM Q" text with gradient

Color: #6366F1 → #D946EF gradient
Don't use flat colors - gradient is key
```

---

## 11. Feedback Panel Design

### Correct Answer State
```
Background: rgba(6, 255, 165, 0.1)
Border-left: 4px solid #06FFA5
Radius: 14px
Padding: 20px

Content:
- ✅ Emoji or icon (16px)
- Heading: "Đúng rồi!" (600 weight, dark)
- Copy: Brief explanation (400 weight, secondary)
- Optional: Show correct answer highlight

Animation:
- Slide up from bottom
- Glow pulse on appear
- Smooth 220ms ease-out
```

### Wrong Answer State
```
Background: rgba(255, 0, 110, 0.1)
Border-left: 4px solid #FF006E
Animation: Shake + glow pulse
Content: Show selected vs. correct answer
```

---

## 12. Dark Mode (Future-Proof)

While primary is light, add token variants for dark:
```
@dark mode:
- canvas: #0F0F1E
- surface: #1A1B2E
- text-primary: #FFFFFF
- borders: lighter (higher alpha)
- All glows become more prominent
```

---

## 13. Micro-interactions & Feel

### Button Click
- Scale down 2%
- Shadow lift
- 100ms snappy response

### Correct Answer Reveal
- Card slides up with fade
- Green glow pulses (2 times)
- Checkmark icon animate from 0 to 1

### Wrong Answer Reveal
- Card shakes (3 times, subtle)
- Red glow pulses
- X icon animate

### Progress Update
- Number scales up slightly (1.05x)
- Brief color highlight flash

### Filter/Category Change
- Smooth fade transition (150ms)
- List items stagger enter (30ms apart)

---

## 14. Writing Style

### Tone Examples
```
Correct: "🎯 Đúng rồi! Bạn chọn đúng cách."
Wrong: "Oops! Bạn chọn A, nhưng đáp án là D."
Pending: "Ready? Chọn đáp án để tiếp tục →"
Empty: "Không có câu hỏi. Khởi tạo bộ quiz mới?"
```

### Key Principles
- Conversational (như nói chuyện với bạn)
- Emoji use is OK (not forced)
- Vietnamese diacritics MUST be perfect
- Short sentences, active voice

---

## 15. Do's & Don'ts (Gen Z Edition)

### ✅ DO
- Use gradient strategically (not everywhere)
- Make success feel good (glow, pulse, dopamine)
- Keep loading states fun (animated gradient)
- Use modern sans-serif consistently
- Make mobile feel native & fast
- Use white space intentionally
- Test dark mode compatibility

### ❌ DON'T
- Multiple conflicting accent colors
- Cheesy animations or skeuomorphism
- Flat design (boring)
- Outdated UI patterns
- Slow transitions (feels sluggish)
- Overly formal copy
- Decorative shadows everywhere
- Ignore Vietnamese text rendering

---

## 16. File Structure

```
/design-system/
  - colors.css (CSS variables)
  - typography.css
  - spacing.css
  - shadows.css
  - animations.css
  
/components/
  - button.jsx
  - input.jsx
  - card.jsx
  - badge.jsx
  - answer-card.jsx
  - progress-summary.jsx
  
/assets/
  - logo-dark.svg
  - logo-gradient.svg
  - icons/ (24px set)
  - illustrations/ (optional)
```

---

## 17. Implementation Checklist

- [ ] Set up CSS custom properties for all tokens
- [ ] Create button component (5 variants)
- [ ] Answer card with 3 states (default, selected, answered)
- [ ] Progress cards with gradient backgrounds
- [ ] Question list with smooth interactions
- [ ] Feedback panel with animations
- [ ] Logo in header (gradient)
- [ ] Mobile responsiveness fully tested
- [ ] Dark mode ready (CSS variables prepared)
- [ ] Vietnamese text rendering perfect
- [ ] Animation performance optimized
- [ ] Accessibility checks (WCAG AA)
- [ ] Test on low-end mobile devices

---

## 18. Source of Truth

**This file is the design contract.** 
If implementation conflicts with this, update this file first before shipping changes.
Keep the Gen Z energy, the vibrance, and the dopamine-rewarding feedback loop.

Good luck! Make it snappy 🚀

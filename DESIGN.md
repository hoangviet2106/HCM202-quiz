# DESIGN.md — HCM Quiz Review UI

**Version 2.1 — UX/UI updates (theme, navigation, music, tokens)**

Bản này cập nhật từ v2.0 để phản ánh các thay đổi giao diện và hành vi đã
triển khai trong codebase: tông màu sáng cà phê (coffee palette), cải thiện
dark-theme, di chuyển điều hướng Prev/Next, thêm ô nhập link YouTube để phát
nền nhạc cùng nút Play / Clear, và một số chỉnh sửa token để đảm bảo visual
consistency giữa light/dark.

---

## 1 — Tóm tắt thay đổi UX chính

- Light theme đổi sang "coffee" palette (ấm, paper-like). Tokens đã cập nhật
	trong `design-system/colors.css`.
- Dark theme chỉnh để tránh "đen tuyệt đối" — surfaces nhẹ hơn, shadow mềm
	hơn để dễ đọc.
- Prev / Next: di chuyển xuống bên dưới phần đáp án (vị trí trực quan hơn khi
	người dùng trả lời liên tiếp). Nút `Prev`/`Next` là `secondary` / `primary`
	tuân theo token màu.
- Music control: thêm input nhận YouTube link, `Play` và `Clear` button, và
	một iframe embed dùng dạng `https://www.youtube.com/embed/<id>?autoplay=1`.
	Giá trị có thể được persist (localStorage key: `musicUrl`) nếu cần.
- Theme toggle: nút chuyển sáng/tối đặt trong hero; lưu lựa chọn vào
	`localStorage` key `theme` và áp dụng bằng `document.documentElement.setAttribute('data-theme', theme)`.
- Dọn dẹp: đã loại bỏ các component không dùng (ví dụ `src/components/ui/Button.jsx`, `src/components/ui/ProgressSummary.jsx`).

---

## 2 — Theme & Color Tokens (developer notes)

- Light tokens (coffee) — đã cập nhật trong `design-system/colors.css`:
	`--canvas`, `--surface`, `--surface-raised`, `--surface-subtle`,
	`--ink-900`..`--ink-100`, `--accent`, `--accent-mid`, `--accent-soft`.
- Dark overrides live under `[data-theme="dark"]` in the same file.
- Gradient and overlay guidance: prefer token-driven colors. Nếu cần overlay
	alpha on surface, define RGB tokens to be used inside `rgba()`:

	- `--surface-raised-rgb: 248,242,236;` (light) and dark variant under `[data-theme="dark"]`
	- `--surface-rgb: 251,247,242;`

	Use like `background: linear-gradient(180deg, rgba(var(--surface-raised-rgb), 0.96), rgba(var(--surface-rgb), 0.96));`

- Accessibility: keep contrast >= 4.5:1 for body text; test badges and
	selected states with grayscale to ensure shape/icon signals exist.

---

## 3 — Navigation (Prev / Next)

- Layout: `Prev / Next` buttons are rendered below the answer options and the
	feedback bar. They sit in a small action row centered horizontally on mobile
	and aligned to the right on wide screens.
- Behavior:
	- `Prev` goes to previous question (disabled on first question).
	- `Next` goes to next question (disabled on last question).
	- `Next` is `primary` when it proceeds; `Prev` is `default/secondary`.

CSS notes: use `--r-md` radius for these buttons and `--shadow-xs` for subtle lift.

---

## 4 — Music (YouTube) control

- UX: a compact input field (placeholder: "YouTube link (optional)") with two
	inline buttons: `Play` and `Clear`.
- Play flow: parse the provided URL to extract the video id (helper `toYouTubeEmbed()`),
	set `embedUrl` and mount an iframe with autoplay query. `Clear` removes the
	embed and clears the field.
- Persisting: optional; app currently supports saving to `localStorage` key
	`musicUrl` if desired by product.

Security note: do not accept arbitrary HTML; construct the embed URL only from
an extracted video id.

---

## 5 — Theme Toggle behaviour

- Toggle control in the hero bar switches between `light` and `dark`.
- Persist selection: `localStorage.setItem('theme', theme)`.
- On initial load, app checks `localStorage` then falls back to
	`window.matchMedia('(prefers-color-scheme: dark)').matches` if unset.

---

## 6 — Developer implementation notes (files changed)

- `design-system/colors.css`
	- Light tokens now use a coffee/warm-neutral palette; dark overrides tuned.
	- Add RGB tokens (`--surface-raised-rgb`, `--surface-rgb`) if overlay alpha
		is required.
- `src/styles.css`
	- Replace hard-coded whites/gradients with token references (use var tokens
		and RGB variables for rgba where necessary).
- `src/App.jsx`
	- Theme state and persistence logic; theme toggle control in hero.
- `src/components/QuestionDetail.jsx`
	- Moved Prev/Next rendered below answers; added YouTube music input + Play/Clear
		+ iframe embed handling and toYouTubeEmbed util.
- `src/lib/storage.js`
	- Centralise localStorage keys (e.g., `theme`, optional `musicUrl`, app state).

---

## 7 — Notes & checklist for final polish

- Verify remaining occurrences of color literals or rgba(var(...)) patterns and
	either define the needed `-rgb` tokens or convert to token-only backgrounds.
- Test contrast and visual comfort in both themes with sample question flows.
- Consider persisting the music URL if user feedback shows preference.

---

## 8 — How to test locally

Run the dev server and exercise these flows:

```bash
npm install
npm run dev
```

1. Toggle theme in the hero; confirm `data-theme` attribute and that surfaces
	 use the coffee palette in light and the tuned surfaces in dark.
2. Open a question, use the YouTube input: paste a YouTube watch URL, click
	 `Play` → embedded player should appear and start playing.
3. Select answers, confirm feedback bar shows and `Prev/Next` are under the
	 answers and behave correctly.

If anything looks off, adjust tokens in `design-system/colors.css` and run
another quick check.

---

If you want, tôi có thể:
- commit các thay đổi này lên một branch và tạo PR, hoặc
- chạy `npm run dev` để bạn kiểm tra trực tiếp.


## 1. Design Philosophy

### Định hướng thẩm mỹ

Không phải "UI kit sạch bóng." Không phải "dashboard màu xanh mặc định."

Giao diện này cần cảm giác như một **cuốn sổ tay nghiên cứu được thiết kế kỹ** —
warm, có chiều sâu, đáng tin cậy trong nhiều giờ học liên tục.

### Năm nguyên tắc cốt lõi

1. **Serif cho danh tính, Sans cho dữ liệu.**
Heading dùng Instrument Serif để tạo cảm giác học thuật và bản sắc riêng.
Mọi label, số liệu, button dùng DM Sans cho độ rõ ràng tối đa.

2. **Màu ấm làm nền — màu lạnh làm accent.**
Canvas ấm (`#F5F4F0`) tạo sự thư giãn. Accent xanh lam đậm (`#1A3FA8`) là
điểm nhấn duy nhất, không cạnh tranh với nội dung câu hỏi.

3. **State phải đọc được ngay, không cần đoán.**
Đúng / sai / chưa làm / đang chọn — mỗi trạng thái dùng tối thiểu hai tín hiệu
(màu + hình dạng / icon), không phụ thuộc chỉ một kênh cảm giác.

4. **Hệ thống phân cấp bằng spacing và typography, không bằng màu sắc.**
Tránh dùng card màu nặng, block màu lớn, hay gradient trang trí.
Phân cấp đến từ kích thước chữ, weight, khoảng cách và border mỏng.

5. **Quiet interface, loud content.**
Giao diện đủ yên tĩnh để câu hỏi là thứ nổi bật nhất trong viewport.

---

## 2. Color System

### Core Palette

css

```
--canvas:          #F5F4F0   /* Nền tổng thể — ấm, không trắng thuần */
--surface:         #FDFCFA   /* Surface thứ cấp */
--surface-raised:  #FFFFFF   /* Card nổi — panel, question area */
--surface-subtle:  #EEE9E0   /* Hover state, chip active background */

--ink-900: #1A1612   /* Text chính — không phải đen thuần */
--ink-700: #3D3730   /* Text thứ cấp quan trọng (option text) */
--ink-500: #7A7066   /* Label, meta, mô tả */
--ink-300: #B8B0A6   /* Placeholder, disabled, border light */
--ink-100: #E8E2DA   /* Divider, progress track */
```

### Accent & Semantic

css

```
--accent:        #1A3FA8              /* Navy blue — màu nhấn duy nhất */
--accent-mid:    #2E5FD4              /* Lighter shade cho hover, eyebrow */
--accent-soft:   rgba(26,63,168,0.08) /* Selected state background */
--accent-softer: rgba(26,63,168,0.04) /* Subtle tint */

--success:      #1C7A50              /* Xanh lá — chỉ cho đúng/correct */
--success-soft: rgba(28,122,80,0.08)

--danger:       #B83232              /* Đỏ đất — chỉ cho sai/wrong */
--danger-soft:  rgba(184,50,50,0.08)

--border:       rgba(26,22,18,0.08)  /* Border mặc định */
--border-strong: rgba(26,22,18,0.14) /* Border nổi hơn, input, option */
```

### Usage Rules

MàuĐược dùng choKhông dùng cho`--accent` (navy)Navigation, selected state, primary button, progress barDecoration, icon màu đơn thuần`--success` (green)Đáp án đúng, badge "đúng", stat cardBất kỳ nội dung không phải correctness`--danger` (red)Đáp án sai, badge "sai", stat cardWarning, alert không liên quan đến quizCanvas ấmNền app, nền input, nền chipCard nổi — card dùng `--surface-raised`

> 
> **Quy tắc tuyệt đối:** Không có màu accent nào xuất hiện trên cùng một component
> trừ khi nó mang nghĩa trạng thái cụ thể (selected, correct, wrong).

---

## 3. Typography

### Font Stack

css

```
/* Display / Heading */
'Instrument Serif', Georgia, 'Times New Roman', serif

/* Body / UI / Data */
'DM Sans', 'Helvetica Neue', system-ui, sans-serif
```

**Lý do chọn bộ đôi này:**

- Instrument Serif — hiện đại, dễ đọc ở màn hình retina, có nét học thuật không quá formal.

- DM Sans — geometric nhẹ, optical sizing tốt ở 9–40px, dễ đọc tiếng Việt có dấu.

### Type Scale

TokenFontSizeWeightLine-heightDùng cho`hero-title`Serif36px4001.15Page title chính`panel-title`Sans15px6001.3Left panel header`question-text`Sans17px5001.6Nội dung câu hỏi`option-text`Sans14.5px4001.5Text đáp án`stat-value`Serif28–32px4001.0Số liệu stat card`body`Sans14px4001.6Mô tả, meta`label`Sans13px5001.35Button, chip`eyebrow`Sans11px6001.2Section label trên`caption`Sans11–12px5001.3Metadata phụ, page info

### Letter Spacing

css

```
/* Eyebrow / uppercase label */
letter-spacing: 0.1em;

/* Heading serif */
letter-spacing: -0.01em;

/* Option ID badge */
letter-spacing: 0.02em;

/* Body text */
letter-spacing: 0;
```

### Vietnamese Typography Rules

- Font phải load full `Vietnamese` subset từ Google Fonts hoặc self-host.

- Không dùng `font-synthesis: none` — để browser render diacritics tự nhiên.

- Minimum body text: 14px. Không nhỏ hơn 12px ở bất kỳ UI element nào.

- Line-height tối thiểu 1.5 cho paragraph, 1.3 cho label — dấu tiếng Việt cần không gian dọc.

---

## 4. Layout Architecture

### Page Structure

Single-column study layout (left panel removed — focused reading and
answering flow):

```
┌────────────────────────────────────────────────────────────┐
│  HERO                                                       │
│  Title (Serif) + Description    [Actions: nav + reset]      │
├────────────────────────────────────────────────────────────┤
│  STATS STRIP (5 columns)                                    │
│  Total │ Done │ Correct │ Wrong │ Progress                  │
├────────────────────────────────────────────────────────────┤
│  QUESTION PANEL (main) — Question header, options, feedback │
│  Navigation (Prev / Next) placed below options              │
└────────────────────────────────────────────────────────────┘
```

### Desktop Specifications

- `max-width: 1200px` — không rộng hơn để duy trì line-length tốt.

- Single-column main content: question panel is the central focus; hero and
	stats strip remain full-width within the container.

- Card padding chuẩn: `28px 32px` (hero), `22px 28px` (question area), `18px 20px` (panel).

### Mobile Specifications (

```
Structure:
├── Eyebrow (label nhỏ + line accent)
├── Title (Serif, 36px, có * italic cho phần phụ)
├── Description (13.5px, muted)
└── Action group (Prev / Next / Review wrong / Reset)
```

**Eyebrow pattern:**

css

```
.hero-eyebrow::before {
	content: '';
	display: inline-block;
	width: 20px; height: 2px;
	background: var(--accent-mid);
}
```

Tạo visual anchor mà không cần icon.

---

### 5.2 Stats Cards

Mỗi card có một **colored top bar** (3px) thay vì toàn bộ card màu.
Tránh visual noise, đồng thời giữ state differentiation rõ ràng.

```
stat-card
├── top bar (3px, muted | accent | success | danger)
├── label (11px, uppercase, muted)
├── value (Serif 28–32px)
└── sub-label (11.5px, muted)
		[optional: progress bar for Tiến độ card]
```

**Color mapping:**

CardTop barTổng câu`--ink-300` (muted)Đã làm`--accent`Đúng`--success`Sai`--danger`Tiến độ`--accent` + progress bar

---

<!-- Left panel removed in v2.1: question navigator component deprecated -->

### 5.4 Question Header

```
structure:
├── q-meta row
│   ├── "CÂU 7" (eyebrow style, accent-mid)
│   └── "6/270 đã làm" + badges (5 đúng / 1 sai)
└── question-text (17px / 500 / 1.6)
```

Badges dùng compact pill — không dùng icon nặng, không dùng chip to.

---

### 5.5 Answer Options

Đây là component quan trọng nhất. Mỗi option là **large tap target** với 4 sub-elements:

```
option (border-radius: 12px)
├── option-id badge (32×32px, rounded 8px)
├── option-text (14.5px)
└── option-indicator (icon trạng thái, ẩn mặc định)
```

**States matrix:**

StateOption borderOption bgID badgeText colorIndicatorDefault`--border-strong``--surface-raised`canvas bg, ink-700`--ink-700`hiddenHover`--ink-300``--surface-subtle`———Selectedaccent 30%`--accent-softer`navy solid`--ink-700`—Correctsuccess 30%success 5%success solid`--success`✓Wrongdanger 30%danger 5%danger solid`--danger`✗

> 
> **Grayscale test:** Selected vs Correct vs Wrong phải phân biệt được dù loại bỏ màu.
> Tín hiệu thứ hai là: ID badge fill pattern + indicator icon.
 
---

### 5.6 Feedback Bar

Xuất hiện bên dưới options sau khi chọn đáp án. Không dùng modal, không dùng toast.

css

```
/* Correct */
background: var(--success-soft);
border: 1px solid rgba(28,122,80,0.2);
color: var(--success);

/* Wrong */
background: var(--danger-soft);
border: 1px solid rgba(184,50,50,0.2);
color: var(--danger);
```

**Copy pattern:**

- Correct: `"Chính xác. [Giải thích ngắn]"`

- Wrong: `"Chưa đúng. Đáp án là [X — Nội dung đáp án]. [Giải thích ngắn nếu có]"`

Không dùng icon animation phức tạp. Không có confetti. Phản hồi cần bình tĩnh, rõ ràng.

---

### 5.7 Buttons

VariantBackgroundBorderTextDùng choPrimary`--accent``--accent`whiteCâu tiếp, hành động chínhDefault`--surface-raised``--border-strong``--ink-700`Câu trước, actions phụGhosttransparenttransparent`--ink-500`Ôn câu sai (ít nhấn)Danger`--danger-soft`danger 20%`--danger`Xóa toàn bộ (destructive)

Padding chuẩn: `8px 16px`. Border-radius: `12px`. Font: 13px / 500.

---

## 6. Radius & Shadow

### Border Radius

css

```
--r-sm:   8px    /* Option ID badge, input, small elements */
--r-md:   12px   /* Button, chip, feedback bar, stats row */
--r-lg:   16px   /* Option card, filter section */
--r-xl:   22px   /* Hero panel, left panel, right panel (main cards) */
--r-pill: 9999px /* Badge, chip pill, progress bar */
```

### Shadow

Sử dụng rất hạn chế — chủ yếu dùng border để phân tách layer.

css

```
--shadow-xs: 0 1px 2px rgba(26,22,18,0.04)   /* Nội bộ nhỏ */
--shadow-sm: 0 4px 12px rgba(26,22,18,0.06)  /* Card nổi nhẹ nếu cần */
--shadow-focus: 0 0 0 3px rgba(26,63,168,0.2) /* Focus ring input */
```

> 
> **Quy tắc:** Không dùng `--shadow-md` trở lên cho UI thông thường.
> Shadow nặng = giao diện nặng nề, không phù hợp môi trường học tập.
> 
---

## 7. Motion & Interaction

### Transition Defaults

css

```
transition: all 0.14s ease;        /* Option hover, chip, button */
transition: opacity 0.18s ease;    /* Feedback bar appear */
transition: border-color 0.12s;    /* Input focus */
```

### Rules

- Không dùng animation bounce, spring, hay slide phức tạp.

- Feedback bar xuất hiện bằng `display: block` — không cần fade nếu tốc độ 

css

```
@media (prefers-reduced-motion: reduce) {
	*, *::before, *::after {
		transition-duration: 0.01ms !important;
		animation-duration: 0.01ms !important;
	}
}
```

---

## 8. Accessibility

### Contrast Requirements

ElementRatio tối thiểuStandardBody text trên canvas7:1AAAQuestion text7:1AAAPlaceholder text3:1AA LargeButton label4.5:1AABadge text (success/danger)4.5:1AA

Ink-900 (`#1A1612`) trên canvas (`#F5F4F0`) đạt ~15:1.
Success text (`#1C7A50`) trên success-soft đạt ~5.2:1 ✓

### Focus Management

css

```
/* Visible focus ring cho keyboard navigation */
:focus-visible {
	outline: none;
	box-shadow: 0 0 0 3px rgba(26,63,168,0.25);
	border-radius: inherit;
}
```

- Option cards phải focusable bằng keyboard (`tabindex="0"`).

- Sau khi chọn đáp án, focus chuyển tự động sang feedback bar.

- Pagination buttons luôn visible, không ẩn khi disabled — chỉ thay đổi style.

### ARIA

html

```

	Đúng
	5 câu đã chinh phục

```

### Vietnamese Diacritics

- Font phải có full Vietnamese glyph set — kiểm tra: ắ ặ ổ ợ ữ ướ ẫ.

- Không dùng `font-feature-settings` ảnh hưởng đến dấu.

- Test ở 12px minimum — dấu huyền/sắc/nặng phải còn rõ.

---

## 9. Implementation Notes

### CSS Architecture

css

```
/* Cấu trúc gợi ý cho CSS custom properties */
:root {
	/* 1. Color tokens */
	/* 2. Typography tokens */
	/* 3. Spacing/radius/shadow tokens */
}

/* Component classes: .hero, .stat-card, .option, .chip, .feedback-bar */
/* State modifiers: .active, .correct, .wrong, .selected, .disabled */
/* Utility: .success, .danger, .accent (chỉ cho text color) */
```

### Component Checklist

Trước khi ship mỗi component, kiểm tra:

- Có ít nhất 2 tín hiệu phân biệt state (màu + shape/icon)

- Đọc được ở chế độ grayscale

- Focus ring visible khi navigate bằng keyboard

- Vietnamese diacritics không bị cắt ở mọi size

- Tap target tối thiểu 44px trên mobile

- Contrast AA tối thiểu cho tất cả text

### Performance

- Google Fonts: load với `display=swap` và `subset=latin,vietnamese`.

- Không preload font nặng hơn 2 weights.

- Không dùng background-image hay gradient phức tạp — tất cả là flat color + border.

- Tránh `box-shadow` nhiều layer cho elements lặp lại (options list).

### Long Session Ergonomics

- Canvas ấm (`#F5F4F0`) giảm eye strain so với pure white trong môi trường sáng.

- Line-height rộng (1.6) cho question text giúp đọc nhanh hơn tiếng Việt nhiều dấu.

Main question panel nên là anchor khi người dùng scroll để tránh mất focus nội dung.

- Không có animation flash hay color pop bất ngờ gây mất tập trung.

---

## 10. Design Tokens Quick Reference

css

```
:root {
	/* Color */
	--canvas:          #F5F4F0;
	--surface:         #FDFCFA;
	--surface-raised:  #FFFFFF;
	--surface-subtle:  #EEE9E0;
	--ink-900: #1A1612; --ink-700: #3D3730;
	--ink-500: #7A7066; --ink-300: #B8B0A6; --ink-100: #E8E2DA;
	--accent:        #1A3FA8;
	--accent-mid:    #2E5FD4;
	--accent-soft:   rgba(26,63,168,0.08);
	--accent-softer: rgba(26,63,168,0.04);
	--success:       #1C7A50;
	--success-soft:  rgba(28,122,80,0.08);
	--danger:        #B83232;
	--danger-soft:   rgba(184,50,50,0.08);
	--border:        rgba(26,22,18,0.08);
	--border-strong: rgba(26,22,18,0.14);

	/* Typography */
	--font-serif: 'Instrument Serif', Georgia, serif;
	--font-sans:  'DM Sans', 'Helvetica Neue', system-ui, sans-serif;

	/* Radius */
	--r-sm: 8px; --r-md: 12px; --r-lg: 16px;
	--r-xl: 22px; --r-pill: 9999px;

	/* Shadow */
	--shadow-xs:    0 1px 2px rgba(26,22,18,0.04);
	--shadow-sm:    0 4px 12px rgba(26,22,18,0.06);
	--shadow-focus: 0 0 0 3px rgba(26,63,168,0.20);
}
```

---

DESIGN.md v2.0 — HCM Quiz Review*
*Revised: Refined Academic Editorial direction*
*Prioritizes: typography identity, warm palette, clear state system, long-session comfort*
thay xong thì thực hiện nó
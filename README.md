# BCM Software Developer Test — Submission

My submission includes complete answers for all ten questions. Open this README for setup and where to find each part.

## Prerequisites

- Modern browser (Chrome/Firefox) for HTML, CSS, and JS demos
- Optional: PHP 8+ to skim the WordPress snippet (no full WP install required)
- Optional: [validator.nu](https://validator.nu) or `vnu.jar` to reproduce HTML validation

## Quick start

| Question | Location | How to verify |
|----------|----------|---------------|
| 1 PHP / WordPress | [php/](php/) | Read [php/NOTES.md](php/NOTES.md) and [php/corrected.php](php/corrected.php) |
| 2 Editor uploads | [answers/02-editor-uploads.md](answers/02-editor-uploads.md) | Written answer |
| 3 Performance | [answers/03-performance.md](answers/03-performance.md) | Written answer |
| 4 CSS layout | [css/index.html](css/index.html) | Open in browser; see [css/screenshots/](css/screenshots/) |
| 5 HTML | [html/index.html](html/index.html) | See [html/validation.txt](html/validation.txt) |
| 6 JavaScript | [js/app.js](js/app.js) | Open [html/index.html](html/index.html) (script linked at bottom) |
| 7 Caching | [answers/07-caching.md](answers/07-caching.md) | Written answer |
| 8 Editorial workflow | [answers/08-editorial-workflow.md](answers/08-editorial-workflow.md) | Written answer |
| 9 Newsletter API | [answers/09-newsletter-signup.md](answers/09-newsletter-signup.md) | Written answer |
| 10 Security review | [answers/10-endpoint-security.md](answers/10-endpoint-security.md) | Written answer |

Index: [SHORT_ANSWERS.md](SHORT_ANSWERS.md)

### Question 4 (CSS)

```bash
open css/index.html
```

Breakpoint: **768px**. Desktop grid: A spans two columns; mobile hides E, F, H and reorders to A → D → B → C → G via CSS `order` (single DOM, no duplicated sections). See [css/LAYOUT.md](css/LAYOUT.md).

### Question 5–6 (HTML + JS)

Serve the repo root so the script path resolves:

```bash
cd /Users/owner/Desktop/bcm-assessment && python3 -m http.server 8765
# open http://127.0.0.1:8765/html/index.html
```

Details: [html/CORRECTIONS.md](html/CORRECTIONS.md), [html/Q6-TESTING.md](html/Q6-TESTING.md).

**Manual checks for Q6:**

1. Initial load: three paragraphs with HR after paragraph 2 (P1, P2, HR, P3).
2. Click **Hit me** repeatedly: three more paragraphs append in random order; HRs recalculate for **all** paragraphs (including hidden).
3. Click **Toggle image paragraphs**: paragraphs containing `img` hide/show; add more via **Hit me** while hidden — new image paragraphs stay hidden until toggled visible.

### Question 1 (PHP)

Reference broken snippet: [php/broken.php](php/broken.php). Corrected version: [php/corrected.php](php/corrected.php).

Documented test scenarios (missing `s`, page 2, no results, multiple `[ad]`): [php/NOTES.md](php/NOTES.md).

## Evidence included

- HTML validation output: [html/validation.txt](html/validation.txt)
- CSS layout screenshots: [css/screenshots/desktop.png](css/screenshots/desktop.png), [css/screenshots/mobile.png](css/screenshots/mobile.png)

## AI usage and verification

I used Cursor to help draft structure, written answers, and initial code. I verified each part myself:

- PHP fixes against [WordPress `WP_Query` documentation](https://developer.wordpress.org/reference/classes/wp_query/) (`paged` vs `page`, search param, loop reset).
- HTML with the W3C Nu Validator (I saved the output in `html/validation.txt`).
- JavaScript behaviour manually in the browser (clicks, toggle, HR placement with hidden paragraphs).
- CSS layout in browser devtools at desktop and mobile widths; I saved screenshots under `css/screenshots/`.
- Security and API answers reviewed against standard authz/idempotency practice.

## Packaging

To submit as ZIP from the repo root:

```bash
cd /Users/owner/Desktop/bcm-assessment && zip -r bcm-assessment.zip . -x '.git/*'
```

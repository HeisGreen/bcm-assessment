# Question 6 — manual test checklist

Open [index.html](index.html) via local server or `file://` (use `python3 -m http.server` from repo root so `../js/app.js` loads).

## Initial load

- Three paragraphs present.
- One `<hr class="paragraph-separator">` after paragraph 2 (pattern P1, P2, HR, P3).

## Repeated clicks on “Hit me”

- Each click appends three cloned paragraphs in a **random** order (order varies between clicks).
- HRs rebuild: after every pair of paragraphs when another paragraph follows (e.g. five paragraphs → P1,P2,HR,P3,P4,HR,P5).

## Toggle image paragraphs

- Second button **Toggle image paragraphs** hides any paragraph containing an `img` (the third original paragraph).
- With image paragraphs hidden, click **Hit me**: newly added copies of the image paragraph stay hidden.
- Toggle show again: all image paragraphs (including new clones) become visible.

## Hidden paragraphs and HRs

- HR placement counts **all** `<p>` elements in `#content`, including those with class `is-hidden` (`display: none` still in DOM).
- After toggling hide/show, separator count updates accordingly.

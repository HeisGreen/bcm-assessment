# Question 5 — HTML corrections

## HTML5 validity errors (original)

| Issue | Fix |
|-------|-----|
| `</html>` closed before `<body>` | Nest `<body>` inside `<html>`; one closing `</html>` at end |
| `href=https://...` unquoted | `href="https://www.bigcabal.com"` |
| `src=test.jpeg` unquoted | `src="test.jpeg"` |
| `with=300` typo | `width="300"` |
| `height=auto` invalid on img | Omitted (height controlled in CSS) |
| `<abbr name="lobortis">` | `<abbr title="lobortis">` — `name` is not valid on `abbr` |
| `<code><b>...</code></b>` | `<code><b>...</b></code>` — tags properly nested |
| Stray space in `</a >` | `</a>` |

## Accessibility / style (separate from validity)

- `type="button"` on button (avoids accidental form submit)
- `alt` on image
- `lang="en"` on `<html>` (also helps discoverability)

## Search discoverability (HTML-only, ≥3)

1. **`lang="en"`** — signals primary language to crawlers and snippet generation.
2. **`<meta name="description" content="...">`** — supports accurate search snippets.
3. **`<main>`** — marks primary content for parsers that weight main body text.

# Question 1 — PHP / WordPress notes

## Errors in the original snippet

1. **`'page' => $page` in `WP_Query`** — The `page` argument is for static front-page queries. Paginated post lists require **`paged`**. Using `page` breaks or ignores pagination (page 2 shows wrong results).

2. **`$pages` undefined** — Never set; causes PHP notices and wrong heading. Use **`$q->max_num_pages`** after running the query.

3. **`preg_replace_callback('#[ad]#', ...)`** — In regex, `[ad]` is a character class matching a single `a` or `d`, not the literal text `[ad]`. Replacements will hit wrong characters in content.

4. **Callback uses `echo` instead of `return`** — `preg_replace_callback` expects the replacement string from the return value. Echoing leaves the matched text removed with nothing inserted.

5. **`$m[1]` without a capture group** — Undefined index; ad markup is broken even if the regex were fixed.

6. **Missing third argument to `preg_replace_callback`** — Without passing `$content`, the modified string is discarded.

7. **`esc_html(the_title())`** — `the_title()` echoes output and returns nothing useful to `esc_html`. Use **`esc_html(get_the_title())`**.

8. **Raw `$_GET['s']` in query and heading** — Unsanitized; triggers notices when `s` is absent. Use **`sanitize_text_field(wp_unslash(...))`** and default to empty string.

9. **No `wp_reset_postdata()`** — Leaves global `$post` from the custom query; breaks downstream template tags.

10. **No empty-results handling** — Loop simply shows nothing; editors/users get no feedback.

## Assumptions about ad placeholders

- Post content contains the **literal string `[ad]`** (no ID variant).
- Replacement is a static **`<div class="ad"></div>`**; front-end JavaScript or an ad server fills the slot later.
- Multiple `[ad]` markers in one post each become one div (verified by regex global replace).

## Manual test scenarios

| Scenario | URL / input | Expected |
|----------|-------------|----------|
| Missing search param | `?page=1` | No notice; lists posts (or empty message if site has no posts) |
| Empty search | `?s=` | Treated as no search filter (all posts, paginated) |
| Page 2 | `?page=2&s=news` | Second page of 10 results for "news" |
| No results | `?s=zzzznotfound12345` | "No posts matched your search." |
| Multiple ads | Post content `Intro [ad] mid [ad] end` | Two `<div class="ad"></div>` in output |

## Checks without full WordPress

Logic was reviewed against [WP_Query](https://developer.wordpress.org/reference/classes/wp_query/) documentation (`paged`, `s`, `max_num_pages`). Run inside a theme search template or local WordPress with sample posts for end-to-end confirmation.

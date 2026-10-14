# Question 7 — Some readers see old article after theme release

**Assumptions:** Production uses a CDN or reverse proxy in front of WordPress; a page-cache plugin or host edge cache serves anonymous HTML; the article content in the database was updated once and is correct in wp-admin; the theme release changed templates or assets, not the post body alone.

## First three checks

1. **CDN / edge cache**
   - Compare response headers (`Age`, `X-Cache`, `CF-Cache-Status`) for the article URL from two networks or curl vs browser.
   - Purge CDN cache for that URL (or whole site if needed) and retest in incognito.
   - **Cache signal:** Fresh content immediately after purge; stale `Age` or HIT before purge.

2. **WordPress object / page cache**
   - Check cache plugin logs or admin “last purge”; whether `post_updated` hooks fire; difference between logged-in editor (often bypass) and anonymous reader (cached).
   - **Cache signal:** Logged-in users see update, anonymous do not until cache flush.

3. **Browser or service worker**
   - Hard refresh vs normal load; Application tab → Service Workers and cache storage if PWA or offline plugin exists.
   - **Cache signal:** Hard refresh shows update; SW cache version still serving old HTML.

## Cache vs code vs content

| Observation | Likely type |
|-------------|-------------|
| Bypass cache (`?v=timestamp`, curl `-H 'Cache-Control: no-cache'`) shows new content | **Caching** |
| Database post_modified / revision matches new copy for everyone in admin | **Not content** — delivery layer |
| New HTML structure broken or wrong template part after deploy | **Code** (theme) |
| Some regions only (CDN PoP) | **CDN TTL / incomplete purge** |

## Rollback vs fix forward

- **Rollback theme** when a **code regression** is confirmed (fatal errors, wrong template loading old partial). Not the first step if bypass-cache shows correct new article HTML.
- **Fix forward** for cache: purge CDN + origin page cache, verify cache invalidation on publish, extend purge to theme deploy hook if releases should bust HTML cache.

**Verify recovery:** Incognito + curl after purge; confirm `Last-Modified` or body contains new headline/paragraph; editor confirms revision; monitor support channel 30–60 minutes.

## Two-sentence update to editors

Some readers were seeing a cached copy of the article from before the update, not a rollback of your edits in the CMS. We have purged the CDN and page cache and scheduled a theme release only if we find a template bug; please confirm the live URL in a private window and tell us if anything still looks wrong after the next hour.

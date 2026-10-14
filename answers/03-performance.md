# Question 3 — Slow article page (especially mobile)

## Three improvements and what to measure first

### 1. Image delivery (responsive images, compression, lazy load)

- **Measure first:** Lighthouse mobile **LCP** and which element is LCP; total image bytes on the article; whether hero/inline images lack `srcset`/`sizes` or serve oversized files.
- **Tools:** Chrome Lighthouse, WebPageTest mobile, Network tab filtered by Img.

### 2. Full-page and CDN caching

- **Measure first:** **TTFB** for anonymous vs logged-in; `Cache-Control` / `Age` headers on HTML; CDN cache hit ratio after publish.
- **Tools:** curl -I, CDN dashboard, caching plugin metrics.

### 3. Third-party script weight (ads, analytics, consent, social embeds)

- **Measure first:** **Total Blocking Time** and main-thread time; bytes and request count from third-party domains; long tasks during load.
- **Tools:** Lighthouse, Performance panel, coverage of tag manager containers.

## Chosen improvement: responsive images + lazy loading below the fold

**Why:** Often the largest win on publishing sites without changing editorial workflow; low risk if hero LCP image is excluded from lazy load and still prioritized.

**How to verify improvement without breaking ads, analytics, or signed-in behaviour:**

1. **Baseline:** Run Lighthouse mobile on the article URL (median of 3 runs); record LCP, CLS, TBT; note ad network requests and GA4/debugView hits on load and scroll.
2. **Deploy:** Enable theme or plugin lazy load for non-LCP images; ensure featured image uses correct `srcset`/`sizes`; keep LCP image `fetchpriority="high"` and not lazy.
3. **After:** Same URL, same conditions (incognito, throttled Fast 3G); compare LCP and total image weight.
4. **Ads:** Confirm ad slots still fire (network requests to ad domain, visible creatives in viewports where expected).
5. **Analytics:** Confirm page_view / article events in GA debug or Tag Assistant.
6. **Signed-in:** View while logged in (often bypasses full-page cache); confirm personalized elements, comments, or paywall still work and page is not incorrectly cached for subscribers.

If LCP improves but ads break, narrow lazy load to content images only and exclude ad containers from lazy-load wrappers.

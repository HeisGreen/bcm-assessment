# Question 8 — Editorial copy workflow (one engineering day)

## What I would ask or observe first

- Shadow one publish: which tools get title, URL, dek, hero image, and social crops (CMS, newsletter, Twitter/X, Slack, Apple News, etc.).
- Where mistakes happen: stale title, wrong UTM, http vs https, old featured image URL.
- Whether fields already exist in WordPress (excerpt, yoast/canonical, featured image, custom ACF) and if REST or admin already exposes them.

## Smallest useful improvement

**“Copy publish pack” button** in the post editor sidebar: one click copies a structured blob to the clipboard:

```json
{
  "title": "...",
  "url": "https://...",
  "excerpt": "...",
  "featuredImage": "https://..."
}
```

Implementation: read-only use of existing post APIs (`get_the_title`, permalink, excerpt, featured image URL); small admin script enqueued on `post.php`; no new microservice.

## Simpler alternative (little or no code)

Published-post **bookmarklet** or browser snippet that reads `<title>`, `og:url`, `og:image`, `meta description` from the live preview tab and copies them. Editors pin it in the browser toolbar.

## Choice

The admin button fits one day if the site already has stable permalinks and featured images; it avoids human copy from the wrong tab (preview vs live). The bookmarklet is the fallback if deploy process is slow.

## What stays under editorial control

Wording of social posts, send timing, which channels to use, and any legal/compliance review — engineering only supplies accurate, consistent **facts** from the CMS.

## Test with one editor

Single real article before wider rollout: editor publishes as usual, uses the button once, pastes into newsletter tool; I time the step and check zero manual retyping of URL/title/image.

## Success

Median prep time for cross-tool copy drops (e.g. 5+ minutes → under 2); no wrong-link incidents in the next two weeks; editor says they trust the pack enough to use it every time.

---

## Personal example

On a university newspaper site I added a “Copy metadata” button that put title, URL, and hero image URL on the clipboard for the social team. Prep for each post dropped from about six minutes to two, and we stopped pasting draft preview links into Twitter. I learned to ship the ugly clipboard JSON first and refine formatting only after one editor used it on a live deadline story.

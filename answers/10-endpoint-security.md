# Question 10 — WordPress endpoint: update article status from browser

## Review of “safe because button is visible only to editors”

**Not safe.** UI visibility is client-side and bypassable. Any user can craft a request to the endpoint with arbitrary `article_id` and `status` unless the server enforces authentication, authorization, CSRF protection, and input validation.

Attackers do not need the button — only the URL, parameter names, and a valid or stolen session/nonce.

## Required server-side checks (in order)

1. **Authenticate** — Valid logged-in session (or application password with appropriate scope).
2. **CSRF** — Verify WordPress nonce or equivalent for this action.
3. **Identify resource** — `article_id` is positive integer; post exists and is the correct post type.
4. **Authorize** — `current_user_can('edit_post', $article_id)` (and capability for the requested transition, e.g. `publish_posts` to publish).
5. **Allowlist status** — Reject unknown statuses; enforce allowed transitions (e.g. draft → publish, not arbitrary strings).
6. **Optional hardening** — Rate limit; audit log of who changed what.

## Pseudocode (order of checks)

```
POST /wp-json/custom/v1/article-status
  if not is_user_logged_in():
    return 401

  if not wp_verify_nonce(request.nonce, 'update_article_status'):
    return 403

  id = intval(request.article_id)
  if id <= 0 or not get_post(id):
    return 404

  if not current_user_can('edit_post', id):
    return 403

  new_status = sanitize_key(request.status)
  if new_status not in ALLOWED_STATUSES:
    return 400

  if new_status === 'publish' and not current_user_can('publish_posts'):
    return 403

  if not user_can_edit_this_post_type(id):
    return 403

  wp_update_post(['ID' => id, 'post_status' => new_status])
  return 200 with updated post
```

## Two tests that must be rejected

1. **Unauthenticated request** — POST with valid-looking `article_id` and `status=publish`, no cookie → **401/403**, post unchanged.
2. **Subscriber with forged nonce** — Logged-in subscriber (or editor without rights on that post) POST to publish someone else’s article → **403**, post unchanged.

## Raising with the developer

Private PR comment: explain that **authorization must be server-side** (CWE-862 / OWASP Broken Access Control); the button is UX, not security. Offer a paired patch using `permission_callback`, nonce verification, and status allowlist. **Block release** until endpoint fails the two tests above and passes capability checks for legitimate editors.

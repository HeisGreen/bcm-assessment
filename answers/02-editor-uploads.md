# Question 2 — Editor cannot upload images

## Likely causes (at least three)

1. **Role / capability mismatch** — The editor’s role lacks `upload_files` (or a custom role plugin removed it) while the colleague has Administrator or Author with upload rights.
2. **PHP or server upload limits** — `upload_max_filesize`, `post_max_size`, or memory limits block the file; only some users might hit this if they upload larger assets.
3. **Security or hosting policy** — A security plugin, WAF (mod_security), or `DISALLOW_UNFILTERED_UPLOADS` blocks MIME types; or the site / multisite **upload quota** is full for that account or globally.
4. *(Additional)* **Browser or network** — Corporate proxy or extension blocks Media Library uploads for one machine (less common but quick to rule out).

## Order of checks, evidence, and fixes

### 1. Capabilities (check first — most common on WP)

- **Where:** Users → affected editor → Role; or User Role Editor / Members plugin; temporarily log in as that user (User Switching).
- **Evidence:** `current_user_can('upload_files')` is false; role is Editor but customized caps differ from colleague.
- **Fix:** Restore `upload_files` on the role or move user to a role that includes it; document if intentional restriction.

### 2. Upload error from Media Library

- **Where:** Reproduce upload as that user; read exact error in UI; Site Health → Info → Media handling; PHP ini / hosting panel.
- **Evidence:** “ exceeds the maximum upload size ”, HTTP 413, or PHP log entry.
- **Fix:** Increase limits or provide guidance on image compression; adjust nginx `client_max_body_size` if applicable.

### 3. Server / plugin restrictions and quota

- **Where:** Server error log at upload time; security plugin settings; Multisite → Sites → upload space; disk usage on host.
- **Evidence:** MIME blocked, mod_security rule ID, “Sorry, you have used all of your storage quota”.
- **Fix:** Whitelist allowed types, adjust quota, free disk space, or tune WAF rule.

### 4. Client environment (if server looks clean)

- **Where:** Same user, different browser/incognito; another network.
- **Evidence:** Works elsewhere → local blocker; same failure everywhere → server-side.

**Once confirmed:** Apply the minimal fix (capability restore, limit increase, quota, or plugin exception), have the editor retry one small JPEG and one typical article image, and note the cause in the ticket for future onboarding.

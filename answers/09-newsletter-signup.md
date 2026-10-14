# Question 9 — Newsletter signup (timeout, rate limit, invalid email)

## Approach

- Persist each attempt with an **idempotency key** (UUID generated once per user submit).
- On timeout, treat outcome as **unknown** — do not assume failure; avoid blind retries that create duplicates.
- Reconcile with provider using the same idempotency key or a GET-by-email-hash if the API supports it.

## Storage (example table `newsletter_signups`)

| Column | Purpose |
|--------|---------|
| `idempotency_key` | Primary key; sent as `Idempotency-Key` header |
| `email_hash` | SHA-256 of normalised email (lookup without storing plaintext in logs) |
| `status` | `pending`, `confirmed`, `failed` |
| `provider_subscriber_id` | Set when API returns success |
| `attempts` | Retry count |
| `updated_at` | Last API interaction |

## Logging

**Log:** idempotency key, HTTP status, latency, rate-limit headers, correlation id.

**Avoid logging:** full email, API secrets, full request/response bodies with PII.

## Function (PHP-style pseudocode)

```php
function subscribe_newsletter(string $email, string $idempotencyKey, NewsletterClient $api, SignupRepository $db): SignupResult
{
    $email = strtolower(trim($email));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return SignupResult::invalidEmail();
    }

    $existing = $db->findByKey($idempotencyKey);
    if ($existing && $existing->status === 'confirmed') {
        return SignupResult::alreadySubscribed($existing);
    }

    if ($existing && $existing->status === 'pending') {
        $remote = $api->getSubscriberByIdempotencyKey($idempotencyKey);
        if ($remote->found) {
            $db->markConfirmed($idempotencyKey, $remote->id);
            return SignupResult::confirmed($remote->id);
        }
    }

    $row = $db->upsertPending($idempotencyKey, hash('sha256', $email));

    try {
        $response = $api->createSubscriber($email, ['Idempotency-Key' => $idempotencyKey]);
    } catch (TimeoutException $e) {
        $db->touchPending($idempotencyKey);
        return SignupResult::pendingRetryLater();
    } catch (RateLimitException $e) {
        if ($row->attempts >= 3) {
            return SignupResult::rateLimited();
        }
        $db->incrementAttempts($idempotencyKey);
        sleep(min(60, 2 ** $row->attempts));
        return subscribe_newsletter($email, $idempotencyKey, $api, $db);
    } catch (InvalidEmailException $e) {
        $db->markFailed($idempotencyKey, 'invalid');
        return SignupResult::invalidEmail();
    }

    $db->markConfirmed($idempotencyKey, $response->subscriberId);
    return SignupResult::confirmed($response->subscriberId);
}
```

## Test: retry after service already accepted

1. Mock API: first `createSubscriber` sleeps then closes connection (timeout).
2. Assert DB row is `pending`, no second subscriber id yet.
3. Mock `getSubscriberByIdempotencyKey` returns subscriber id `sub_123`.
4. Call function again with **same** idempotency key.
5. Assert **no second** `createSubscriber` call (or provider returns 409/idempotent replay); DB `confirmed` with `sub_123`; exactly one logical signup.

Local mock: WireMock or a tiny PHP script returning scripted responses per `Idempotency-Key`.

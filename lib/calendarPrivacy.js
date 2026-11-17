// Calendar URLs are bearer credentials, including tokens in paths, userinfo,
// fragments and arbitrary query keys. Never log a path-preserving "redaction".
function redactCalendarText(value) {
    return String(value == null ? '' : value)
        .replace(/(?:https?|webcals?):\/\/[^\s<>"'`]+/gi, (raw) => {
            try { return `${new URL(raw.replace(/^webcal/i, 'http')).hostname}/[redacted-calendar-url]`; }
            catch { return '[redacted-calendar-url]'; }
        })
        .replace(/\/api\/public\/ical\/[^\s<>"'`]+/gi, '/api/public/ical/[redacted]')
        .replace(/([?&](?:sig|token|secret|apikey|api_key|key|s)=)[^&\s<>"']*/gi, '$1[redacted]');
}

function safeCalendarStatus(value) {
    const text = String(value || '');
    if (/^ok \(\d+ dates blocked\)$/.test(text)) return text;
    return text ? 'error: Calendar sync failed' : null;
}

function publicFeed(row) {
    let host = null;
    try { host = new URL(row.ical_url).hostname; } catch { /* no raw fallback */ }
    return {
        id: row.id, entity_slug: row.entity_slug, resource_id: row.resource_id,
        source_label: redactCalendarText(row.source_label),
        provider: redactCalendarText(row.provider), ical_host: host,
        last_synced_at: row.last_synced_at,
        last_sync_status: safeCalendarStatus(row.last_sync_status),
        created_at: row.created_at, is_active: row.is_active,
    };
}

function publicEntity(row) {
    if (!row) return row;
    // Explicitly remove known calendar credentials from legacy select('*') rows.
    const { ical_token, ical_export_token, ical_url, feed_url, ...safe } = row;
    return safe;
}

function calendarPrivateHeaders(_req, res, next) {
    res.set('Cache-Control', 'private, no-store');
    res.set('Referrer-Policy', 'no-referrer');
    next();
}

module.exports = { redactCalendarText, safeCalendarStatus, publicFeed, publicEntity, calendarPrivateHeaders };

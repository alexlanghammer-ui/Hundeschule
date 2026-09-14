import { clearSessionCookie, jsonResponse } from '../../../src/lib/auth.js';

export function onRequestPost() {
  return jsonResponse({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie() } });
}

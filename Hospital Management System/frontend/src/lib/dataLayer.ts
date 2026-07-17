// Single place that talks to @msbc/data-layer's token manager.
//
// The data-layer ships a default token manager whose bound methods are
// re-exported from the package (setTokens, clearTokens, isAuthenticated,
// setRefreshEndpoint, ...). We access them through a namespace import so that
// if a name differs slightly in your installed version, the app still loads and
// you only fix it HERE. Once installed, hover these calls in your editor to see
// the exact signatures.

import * as DataLayer from '@msbc/data-layer';
import { ApiUrls } from '../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dl = DataLayer as any;

// Tell the token manager which endpoint refreshes an expired access token.
// (The response interceptor calls this automatically on a 401.)
if (typeof dl.setRefreshEndpoint === 'function') {
  dl.setRefreshEndpoint(ApiUrls.auth.refresh);
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Store tokens so the axios request interceptor attaches
 * "Authorization: Bearer <accessToken>" to every call.
 *
 * The token manager's signature is setTokens(access, refresh) — positional.
 */
export function saveTokens(tokens: AuthTokens): void {
  if (typeof dl.setTokens !== 'function') {
    console.error('[dataLayer] @msbc/data-layer has no setTokens export — cannot store the session.');
    return;
  }
  dl.setTokens(tokens.accessToken, tokens.refreshToken);
}

/** Wipe the session (logout). */
export function clearSession(): void {
  if (typeof dl.clearTokens === 'function') dl.clearTokens();
}

/** True if a valid access token is stored. */
export function isLoggedIn(): boolean {
  try {
    return typeof dl.isAuthenticated === 'function' ? Boolean(dl.isAuthenticated()) : false;
  } catch {
    return false;
  }
}

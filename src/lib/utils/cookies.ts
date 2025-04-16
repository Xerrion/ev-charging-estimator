// Types for cookie options
export interface CookieOptions {
  expires?: Date | number; // Date object or days as number
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean;
}

// Cookie value can be string, number, boolean, or object
export type CookieValue = string | number | boolean | object;

/**
 * Sets a cookie with the given name, value, and options
 */
export function setCookie(name: string, value: CookieValue, options: CookieOptions = {}): void {
  if (typeof window === 'undefined') return;

  try {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(JSON.stringify(value))}`;

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const days = options.expires;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        options.expires = date;
      }
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.path) cookieString += `; path=${options.path}`;
    if (options.domain) cookieString += `; domain=${options.domain}`;
    if (options.secure) cookieString += '; secure';
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
    if (options.httpOnly) cookieString += '; httponly';

    document.cookie = cookieString;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
}

/**
 * Gets a cookie value by name
 * Returns null if cookie doesn't exist
 */
export function getCookie<T extends CookieValue>(name: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((c) => c.startsWith(`${encodeURIComponent(name)}=`));

    if (!cookie) return null;

    const value = cookie.split('=')[1];
    return JSON.parse(decodeURIComponent(value)) as T;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
}

/**
 * Checks if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Removes a cookie by name
 */
export function removeCookie(name: string, options: Omit<CookieOptions, 'expires'> = {}): void {
  setCookie(name, '', { ...options, expires: new Date(0) });
}

/**
 * Gets all cookies as an object
 */
export function getAllCookies(): Record<string, CookieValue> {
  if (typeof window === 'undefined') return {};

  try {
    return document.cookie.split('; ').reduce<Record<string, CookieValue>>((acc, cookie) => {
      if (cookie) {
        const [name, value] = cookie.split('=').map(decodeURIComponent);
        try {
          acc[name] = JSON.parse(value);
        } catch {
          acc[name] = value;
        }
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Error getting all cookies:', error);
    return {};
  }
}

/**
 * Removes all cookies
 */
export function removeAllCookies(options: Omit<CookieOptions, 'expires'> = {}): void {
  const cookies = getAllCookies();
  Object.keys(cookies).forEach((name) => removeCookie(name, options));
}

/**
 * Cookie consent management
 */
export const COOKIE_CONSENT = {
  ACCEPTED: 'cookie-consent-accepted',
  REJECTED: 'cookie-consent-rejected',
  PENDING: 'cookie-consent-pending'
} as const;

export type CookieConsentStatus = (typeof COOKIE_CONSENT)[keyof typeof COOKIE_CONSENT];

/**
 * Gets the current cookie consent status
 */
export function getCookieConsentStatus(): CookieConsentStatus {
  if (hasCookie(COOKIE_CONSENT.ACCEPTED)) return COOKIE_CONSENT.ACCEPTED;
  if (hasCookie(COOKIE_CONSENT.REJECTED)) return COOKIE_CONSENT.REJECTED;
  return COOKIE_CONSENT.PENDING;
}

/**
 * Sets the cookie consent status
 */
export function setCookieConsentStatus(status: CookieConsentStatus): void {
  // Remove any existing consent cookies
  Object.values(COOKIE_CONSENT).forEach((value) => removeCookie(value));

  // Set the new consent status
  if (status !== COOKIE_CONSENT.PENDING) {
    setCookie(status, true, {
      expires: 365, // 1 year
      path: '/',
      sameSite: 'Lax'
    });
  }
}

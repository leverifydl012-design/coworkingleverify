/** Client session keys (browser only). */
export const AUTH_KEY = "leverify-circle-admin-auth";
export const PW_KEY = "leverify-circle-admin-pw";

export const ADMIN_EMAIL = "Asidsarfraz@gmail.com";

/** Default admin password for local dev; override in production with ADMIN_PASSWORD env. */
export const DEFAULT_ADMIN_PASSWORD = "7654321";

export function getServerAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function persistAdminSession(password: string) {
  sessionStorage.setItem(AUTH_KEY, "ok");
  sessionStorage.setItem(PW_KEY, password);
  window.dispatchEvent(new Event("leverify-admin-auth"));
}

export function clearAdminSession() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(PW_KEY);
  window.dispatchEvent(new Event("leverify-admin-auth"));
}

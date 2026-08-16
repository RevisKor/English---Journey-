import { POST_LOGIN_RETURN_KEY } from "@shared/auth-navigation";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
export { POST_LOGIN_RETURN_KEY, resolvePostLoginReturnPath } from "@shared/auth-navigation";

// Start application-owned Google OAuth from an event handler or effect.
export const startLogin = () => {
  try {
    sessionStorage.setItem(POST_LOGIN_RETURN_KEY, `${window.location.pathname}${window.location.search}`);
  } catch {}
  window.location.assign("/api/auth/login/google");
};

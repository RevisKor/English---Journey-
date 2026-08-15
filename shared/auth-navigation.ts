export const POST_LOGIN_RETURN_KEY = "english-journey:post-login-return";

/** Only internal paths may be restored after authentication. */
export function resolvePostLoginReturnPath(storedPath: string | null, currentPath: string) {
  if (!storedPath || storedPath === currentPath) return null;
  if (!storedPath.startsWith("/") || storedPath.startsWith("//")) return null;
  return storedPath;
}

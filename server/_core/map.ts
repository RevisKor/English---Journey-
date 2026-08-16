/** Maps proxy support is not part of the Vercel-only English Journey runtime. */
export async function makeRequest<T = unknown>(
  _endpoint: string,
  _params: Record<string, unknown> = {},
): Promise<T> {
  throw new Error("Maps integration is not configured for this deployment.");
}

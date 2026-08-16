/**
 * Object-storage helpers are intentionally unavailable in the Vercel-only,
 * no-external-service deployment. English Journey does not currently call
 * these helpers; keeping explicit failures prevents accidental Forge use.
 */
function unavailable(): never {
  throw new Error("Object storage is not configured for this Vercel-only deployment.");
}

export async function storagePut(
  _relKey: string,
  _data: Buffer | Uint8Array | string,
  _contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  return unavailable();
}

export async function storageGet(_relKey: string): Promise<{ key: string; url: string }> {
  return unavailable();
}

export async function storageGetSignedUrl(_relKey: string): Promise<string> {
  return unavailable();
}

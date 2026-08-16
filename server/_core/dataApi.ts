export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

/** External data API calls are disabled in the independent Vercel deployment. */
export async function callDataApi(_apiId: string, _options: DataApiCallOptions = {}): Promise<never> {
  throw new Error("External data API calls are not configured for this Vercel-only deployment.");
}

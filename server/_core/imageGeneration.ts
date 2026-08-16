export type GenerateImageOptions = { prompt: string; [key: string]: unknown };
export type GenerateImageResponse = { error: string; code: "IMAGE_GENERATION_DISABLED" };
export type ImageModelInfo = { id: string };
export type ListImageModelsResponse = { data: ImageModelInfo[] };

/** Image generation is intentionally disabled to avoid external service usage. */
export async function generateImage(_options: GenerateImageOptions): Promise<GenerateImageResponse> {
  return { error: "Image generation is not available in the Vercel-only no-cost deployment.", code: "IMAGE_GENERATION_DISABLED" };
}

export async function listImageModels(): Promise<ListImageModelsResponse> {
  return { data: [] };
}

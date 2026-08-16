export type Role = "system" | "user" | "assistant" | "tool" | "function";
export type Message = { role: Role; content: unknown; name?: string; tool_call_id?: string };
export type InvokeParams = { messages: Message[]; model?: string; [key: string]: unknown };
export type ResponseFormat = Record<string, unknown>;
export type InvokeResult = {
  choices: Array<{ message: { content: string } }>;
  error?: { message: string; code: string };
};
export type ModelInfo = { id: string; object: string; created: number; owned_by: string };
export type ModelsResponse = { object: string; data: ModelInfo[] };

/**
 * Server-side LLM calls are disabled by design. Learners use exportable prompts
 * with their own chosen AI service, avoiding per-request platform charges.
 */
export async function invokeLLM(_params: InvokeParams): Promise<InvokeResult> {
  return {
    choices: [{ message: { content: "In-site AI calls are disabled. Use the lesson’s external AI prompt with your preferred assistant." } }],
    error: { code: "LLM_DISABLED", message: "In-site AI calls are disabled in this no-cost deployment." },
  };
}

export async function listLLMModels(): Promise<ModelsResponse> {
  return { object: "list", data: [] };
}

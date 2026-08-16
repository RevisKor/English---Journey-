/**
 * English Journey uses browser-native pronunciation playback and does not send
 * learner audio to paid transcription services in the Vercel-only edition.
 */
export type TranscribeOptions = {
  audioUrl: string;
  language?: string;
  prompt?: string;
};

export type TranscriptionResponse = {
  text: string;
  language?: string;
  duration?: number;
};

export type TranscriptionError = {
  error: string;
  code: "SERVICE_UNAVAILABLE";
  details: string;
};

export async function transcribeAudio(
  _options: TranscribeOptions,
): Promise<TranscriptionError> {
  return {
    error: "Server-side transcription is unavailable in the no-cost deployment.",
    code: "SERVICE_UNAVAILABLE",
    details: "Use the browser-native pronunciation and speaking practice tools instead.",
  };
}

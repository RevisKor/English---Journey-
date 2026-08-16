export type HeartbeatJob = { name: string; cron: string; path: string; method?: "POST" | "PUT"; payload?: unknown; description?: string };
export type HeartbeatJobUpdate = Partial<Omit<HeartbeatJob, "name">> & { enable?: boolean };
export type HeartbeatJobInfo = { taskUid: string; name: string; userId: string; description: string; cronExpression: string; callbackPath: string; callbackMethod: string; callbackPayload: string; isEnable: boolean };

const unsupported = () => {
  throw new Error("Scheduled jobs are not configured for this Vercel-only deployment.");
};

export async function createHeartbeatJob(_job: HeartbeatJob, _userSession: string): Promise<{ taskUid: string }> { return unsupported(); }
export async function updateHeartbeatJob(_taskUid: string, _patch: HeartbeatJobUpdate, _userSession: string): Promise<{ nextExecutionAt?: string | null }> { return unsupported(); }
export async function deleteHeartbeatJob(_taskUid: string, _userSession: string): Promise<void> { return unsupported(); }
export async function listHeartbeatJobs(_userSession: string, _pagination?: { page?: number; pageSize?: number }): Promise<{ total: number; actorUserId: string; jobs: HeartbeatJobInfo[] }> { return unsupported(); }

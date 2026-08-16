export type NotificationPayload = {
  title: string;
  content: string;
};

/** Owner notifications are intentionally disabled in the independent edition. */
export async function notifyOwner(_payload: NotificationPayload): Promise<boolean> {
  return false;
}

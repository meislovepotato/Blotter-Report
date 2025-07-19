import emitter from "./eventEmitter";

/**
 * Triggers a local live activity feed event.
 * @param {"complaint" | "blotter"} type
 * @param {string} id - Complaint or Blotter ID
 * @param {string} status
 * @param {string} adminName
 */
export function triggerActivityFeed(type, id, status, adminName) {
  emitter.dispatchEvent(
    new CustomEvent("activityFeedUpdated", {
      detail: {
        type,
        [`${type}Id`]: id,
        status,
        adminName,
        action: `marked ${type} as ${status}`,
        timestamp: new Date().toISOString(),
      },
    })
  );
}

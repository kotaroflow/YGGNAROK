export type ChatProfileContext = {
  profileId?: string;
  profileName?: string;
  profileGoal?: string;
};

export function normalizeChatProfileContext(input: unknown): ChatProfileContext {
  if (!input || typeof input !== "object") {
    return { profileName: "default" };
  }

  const raw = input as Record<string, unknown>;

  return {
    profileId: typeof raw.profileId === "string" && raw.profileId.trim() ? raw.profileId.trim() : undefined,
    profileName:
      typeof raw.profileName === "string" && raw.profileName.trim() ? raw.profileName.trim() : "default",
    profileGoal:
      typeof raw.profileGoal === "string" && raw.profileGoal.trim() ? raw.profileGoal.trim() : undefined,
  };
}

import { redirect } from "next/navigation";
import { runFreeCouncilTask } from "@/server/ai-council/free-runtime";

export async function POST(request: Request) {
  const formData = await request.formData();
  const taskType = String(formData.get("taskType") || "content.prepare");
  const mode = normalizeMode(formData.get("mode"));
  const prompt = String(formData.get("prompt") || "").trim();

  if (!prompt) {
    redirect("/conselho-ia?error=missing_prompt");
  }

  const job = await runFreeCouncilTask({ taskType, mode, prompt });
  redirect(`/conselho-ia?job=${job.id}`);
}

function normalizeMode(value: FormDataEntryValue | null): "fast" | "deep" | "chaos" | "council_decision" {
  if (value === "fast" || value === "deep" || value === "chaos" || value === "council_decision") return value;
  return "deep";
}

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { runFreeCouncilTask } from "@/server/ai-council/free-runtime";
import { rateLimitByIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { allowed } = rateLimitByIp(request, 5, 60000);
  if (!allowed) {
    if (request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
    }
    redirect("/conselho-ia?error=rate_limited");
  }

  const contentType = request.headers.get("content-type") || "";
  let taskType: string;
  let mode: "fast" | "deep" | "chaos" | "council_decision";
  let prompt: string;

  if (contentType.includes("application/json")) {
    const body = await request.json();
    taskType = body.taskType || "content.prepare";
    mode = normalizeMode(body.mode);
    prompt = String(body.prompt || "").trim();
  } else {
    const formData = await request.formData();
    taskType = String(formData.get("taskType") || "content.prepare");
    mode = normalizeMode(formData.get("mode"));
    prompt = String(formData.get("prompt") || "").trim();
  }

  if (!prompt) {
    if (contentType.includes("application/json")) {
      return NextResponse.json({ error: "missing_prompt" }, { status: 400 });
    }
    redirect("/conselho-ia?error=missing_prompt");
  }

  const job = await runFreeCouncilTask({ taskType, mode, prompt });

  if (contentType.includes("application/json")) {
    return NextResponse.json({ job });
  }

  redirect(`/conselho-ia?job=${job.id}`);
}

function normalizeMode(value: unknown): "fast" | "deep" | "chaos" | "council_decision" {
  if (value === "fast" || value === "deep" || value === "chaos" || value === "council_decision") return value;
  return "deep";
}

import { NextResponse } from "next/server";
import { getFreeCouncilJobs } from "@/server/ai-council/free-runtime";

export async function GET() {
  try {
    const jobs = await getFreeCouncilJobs();
    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json({ jobs: [] });
  }
}

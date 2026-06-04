// scripts/run_chat_tests.ts
import { chromium, Browser, Page } from "playwright";
import * as fs from "fs";

interface TestResult {
  agent: string;
  latencyMs: number;
  response: string;
  error?: string;
}

const agents = ["@antigravity"];
const prompt = `
${"${agent}"} Olá, por favor responda as três questões abaixo e inclua o nome do modelo que está usando:
1. Qual a capital do Brasil?
2. Explique em duas frases como funciona a fotossíntese.
3. Crie um pequeno poema de quatro linhas sobre criatividade.
`;

async function runTest(agent: string): Promise<TestResult> {
  const browser: Browser = await chromium.launch({ headless: true });
  const page: Page = await browser.newPage();
  const start = Date.now();
  try {
    await page.goto("http://localhost:3000");
    // Assume the chat input is a textarea; adjust if needed
    const input = page.locator("textarea");
    await input.waitFor({ timeout: 5000 });
    const message = `${agent} Olá, por favor responda as três questões abaixo e inclua o nome do modelo que está usando:\n1. Qual a capital do Brasil?\n2. Explique em duas frases como funciona a fotossíntese.\n3. Crie um pequeno poema de quatro linhas sobre criatividade.`;
    await input.fill(message);
    await input.press("Enter");
    // Wait for response container; assume messages appear in div[data-role='message']
    const responseLocator = page.locator("div[data-role='message']").last();
    await responseLocator.waitFor({ timeout: 30000 });
    const response = await responseLocator.textContent();
    const latency = Date.now() - start;
    await browser.close();
    return { agent, latencyMs: latency, response: response?.trim() ?? "" };
  } catch (e:any) {
    await browser.close();
    return { agent, latencyMs: Date.now() - start, response: "", error: e.message };
  }
}

(async () => {
  const results: TestResult[] = [];
  for (const agent of agents) {
    const res = await runTest(agent);
    results.push(res);
  }
  const outPath = "scripts/test_results.json";
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");
  console.log("Test results saved to", outPath);
})();

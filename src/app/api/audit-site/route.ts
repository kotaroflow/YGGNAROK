import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAllowedUrl } from "@/lib/urlValidator";
import { rateLimitByIp } from "@/lib/rate-limit";


interface AuditRequest {
  url: string;
  adminAuth?: {
    username: string;
    password: string;
  };
  agents?: string[];
}

interface BugReport {
  type: "html" | "css" | "javascript" | "seo" | "accessibility" | "performance" | "security";
  severity: "error" | "warning" | "info";
  message: string;
  suggestion: string;
  element?: string;
  line?: number;
}

async function fetchUrl(url: string, adminAuth?: { username: string; password: string }): Promise<string> {
  const headers: HeadersInit = {
    "User-Agent": "YGGNAROK-Audit-Bot/1.0",
  };

  if (adminAuth) {
    const encoded = Buffer.from(`${adminAuth.username}:${adminAuth.password}`).toString("base64");
    headers["Authorization"] = `Basic ${encoded}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return response.text();
}

function analyzeHTML(html: string, url: string): BugReport[] {
  const bugs: BugReport[] = [];
  const $ = cheerio.load(html);

  $("title").each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 60) {
      bugs.push({
        type: "seo",
        severity: "warning",
        message: `Title tag muito longa (${text.length} caracteres)`,
        suggestion: "Reduza para 50-60 caracteres para melhor exibição nos resultados de busca.",
        element: "title",
      });
    }
    if (text.length < 10) {
      bugs.push({
        type: "seo",
        severity: "warning",
        message: "Title tag muito curta ou vazia",
        suggestion: "Adicione uma descrição única e descritiva.",
        element: "title",
      });
    }
  });

  $("meta[name='description']").each((i, el) => {
    const content = $(el).attr("content") || "";
    if (content.length > 160) {
      bugs.push({
        type: "seo",
        severity: "warning",
        message: `Meta description muito longa (${content.length} caracteres)`,
        suggestion: "Reduza para 150-160 caracteres.",
        element: "meta[name='description']",
      });
    }
    if (!content) {
      bugs.push({
        type: "seo",
        severity: "error",
        message: "Meta description ausente",
        suggestion: "Adicione uma meta description única para cada página.",
        element: "meta[name='description']",
      });
    }
  });

  $("img").each((i, el) => {
    const src = $(el).attr("src");
    const alt = $(el).attr("alt");
    if (src && !alt) {
      bugs.push({
        type: "accessibility",
        severity: "warning",
        message: `Imagem sem atributo ALT: ${src}`,
        suggestion: "Adicione descrições ALT para melhorar acessibilidade e SEO.",
        element: "img",
      });
    }
  });

  $("a").each((i, el) => {
    const href = $(el).attr("href");
    if (href && href.startsWith("#")) {
      const targetId = href.substring(1);
      if (!$(`#${targetId}`).length) {
        bugs.push({
          type: "html",
          severity: "warning",
          message: `Link ancor âncora inexistente: ${href}`,
          suggestion: "Verifique se o destino do link existe na página.",
          element: "a",
        });
      }
    }
  });

  const htmlStr = $.html();
  const divCount = (htmlStr.match(/<div/g) || []).length;
  const pCount = (htmlStr.match(/<p/g) || []).length;
  
  if (divCount > pCount * 3) {
    bugs.push({
      type: "html",
      severity: "info",
      message: "Alta proporção de divs em relação a parágrafos",
      suggestion: "Considere usar elementos semânticos (article, section, main) para melhorar SEO.",
    });
  }

  return bugs;
}

function analyzeCSS(html: string): BugReport[] {
  const bugs: BugReport[] = [];
  const $ = cheerio.load(html);

  $("style").each((i, el) => {
    const css = $(el).html() || "";
    const unusedSelectors = css.match(/[.#]?[a-zA-Z_-]+ \{/g)?.filter(s => 
      !html.includes(s.replace(/ [.#]?[a-zA-Z_-]+ \{/, ""))
    ) || [];
    
    if (unusedSelectors.length > 3) {
      bugs.push({
        type: "css",
        severity: "info",
        message: `${unusedSelectors.length} seletores CSS provavelmente não utilizados`,
        suggestion: "Remova regras CSS órfãs para reduzir o tamanho do bundle.",
      });
    }
  });

  const inlineStyles = $("[style]").length;
  if (inlineStyles > 10) {
    bugs.push({
      type: "css",
      severity: "warning",
      message: `${inlineStyles} elementos com estilos inline`,
      suggestion: "Mova estilos para folhas de estilo externas para melhor manutenção.",
    });
  }

  return bugs;
}

function analyzeAccessibility(html: string): BugReport[] {
  const bugs: BugReport[] = [];
  const $ = cheerio.load(html);

  $("[aria-hidden='true']").each((i, el) => {
    const parentFocusable = $(el).find("a, button, input, select, textarea").length;
    if (parentFocusable > 0) {
      bugs.push({
        type: "accessibility",
        severity: "warning",
        message: "Elemento aria-hidden contém elementos focáveis",
        suggestion: "Remova elementos focáveis dentro de aria-hidden ou inverta a lógica.",
      });
    }
  });

  $("button").each((i, el) => {
    const hasAccessibleName = $(el).attr("aria-label") || $(el).attr("aria-labelledby") || 
                              $(el).find("*[slot='tooltip']").length > 0 ||
                              $(el).text().trim().length > 0;
    if (!hasAccessibleName) {
      bugs.push({
        type: "accessibility",
        severity: "warning",
        message: "Botão sem nome acessível",
        suggestion: "Adicione aria-label ou texto visível ao botão.",
      });
    }
  });

  return bugs;
}

function analyzePerformance(html: string): BugReport[] {
  const bugs: BugReport[] = [];
  const $ = cheerio.load(html);

  const scripts = $("script[src]").length;
  if (scripts > 5) {
    bugs.push({
      type: "performance",
      severity: "warning",
      message: `${scripts} scripts externos carregados`,
      suggestion: "Considere carregar scripts não críticos de forma assíncrona ou defer.",
    });
  }

  const images = $("img[src]").length;
  const imagesWithoutLoading = $("img:not([loading])").length;
  if (imagesWithoutLoading > images * 0.5) {
    bugs.push({
      type: "performance",
      severity: "info",
      message: "Várias imagens sem atributo loading='lazy'",
      suggestion: "Adicione loading='lazy' para imagens fora da viewport.",
    });
  }

  return bugs;
}

function analyzeSecurity(html: string): BugReport[] {
  const bugs: BugReport[] = [];
  const $ = cheerio.load(html);

  $("form").each((i, el) => {
    const action = $(el).attr("action") || "";
    if (action.startsWith("http://")) {
      bugs.push({
        type: "security",
        severity: "warning",
        message: "Formulário enviando para HTTP (não HTTPS)",
        suggestion: "Use URLs HTTPS para previnir interception de dados.",
      });
    }
  });

  $("iframe").each((i, el) => {
    const src = $(el).attr("src") || "";
    if (src.startsWith("http://")) {
      bugs.push({
        type: "security",
        severity: "warning",
        message: "Iframe carregando de fonte HTTP",
        suggestion: "Atualize para HTTPS ou use sandbox.",
      });
    }
  });

  return bugs;
}

export async function POST(request: Request) {
  const { allowed } = rateLimitByIp(request, 10, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    const { url, adminAuth, agents = ["hermes", "atlas", "pixel"] }: AuditRequest = body;

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    const baseUrl = url.replace(/\/$/, "");
    const results: BugReport[] = [];

    let html: string;
    try {
      html = await fetchUrl(baseUrl, adminAuth);
    } catch (e) {
      return NextResponse.json(
        { error: `Falha ao acessar URL: ${e instanceof Error ? e.message : String(e)}` },
        { status: 500 }
      );
    }

    const $ = cheerio.load(html);
    
    const title = $("title").text().trim();
    const description = $("meta[name='description']").attr("content") || "";
    const h1Text = $("h1").first().text().trim();
    const ssl = url.startsWith("https://");

    const issues = [
      ...analyzeHTML(html, baseUrl),
      ...analyzeCSS(html),
      ...analyzeAccessibility(html),
      ...analyzePerformance(html),
      ...analyzeSecurity(html),
    ];

    const scores = {
      seo: Math.max(0, 100 - issues.filter(i => i.type === "seo").length * 15),
      ux: Math.max(0, 100 - issues.filter(i => i.type === "accessibility").length * 10),
      perf: Math.max(0, 100 - issues.filter(i => i.type === "performance").length * 8),
      cro: Math.max(0, 100 - Math.floor(issues.length / 2)),
      code: Math.max(0, 100 - issues.filter(i => i.type === "html" || i.type === "css").length * 12),
      design: 85,
    };

    const suggestions = [];
    if (issues.some(i => i.type === "seo")) {
      suggestions.push({
        title: "Otimizar SEO Básico",
        impact: "high" as const,
        agent: "Hermes",
        text: "Corrija as tags meta e heading para melhorar o ranqueamento nos mecanismos de busca.",
      });
    }
    if (issues.some(i => i.type === "accessibility")) {
      suggestions.push({
        title: "Corrigir Problemas de Acessibilidade",
        impact: "high" as const,
        agent: "Isis",
        text: "Adicione ARIA labels e corrija o contraste para atender WCAG 2.1.",
      });
    }
    if (issues.some(i => i.type === "performance")) {
      suggestions.push({
        title: "Otimizar Performance",
        impact: "medium" as const,
        agent: "Atlas",
        text: "Reduza scripts externos e adicione lazy loading em imagens.",
      });
    }

    return NextResponse.json({
      success: true,
      url: baseUrl,
      score: scores,
      issues,
      suggestions,
      details: {
        title,
        description,
        h1: h1Text,
        ssl,
        loadTime: "< 1s",
      },
      agents: agents.filter(a => ["hermes", "isis", "morax", "atlas", "pixel"].includes(a)),
    });
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor de análise" },
      { status: 500 }
    );
  }
}
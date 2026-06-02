import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Autenticação Supabase
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const payload = await request.json();

    const n8nWebhookUrl = "https://kotaroflow.app.n8n.cloud/webhook-test/yggnarok-hub";

    // Se a URL estiver ausente, devolvemos um aviso
    if (!n8nWebhookUrl) {
      console.warn("⚠️ [YGGNAROK -> N8N] N8N_WEBHOOK_URL não definida. Simulando resposta.");
      return NextResponse.json({
        success: true,
        message: "SIMULAÇÃO: O n8n não está conectado ainda, mas o YGGNAROK está pronto para disparar!",
        payload_recebido: payload
      });
    }

    // Dispara a requisição real para o n8n
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro no n8n: ${response.statusText}`);
    }

    const n8nData = await response.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      message: "Sucesso! O n8n recebeu e processou a carga.",
      data: n8nData,
    });

  } catch (error: unknown) {
    console.error("[N8N API ERROR]", error);
    const message = error instanceof Error ? error.message : "Falha ao enviar para o n8n";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

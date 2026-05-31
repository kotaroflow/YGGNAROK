"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { Megaphone, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function NovaCampanhaClient() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [source, setSource] = useState("facebook_ads");
  const [budget, setBudget] = useState("1500");
  const [utmCampaign, setUtmCampaign] = useState("ygg_lancamento_alpha");
  const [utmMedium, setUtmMedium] = useState("cpc");

  // Flow State
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Por favor, preencha o nome da campanha.");
      return;
    }

    setIsLoading(true);

    // Simulate AI campaign structure design
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleRedirect = () => {
    router.push("/comercial?tab=campanhas");
  };

  return (
    <main className="min-h-screen text-foreground px-4 py-8 lg:px-8 bg-neutral-950">
      <div className="mx-auto w-full max-w-2xl">
        <BackButton />

        {isSuccess ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-6 animate-alert-pop shadow-2xl shadow-emerald-500/5">
            <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Campanha Ativada com Sucesso!</h2>
              <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                As IAs assistentes do YGGNAROK estruturaram a campanha. Os pixels de remarketing e rastreadores UTM já estão auditando tráfego comercial.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-neutral-900/40 p-4 font-mono text-[10px] text-brand break-all select-all max-w-md mx-auto">
              https://yggnarok.com/lnk?url=checkout&amp;utm_source={source}&amp;utm_medium={utmMedium}&amp;utm_campaign={utmCampaign}
            </div>

            <button
              type="button"
              onClick={handleRedirect}
              className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-6 py-3 text-xs font-bold transition shadow-md shadow-brand/10 mx-auto"
            >
              <span>Ir para Painel de Campanhas</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur flex flex-col transition hover:border-white/10">
            {/* Decorative glows */}
            <div className="absolute -right-20 -top-20 size-40 rounded-full bg-brand/5 blur-3xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-brand/15 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                <Megaphone size={22} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-brand/20 bg-brand/5 text-brand text-[10px] font-medium mb-1.5">
                  <Sparkles size={10} className="animate-pulse" />
                  <span>Inteligência do Conselho</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tight">Estruturar Nova Campanha</h1>
                <p className="text-xs text-muted mt-0.5">Defina as fontes de tráfego e gere rastreadores UTM integrados ao LTM comercial.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-4 border-t border-line/60">
              {isLoading ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-4">
                  <div className="size-10 rounded-full border-4 border-brand border-t-transparent animate-spin" />
                  <p className="text-xs text-muted font-bold animate-pulse">Conselho de IAs estruturando tráfego e pixels...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Nome da Campanha Comercial</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Tráfego Frio - Mentoria Alpha"
                      className="w-full h-11 px-4 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/40 transition"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Canal de Aquisição (Origem)</label>
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/40 transition cursor-pointer"
                      >
                        <option value="facebook_ads">Facebook &amp; Instagram Ads</option>
                        <option value="google_ads">Google &amp; YouTube Ads</option>
                        <option value="tiktok_ads">TikTok Ads</option>
                        <option value="instagram_bio">Instagram Bio (Orgânico)</option>
                        <option value="youtube_desc">YouTube Descrição (Orgânico)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Orçamento Estimado (R$)</label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Ex: 1500"
                        className="w-full h-11 px-4 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/40 transition font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Nome da UTM Campaign</label>
                      <input
                        type="text"
                        value={utmCampaign}
                        onChange={(e) => setUtmCampaign(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/40 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Meio de Divulgação (UTM Medium)</label>
                      <input
                        type="text"
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/40 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 h-11 w-full rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 text-xs font-bold transition shadow-md shadow-brand/10 mt-6"
                  >
                    <Sparkles size={13} />
                    <span>Gerar Campanha com IA</span>
                  </button>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Megaphone, Sparkles, ArrowRight, CheckCircle2, X } from "lucide-react";

interface NovaCampanhaModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

export function NovaCampanhaModal({ onClose, onCreated }: NovaCampanhaModalProps) {
  // Form State
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [budget, setBudget] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmMedium, setUtmMedium] = useState("");

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

  const handleDone = () => {
    onCreated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-surface shadow-2xl animate-alert-pop">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-8 rounded-lg border border-line bg-surface-strong/50 hover:bg-surface-strong text-muted hover:text-foreground flex items-center justify-center transition"
        >
          <X size={14} />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {isSuccess ? (
            /* Success State */
            <div className="text-center space-y-6 animate-alert-pop">
              <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Campanha Ativada com Sucesso!</h2>
                <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                  As IAs assistentes do YGGNAROK estruturaram a campanha. Os pixels de remarketing e rastreadores UTM já estão auditando tráfego comercial.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface-strong/40 p-4 font-mono text-[10px] text-brand break-all select-all max-w-md mx-auto">
                https://yggnarok.com/lnk?url=checkout&amp;utm_source={source}&amp;utm_medium={utmMedium}&amp;utm_campaign={utmCampaign}
              </div>

              <button
                type="button"
                onClick={handleDone}
                className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-6 py-3 text-xs font-bold transition shadow-md shadow-brand/10 mx-auto"
              >
                <span>Ir para Painel de Campanhas</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Header */}
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

              {/* Form */}
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
                      <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        list="canal-options"
                        placeholder="Ex: @instagram, @youtube, tráfego direto..."
                        className="w-full h-11 px-4 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/40 transition"
                      />
                      <datalist id="canal-options">
                        <option value="@facebook_ads" />
                        <option value="@google_ads" />
                        <option value="@tiktok_ads" />
                        <option value="@instagram_bio" />
                        <option value="@youtube_desc" />
                      </datalist>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Orçamento Estimado (R$)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Ex: 1500"
                        className="w-full h-11 px-4 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/40 transition font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-11 rounded-xl border border-line bg-surface-strong/30 hover:bg-surface-strong text-muted hover:text-foreground text-xs font-bold transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-[2] flex items-center justify-center gap-1.5 h-11 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 text-xs font-bold transition shadow-md shadow-brand/10"
                      >
                        <Sparkles size={13} />
                        <span>Gerar Campanha com IA</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

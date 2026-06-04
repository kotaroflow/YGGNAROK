"use client";

import { useState, useEffect } from "react";
import { AgentNodeStudio } from "@/components/agent-node-studio";
import { AgentEvolutionDashboard } from "@/components/agent-evolution-dashboard";
import { GitBranch, Brain, Lock, ShieldAlert } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isYggnarokAdminIdentity } from "@/lib/ai-hierarchy";

export function AgentesIaClient() {
  const [activeTab, setActiveTab] = useState<"studio" | "evolution">("studio");
  const [username, setUsername] = useState("kotaro");
  
  // Read logged user client-side to avoid hydration mismatch and force sidebar collapse on mount
  useEffect(() => {
    async function fetchUser() {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const email = user.email ?? "";
        const emailName = email.split("@")[0];
        setUsername(emailName);
        
        const isOwner = isYggnarokAdminIdentity(email);
        if (!isOwner) {
          setActiveTab("evolution");
        }
      } else {
        setUsername("visitante");
        setActiveTab("evolution");
      }
    }
    fetchUser();

    // Collapses the main left sidebar to optimize space for the 3D globe studio
    window.dispatchEvent(new CustomEvent("ygn-force-collapse-sidebar"));
  }, []);

  const isKotaro = isYggnarokAdminIdentity(username);

  return (
    <main className="w-full px-4 py-6 lg:px-8 space-y-6">
      {/* Header and Permission Indicator */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
            Centro Neural de Agentes
          </h1>
          <p className="text-sm text-muted mt-1">
            Gerencie a arquitetura de blocos neurais e acompanhe a evolução cognitiva do YGGNAROK.
          </p>
        </div>

        {/* Security Clearance Badge */}
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border transition ${
          isKotaro 
            ? "text-brand bg-brand/5 border-brand/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]" 
            : "text-muted bg-surface/40 border-line"
        }`}>
          {isKotaro ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              Acesso Master: Kotaro
            </>
          ) : (
            <>
              <Lock size={12} />
              Acesso Limitado: {username}
            </>
          )}
        </div>
      </div>

      {/* Tab Selector Header */}
      <div className="flex items-center gap-2 rounded-xl bg-surface/30 p-1 border border-line w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition duration-200 relative ${
            activeTab === "studio"
              ? "bg-brand text-neutral-950 shadow-md"
              : "text-muted hover:text-foreground"
          }`}
        >
          <GitBranch size={13} />
          Estúdio em Nodes
          {!isKotaro && (
            <Lock size={10} className="absolute top-1 right-1 text-red-500/80" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("evolution")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition duration-200 ${
            activeTab === "evolution"
              ? "bg-brand text-neutral-950 shadow-md"
              : "text-muted hover:text-foreground"
          }`}
        >
          <Brain size={13} />
          Autoaprendizagem &amp; Evolução
        </button>
      </div>

      {/* Content Render with Security Protection Card */}
      <div className={
        activeTab === "studio" && isKotaro 
          ? "w-full" 
          : "relative overflow-hidden rounded-2xl border border-line bg-surface/10 p-6 shadow-xl backdrop-blur-md min-h-[400px] flex flex-col justify-center"
      }>
        {activeTab === "studio" ? (
          isKotaro ? (
            <AgentNodeStudio />
          ) : (
            /* STUNNING PREMIUM SECURITY BLOCK FOR NON-ADMINS */
            <div className="max-w-md mx-auto text-center space-y-6 py-12">
              <div className="mx-auto size-16 rounded-2xl bg-brand/5 text-brand flex items-center justify-center border border-brand/20 relative shadow-[0_0_25px_rgba(245,158,11,0.08)]">
                <ShieldAlert className="size-8 text-brand animate-pulse" />
                <Lock className="size-4 text-neutral-950 bg-brand rounded-full p-0.5 absolute -bottom-1 -right-1 border border-neutral-950" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  Acesso Restrito ao Administrador
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  O **Estúdio em Nodes** permite configurar a orquestração de comportamento, system prompts e diretrizes neurais críticas do ecossistema YGGNAROK. 
                  Por razões de segurança operacional, estes controles estão bloqueados para a sua conta e restritos exclusivamente ao Administrador Master **Kotaro**.
                </p>
              </div>

              <div className="bg-surface/30 rounded-xl p-3 border border-line/60 text-[10px] text-muted text-left font-mono space-y-1">
                <p className="text-red-500 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-red-500 inline-block" /> STATUS: BLOCKED_BY_POLICY
                </p>
                <p>USER: {username}</p>
                <p>CLEARANCE_LEVEL: Tier 2 (Common)</p>
                <p>REQUIRED_CLEARANCE: Tier 1 (Owner: Kotaro)</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("evolution")}
                className="rounded-xl bg-brand/10 border border-brand/20 text-brand hover:bg-brand/20 px-5 py-2.5 text-xs font-bold transition shadow-sm"
              >
                Ir para Painel de Autoaprendizagem
              </button>
            </div>
          )
        ) : (
          <AgentEvolutionDashboard />
        )}
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import { 
  User, Mail, Shield, Key, Bell, Palette, Globe, 
  Eye, EyeOff, Check, ShieldAlert, Monitor, Sparkles, 
  LogOut, Loader2, Save, Moon, Sun, Laptop 
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { useTheme } from "@/components/theme-toggle";
import { playNotificationSound } from "@/lib/notification-sound";

const sections = [
  { id: "perfil", label: "Perfil", icon: User, description: "Nome, avatar e informações pessoais" },
  { id: "email", label: "E-mail", icon: Mail, description: "E-mail e verificação de conta" },
  { id: "seguranca", label: "Segurança", icon: Shield, description: "Senha e autenticação" },
  { id: "api", label: "Chaves de API", icon: Key, description: "OpenRouter, Supabase e integrações" },
  { id: "notificacoes", label: "Notificações", icon: Bell, description: "Preferências de alertas" },
  { id: "aparencia", label: "Aparência", icon: Palette, description: "Tema, cores e layout" },
  { id: "idioma", label: "Idioma", icon: Globe, description: "Idioma e região" },
];

export function MeuPerfilClient({
  email,
  initial,
  plan,
}: {
  email: string;
  initial: string;
  plan: string;
}) {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [theme, setTheme] = useTheme();

  const defaultName = email.split("@")[0];
  const savedProfile = useMemo(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("yggnarok.profile.v1");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, []);

  // Core profile state
  const [name, setName] = useState(() => savedProfile?.name ?? defaultName);
  const [cargo, setCargo] = useState(() => savedProfile?.cargo ?? "Líder de Estratégia");
  const [bio, setBio] = useState(() => savedProfile?.bio ?? "Desenvolvedor e modelador neural no ecossistema YGGNAROK.");
  const [avatarColor, setAvatarColor] = useState(() => savedProfile?.avatarColor ?? "bg-brand"); // preset colors: bg-brand, bg-purple-500, bg-sky-500, bg-emerald-500
  const [recoveryEmail, setRecoveryEmail] = useState(() => savedProfile?.recoveryEmail ?? "");

  // Ensure username key exists for other components
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("yggnarok.profile.v1");
    if (!stored) {
      window.localStorage.setItem("yggnarok.username", defaultName);
    }
  }, [defaultName]);
  
  // API Keys state
  const [openRouterKey, setOpenRouterKey] = useState("sk-or-v1-****************************************");
  const [geminiKey, setGeminiKey] = useState("");
  const [showOpenRouter, setShowOpenRouter] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome / Windows 11 (Esta sessão)", ip: "191.185.12.94", lastActive: "Ativo agora" },
    { id: 2, device: "Firefox / macOS Sonoma", ip: "177.34.201.8", lastActive: "Há 3 horas" },
    { id: 3, device: "Safari / iPhone 15 Pro", ip: "186.22.45.109", lastActive: "Ontem" }
  ]);

  // Notifications state
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [notifyErrors, setNotifyErrors] = useState(true);

  // UI interaction states
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const profileData = { name, cargo, bio, avatarColor, recoveryEmail };
      localStorage.setItem("yggnarok.profile.v1", JSON.stringify(profileData));
      localStorage.setItem("yggnarok.username", name);
      // Notify other components (like sidebar) of storage changes
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to save profile to localStorage", err);
    }

    setTimeout(() => {
      setIsSaving(false);
      triggerToast("Configurações atualizadas com sucesso!");
    }, 800);
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    playNotificationSound("success");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleEndSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
    triggerToast("Sessão remota encerrada.");
  };

  return (
    <main className="min-h-screen text-foreground relative">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-[var(--z-toast)] rounded-xl border border-brand/30 bg-surface/90 px-4 py-3 text-xs font-semibold text-brand shadow-xl shadow-brand/10 backdrop-blur flex items-center gap-2 animate-bounce">
          <Check size={14} />
          {successToast}
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8">
        <BackButton href="/" />

        {/* Dynamic header card */}
        <div className="mb-8 rounded-2xl border border-line bg-surface/30 p-6 shadow-sm backdrop-blur flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 size-32 bg-brand/5 blur-2xl pointer-events-none" />
          
          {/* Avatar frame */}
          <div className={`grid size-20 shrink-0 place-items-center rounded-2xl ${avatarColor} text-3xl font-black text-neutral-950 shadow-lg shadow-brand/10 transition-all duration-300`}>
            {name.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
                {name}
              </h1>
              <span className="rounded bg-brand/15 border border-brand/20 px-2 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                {plan.includes("Admin") ? "Admin" : "Free"}
              </span>
            </div>
            <p className="text-xs text-muted font-mono">{email} · {plan}</p>
            <p className="text-xs text-brand font-medium">{cargo}</p>
          </div>
        </div>

        {/* Two-column layout for desktop settings */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* Sidebar selector */}
          <nav className="flex flex-col gap-1.5 w-full">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest pl-3 mb-2 block">Preferências</span>
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-xs font-semibold transition-all duration-200
                    ${isActive 
                      ? 'border-brand bg-brand/5 text-brand shadow-sm shadow-brand/5' 
                      : 'border-line bg-surface/30 hover:border-brand/40 text-muted hover:text-foreground hover:bg-surface-strong/30'}
                  `}
                >
                  <Icon size={14} className={isActive ? "text-brand" : "text-muted group-hover:text-foreground"} />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Form/Details block */}
          <div className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md">
            
            <div className="border-b border-line pb-4 mb-6">
              <h2 className="text-base font-bold text-foreground">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              <p className="text-xs text-muted mt-1">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* SECTION: PERFIL */}
              {activeSection === "perfil" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">Nome de Usuário</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">Cargo / Role</label>
                    <input 
                      type="text" 
                      value={cargo} 
                      onChange={(e) => setCargo(e.target.value)}
                      className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">Biografia do Agente</label>
                    <textarea 
                      rows={3}
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground block mb-2">Cor do Avatar</label>
                    <div className="flex gap-3">
                      {[
                        { color: "bg-brand", name: "Ambar" },
                        { color: "bg-purple-500", name: "Roxo" },
                        { color: "bg-sky-500", name: "Azul" },
                        { color: "bg-emerald-500", name: "Verde" },
                        { color: "bg-rose-500", name: "Rose" }
                      ].map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setAvatarColor(item.color)}
                          className={`size-8 rounded-xl ${item.color} border transition ${avatarColor === item.color ? 'border-foreground scale-110 shadow-md ring-2 ring-brand/20' : 'border-line hover:scale-105'}`}
                          title={item.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: EMAIL */}
              {activeSection === "email" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground flex justify-between">
                      E-mail Primário
                      <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Verificado</span>
                    </label>
                    <input 
                      type="email" 
                      value={email} 
                      disabled
                      className="w-full rounded-xl border border-line bg-surface-strong px-4 py-2.5 text-xs text-muted cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">E-mail de Recuperação</label>
                    <input 
                      type="email" 
                      placeholder="adicionar email secundário..."
                      value={recoveryEmail} 
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: SEGURANÇA */}
              {activeSection === "seguranca" && (
                <div className="space-y-6">
                  
                  {/* Password Form */}
                  <div className="space-y-4 border-b border-line pb-6">
                    <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Alterar Senha</h3>
                    <div className="space-y-2">
                      <label className="text-[11px] text-foreground font-semibold">Senha Atual</label>
                      <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[11px] text-foreground font-semibold">Nova Senha</label>
                        <input 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] text-foreground font-semibold">Confirmar Nova Senha</label>
                        <input 
                          type="password" 
                          value={confirmNewPassword} 
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2FA simulated toggle */}
                  <div className="flex items-center justify-between border-b border-line pb-6">
                    <div>
                      <p className="text-xs font-bold text-foreground">Autenticação de Dois Fatores (2FA)</p>
                      <p className="text-[11px] text-muted leading-relaxed mt-1">Proteja sua conta solicitando um código de segurança em cada login.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactor ? 'bg-brand' : 'bg-surface-strong'}`}
                    >
                      <span className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoFactor ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Device sessions */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Sessões Ativas</h3>
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div key={session.id} className="flex justify-between items-center bg-surface/30 rounded-xl border border-line p-4 text-xs">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">{session.device}</p>
                            <p className="text-muted font-mono text-[10px]">{session.ip} · {session.lastActive}</p>
                          </div>
                          {session.id !== 1 && (
                            <button
                              type="button"
                              onClick={() => handleEndSession(session.id)}
                              className="flex items-center gap-1 font-bold text-rose-500 hover:text-rose-600 transition"
                            >
                              <LogOut size={12} /> Encerrar
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: API KEYS */}
              {activeSection === "api" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground flex justify-between">
                      OpenRouter API Key
                      <span className="text-[10px] text-brand font-mono">Conectado (Free Mode)</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showOpenRouter ? "text" : "password"} 
                        value={openRouterKey} 
                        onChange={(e) => setOpenRouterKey(e.target.value)}
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none pr-10 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenRouter(!showOpenRouter)}
                        className="absolute right-3 top-2.5 text-muted hover:text-foreground transition"
                      >
                        {showOpenRouter ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed">
                      Utilizada para chamar os motores neurais de copywriting e SEO integrados sem custos adicionais.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground flex justify-between">
                      Google Gemini API Key
                      <span className="text-[10px] text-muted font-mono">Opcional</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showGemini ? "text" : "password"} 
                        placeholder="AIzaSy..."
                        value={geminiKey} 
                        onChange={(e) => setGeminiKey(e.target.value)}
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none pr-10 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGemini(!showGemini)}
                        className="absolute right-3 top-2.5 text-muted hover:text-foreground transition"
                      >
                        {showGemini ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: NOTIFICAÇÕES */}
              {activeSection === "notificacoes" && (
                <div className="space-y-4">
                  {[
                    { id: "email", title: "Notificações por Email", desc: "Receba alertas sobre relatórios comerciais e atualizações críticas diretamente na caixa de entrada.", state: notifyEmail, setState: setNotifyEmail },
                    { id: "weekly", title: "Resumos Semanais de Performance", desc: "Um relatório consolidado dos roteiros, ideias e jobs mais eficientes produzidos por seus agentes.", state: notifyWeekly, setState: setNotifyWeekly },
                    { id: "errors", title: "Alertas de Integridade de IA", desc: "Avisos caso o bucket R2 ou as chamadas de API do OpenRouter gerem falhas de processamento.", state: notifyErrors, setState: setNotifyErrors }
                  ].map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b border-line pb-4 last:border-b-0">
                      <div className="pr-4">
                        <p className="text-xs font-bold text-foreground">{item.title}</p>
                        <p className="text-[10px] text-muted leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => item.setState(!item.state)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.state ? 'bg-brand' : 'bg-surface-strong'}`}
                      >
                        <span className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.state ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION: APARÊNCIA */}
              {activeSection === "aparencia" && (
                <div className="space-y-6">
                  
                  {/* Theme toggler block */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-foreground">Tema Visual do OS</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "dark", label: "Void", desc: "Modo Void", icon: Moon },
                        { id: "light", label: "AMBER", desc: "Modo Ambar", icon: Sun }
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSel = theme === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setTheme(item.id as "light" | "dark")}
                            className={`
                              flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition duration-200
                              ${isSel 
                                ? 'border-brand bg-brand/10 text-brand font-bold' 
                                : 'border-line bg-surface/50 text-muted hover:text-foreground hover:border-brand/35'}
                            `}
                          >
                            <Icon size={16} className={isSel ? "text-brand" : ""} />
                            <div className="text-center">
                              <p className="text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                              <p className="text-[8px] text-muted mt-0.5">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sidebar visual choice */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">Densidade Visual</label>
                    <select 
                      className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none font-medium"
                      defaultValue="normal"
                    >
                      <option value="compact">Compacto (Mais densidade)</option>
                      <option value="normal">Normal (Equilibrado)</option>
                      <option value="cozy">Confortável (Espaçado)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SECTION: IDIOMA */}
              {activeSection === "idioma" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">Idioma Regional</label>
                    <select 
                      className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none font-medium"
                      defaultValue="pt"
                    >
                      <option value="pt">Português (Brasil)</option>
                      <option value="en">English (US)</option>
                      <option value="es">Español (ES)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">Fuso Horário</label>
                    <select 
                      className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none font-medium"
                      defaultValue="-3"
                    >
                      <option value="-3">Brasília (GMT -03:00)</option>
                      <option value="0">Londres (GMT +00:00)</option>
                      <option value="-5">Nova York (GMT -05:00)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-line mt-6">
                <button
                  type="button"
                  onClick={() => {
                    const defaultName = email.split("@")[0];
                    setName(defaultName);
                    setCargo("Líder de Estratégia");
                    setBio("Desenvolvedor e modelador neural no ecossistema YGGNAROK.");
                    setAvatarColor("bg-brand");
                    setRecoveryEmail("");
                    try {
                      localStorage.removeItem("yggnarok.profile.v1");
                      localStorage.setItem("yggnarok.username", defaultName);
                      window.dispatchEvent(new Event("storage"));
                    } catch (e) {}
                    triggerToast("Campos restaurados.");
                  }}
                  className="rounded-xl px-4 py-2.5 text-xs text-muted hover:text-foreground transition"
                >
                  Restaurar Padrões
                </button>
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-5 py-2.5 text-xs font-bold transition shadow-md shadow-brand/10 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

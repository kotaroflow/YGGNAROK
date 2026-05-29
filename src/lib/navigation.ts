import {
  Home, Users, ListChecks, Workflow,
  ShoppingBag, Package, UserCheck, Link2, Megaphone, BarChart3, TrendingUp, FileBarChart,
  PenLine, Bot, RefreshCw, BookOpen, Lightbulb, Terminal, Subtitles, Hash, Library, Film, Trash2, Send,
  Shield, Briefcase, Brain, UserCog, KeyRound, Settings, ScrollText, Activity, ClipboardList,
  MessageSquare
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  label: string;
  description: string;
  href: string;
  permission?: string;
  icon: LucideIcon;
};

export type SidebarGroup = {
  id: "iriguchi" | "ura-ichiba" | "sosaku-kobo" | "sakusen-honbu";
  title: string;
  subtitle: string;
  purpose: string;
  items: SidebarItem[];
};

export const sidebarGroups: SidebarGroup[] = [
  {
    id: "iriguchi",
    title: "Entrada",
    subtitle: "Inicio",
    purpose: "Entrada do sistema e visao geral.",
    items: [
      { label: "Início", description: "Chat e atalhos", href: "/", icon: Home },
      { label: "Painel operacional", description: "Jobs e metricas", href: "/painel", permission: "profiles.view", icon: FileBarChart },
      { label: "Chat IA", description: "Assistente", href: "/chat", permission: "ai_jobs.view_own", icon: MessageSquare },
      { label: "Perfis", description: "Perfis permitidos", href: "/perfis", permission: "profiles.view", icon: Users },
      { label: "Integrações", description: "APIs e serviços", href: "/integracoes", permission: "admin.access", icon: Link2 },
    ],
  },
  {
    id: "ura-ichiba",
    title: "Mercado",
    subtitle: "Vendas",
    purpose: "Vendas, afiliados, links, campanhas e monetizacao.",
    items: [
      { label: "Vendas", description: "Painel comercial", href: "/comercial?aba=vendas", permission: "reports.view", icon: ShoppingBag },
      { label: "Produtos", description: "Ofertas", href: "/comercial?aba=produtos", permission: "reports.view", icon: Package },
      { label: "Afiliados", description: "Parceiros", href: "/comercial?aba=afiliados", permission: "reports.view", icon: UserCheck },
      { label: "Links", description: "URLs rastreaveis", href: "/comercial?aba=links", permission: "reports.view", icon: Link2 },
      { label: "Campanhas", description: "Acoes comerciais", href: "/comercial?aba=campanhas", permission: "reports.view", icon: Megaphone },
      { label: "Comissoes", description: "Ganhos", href: "/comercial?aba=comissoes", permission: "reports.view", icon: BarChart3 },
      { label: "Oportunidades", description: "Pipeline", href: "/comercial?aba=oportunidades", permission: "reports.view", icon: TrendingUp },
      { label: "Relatorios comerciais", description: "Metricas basicas", href: "/comercial?aba=relatorios", permission: "reports.view", icon: FileBarChart },
    ],
  },
  {
    id: "sosaku-kobo",
    title: "Criacao",
    subtitle: "Criacao",
    purpose: "Criacao, conteudo, midia, biblioteca e postagem manual.",
    items: [
      { label: "Criar conteudo", description: "Novo conteudo", href: "/criar-conteudo?aba=ideias", permission: "content.create", icon: PenLine },
      { label: "Calendário", description: "Planejamento", href: "/calendario", permission: "content.view", icon: ScrollText },
      { label: "Postagem Manual", description: "Fila assistida", href: "/postagem-manual", permission: "posting.view", icon: Send },
      { label: "Biblioteca", description: "Referencias", href: "/biblioteca", permission: "library.view", icon: Library },
      { label: "Midias", description: "Arquivos no R2", href: "/midias", permission: "library.view", icon: Film },
      { label: "Agentes IA", description: "Fluxo em nodes", href: "/agentes-ia", permission: "ai_jobs.create", icon: Bot },
      { label: "Continuidade IA", description: "Contexto portatil", href: "/continuidade-ia", permission: "ai_jobs.create", icon: RefreshCw },
      { label: "Roteiros", description: "Scripts", href: "/criar-conteudo?aba=roteiros", permission: "content.view", icon: ScrollText },
      { label: "Prompts", description: "Comandos uteis", href: "/prompts", permission: "library.view", icon: Terminal },
      { label: "Legendas", description: "Copy pronta", href: "/criar-conteudo?aba=legendas", permission: "content.view", icon: Subtitles },
      { label: "Hashtags", description: "Organizacao", href: "/criar-conteudo?aba=hashtags", permission: "content.view", icon: Hash },
      { label: "Lixeira Inteligente", description: "Restaurar itens", href: "/lixeira-inteligente", permission: "library.restore", icon: Trash2 },
    ],
  },
  {
    id: "sakusen-honbu",
    title: "Operacao",
    subtitle: "Sistema",
    purpose: "Sistema, permissoes, logs, jobs, seguranca e governanca tecnica.",
    items: [
      { label: "Sistema", description: "Operacao", href: "/admin?aba=geral", permission: "admin.access", icon: Shield },
      { label: "Trabalhos", description: "Fila de processamento", href: "/jobs", permission: "ai_jobs.manage_all", icon: Briefcase },
      { label: "Conselho IA", description: "Execução multiagente", href: "/conselho-ia", permission: "admin.access", icon: Brain },
      { label: "Momonga", description: "Conselho de IAs", href: "/momonga", permission: "admin.access", icon: Brain },
      { label: "Usuarios", description: "Membros", href: "/admin?aba=usuarios", permission: "admin.access", icon: Users },
      { label: "Cargos", description: "Roles", href: "/admin?aba=cargos", permission: "admin.manage_roles", icon: UserCog },
      { label: "Permissoes", description: "Chaves de acesso", href: "/admin?aba=permissoes", permission: "admin.manage_permissions", icon: KeyRound },
      { label: "Workers", description: "Processamento", href: "/admin?aba=health", permission: "admin.system_health", icon: Settings },
      { label: "Logs Gerais", description: "Eventos", href: "/admin?aba=logs", permission: "admin.view_logs", icon: BookOpen },
      { label: "Configuracoes", description: "Parametros globais", href: "/admin?aba=config", permission: "admin.access", icon: Settings },
    ],
  },
];

export function findNavigationItem(pathname: string) {
  return sidebarGroups
    .flatMap((group) => group.items.map((item) => ({ group, item })))
    .find(({ item }) => item.href === pathname);
}

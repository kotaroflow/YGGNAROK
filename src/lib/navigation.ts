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
      { label: "Painel Comercial", description: "Vendas, afiliados e métricas", href: "/comercial", permission: "reports.view", icon: ShoppingBag },
    ],
  },
  {
    id: "sosaku-kobo",
    title: "Criacao",
    subtitle: "Criacao",
    purpose: "Criacao, conteudo, midia, biblioteca e postagem manual.",
    items: [
      { label: "Estúdio de Criação", description: "Pautas, roteiros e legendas", href: "/criar-conteudo", permission: "content.create", icon: PenLine },
      { label: "Estúdio de Edição", description: "Edição de vídeo e orquestra IA", href: "/estudio-video", permission: "content.create", icon: Film },
      { label: "Agentes IA", description: "Fluxo em nodes", href: "/agentes-ia", permission: "ai_jobs.create", icon: Bot },
      { label: "Calendário", description: "Planejamento", href: "/calendario", permission: "content.view", icon: ScrollText },
      { label: "Postagem Manual", description: "Fila assistida", href: "/postagem-manual", permission: "posting.view", icon: Send },
      { label: "Biblioteca", description: "Referencias", href: "/biblioteca", permission: "library.view", icon: Library },
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

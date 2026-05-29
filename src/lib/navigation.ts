import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Captions,
  ClipboardCheck,
  FileText,
  Film,
  Gauge,
  HeartPulse,
  Home,
  KeyRound,
  Library,
  Link2,
  ListChecks,
  LockKeyhole,
  Megaphone,
  Package,
  PenLine,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Tags,
  Trash2,
  UserRoundCog,
  Users,
  Workflow,
  MessageSquare,
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
      { label: "Dashboard", description: "Visao geral", href: "/", icon: Home },
      { label: "Chat IA", description: "Assistente", href: "/chat", permission: "ai_jobs.view_own", icon: MessageSquare },
      { label: "Perfis", description: "Perfis permitidos", href: "/perfis", permission: "profiles.view", icon: Users },
      { label: "Atalhos recentes", description: "Acessos rapidos", href: "/atalhos-recentes", permission: "profiles.view", icon: ListChecks },
      { label: "Jobs em andamento", description: "Status assincrono", href: "/jobs-em-andamento", permission: "ai_jobs.view_own", icon: Workflow },
      { label: "Alertas simples", description: "Pendencias", href: "/alertas", permission: "admin.system_health", icon: Bell },
    ],
  },
  {
    id: "ura-ichiba",
    title: "Mercado",
    subtitle: "Vendas",
    purpose: "Vendas, afiliados, links, campanhas e monetizacao.",
    items: [
      { label: "Vendas", description: "Painel comercial", href: "/vendas", permission: "reports.view", icon: BriefcaseBusiness },
      { label: "Produtos", description: "Ofertas", href: "/produtos", permission: "reports.view", icon: Package },
      { label: "Afiliados", description: "Parceiros", href: "/afiliados", permission: "reports.view", icon: Users },
      { label: "Links", description: "URLs rastreaveis", href: "/links", permission: "reports.view", icon: Link2 },
      { label: "Campanhas", description: "Acoes comerciais", href: "/campanhas", permission: "reports.view", icon: Megaphone },
      { label: "Comissoes", description: "Ganhos", href: "/comissoes", permission: "reports.view", icon: BarChart3 },
      { label: "Oportunidades", description: "Pipeline", href: "/oportunidades", permission: "reports.view", icon: Sparkles },
      { label: "Relatorios comerciais", description: "Metricas basicas", href: "/relatorios-comerciais", permission: "reports.view", icon: Gauge },
    ],
  },
  {
    id: "sosaku-kobo",
    title: "Criacao",
    subtitle: "Criacao",
    purpose: "Criacao, conteudo, midia, biblioteca e postagem manual.",
    items: [
      { label: "Criar conteudo", description: "Novo conteudo", href: "/criar-conteudo", permission: "content.create", icon: PenLine },
      { label: "Agentes IA", description: "Fluxo em nodes", href: "/agentes-ia", permission: "ai_jobs.create", icon: Workflow },
      { label: "Continuidade IA", description: "Contexto portatil", href: "/continuidade-ia", permission: "ai_jobs.create", icon: ClipboardCheck },
      { label: "Conselho IA", description: "Multiagente free", href: "/conselho-ia", permission: "ai_jobs.create", icon: Brain },
      { label: "Ideias", description: "Fila criativa", href: "/ideias", permission: "content.view", icon: Sparkles },
      { label: "Roteiros", description: "Scripts", href: "/roteiros", permission: "content.view", icon: ScrollText },
      { label: "Prompts", description: "Comandos uteis", href: "/prompts", permission: "library.view", icon: FileText },
      { label: "Legendas", description: "Copy pronta", href: "/legendas", permission: "content.view", icon: Captions },
      { label: "Hashtags", description: "Organizacao", href: "/hashtags", permission: "content.view", icon: Tags },
      { label: "Biblioteca", description: "Referencias", href: "/biblioteca", permission: "library.view", icon: Library },
      { label: "Midias", description: "Arquivos no R2", href: "/midias", permission: "library.view", icon: Film },
      { label: "Lixeira Inteligente", description: "Restaurar itens", href: "/lixeira-inteligente", permission: "library.restore", icon: Trash2 },
      { label: "Postagem Manual", description: "Fila assistida", href: "/postagem-manual", permission: "posting.view", icon: ClipboardCheck },
    ],
  },
  {
    id: "sakusen-honbu",
    title: "Operacao",
    subtitle: "Sistema",
    purpose: "Sistema, permissoes, logs, jobs, seguranca e governanca tecnica.",
    items: [
      { label: "Sistema", description: "Operacao", href: "/sistema", permission: "admin.access", icon: ShieldCheck },
      { label: "Jobs", description: "Fila assincrona", href: "/jobs", permission: "ai_jobs.manage_all", icon: Workflow },
      { label: "Momonga", description: "Conselho de IAs", href: "/momonga", permission: "admin.access", icon: Brain },
      { label: "Usuarios", description: "Membros", href: "/usuarios", permission: "admin.access", icon: Users },
      { label: "Cargos", description: "Roles", href: "/cargos", permission: "admin.manage_roles", icon: UserRoundCog },
      { label: "Permissoes", description: "Chaves de acesso", href: "/permissoes", permission: "admin.manage_permissions", icon: KeyRound },
      { label: "PermissionGate", description: "Camada de UI", href: "/permissiongate", permission: "admin.access", icon: LockKeyhole },
      { label: "Workers", description: "Processamento externo", href: "/workers", permission: "admin.system_health", icon: Settings },
      { label: "Logs", description: "Eventos", href: "/logs", permission: "admin.view_logs", icon: BookOpen },
      { label: "Health Logs", description: "Saude tecnica", href: "/health-logs", permission: "admin.system_health", icon: HeartPulse },
      { label: "Audit Logs", description: "Auditoria", href: "/audit-logs", permission: "admin.view_logs", icon: ScrollText },
      { label: "Configuracoes", description: "Parametros", href: "/configuracoes", permission: "admin.access", icon: Settings },
    ],
  },
];

export function findNavigationItem(pathname: string) {
  return sidebarGroups
    .flatMap((group) => group.items.map((item) => ({ group, item })))
    .find(({ item }) => item.href === pathname);
}

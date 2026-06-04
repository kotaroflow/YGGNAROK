/**
 * Node type registry: icons, colors, labels, default dimensions per type.
 */

import {
  Image,
  Video,
  MessageSquare,
  FileText,
  FolderKanban,
  Lightbulb,
  BookOpen,
  Terminal,
} from "lucide-react";
import type { YggNodeType } from "@/types/yggnarok";
import type { LucideIcon } from "lucide-react";

export interface NodeTypeDef {
  type: YggNodeType;
  label: string;
  icon: LucideIcon;
  color: string; // tailwind text color class
  bg: string; // tailwind bg class
  border: string; // tailwind border class
  defaultWidth: number;
  defaultHeight: number;
}

export const NODE_TYPE_REGISTRY: Record<YggNodeType, NodeTypeDef> = {
  image: {
    type: "image",
    label: "Imagem",
    icon: Image,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/5 dark:bg-amber-500/10",
    border: "border-amber-500/20 dark:border-amber-500/30",
    defaultWidth: 240,
    defaultHeight: 280,
  },
  video: {
    type: "video",
    label: "Video",
    icon: Video,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/5 dark:bg-rose-500/10",
    border: "border-rose-500/20 dark:border-rose-500/30",
    defaultWidth: 240,
    defaultHeight: 280,
  },
  prompt: {
    type: "prompt",
    label: "Prompt",
    icon: Terminal,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/5 dark:bg-sky-500/10",
    border: "border-sky-500/20 dark:border-sky-500/30",
    defaultWidth: 260,
    defaultHeight: 200,
  },
  chat: {
    type: "chat",
    label: "Chat",
    icon: MessageSquare,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/5 dark:bg-violet-500/10",
    border: "border-violet-500/20 dark:border-violet-500/30",
    defaultWidth: 260,
    defaultHeight: 220,
  },
  campaign: {
    type: "campaign",
    label: "Campanha",
    icon: FolderKanban,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    border: "border-emerald-500/20 dark:border-emerald-500/30",
    defaultWidth: 280,
    defaultHeight: 200,
  },
  project: {
    type: "project",
    label: "Projeto",
    icon: FolderKanban,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/5 dark:bg-teal-500/10",
    border: "border-teal-500/20 dark:border-teal-500/30",
    defaultWidth: 280,
    defaultHeight: 200,
  },
  reference: {
    type: "reference",
    label: "Referencia",
    icon: BookOpen,
    color: "text-stone-600 dark:text-stone-400",
    bg: "bg-stone-500/5 dark:bg-stone-500/10",
    border: "border-stone-500/20 dark:border-stone-500/30",
    defaultWidth: 220,
    defaultHeight: 180,
  },
  idea: {
    type: "idea",
    label: "Ideia",
    icon: Lightbulb,
    color: "text-amber-700 dark:text-yellow-400",
    bg: "bg-yellow-500/5 dark:bg-yellow-500/10",
    border: "border-yellow-500/20 dark:border-yellow-500/30",
    defaultWidth: 200,
    defaultHeight: 160,
  },
};

export function getNodeTypeDef(type: YggNodeType): NodeTypeDef {
  return NODE_TYPE_REGISTRY[type];
}

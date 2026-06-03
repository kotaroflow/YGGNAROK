/**
 * Obsidian Service — two-vault architecture (admin vs user).
 * Stub phase: logs to console, returns success with informational message.
 */

import type { YggNode, User, ObsidianService } from "@/types/yggnarok";
import { buildMarkdown } from "@/services/markdownBuilders";
import { integrationConfig } from "./integrationConfig";

function resolveVaultImpl(node: YggNode, user: User): "admin" | "user" {
  // Admin vault only for admin-owned system nodes or explicit admin actions
  if (user.role === "admin" && node.metadata.createdBy === user.id) {
    // Could add more logic: if node.type is 'campaign' and admin created it, admin vault
    // For now: admin user's own creative nodes go to admin vault
    return "admin";
  }
  return "user";
}

function buildVaultPathImpl(node: YggNode, user: User): string {
  const vault = resolveVaultImpl(node, user);
  const cfg = integrationConfig.obsidian;
  const base =
    vault === "admin"
      ? cfg.adminVaultPath || "/AdminVault"
      : cfg.userVaultBasePath
      ? `${cfg.userVaultBasePath}/User_${user.id}`
      : `/UserVault/User_${user.id}`;

  const folder =
    node.type === "image"
      ? "Images"
      : node.type === "video"
      ? "Videos"
      : node.type === "prompt"
      ? "Prompts"
      : node.type === "chat"
      ? "Chats"
      : node.type === "campaign"
      ? "Campaigns"
      : node.type === "project"
      ? "Projects"
      : node.type === "reference"
      ? "References"
      : "Ideas";

  return `${base}/${folder}/${node.type}_${node.id}.md`;
}

async function sendToObsidianImpl(
  node: YggNode,
  user: User
): Promise<{ success: boolean; vaultPath: string; message: string }> {
  const vault = resolveVaultImpl(node, user);
  const vaultPath = buildVaultPathImpl(node, user);
  const markdown = buildMarkdown(node);

  console.log(`[Obsidian STUB] Would write to ${vault} vault at: ${vaultPath}`);
  console.log(`[Obsidian STUB] Markdown content:\n${markdown}`);

  // TODO in production:
  // 1. Connect to Obsidian Local REST API or vault file system
  // 2. Write markdown file to the appropriate vault path
  // 3. Return actual file path

  return {
    success: true,
    vaultPath,
    message: `📝 Sent to ${vault === "admin" ? "Admin" : "User"} Vault (stub — configure Obsidian in Settings → Integrations)`,
  };
}

async function pullFromObsidianImpl(
  _path: string,
  _vault: "admin" | "user"
): Promise<YggNode | null> {
  // TODO: implement Obsidian read-back in future
  return null;
}

export const obsidianService: ObsidianService = {
  resolveVault: resolveVaultImpl,
  buildMarkdown,
  buildVaultPath: buildVaultPathImpl,
  sendToObsidian: sendToObsidianImpl,
  pullFromObsidian: pullFromObsidianImpl,
};

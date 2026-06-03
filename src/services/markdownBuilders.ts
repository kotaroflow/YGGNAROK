/**
 * Markdown builders per node type for Obsidian export.
 */

import type { YggNode } from "@/types/yggnarok";

function frontMatter(node: YggNode, vaultType: string): string {
  const tags = node.metadata.tags.join(", ");
  return `---
id: ${node.id}
type: ${node.type}
tags: [${tags}]
created: ${node.metadata.createdAt}
vault: ${vaultType}
---\n`;
}

function relatedLinks(node: YggNode): string {
  return node.connections.map((c) => `[[${c.targetId}]]`).join(", ");
}

export function buildMarkdown(node: YggNode): string {
  const vaultType = node.metadata.createdBy.startsWith("admin")
    ? "admin"
    : "user";
  const fm = frontMatter(node, vaultType);
  const d = node.data;

  switch (node.type) {
    case "image": {
      return (
        fm +
        `# ${d.title || "Untitled Image"}\n` +
        `![[${d.imageFilename || "image.png"}]]\n\n` +
        `**Prompt:** ${d.prompt || ""}\n\n` +
        `**Related:** ${relatedLinks(node)}\n`
      );
    }

    case "video": {
      return (
        fm +
        `# ${d.title || "Untitled Video"}\n` +
        `**Duration:** ${d.duration || "N/A"}\n` +
        `**Status:** ${d.status || "N/A"}\n` +
        `**Platform:** ${d.platform || "N/A"}\n\n` +
        `**Script:**\n${d.script || ""}\n\n` +
        `**Related:** ${relatedLinks(node)}\n`
      );
    }

    case "chat": {
      const msgs = Array.isArray(d.messages)
        ? (d.messages as { role: string; content: string }[])
            .map((m) => `**${m.role}:** ${m.content}`)
            .join("\n\n")
        : "";
      return (
        fm +
        `# Chat with ${d.personaName || "Assistant"}\n` +
        `${msgs}\n\n` +
        `**Linked Assets:** ${relatedLinks(node)}\n`
      );
    }

    case "prompt": {
      return (
        fm +
        `# Prompt\n` +
        "\`\`\`\n" +
        `${d.promptText || ""}\n` +
        "\`\`\`\n\n" +
        `**Model:** ${d.model || "N/A"}\n` +
        `**Related Outputs:** ${relatedLinks(node)}\n`
      );
    }

    case "campaign":
    case "project": {
      return (
        fm +
        `# ${d.title || "Untitled"}\n` +
        `**Status:** ${d.status || "N/A"}\n` +
        `**Progress:** ${d.progress ?? 0}%\n` +
        `**Deadline:** ${d.deadline || "N/A"}\n\n` +
        `**Linked Assets:**\n` +
        node.connections.map((c) => `- [[${c.targetId}]]`).join("\n") +
        "\n"
      );
    }

    case "reference":
    case "idea": {
      return (
        fm +
        `# ${d.title || "Untitled"}\n` +
        `${d.content || ""}\n\n` +
        `**Source:** ${d.sourceUrl || "N/A"}\n` +
        `**Related:** ${relatedLinks(node)}\n`
      );
    }

    default:
      return fm + `# ${node.type} node\n${JSON.stringify(d, null, 2)}\n`;
  }
}

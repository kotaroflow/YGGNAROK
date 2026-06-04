import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { buildMarkdown } from "@/services/markdownBuilders";
import type { YggNode } from "@/types/yggnarok";

export async function POST(request: Request) {
  try {
    const { node, user, vaultType } = await request.json();

    if (!node || !user) {
      return NextResponse.json(
        { success: false, error: "Node e User são obrigatórios." },
        { status: 400 }
      );
    }

    const adminVaultPath = process.env.OBSIDIAN_ADMIN_VAULT_PATH || "C:\\Users\\Administrador\\Documents\\Obsidian Vault";
    const userVaultBasePath = process.env.OBSIDIAN_USER_VAULT_BASE_PATH || "C:\\Users\\Administrador\\Documents\\Obsidian Vault";

    // Determine target vault path
    const resolvedVault = user.role === "admin" ? "admin" : "user";
    const basePath = resolvedVault === "admin"
      ? adminVaultPath
      : path.join(userVaultBasePath, `User_${user.id}`);

    // Map node type to folder
    const folderMap: Record<string, string> = {
      image: "Images",
      video: "Videos",
      prompt: "Prompts",
      chat: "Chats",
      campaign: "Campaigns",
      project: "Projects",
      reference: "References",
      idea: "Ideas",
    };
    const folder = folderMap[node.type] || "Ideas";

    // Build subfolder path
    const targetFolder = path.join(basePath, folder);
    
    // Create folder if it doesn't exist
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Sanitize title for filename
    const title = node.data?.title || node.title || `Untitled_${node.id}`;
    const sanitizedTitle = title.replace(/[\\/:*?"<>|]/g, "_");
    const filePath = path.join(targetFolder, `${sanitizedTitle}.md`);

    // Build Markdown content
    const markdown = buildMarkdown(node);

    // Write file
    fs.writeFileSync(filePath, markdown, "utf-8");

    return NextResponse.json({
      success: true,
      vaultPath: filePath,
      message: `📝 Nota Obsidian salva em ${resolvedVault === "admin" ? "Admin" : "User"} Vault: ${sanitizedTitle}.md`,
    });

  } catch (error: unknown) {
    console.error("[OBSIDIAN API ERROR]", error);
    const message = error instanceof Error ? error.message : "Falha ao gravar no Obsidian";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

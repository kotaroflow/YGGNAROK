import { useCallback } from "react";
import { obsidianService } from "@/services/integrations/obsidian";
import { useToast } from "@/lib/utils";
import type { YggNode, User } from "@/types/yggnarok";

export function useObsidian() {
  const { showToast } = useToast(3000);

  const persistNode = useCallback(async (node: YggNode, user: User) => {
    try {
      const result = await obsidianService.sendToObsidian(node, user);
      showToast(result.message);
      return result;
    } catch (err) {
      showToast("Erro ao persistir no Obsidian");
      console.error(err);
      return null;
    }
  }, [showToast]);

  return { persistNode };
}

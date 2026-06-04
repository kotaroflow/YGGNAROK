import { useCallback } from "react";
import { useToast } from "@/lib/utils";
import type { YggNode, User } from "@/types/yggnarok";

export function useObsidian() {
  const { showToast } = useToast(3000);

  const persistNode = useCallback(async (node: YggNode, user: User) => {
    try {
      const response = await fetch("/api/obsidian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ node, user }),
      });

      const result = await response.json();
      if (result.success) {
        showToast(result.message);
        return result;
      } else {
        showToast(result.error || "Erro ao salvar no Obsidian");
        return null;
      }
    } catch (err) {
      showToast("Erro de rede ao conectar com o Obsidian");
      console.error(err);
      return null;
    }
  }, [showToast]);

  return { persistNode };
}

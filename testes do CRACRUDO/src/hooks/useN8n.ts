import { useCallback } from "react";
import { useToast } from "@/lib/utils";
import type { YggNode, User } from "@/types/yggnarok";

export function useN8n() {
  const { showToast } = useToast(3000);

  const triggerWorkflow = useCallback(async (node: YggNode, workflowType: string, user: User) => {
    try {
      const response = await fetch("/api/n8n", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ node, workflowType, user }),
      });

      const result = await response.json();
      if (result.success) {
        showToast(result.message);
        return result;
      } else {
        showToast(result.error || "Erro ao executar fluxo no n8n");
        return null;
      }
    } catch (err) {
      showToast("Erro de rede ao conectar com o n8n");
      console.error(err);
      return null;
    }
  }, [showToast]);

  return { triggerWorkflow };
}

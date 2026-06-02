import { useCallback } from "react";
import { n8nService } from "@/services/integrations/n8n";
import { useToast } from "@/lib/utils";
import type { YggNode, User } from "@/types/yggnarok";

export function useN8n() {
  const { showToast } = useToast(3000);

  const triggerWorkflow = useCallback(async (node: YggNode, workflowType: string, user: User) => {
    try {
      const result = await n8nService.sendToN8n(node, workflowType, user);
      showToast(result.message);
      return result;
    } catch (err) {
      showToast("Erro ao executar fluxo no n8n");
      console.error(err);
      return null;
    }
  }, [showToast]);

  return { triggerWorkflow };
}

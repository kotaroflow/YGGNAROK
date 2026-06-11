import { IntentClassification } from "./intent";

export type PermissionCheck = {
  allowed: boolean;
  reason?: string;
};

/**
 * Validação física de backend para ações antes de delegá-las ao Hermes.
 */
export function checkHermesPermission(intent: IntentClassification, role: "user" | "admin"): PermissionCheck {
  // Se o servidor estiver configurado para bloquear execução local via ENV,
  // nem o admin pode forçar via YGGNAROK (precisaria rodar o Hermes nativo direto).
  if (intent.riskLevel === "high") {
    if (process.env.HERMES_ALLOW_LOCAL_EXECUTION === "false") {
      return { allowed: false, reason: "A execução de ações de alto risco está desativada no .env (HERMES_ALLOW_LOCAL_EXECUTION=false)." };
    }
  }

  // Se a intenção requer admin e o usuário não é, bloqueia.
  if (intent.requiresAdmin && role !== "admin") {
    return { allowed: false, reason: "O Hermes Agent determinou ou a triagem inferiu que a ação exige privilégios de Administrador Master do YGGNAROK." };
  }

  return { allowed: true };
}

export function isHermesAdmin(user: any) {
  return user?.email === "admin@yggnarok.local" || user?.email === "matheus.art1@gmail.com";
}

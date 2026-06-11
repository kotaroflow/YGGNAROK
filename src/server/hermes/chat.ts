import { createHermesContextFromMessage } from "./memory";
import { routeHermesChat, type HermesRouteRequest, type HermesRouteResponse } from "./router";

export type HermesChatRequest = Omit<HermesRouteRequest, "context"> & {
  message: string;
};
export type HermesChatResponse = HermesRouteResponse;

/**
 * Compatibilidade legada: o fluxo principal agora vive no Hermes Router.
 */
export async function sendChatMessage(req: HermesChatRequest): Promise<HermesChatResponse> {
  return routeHermesChat({
    ...req,
    context: createHermesContextFromMessage(req.message),
  });
}

// Stub legado para autopilot
export async function runHermesChat(prompt: string, contextFiles: string[] = []): Promise<string> {
  void prompt;
  void contextFiles;
  return "Autopilot mock";
}

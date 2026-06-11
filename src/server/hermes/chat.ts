import { routeHermesChat, type HermesRouteRequest, type HermesRouteResponse } from "./router";

export type HermesChatRequest = HermesRouteRequest;
export type HermesChatResponse = HermesRouteResponse;

/**
 * Compatibilidade legada: o fluxo principal agora vive no Hermes Router.
 */
export async function sendChatMessage(req: HermesChatRequest): Promise<HermesChatResponse> {
  return routeHermesChat(req);
}

// Stub legado para autopilot
export async function runHermesChat(prompt: string, contextFiles: string[] = []): Promise<string> {
  void prompt;
  void contextFiles;
  return "Autopilot mock";
}

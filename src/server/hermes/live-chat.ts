import { runHermesGateway } from "./gateway";

export async function runHermesLiveChat(bodyObject: Record<string, unknown>, user: any) {
  return runHermesGateway({ body: bodyObject, user });
}

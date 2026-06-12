import { runHermesGateway } from "./gateway";
import type { HermesUser } from "./permissions";

export async function runHermesLiveChat(bodyObject: Record<string, unknown>, user: HermesUser) {
  return runHermesGateway({ body: bodyObject, user });
}

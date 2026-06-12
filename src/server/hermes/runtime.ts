import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export type HermesHealthStatus = {
  isInstalled: boolean;
  version: string | null;
  mode: "cli" | "gateway" | "mcp" | "proxy" | "dashboard" | "unknown";
  isAccessible: boolean;
  error?: string;
};

const HERMES_MODES = ["cli", "gateway", "mcp", "proxy", "dashboard"] as const;

function getHermesBridgeMode(): HermesHealthStatus["mode"] {
  const mode = process.env.HERMES_BRIDGE_MODE;
  return mode && (HERMES_MODES as readonly string[]).includes(mode)
    ? (mode as HermesHealthStatus["mode"])
    : "cli";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function getHermesCommand(): string {
  // Default to what we discovered, but allow override
  return process.env.HERMES_COMMAND || "C:\\Users\\Administrador\\HERMES\\hermes-agent\\venv\\Scripts\\hermes.exe";
}

export function checkHermesRuntime(): HermesHealthStatus {
  const hermesCmd = getHermesCommand();
  const status: HermesHealthStatus = {
    isInstalled: false,
    version: null,
    mode: getHermesBridgeMode(),
    isAccessible: false,
  };

  try {
    // Check if the exact path exists
    if (fs.existsSync(/*turbopackIgnore: true*/ hermesCmd)) {
      status.isInstalled = true;
    } else {
      // Maybe it's in PATH, try 'where' or 'which'
      try {
        const checkCmd = process.platform === "win32" ? "where hermes" : "which hermes";
        execSync(checkCmd, { stdio: "ignore" });
        status.isInstalled = true;
      } catch (e) {
        status.isInstalled = false;
        status.error = "Hermes executable not found in PATH or HERMES_COMMAND.";
        return status;
      }
    }

    // Check version and access
    const versionOutput = execSync(`"${hermesCmd}" --version`).toString();
    status.version = versionOutput.trim();
    status.isAccessible = true;
  } catch (error: unknown) {
    status.error = getErrorMessage(error);
  }

  return status;
}

export function getHermesWorkdir(): string {
  return process.env.HERMES_WORKDIR || path.join(/*turbopackIgnore: true*/ process.cwd(), ".");
}

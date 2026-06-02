import { spawn } from "node:child_process";

const commands = [
  { name: "next", command: "npm", args: ["run", "dev"] },
  { name: "worker", command: "npm", args: ["run", "worker:dev"] },
];

const children = commands.map((entry) => {
  const child = spawn(entry.command, entry.args, {
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
    env: process.env,
  });

  child.stdout.on("data", (chunk) => write(entry.name, chunk));
  child.stderr.on("data", (chunk) => write(entry.name, chunk));
  child.on("exit", (code) => {
    write(entry.name, `exited with code ${code}\n`);
    shutdown(code ?? 0);
  });

  return child;
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

function write(name, chunk) {
  const text = String(chunk);
  for (const line of text.split(/\r?\n/)) {
    if (line.trim()) {
      process.stdout.write(`[${name}] ${line}\n`);
    }
  }
}

function shutdown(code) {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(code);
}

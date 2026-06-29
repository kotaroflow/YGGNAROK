import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const cssPath = resolve(rootDir, "src/app/globals.css");
const css = readFileSync(cssPath, "utf8");

const checks = [
  { token: "text-primary", background: "background", minimum: 4.5 },
  { token: "text-secondary", background: "background", minimum: 4.5 },
  { token: "text-muted", background: "background", minimum: 4.5 },
  { token: "on-brand", background: "brand", minimum: 4.5 },
  { token: "focus-ring", background: "background", minimum: 3 },
  { token: "border-readable", background: "background", minimum: 3 },
  { token: "text-primary", background: "surface", minimum: 4.5 },
  { token: "text-secondary", background: "surface", minimum: 4.5 },
  { token: "text-muted", background: "surface", minimum: 4.5 },
  { token: "on-surface", background: "surface", minimum: 4.5 },
  { token: "text-primary", background: "surface-strong", minimum: 4.5 },
  { token: "text-primary", background: "surface-overlay", minimum: 4.5 },
];

const themes = [
  { name: "Amber/light", selector: ":root" },
  { name: "Void/dark", selector: ".dark" },
];

function getBlock(selector) {
  const escaped = selector.replace(".", "\\.");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));
  if (!match) {
    throw new Error(`Theme block not found: ${selector}`);
  }
  return match[1];
}

function getToken(block, token) {
  const match = block.match(new RegExp(`--${token}:\\s*([^;]+);`));
  if (!match) {
    throw new Error(`Token not found: --${token}`);
  }
  return match[1].trim();
}

function parseHex(color) {
  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match) {
    return null;
  }
  const value = match[1];
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function parseRgba(color) {
  const match = color.match(/^rgba\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*(0|1|0?\.[0-9]+)\s*\)$/i);
  if (!match) {
    return null;
  }

  return {
    rgb: [
      Number.parseInt(match[1], 10),
      Number.parseInt(match[2], 10),
      Number.parseInt(match[3], 10),
    ],
    alpha: Number.parseFloat(match[4]),
  };
}

function parseColor(color) {
  const hex = parseHex(color);
  if (hex) return { rgb: hex, alpha: 1 };

  const rgba = parseRgba(color);
  if (rgba) return rgba;

  throw new Error(`Unsupported color format: ${color}`);
}

function compositeColor(foreground, base) {
  const parsedForeground = parseColor(foreground);
  const parsedBase = parseColor(base);

  if (parsedForeground.alpha === 1) {
    return parsedForeground.rgb;
  }

  return parsedForeground.rgb.map((channel, index) => {
    return Math.round(channel * parsedForeground.alpha + parsedBase.rgb[index] * (1 - parsedForeground.alpha));
  });
}

function toLinear(channel) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb) {
  const [red, green, blue] = rgb.map(toLinear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

const rows = [];
let failed = false;

for (const theme of themes) {
  const block = getBlock(theme.selector);
  const baseBackground = getToken(block, "background");

  for (const check of checks) {
    const foreground = compositeColor(getToken(block, check.token), baseBackground);
    const background = compositeColor(getToken(block, check.background), baseBackground);
    const ratio = contrastRatio(foreground, background);
    const passed = ratio >= check.minimum;

    rows.push({
      Tema: theme.name,
      Par: `${check.token} sobre ${check.background}`,
      Contraste: ratio.toFixed(2),
      Minimo: check.minimum.toFixed(1),
      Status: passed ? "OK" : "FALHA",
    });

    if (!passed) failed = true;
  }
}

console.table(rows);

if (failed) {
  console.error("Theme contrast check failed.");
  process.exit(1);
}

console.log("Theme contrast check passed.");

const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Administrador\\YGGNAROK\\testes do CRACRUDO\\src';

const hardcodedColorPatterns = [
  /bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)/g,
  /text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)/g,
  /border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)/g,
  /bg-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\]/g,
  /text-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\]/g,
  /border-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\]/g,
  /bg-white/g,
  /bg-black/g,
  /text-white/g,
  /text-black/g,
];

function scanDirectory(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const filePath = path.join(currentDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        scanDirectory(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const findings = [];
      for (const pattern of hardcodedColorPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          findings.push({
            pattern: pattern.source,
            match: match[0],
            line: content.substring(0, match.index).split('\n').length
          });
        }
      }
      if (findings.length > 0) {
        console.log(`\nFile: ${filePath.substring(dir.length)}`);
        // Group by match to avoid spamming same match multiple times
        const grouped = {};
        findings.forEach(f => {
          if (!grouped[f.match]) grouped[f.match] = [];
          grouped[f.match].push(f.line);
        });
        Object.keys(grouped).forEach(match => {
          console.log(`  - ${match} on lines: ${grouped[match].slice(0, 5).join(', ')} ${grouped[match].length > 5 ? '...' : ''}`);
        });
      }
    }
  }
}

console.log("Scanning for hardcoded styles...");
scanDirectory(dir);

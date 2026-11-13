#!/usr/bin/env node
// Removes emoji candidates (pictographs, flag sequences, keycap emoji) from a
// generated WebData*.ts file in place, leaving plain symbols (arrows, circled
// letters/digits, stylized alphabets, etc.) untouched.
//
// Usage: node strip_emoji.js <path/to/WebData.ts>

const fs = require("fs");

const EMOJI_RE = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u{20E3}/u;

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node strip_emoji.js <path/to/WebData.ts>");
  process.exit(1);
}

const content = fs.readFileSync(filePath, "utf8");
const m = content.match(
  /^const source = `([\s\S]*)`;\nexport const (\w+) = JSON\.parse\(source\);\n?$/
);
if (!m) {
  throw new Error("Unexpected file format: " + filePath);
}
const [, templateBody, exportName] = m;
const jsonText = templateBody.replace(/\\`/g, "`").replace(/\\\$\{/g, "${");
const obj = JSON.parse(jsonText);

let removedPairs = 0;
let removedKeys = 0;
const filtered = {};
for (const key of Object.keys(obj)) {
  const parts = obj[key].split(" ");
  const kept = [];
  for (let i = 0; i < parts.length; i += 2) {
    const phrase = parts[i];
    const score = parts[i + 1];
    if (EMOJI_RE.test(phrase)) {
      removedPairs++;
      continue;
    }
    kept.push(phrase, score);
  }
  if (kept.length === 0) {
    removedKeys++;
    continue;
  }
  filtered[key] = kept.join(" ");
}

const jsonOutput = JSON.stringify(filtered)
  .replace(/`/g, "\\`")
  .replace(/\$\{/g, "\\${");
const out = `const source = \`${jsonOutput}\`;\nexport const ${exportName} = JSON.parse(source);\n`;
fs.writeFileSync(filePath, out);
console.error(
  `${filePath}: removed ${removedPairs} emoji entries, dropped ${removedKeys} now-empty keys`
);

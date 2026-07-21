const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function walkHtml(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".git", "images", "partials"].includes(entry.name)) walkHtml(full, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

const from = /<button type="button" class="nav-cta" onclick="open(?:Enquire|Vip)Modal\(\)">(?:Get in Touch|Book Your Pass)<\/button>/g;
const to = '<button type="button" class="nav-cta" onclick="openVipModal()">Book Your Pass</button>';

let updated = 0;
for (const file of walkHtml(root)) {
  const content = fs.readFileSync(file, "utf8");
  if (!from.test(content)) continue;
  from.lastIndex = 0;
  const next = content.replace(from, to);
  if (next !== content) {
    fs.writeFileSync(file, next);
    updated += 1;
  }
}

console.log(`Updated nav CTA in ${updated} HTML files`);

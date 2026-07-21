const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pagesDir = path.join(root, "pages");

function fixMovedPageContent(content) {
  return content
    .replace(/\.\.\/favicon\.ico/g, "favicon.ico")
    .replace(/\.\.\/style\.css/g, "style.css")
    .replace(/\.\.\/inner-pages\.css/g, "inner-pages.css")
    .replace(/\.\.\/inner-pages\.js/g, "inner-pages.js")
    .replace(/\.\.\/javascript\.js/g, "javascript.js")
    .replace(/\.\.\/images\//g, "images/")
    .replace(/href="\.\.\/index\.html/g, 'href="index.html')
    .replace(/href='\.\.\/index\.html/g, "href='index.html");
}

function fixPagesPrefix(content) {
  return content.replace(/pages\//g, "");
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".git", "agent-transcripts", "images", "pages"].includes(entry.name)) {
        walk(full, files);
      }
    } else if (/\.(html|js|css)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

// 1. Move *.html to root with fixed asset paths
const moved = [];
for (const file of fs.readdirSync(pagesDir)) {
  if (!file.endsWith(".html")) continue;
  const src = path.join(pagesDir, file);
  const dest = path.join(root, file);
  const content = fixMovedPageContent(fs.readFileSync(src, "utf8"));
  fs.writeFileSync(dest, content);
  moved.push(file);
}

// 2. Update all html/js/css (except pages folder) — remove  prefix
const targets = walk(root).filter((f) => !f.startsWith(pagesDir));
for (const file of targets) {
  let content = fs.readFileSync(file, "utf8");
  const next = fixPagesPrefix(content);
  if (next !== content) fs.writeFileSync(file, next);
}

// 3. Fix inner-pages.js image paths
const innerPagesPath = path.join(root, "inner-pages.js");
let innerPages = fs.readFileSync(innerPagesPath, "utf8");
innerPages = innerPages.replace(/\.\.\/images\//g, "images/");
fs.writeFileSync(innerPagesPath, innerPages);

// 4. Fix inner-pages.css image paths
const innerCssPath = path.join(root, "inner-pages.css");
let innerCss = fs.readFileSync(innerCssPath, "utf8");
innerCss = innerCss.replace(/url\("\.\.\/images\//g, 'url("images/');
fs.writeFileSync(innerCssPath, innerCss);

// 5. Simplify javascript.js index path logic
const jsPath = path.join(root, "javascript.js");
let js = fs.readFileSync(jsPath, "utf8");
js = js.replace(
  /const base = window\.location\.pathname\.includes\("\/pages\/"\) \? "\.\.\/index\.html" : "index\.html";/,
  'const base = "index.html";'
);
fs.writeFileSync(jsPath, js);

// 6. Remove pages folder
for (const file of fs.readdirSync(pagesDir)) {
  fs.unlinkSync(path.join(pagesDir, file));
}
fs.rmdirSync(pagesDir);

console.log(`Moved ${moved.length} pages to site root and removed  folder`);

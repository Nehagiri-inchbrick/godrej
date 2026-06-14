const fs = require("fs");
const page = fs.readFileSync("D:/godrejproperties/pages/leadership.html", "utf8");
const frag = fs.readFileSync("D:/godrejproperties/committees-fragment.html", "utf8").trimEnd();
const startMarker = '<div class="leader-panel" id="leader-panel-committees"';
const start = page.indexOf(startMarker);
if (start < 0) {
  console.error("panel start not found");
  process.exit(1);
}
const contentStart = page.indexOf(">", start) + 1;
const mainIdx = page.indexOf("  </main>", contentStart);
const end = page.lastIndexOf("        </div>\n      </div>\n    </section>\n", mainIdx);
if (end < 0) {
  console.error("panel end not found");
  process.exit(1);
}
const out = page.slice(0, contentStart) + "\n" + frag + "\n" + page.slice(end);
fs.writeFileSync("D:/godrejproperties/pages/leadership.html", out);
console.log("leadership.html updated");

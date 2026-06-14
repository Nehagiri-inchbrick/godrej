const fs = require("fs");
const h = fs.readFileSync("D:/godrejproperties/temp-lead.html", "utf8");
const start = h.indexOf('"committee_name":"Allotment Committee"');
if (start < 0) {
  console.error("Allotment not found");
  process.exit(1);
}
const arrStart = h.lastIndexOf('[', start);
const end = h.indexOf('],"committee_title"', arrStart);
if (start < 0 || end < 0) {
  console.error("not found");
  process.exit(1);
}
const arr = JSON.parse(h.slice(start + 12, end + 1));
arr.forEach((c) => {
  console.log(`--- ${c.committee_name} (${c.committee_img.length})`);
  c.committee_img.forEach((p) => console.log(`  ${p.name} | ${p.designation}`));
});

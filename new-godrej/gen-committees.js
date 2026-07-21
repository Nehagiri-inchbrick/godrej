const fs = require("fs");
const h = fs.readFileSync("D:/godrejproperties/temp-lead.html", "utf8");
const i = h.indexOf("Allotment Committee");
const arrStart = h.lastIndexOf("[", i);
let depth = 0;
let end = -1;
for (let j = arrStart; j < h.length; j++) {
  if (h[j] === "[") depth++;
  else if (h[j] === "]") {
    depth--;
    if (depth === 0) {
      end = j;
      break;
    }
  }
}
const committees = JSON.parse(h.slice(arrStart, end + 1));

const localImages = {
  "pirojsha-godrej": "../images/leader/pirojsha-godrej-cmo9xg45f000mj2phdlxj25ap.webp",
  "gaurav-pandey": "../images/leader/gaurav-pandey-cmo9xhcsk000qj2phazf3a2zx.webp",
  "sutapa-banerjee": "../images/leader/sutapa-banerjee-cmo9xi3er000uj2ph7fbp309g.webp",
  "dr.-indu-bhushan": "../images/leader/indu-bhushan-cmo9xieem000wj2ph4go0d6k7.webp",
  "jayashree-vaidyanathan": "../images/leader/jayashree-vaidyanathan-cmoadqmoj001fj2ph6crb5d25.webp",
  "sumeet-narang": "../images/leader/sumeet-narang-cmo9xj92i0011j2ph0f3y336y.webp",
  "rajendra-khetawat": "../images/leader/rajendra-khetawat-cmo9xjub80013j2ph9hpydj1l.webp",
};

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';

function displayName(name) {
  if (name.startsWith("Dr.")) return name;
  if (name.startsWith("Ms.")) return name;
  if (name.startsWith("Mr.")) return name;
  if (name === "Jayashree Vaidyanathan") return "Ms. Jayashree Vaidyanathan";
  if (name === "Sutapa Banerjee") return "Ms. Sutapa Banerjee";
  return `Mr. ${name}`;
}

function imgSrc(person) {
  const slug = person.slug || "";
  if (localImages[slug]) return localImages[slug];
  return person.img.url;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let html = `          <p class="leader-committees-intro">Our Board of Directors has constituted the following Committees to assist the Board in discharging its responsibilities:</p>\n`;

committees.forEach((committee) => {
  html += `\n          <section class="leader-committee-section">\n`;
  html += `            <h2 class="leader-committee-title">${escapeHtml(committee.committee_name)}</h2>\n`;
  html += `            <div class="leader-grid leader-grid--committee">\n`;
  committee.committee_img.forEach((person) => {
    const name = displayName(person.name);
    const role = person.designation.replace(/\s+/g, " ").trim();
    const src = imgSrc(person);
    html += `              <article class="leader-card">\n`;
    html += `                <div class="leader-card-img"><img src="${src}" alt="${escapeHtml(name)}" loading="lazy" decoding="async"></div>\n`;
    html += `                <div class="leader-card-foot">\n`;
    html += `                  <h3 class="leader-card-name">${escapeHtml(name)} ${arrow}</h3>\n`;
    html += `                  <p class="leader-card-role">${escapeHtml(role)}</p>\n`;
    html += `                </div>\n`;
    html += `              </article>\n`;
  });
  html += `            </div>\n`;
  html += `          </section>\n`;
});

fs.writeFileSync("D:/godrejproperties/committees-fragment.html", html);
console.log("Wrote committees-fragment.html");

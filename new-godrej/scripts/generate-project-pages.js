const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const templatePath = path.join(root, "project-detail.html");
const nexspaceTemplatePath = path.join(root, "commercial-nexspace.html");
const jsPath = path.join(root, "inner-pages.js");

const template = fs.readFileSync(templatePath, "utf8");
const nexspaceTemplate = fs.readFileSync(nexspaceTemplatePath, "utf8");
const code = fs.readFileSync(jsPath, "utf8");

const extractSection = (startMarker, endMarker) => {
  const start = code.indexOf(startMarker);
  const end = code.indexOf(endMarker, start);
  if (start < 0 || end < 0) return "";
  return code.slice(start, end);
};

const extractSlugs = (section) => {
  const slugs = [];
  const re = /slug:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(section))) slugs.push(match[1]);
  return slugs;
};

const residentialSlugs = extractSlugs(
  extractSection("const initResidentialPage = () => {", "const initCommercialPage = () => {")
);
const commercialSlugs = extractSlugs(
  extractSection("const initCommercialPage = () => {", "const initPlottedPage = () => {")
).filter((slug) => slug !== "nexspace");
const plottedSlugs = extractSlugs(
  extractSection("const initPlottedPage = () => {", "const initDynamicProjectDetail = () => {")
);

const localPages = [
  "favicon.ico",
  "style.css",
  "inner-pages.css",
  "inner-pages.js",
  "javascript.js",
  "index.html",
  "about.html",
  "leadership.html",
  "residential.html",
  "commercial.html",
  "plotted.html",
  "nri-legal.html",
  "nri-loan.html",
  "nri-faqs.html",
  "nri-home-fest.html",
  "nri-corner.html",
  "nri-expo.html",
  "blog.html",
  "blog-detail.html",
  "contact.html",
  "disclaimer.html",
  "design.html",
  "media-gallery.html",
  "reach-us.html",
  "sustainability.html",
  "project-detail.html",
  "commercial-nexspace.html"
];

const toFolderHtml = (html, bodyAttrs) => {
  let out = html;
  out = out
    .replace(/href="favicon\.ico"/g, 'href="../favicon.ico"')
    .replace(/href="style\.css"/g, 'href="../style.css"')
    .replace(/href="inner-pages\.css"/g, 'href="../inner-pages.css"')
    .replace(/src="inner-pages\.js"/g, 'src="../inner-pages.js"')
    .replace(/src="javascript\.js"/g, 'src="../javascript.js"');
  localPages.forEach((page) => {
    const escaped = page.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`((?:href|src)=["'])${escaped}`, "g"), `$1../${page}`);
  });
  out = out.replace(/((?:href|src)=["'])images\//g, "$1../images/");
  out = out.replace(
    /<body class="inner-page" data-page="[^"]+">/,
    `<body class="inner-page" ${bodyAttrs}>`
  );
  return out;
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const removeIfExists = (filePath) => {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

[
  "crown-residences-at-godrej-golf-links",
  "godrej-astra",
  "godrej-vanantara",
  "godrej-meridien",
  "godrej-altus",
  "godrej-aveline",
  "godrej-ivara",
  "godrej-horizon",
  "godrej-parkshire",
  "godrej-connaught-one",
  "godrej-regal-pavilion",
  "godrej-arden",
  "godrej-vrikshya",
  "godrej-rejuve",
  "godrej-blue",
  "godrej-south-estate",
  "godrej-tiara",
  "godrej-exquisite",
  "godrej-carnival",
  "godrej-avenue-9",
  "godrej-square",
  "godrej-one",
  "godrej-bkc",
  "godrej-eternia",
  "godrej-woodside-estate",
  "godrej-woodscapes",
  "godrej-reserve",
  "godrej-golf-links",
  "godrej-courtyard-shopense",
  "godrej-shantivan-eden-phase-ii-pali",
  "godrej-golf-hills",
  "godrej-highland",
  "godrej-msr-city",
  "godrej-green-cove",
  "godrej-palm-retreat"
].forEach((slug) => removeIfExists(path.join(root, `${slug}.html`)));

ensureDir(path.join(root, "residential"));
ensureDir(path.join(root, "commercial"));
ensureDir(path.join(root, "plotted"));

let created = 0;

residentialSlugs.forEach((slug) => {
  const html = toFolderHtml(
    template,
    `data-page="project-detail" data-project-slug="${slug}" data-base-path="../"`
  );
  fs.writeFileSync(path.join(root, "residential", `${slug}.html`), html);
  created += 1;
});

commercialSlugs.forEach((slug) => {
  const html = toFolderHtml(
    template,
    `data-page="project-detail" data-project-slug="${slug}" data-base-path="../"`
  );
  fs.writeFileSync(path.join(root, "commercial", `${slug}.html`), html);
  created += 1;
});

plottedSlugs.forEach((slug) => {
  const html = toFolderHtml(
    template,
    `data-page="project-detail" data-project-slug="${slug}" data-base-path="../"`
  );
  fs.writeFileSync(path.join(root, "plotted", `${slug}.html`), html);
  created += 1;
});

const nexspaceHtml = toFolderHtml(
  nexspaceTemplate,
  `data-page="commercial-nexspace" data-base-path="../"`
);
fs.writeFileSync(path.join(root, "commercial", "commercial-nexspace.html"), nexspaceHtml);

console.log(`Created ${created} category detail pages and commercial/commercial-nexspace.html`);

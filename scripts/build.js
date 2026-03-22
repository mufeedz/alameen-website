const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

console.log("Starting static build generation...");

if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST);

// 1. Copy directories
const dirsToCopy = ['assets', 'docs', 'partials'];
dirsToCopy.forEach(dir => {
    if (fs.existsSync(path.join(ROOT, dir))) {
        fs.cpSync(path.join(ROOT, dir), path.join(DIST, dir), { recursive: true });
    }
});

// Copy all root HTML files
fs.readdirSync(ROOT).forEach(file => {
    if (file.endsWith('.html')) {
        fs.copyFileSync(path.join(ROOT, file), path.join(DIST, file));
    }
});

fs.copyFileSync(path.join(ROOT, 'vercel.json'), path.join(DIST, 'vercel.json'));

// 2. Bundle CSS
console.log("Bundling CSS...");
let mainCss = fs.readFileSync(path.join(DIST, 'assets/css/main.css'), 'utf-8');
const importRegex = /@import\s+url\('([^']+)'\);/g;
mainCss = mainCss.replace(importRegex, (match, file) => {
    try {
        const content = fs.readFileSync(path.join(DIST, 'assets/css', file), 'utf-8');
        console.log(`  - Inlined ${file}`);
        return content;
    } catch (e) {
        console.warn(`  - Warning: Could not inline ${file}`);
        return match;
    }
});
fs.writeFileSync(path.join(DIST, 'assets/css/main.css'), mainCss);

// 3. Inject HTML Partials
console.log("Statically injecting HTML partials...");
const headerHtml = fs.readFileSync(path.join(DIST, 'partials/header.html'), 'utf-8');
const footerHtml = fs.readFileSync(path.join(DIST, 'partials/footer.html'), 'utf-8');

fs.readdirSync(DIST).forEach(file => {
    if (file.endsWith('.html')) {
        let html = fs.readFileSync(path.join(DIST, file), 'utf-8');
        html = html.replace('<div id="header-include"></div>', `<div id="header-include">\n${headerHtml}\n</div>`);
        html = html.replace('<div id="footer-include" class="mt-0"></div>', `<div id="footer-include" class="mt-0">\n${footerHtml}\n</div>`);
        html = html.replace('<div id="footer-include"></div>', `<div id="footer-include">\n${footerHtml}\n</div>`);
        fs.writeFileSync(path.join(DIST, file), html);
        console.log(`  - Injected partials into ${file}`);
    }
});

// 4. Clean up JS to prevent fetching twice
console.log("Removing client-side fetch logic from main.js...");
let mainJs = fs.readFileSync(path.join(DIST, 'assets/js/main.js'), 'utf-8');
mainJs = mainJs.replace(
    "loadPartial('header-include', 'partials/header.html');", 
    "initializeBackToTop();"
);
mainJs = mainJs.replace(
    "loadPartial('footer-include', 'partials/footer.html');", 
    ""
);
fs.writeFileSync(path.join(DIST, 'assets/js/main.js'), mainJs);

console.log("Build complete! Output is in dist/");

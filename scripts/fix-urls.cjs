/**
 * Fix all hardcoded URLs in .astro files to use the url() helper.
 * Uses relative imports instead of @lib/ alias for Astro 7 / Rolldown compatibility.
 */
const fs = require('fs');
const path = require('path');

const files = [
  // Components
  { file: 'src/components/Header.astro', importPath: '../lib/url' },
  { file: 'src/components/Footer.astro', importPath: '../lib/url' },
  { file: 'src/components/HeroCarousel.astro', importPath: '../lib/url' },
  { file: 'src/components/GalleryGrid.astro', importPath: '../lib/url' },
  { file: 'src/components/ProgramCard.astro', importPath: '../lib/url' },
  { file: 'src/components/NewsCard.astro', importPath: '../lib/url' },
  { file: 'src/components/LanguageSelector.astro', importPath: '../lib/url' },
  // Pages - Sinhala
  { file: 'src/pages/index.astro', importPath: '../lib/url' },
  { file: 'src/pages/about-us.astro', importPath: '../lib/url' },
  { file: 'src/pages/news-and-events/index.astro', importPath: '../../lib/url' },
  { file: 'src/pages/get-involved.astro', importPath: '../lib/url' },
  { file: 'src/pages/venue-hire.astro', importPath: '../lib/url' },
  { file: 'src/pages/publications.astro', importPath: '../lib/url' },
  { file: 'src/pages/gallery.astro', importPath: '../lib/url' },
  { file: 'src/pages/contact-us.astro', importPath: '../lib/url' },
  { file: 'src/pages/news-and-events/[slug].astro', importPath: '../../lib/url' },
  { file: 'src/pages/project/[slug].astro', importPath: '../lib/url' },
  // Pages - English
  { file: 'src/pages/en/index.astro', importPath: '../../lib/url' },
  { file: 'src/pages/en/about-us.astro', importPath: '../../lib/url' },
  { file: 'src/pages/en/news-and-events/index.astro', importPath: '../../../lib/url' },
  { file: 'src/pages/en/get-involved.astro', importPath: '../../lib/url' },
  { file: 'src/pages/en/venue-hire.astro', importPath: '../../lib/url' },
  { file: 'src/pages/en/publications.astro', importPath: '../../lib/url' },
  { file: 'src/pages/en/gallery.astro', importPath: '../../lib/url' },
  { file: 'src/pages/en/contact-us.astro', importPath: '../../lib/url' },
];

function fixFile(filePath, importPath) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP (not found): ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace @lib/url import with relative import
  content = content.replace(
    /import \{ url \} from "@lib\/url";/g,
    `import { url } from "${importPath}";`
  );
  
  // Add url import if not present and file has frontmatter with hardcoded paths
  if (content.startsWith('---') && !content.includes('import { url }')) {
    const fmEnd = content.indexOf('---', 3);
    if (fmEnd !== -1) {
      const hasHardcodedPaths = /(href|src)=["']\/(?!\/)[^"']*["']/.test(content);
      if (hasHardcodedPaths) {
        const before = content.substring(0, fmEnd + 3);
        const after = content.substring(fmEnd + 3);
        const lastImportIndex = before.lastIndexOf('import ');
        let insertPoint;
        if (lastImportIndex !== -1) {
          const afterLastImport = before.indexOf('\n', lastImportIndex);
          insertPoint = afterLastImport + 1;
        } else {
          insertPoint = fmEnd + 3;
        }
        const importLine = `import { url } from "${importPath}";\n`;
        content = before.substring(0, insertPoint) + importLine + before.substring(insertPoint) + after;
      }
    }
  }
  
  // Replace href="/..." with href={url("/...")}
  content = content.replace(
    /(href|src)=["']\/((?!\/|#)[^"']*)["']/g,
    (match, attr, p) => {
      if (match.includes('{url(')) return match;
      if (p.startsWith('//')) return match;
      return `${attr}={url("/${p}")}`;
    }
  );
  
  // Fix template string background-image URLs
  content = content.replace(
    /style={`background-image: url\('\$\{([^}]+)\}'\)`}/g,
    (match, varName) => {
      if (varName.includes('url(')) return match;
      return `style={\`background-image: url('\${url(${varName})}')\`}`;
    }
  );
  
  // Fix dynamic href={link.href} etc.
  content = content.replace(
    /href=\{([a-zA-Z_$][a-zA-Z0-9_$.]*)\}/g,
    (match, varName) => {
      if (varName.includes('url(')) return match;
      if (varName === 'currentPath') return match; // skip currentPath
      return `href={url(${varName})}`;
    }
  );
  
  if (content !== fs.readFileSync(fullPath, 'utf8')) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`FIXED: ${filePath}`);
  } else {
    console.log(`OK (no changes): ${filePath}`);
  }
}

console.log('=== Fixing URLs in .astro files ===\n');
files.forEach(f => fixFile(f.file, f.importPath));
console.log('\n=== Done ===');

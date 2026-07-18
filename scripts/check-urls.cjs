/**
 * Check for any hardcoded URLs in .astro files that are NOT wrapped in url().
 * This checks both static href/src="/..." and dynamic src={variable} patterns.
 */
const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/index.astro',
  'src/pages/en/index.astro',
  'src/pages/about-us.astro',
  'src/pages/en/about-us.astro',
  'src/pages/news-and-events/index.astro',
  'src/pages/en/news-and-events/index.astro',
  'src/pages/get-involved.astro',
  'src/pages/en/get-involved.astro',
  'src/pages/venue-hire.astro',
  'src/pages/en/venue-hire.astro',
  'src/pages/publications.astro',
  'src/pages/en/publications.astro',
  'src/pages/gallery.astro',
  'src/pages/en/gallery.astro',
  'src/pages/contact-us.astro',
  'src/pages/en/contact-us.astro',
  'src/pages/news-and-events/[slug].astro',
  'src/pages/project/[slug].astro',
  'src/components/GalleryGrid.astro',
  'src/components/ProgramCard.astro',
  'src/components/NewsCard.astro',
  'src/components/Header.astro',
  'src/components/Footer.astro',
  'src/components/HeroCarousel.astro',
  'src/components/LanguageSelector.astro',
];

let foundIssues = false;

files.forEach(f => {
  const fp = path.join(__dirname, '..', f);
  if (!fs.existsSync(fp)) { console.log('MISS: ' + f); return; }
  const c = fs.readFileSync(fp, 'utf8');
  
  // Check 1: Static href/src="/..." that aren't wrapped in url()
  const staticRegex = /(?:href|src)="\/(?!\/)(?:[^"]*)"/g;
  const staticMatches = c.match(staticRegex);
  if (staticMatches) {
    foundIssues = true;
    console.log(f + ' [STATIC]:');
    staticMatches.forEach(m => console.log('  ' + m));
  }
  
  // Check 2: Dynamic src={variable} that aren't wrapped in url()
  const dynamicRegex = /src=\{([a-zA-Z_$][a-zA-Z0-9_$.]*)\}/g;
  let m;
  while ((m = dynamicRegex.exec(c)) !== null) {
    const varName = m[1];
    if (!varName.includes('url(') && varName !== 'currentPath') {
      // Check if this is an image src (not a script src)
      const beforeMatch = c.substring(Math.max(0, m.index - 50), m.index);
      if (beforeMatch.includes('<img') || beforeMatch.includes('image')) {
        foundIssues = true;
        console.log(f + ' [DYNAMIC]: ' + m[0]);
      }
    }
  }
  
  // Check 3: Dynamic src={obj.prop} or src={obj.prop.prop} that aren't wrapped in url()
  const nestedRegex = /src=\{([a-zA-Z_$][a-zA-Z0-9_$.]+\.[a-zA-Z_$][a-zA-Z0-9_$.]+(?:\.[a-zA-Z_$][a-zA-Z0-9_$.]+)*)\}/g;
  while ((m = nestedRegex.exec(c)) !== null) {
    const varName = m[1];
    if (!varName.includes('url(')) {
      foundIssues = true;
      console.log(f + ' [NESTED]: ' + m[0]);
    }
  }
});

if (!foundIssues) {
  console.log('All URLs are properly wrapped with url()!');
}
console.log('DONE');

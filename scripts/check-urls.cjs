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
];

files.forEach(f => {
  const fp = path.join(__dirname, '..', f);
  if (!fs.existsSync(fp)) { console.log('MISS: ' + f); return; }
  const c = fs.readFileSync(fp, 'utf8');
  // Find any remaining href="/... or src="/... that aren't wrapped in url()
  const regex = /(?:href|src)="\/(?!\/)(?:[^"]*)"/g;
  const matches = c.match(regex);
  if (matches) {
    console.log(f + ':');
    matches.forEach(m => console.log('  ' + m));
  }
});
console.log('DONE');

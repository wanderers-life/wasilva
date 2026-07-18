/**
 * fetch-assets.js
 *
 * Scrapes the live W.A. Silva Foundation site (https://www.wasilva.org)
 * for the 7 inner pages that currently have [CONTENT PLACEHOLDER] stubs.
 *
 * For each page:
 *   1. Fetches the HTML
 *   2. Extracts text content from the main content area
 *   3. Finds <img> tags, downloads images to public/images/
 *   4. Updates the local Astro stub with real content + correct image paths
 *
 * Usage: node scripts/fetch-assets.js
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const PAGES_DIR = path.join(ROOT, "src", "pages");

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// ─── Configuration ───────────────────────────────────────────────────────────

const TARGETS = [
  { url: "https://www.wasilva.org/about-us", stub: "about-us.astro", title: "About Us" },
  { url: "https://www.wasilva.org/news-and-events", stub: "news-and-events/index.astro", title: "News & Events" },
  { url: "https://www.wasilva.org/get-involved", stub: "get-involved.astro", title: "Get Involved" },
  { url: "https://www.wasilva.org/venue-hire", stub: "venue-hire.astro", title: "Venue Hire" },
  { url: "https://www.wasilva.org/publications", stub: "publications.astro", title: "Publications" },
  { url: "https://www.wasilva.org/gallery", stub: "gallery.astro", title: "Gallery" },
  { url: "https://www.wasilva.org/contact-us", stub: "contact-us.astro", title: "Contact Us" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

function extractImageUrls(html) {
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  const urls = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    if (src.startsWith("/") || src.startsWith("https://www.wasilva.org")) {
      urls.push(src.startsWith("http") ? src : `https://www.wasilva.org${src}`);
    }
  }
  return [...new Set(urls)];
}

function extractMainContent(html) {
  const breadcrumbEnd = html.indexOf("<!-- End Breadcrumb -->");
  const footerStart = html.indexOf("<!-- Start Footer");
  if (breadcrumbEnd !== -1 && footerStart !== -1) {
    return html.substring(breadcrumbEnd + 23, footerStart).trim();
  }
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1].trim() : html;
}

function extractSectionsByComments(html) {
  const sections = [];
  const startRegex = /<!--\s*Start\s+(\w+)[\s\S]*?-->/gi;
  let startMatch;

  while ((startMatch = startRegex.exec(html)) !== null) {
    const sectionName = startMatch[1].trim();
    const startIdx = startMatch.index;
    const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const endPattern = new RegExp(`<!--\\s*End\\s*${escapedName}\\s*-->`, 'i');
    const endMatch = endPattern.exec(html.substring(startIdx));

    if (endMatch) {
      const sectionHtml = html.substring(startIdx, startIdx + endMatch.index + endMatch[0].length);

      const headings = [];
      const hRegex = /<h([1-4])[^>]*>(.*?)<\/h\1>/gi;
      let hMatch;
      while ((hMatch = hRegex.exec(sectionHtml)) !== null) {
        headings.push({ level: parseInt(hMatch[1]), text: stripHtml(hMatch[2]) });
      }

      const paragraphs = [];
      const pRegex = /<p[^>]*>(.*?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(sectionHtml)) !== null) {
        const text = stripHtml(pMatch[1]);
        if (text.length > 5) paragraphs.push(text);
      }

      const listItems = [];
      const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(sectionHtml)) !== null) {
        const text = stripHtml(liMatch[1]);
        if (text.length > 5) listItems.push(text);
      }

      const images = extractImageUrls(sectionHtml);
      const hasForm = sectionHtml.includes("<form") || sectionHtml.includes("<input");

      const books = [];
      const colRegex = /<div class="col-md-4[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
      let colMatch;
      while ((colMatch = colRegex.exec(sectionHtml)) !== null) {
        const colHtml = colMatch[1];
        const titleM = colHtml.match(/<h4[^>]*>(.*?)<\/h4>/i);
        const descM = colHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        const imgM = colHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (titleM) {
          books.push({
            title: stripHtml(titleM[1]),
            description: descM ? stripHtml(descM[1]).substring(0, 200) : "",
            image: imgM ? imgM[1] : "",
          });
        }
      }

      sections.push({
        name: sectionName,
        headings,
        paragraphs,
        listItems,
        images,
        books,
        hasForm,
        html: sectionHtml,
      });
    }
  }
  return sections;
}

async function downloadImage(imageUrl) {
  try {
    const urlObj = new URL(imageUrl);
    let basename = path.basename(urlObj.pathname);
    if (!basename || basename === "" || !basename.includes(".")) {
      basename = `image_${Date.now()}.jpg`;
    }
    basename = basename.replace(/[?#].*$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
    const localPath = path.join(IMAGES_DIR, basename);

    if (fs.existsSync(localPath)) {
      return `/images/${basename}`;
    }

    console.log(`  ↓ Downloading: ${imageUrl}`);
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.wasilva.org/",
      },
    });

    if (!response.ok) {
      console.warn(`  ⚠ Failed (${response.status}): ${imageUrl}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(localPath, buffer);
    console.log(`  ✓ Saved: ${basename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return `/images/${basename}`;
  } catch (err) {
    console.warn(`  ⚠ Error downloading ${imageUrl}: ${err.message}`);
    return null;
  }
}

// ─── Content Builders ────────────────────────────────────────────────────────

function buildAboutUsContent(sections) {
  let result = "";
  for (const section of sections) {
    const name = section.name.toLowerCase();
    if (name.includes("history")) {
      result += `
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-ink-900 mb-4">${section.headings.length > 0 ? section.headings[0].text : "ඩබ්ලිව්. ඒ. සිල්වා පදනමේ දැක්ම"}</h2>`;
      if (section.headings.length > 1) {
        result += `
            <h4 class="text-xl font-semibold text-ink-700 mb-4">${section.headings[1].text}</h4>`;
      }
      if (section.listItems.length > 0) {
        result += `
            <ul class="list-disc list-inside space-y-2 text-ink-600">`;
        for (const item of section.listItems) {
          result += `
              <li>${item}</li>`;
        }
        result += `
            </ul>`;
      }
      result += `
          </div>`;
    }
    if (name.includes("mission")) {
      result += `
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-ink-900 mb-6">${section.headings.length > 0 ? section.headings[0].text : "අපගේ මෙහෙවර"}</h2>`;
      for (const p of section.paragraphs) {
        result += `
            <p class="text-ink-600 leading-relaxed mb-4">${p}</p>`;
      }
      result += `
          </div>`;
    }
  }
  if (!result) {
    for (const section of sections) {
      for (const p of section.paragraphs) {
        result += `\n          <p class="text-ink-600 leading-relaxed mb-4">${p}</p>`;
      }
      if (section.listItems.length > 0) {
        result += `\n          <ul class="list-disc list-inside space-y-2 text-ink-600">`;
        for (const item of section.listItems) {
          result += `\n              <li>${item}</li>`;
        }
        result += `\n          </ul>`;
      }
    }
  }
  return result;
}

function buildNewsEventsContent(sections) {
  let result = "";
  for (const section of sections) {
    if (section.headings.length > 0) {
      result += `
          <h2 class="text-2xl font-bold text-ink-900 mb-6">${section.headings[0].text}</h2>`;
    }
    for (const p of section.paragraphs) {
      result += `
          <div class="bg-white rounded-xl p-6 shadow-sm border border-ink-100 mb-4">
            <p class="text-ink-700">${p}</p>
          </div>`;
    }
    if (section.listItems.length > 0) {
      result += `
          <ul class="list-disc list-inside space-y-2 text-ink-600">`;
      for (const item of section.listItems) {
        result += `
              <li>${item}</li>`;
      }
      result += `
          </ul>`;
    }
  }
  return result;
}

function buildGetInvolvedContent(sections) {
  let result = "";
  for (const section of sections) {
    if (section.paragraphs.length > 0) {
      result += `
          <div class="mb-10">
            <p class="text-ink-600 leading-relaxed text-lg">${section.paragraphs[0]}</p>
          </div>`;
    }
    if (section.hasForm) {
      result += `
          <div class="bg-white rounded-xl p-8 shadow-sm border border-ink-100">
            <h2 class="text-2xl font-bold text-ink-900 mb-6">එක්වන්න - පෝරමය</h2>
            <p class="text-ink-600 mb-4">කරුණාකර පහත පෝරමය පුරවා අප හා එක්වන්න:</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">මුල් නම *</label>
                <input type="text" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="මුල් නම" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">අවසන් නම *</label>
                <input type="text" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="අවසන් නම" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">විද්‍යුත් තැපෑල *</label>
                <input type="email" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="විද්‍යුත් තැපැල් ලිපිනය" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">දුරකථනය *</label>
                <input type="tel" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="දුරකථනය" />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-ink-700 mb-1">ඔබේ පණිවිඩය</label>
              <textarea rows="4" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="ඔබ අප හා එක්වීමට කැමති ආකාරය ගැන තව දුරටත් අපට කියන්න"></textarea>
            </div>
            <button class="mt-4 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors">Submit</button>
          </div>`;
    }
  }
  return result;
}

function buildVenueHireContent(sections) {
  let result = "";
  for (const section of sections) {
    if (section.paragraphs.length > 0) {
      result += `
          <div class="mb-10">
            <p class="text-ink-600 leading-relaxed text-lg">${section.paragraphs[0]}</p>
          </div>`;
    }
    if (section.hasForm) {
      result += `
          <div class="bg-white rounded-xl p-8 shadow-sm border border-ink-100">
            <h2 class="text-2xl font-bold text-ink-900 mb-6">ස්ථානය වෙන්කරවා ගැනීම</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">මුල් නම *</label>
                <input type="text" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="මුල් නම" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">අවසන් නම *</label>
                <input type="text" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="අවසන් නම" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">දුරකථනය *</label>
                <input type="tel" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="දුරකථනය" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">විද්‍යුත් තැපෑල *</label>
                <input type="email" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="විද්‍යුත් තැපැල් ලිපිනය" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">දිනය *</label>
                <input type="date" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">වේලාව *</label>
                <select class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>වේලා අවකාශයක් තෝරන්න</option>
                  <option>සම්පූර්ණ දිනය (10am-6pm)</option>
                  <option>උදේ (10am-2pm)</option>
                  <option>දවල් (2pm-6pm)</option>
                  <option>සන්ධ්‍යා (2pm-6pm)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">සංවිධානය</label>
                <input type="text" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="සංවිධානය" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">සභාගීන්ගේ සංඛ්‍යාව *</label>
                <input type="number" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="සභාගීන්ගේ සංඛ්‍යාව" />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-ink-700 mb-1">සිදුවීම් විස්තර *</label>
              <textarea rows="4" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="සිදුවීම් විස්තර"></textarea>
            </div>
            <button class="mt-4 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors">Submit</button>
          </div>`;
    }
  }
  return result;
}

function buildPublicationsContent(sections) {
  let result = "";
  for (const section of sections) {
    if (section.paragraphs.length > 0 && section.books.length === 0) {
      for (const p of section.paragraphs) {
        result += `
          <p class="text-ink-600 leading-relaxed mb-4">${p}</p>`;
      }
    }
    if (section.books.length > 0) {
      result += `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">`;
      for (const book of section.books) {
        result += `
            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-ink-100">
              <div class="aspect-[3/4] bg-ink-100 flex items-center justify-center overflow-hidden">
                ${book.image ? `<img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover" />` : `<span class="text-ink-400 text-sm">Book Cover</span>`}
              </div>
              <div class="p-4">
                <h3 class="font-bold text-ink-900">${book.title}</h3>
                <p class="text-ink-500 text-sm mt-1">${book.description}</p>
              </div>
            </div>`;
      }
      result += `
          </div>`;
    }
  }
  return result;
}

function buildGalleryContent(sections) {
  let result = "";
  for (const section of sections) {
    if (section.headings.length > 0) {
      result += `
          <p class="text-ink-600 leading-relaxed mb-4 font-semibold">${section.headings[0].text}</p>`;
    }
    for (const p of section.paragraphs) {
      result += `
          <p class="text-ink-600 leading-relaxed mb-4">${p}</p>`;
    }
  }
  return result;
}

function buildContactContent(sections) {
  let result = "";
  for (const section of sections) {
    const name = section.name.toLowerCase();
    if (name.includes("contact") && section.headings.length > 0) {
      result += `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-ink-900 mb-4">${section.headings[0].text}</h2>`;
      for (const p of section.paragraphs) {
        result += `
            <p class="text-ink-600 leading-relaxed">${p}</p>`;
      }
      result += `
          </div>`;
    }
    if (name.includes("maps") || name.includes("address")) {
      result += `
          <div class="bg-white rounded-xl p-8 shadow-sm border border-ink-100 mb-8">
            <h2 class="text-2xl font-bold text-ink-900 mb-6">අපගේ ලිපිනය</h2>
            <div class="space-y-4">`;
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(section.html)) !== null) {
        const liText = stripHtml(liMatch[1]);
        if (liText.length > 5) {
          result += `
              <div class="flex items-start gap-3">
                <p class="text-ink-700">${liText}</p>
              </div>`;
        }
      }
      result += `
            </div>
          </div>`;
    }
    if (section.hasForm && name.includes("contact")) {
      result += `
          <div class="bg-white rounded-xl p-8 shadow-sm border border-ink-100">
            <h2 class="text-2xl font-bold text-ink-900 mb-6">අපට පණිවිඩයක් එවන්න</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">නම</label>
                <input type="text" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="නම" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">විද්‍යුත් තැපෑල *</label>
                <input type="email" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="විද්‍යුත් තැපැල් ලිපිනය" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">දුරකථනය *</label>
                <input type="tel" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="දුරකථනය" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1">පණිවිඩය</label>
                <textarea rows="5" class="w-full px-4 py-2.5 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="අපට කියන්න"></textarea>
              </div>
              <button class="w-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors">
                පණිවිඩය එවන්න
              </button>
            </div>
          </div>`;
    }
  }
  return result;
}

const CONTENT_BUILDERS = {
  "about-us.astro": buildAboutUsContent,
  "news-and-events/index.astro": buildNewsEventsContent,
  "get-involved.astro": buildGetInvolvedContent,
  "venue-hire.astro": buildVenueHireContent,
  "publications.astro": buildPublicationsContent,
  "gallery.astro": buildGalleryContent,
  "contact-us.astro": buildContactContent,
};

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═".repeat(60));
  console.log("  W.A. Silva Foundation — Asset Fetcher v7");
  console.log("═".repeat(60));
  console.log();

  const allDownloadedImages = [];

  for (const target of TARGETS) {
    console.log("─".repeat(60));
    console.log(`  Page: ${target.title} (${target.url})`);
    console.log(`  Stub: ${target.stub}`);
    console.log("─".repeat(60));

    try {
      const response = await fetch(target.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        console.warn(`  ⚠ HTTP ${response.status} — skipping`);
        continue;
      }

      const html = await response.text();
      console.log(`  ✓ Received ${(html.length / 1024).toFixed(0)} KB`);

      // Download images
      const imageUrls = extractImageUrls(html);
      console.log(`  → Found ${imageUrls.length} image(s)`);
      for (const imgUrl of imageUrls) {
        const localPath = await downloadImage(imgUrl);
        if (localPath) {
          allDownloadedImages.push({ url: imgUrl, local: localPath });
        }
      }

      // Extract sections
      const mainContent = extractMainContent(html);
      const sections = extractSectionsByComments(mainContent);
      console.log(`  → Extracted ${sections.length} section(s)`);
      for (const s of sections) {
        console.log(`    "${s.name}": ${s.headings.length}h ${s.paragraphs.length}p ${s.listItems.length}li ${s.books.length}books form=${s.hasForm}`);
      }

      // Build content
      const builder = CONTENT_BUILDERS[target.stub];
      let newContent = builder ? builder(sections) : "";

      // Read stub
      const stubPath = path.join(PAGES_DIR, target.stub);
      if (!fs.existsSync(stubPath)) {
        console.warn(`  ⚠ Stub not found: ${stubPath}`);
        continue;
      }

      let stubContent = fs.readFileSync(stubPath, "utf-8");

      // Replace the entire content section between <!-- Content Placeholder --> and </main>
      // with the new content
      const contentSectionRegex = /<!-- Content Placeholder -->[\s\S]*?(?=<\/main>)/;
      const contentSectionMatch = stubContent.match(contentSectionRegex);

      if (contentSectionMatch) {
        const replacement = `<!-- Content Placeholder -->
    <section class="py-16 lg:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        ${newContent || "<!-- Content will be populated from live site -->"}
      </div>
    </section>
  `;
        stubContent = stubContent.replace(contentSectionRegex, replacement);
        fs.writeFileSync(stubPath, stubContent, "utf-8");
        console.log(`  ✓ Updated ${target.stub}`);
      } else {
        console.log("  → Could not find content section marker");
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
    console.log();
  }

  console.log("═".repeat(60));
  console.log("  Summary");
  console.log("═".repeat(60));
  console.log(`  Total images downloaded: ${allDownloadedImages.length}`);
  console.log();
  console.log("  Done! Run `npx astro build` to verify.");
}

main().catch(console.error);

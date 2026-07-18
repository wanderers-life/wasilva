# W.A. Silva Foundation — Rebuild Content Spec

Use this as the source-of-truth prompt/spec for Cline in VS Code. Stack: **Astro + Decap CMS + Cloudflare Pages**.

---

## 1. Global site info

- **Site name:** W.A. Silva Foundation (ඩබ්ලිව්. ඒ. සිල්වා පදනම)
- **Language:** Sinhala (primary), English (secondary — has a language switcher, currently only Sinhala content live)
- **Address:** අංක 126, ඩබ්ලිව්. ඒ. සිල්වා මාවත, වැල්ලවත්ත, කොළඹ 6, ශ්‍රී ලංකාව
- **Phone:** +94 712 748 174
- **Email:** info@wasilva.org, ravi.thilakawardana@gmail.com
- **Logo:** currently at `/assets/assets/img/logo.png` — get the real file from client, don't hotlink
- **Footer credit line to replace:** "Powered by IT MART" → your agency name

## 2. Font requirement (important)

Site is Sinhala-script. Use **Noto Sans Sinhala** (Google Fonts, free) or **Iskoola Pota** fallback stack. Test conjunct/ligature rendering before calling it done — this breaks easily with the wrong font-feature-settings.

## 3. Navigation (main menu)

| Label (Sinhala) | Route |
|---|---|
| මුල් පිටුව (Home) | `/` |
| අපි ගැන (About Us) | `/about-us` |
| පුවත් සහ සිදුවීම් (News & Events) | `/news-and-events` |
| එක්වන්න (Get Involved) | `/get-involved` |
| ස්ථානය වෙන්කිරීම (Venue Hire) | `/venue-hire` |
| ප්‍රකාශන (Publications) | `/publications` |
| ගැලරිය (Gallery) | `/gallery` |
| අපව සම්බන්ධ කරගන්න (Contact Us) | `/contact-us` |

CTA button in header: "දායකත්වය දක්වන්න" (Donate) — links to `/get-involved` (currently just `#`, should point to a real donate section/form).

## 4. Homepage sections (in order)

### A. Hero carousel (3 slides, Bootstrap-style carousel, autoplay + prev/next)
1. **Eyebrow:** මුද්‍රණ සංග්‍රහ මැදුර සහ වර්ණලේඛන එකතුව
   **Headline:** මැදුරේ ප්‍රදර්ශනයට පත් කර ඇත්තේ සම්පූර්ණ සම්ප්‍රදායික ලිපි මැටි මුද්‍රණ යන්ත්‍රයක් සහ ගස් හා ලෝහ අකුරු එකතුවක් වේ.
   **CTAs:** "තවදුරටත් කියවන්න" → `/about-us` · "දැන් එක්වන්න" → `/get-involved`
2. **Eyebrow:** පොත්සාලාව සහ සංරක්ෂණාගාරය
   **Headline:** ඩබ්ලිව්. ඒ. සිල්වා මැදුර ශ්‍රී ලංකා වර්ණලේඛන ආයතනයට වාසස්ථානය වන අතර, දේශීය භාෂා, ලිපි හා සාහිත්‍ය පිළිබඳ පොත් සහ සම්පත් සංරක්ෂණාගාරයක් ලෙස ක්‍රියා කරයි.
   Same CTAs.
3. **Eyebrow:** වැඩමුලු සහ සිදුවීම්
   **Headline:** ඩබ්ලිව්. ඒ. සිල්වා මැදුර මුද්‍රණය, ලිපි, භාෂා හා සාහිත්‍ය සම්බන්ධ වැඩමුලු, සංවාද සහ සිදුවීම් සංවිධානය කරයි.
   Same CTAs.

### B. Programs card grid (5 cards, image + title + short paragraph)
1. **පොතක් අනුගමනය කරන්න** — `assets/img/adopt-a-book.jpg` — sponsor restoration/translation of rare works, get commemorative editions with donor plaques.
2. **සිල්වර්මියර් උරුම සුරක්ෂකයින්** — `assets/img/silvermere_heritage_guardians.jpg` — "sponsor a square foot" of the historic Silvermere grounds.
3. **උරුම දේශන දායාදය** — `assets/img/legacy_lectureships_endowment.jpg` — named lectureship endowment, annual national lecture tour.
4. **තරුණ ලේඛක සංසරණය** — `assets/img/young_writers_residency.jpg` — residency space for new writers, mentorship.
5. **ඩිජිටල් සංරක්ෂණාගාර ව්‍යාපෘතිය** — `assets/img/digital_archive_project.jpg` — named digital-archive scholarships for emerging writers.

### C. Vision block
**Heading:** ඩබ්ලිව්. ඒ. සිල්වා පදනමේ සාහිත්‍ය හා සංස්කෘතික අඛණ්ඩතාවයට ඇති දැක්ම
**Sub-heading:** දැක්ම ප්‍රකාශය
6 bullet points (mission statement — preserve W.A. Silva's national contribution to language/literature, gather info about him, propagate/translate his novels, use modern media, conduct research, preserve "Silvermere" house in Wellawatte as a national asset housing a language-literature library, museum, and old-Colombo info center).

### D. "අපගේ තොරතුරු" (About us teaser) + 6 article/news cards
Each card: thumbnail, title, 2–3 sentence excerpt, "වැඩිදුර කියවන්න" link → `/project/{slug}/{id}`. Topics: the "Higana Kolla" film, "Kele Handa" film history, "Deiyange Rate" novel origin story, a W.A. Silva biography piece, the "W.A. Silva school of literature" essay, "Vijayaba Kollaya" film adaptation.
Plus 3 promo cards: Venue Hire, Become a Volunteer, Donate (each with image + short blurb + CTA to `/venue-hire` or `/get-involved`).

### E. News & Events (3 latest cards)
Card = thumbnail + title + excerpt + "වැඩිදුර කියවන්න" link → `/news-and-events/{slug}/{id}`. Latest 3: "Walk into W.A. Silva's world" (Silvermere house museum tour), "W.A. de Silva (1869–1942)" biography piece, "W.A. Silva's 135th Birth Anniversary" celebration recap.

### F. Photo gallery preview
Filter tabs: සියලුම (All) / ප්‍රකාශන (Publications) / විශේෂ සිදුවීම් (Special Events) / පොත් (Books). Grid of image thumbnails (25 shown on homepage, click-through to lightbox), "තවත් පින්තූර" (More Photos) → `/gallery`.
*(Full image URL list is in section 6 below.)*

### G. Footer
- About blurb (1 sentence) + newsletter signup ("ඔබගේ විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කර...")
- Menu (same as header, plus Gallery)
- Contact block (address/phone/email, repeated)
- Copyright line

## 5. Pages needing manual content pull

I could not fetch these (not indexed / need direct browser access). Before Cline builds them, open each in a browser, view-source or copy the rendered text, and drop it into this spec:

- `https://www.wasilva.org/about-us`
- `https://www.wasilva.org/news-and-events` (full list, not just 3)
- `https://www.wasilva.org/get-involved`
- `https://www.wasilva.org/venue-hire`
- `https://www.wasilva.org/publications`
- `https://www.wasilva.org/gallery` (full image set)
- `https://www.wasilva.org/contact-us`

Tip: in Chrome DevTools → Network tab, reload the page, and check if content loads via an XHR/JSON call — if so, that endpoint may give you structured data (titles, dates, images) much faster than scraping HTML.

## 6. Image assets to migrate (download, don't hotlink)

**Static/brand assets:**
```
/assets/assets/img/logo.png
/assets/assets/img/adopt-a-book.jpg
/assets/assets/img/silvermere_heritage_guardians.jpg
/assets/assets/img/legacy_lectureships_endowment.jpg
/assets/assets/img/young_writers_residency.jpg
/assets/assets/img/digital_archive_project.jpg
/assets/assets/img/venue_hire.jpg
/assets/assets/img/become_a_volunteer.jpg
/assets/assets/img/donate_us.jpg
```

**Content/media images (article + gallery thumbnails, homepage sample — full gallery has more at `/gallery`):**
```
/media/image/1748858685.jpg
/media/image/1748859875.jpg
/media/image/1748861223.jpg
/media/image/1748862494.jpg
/media/image/1748926368.png
/media/image/1749010955.jpg
/media/image/1749023627.jpg
/media/image/1749018870.jpg
/media/image/1749021787.jpg
/media/image/1749102467.jpg
/media/image/1749102579.jpg
/media/image/1749102671.jpg
/media/image/1749103886.jpg
/media/image/1749103902.jpg
/media/image/1749103916.jpg
/media/image/1749103928.jpg
/media/image/1749103941.jpg
/media/image/1749104325.jpg
/media/image/1749104342.jpg
/media/image/1749104360.jpg
/media/image/1749104639.jpg
/media/image/1749104712.jpg
/media/image/1749104733.jpg
/media/image/1749104750.jpg
/media/image/1749189500.jpg
/media/image/1749189521.jpg
/media/image/1749189535.jpg
/media/image/1749189580.jpg
/media/image/1749189596.jpg
/media/image/1749189640.jpg
/media/image/1749189664.jpg
/media/image/1749189680.jpg
/media/image/1749189694.jpg
/media/image/1749189710.jpg
/media/image/1749189724.jpg
```

Bulk-download command (run once you have permission/access from the client — these are their own assets):
```bash
mkdir -p src/assets/downloaded && cd src/assets/downloaded
while read -r url; do curl -O "https://www.wasilva.org$url"; done < image-list.txt
```

## 7. Proposed project structure (Astro + Decap CMS)

```
wasilva-website/
├── astro.config.mjs
├── package.json
├── public/
│   ├── admin/              # Decap CMS
│   │   ├── index.html
│   │   └── config.yml
│   └── images/              # migrated static assets
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── HeroCarousel.astro
│   │   ├── ProgramCard.astro
│   │   ├── NewsCard.astro
│   │   └── GalleryGrid.astro
│   ├── content/
│   │   ├── config.ts        # Astro content collections schema
│   │   ├── news/             # markdown files, editable via Decap
│   │   ├── gallery/           # markdown/json entries per image
│   │   └── programs/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about-us.astro
│   │   ├── news-and-events/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── get-involved.astro
│   │   ├── venue-hire.astro
│   │   ├── publications.astro
│   │   ├── gallery.astro
│   │   └── contact-us.astro
│   └── styles/
│       └── global.css
```

## 8. Decap CMS collections (draft `config.yml`)

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "news"
    label: "News & Events"
    folder: "src/content/news"
    create: true
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Thumbnail", name: "thumbnail", widget: "image" }
      - { label: "Excerpt", name: "excerpt", widget: "text" }
      - { label: "Body", name: "body", widget: "markdown" }

  - name: "gallery"
    label: "Gallery"
    folder: "src/content/gallery"
    create: true
    fields:
      - { label: "Image", name: "image", widget: "image" }
      - { label: "Category", name: "category", widget: "select", options: ["Publications", "Special Events", "Books"] }
      - { label: "Caption", name: "caption", widget: "string", required: false }
```

Decap needs **Git Gateway + Netlify Identity** (free) OR you can swap to GitHub-based auth if hosting elsewhere. Since we're deploying to Cloudflare Pages for hosting, the cleanest free combo is: **Cloudflare Pages for hosting + Netlify Identity/Git Gateway just for the CMS auth layer** (Netlify free tier, used only for auth, not hosting) — or alternatively use **Decap's GitHub backend** directly (no Netlify needed at all) if the client/team is comfortable with GitHub logins.

## 9. Suggested Cline prompt (paste into Cline once assets are downloaded)

> Build an Astro site using the structure and content in `wasilva-content-spec.md`. Use Tailwind CSS for styling, Noto Sans Sinhala as the primary font. Build a responsive header with the nav from section 3, a homepage matching sections A–G in order, and stub pages for the routes in section 5 (to be filled in once I provide their content). Set up Astro content collections for `news` and `gallery` per section 7–8, and scaffold `public/admin/config.yml` for Decap CMS per section 8. Keep components small and reusable (HeroCarousel, ProgramCard, NewsCard, GalleryGrid).

## 10. Hosting/deploy checklist for managed services

1. Client creates (or you create under their name) a GitHub repo — **they own it**, you're a collaborator.
2. Connect repo to **Cloudflare Pages** (free tier) — auto-deploys on push to `main`.
3. Point domain DNS (client's registrar) to Cloudflare Pages — free SSL auto-provisioned.
4. Set up Decap CMS auth (Netlify Identity or GitHub backend) so client/staff can add News & Gallery entries without touching code.
5. Document a simple runbook: how to add a news post, how to add gallery images, who to call if the site goes down.
6. Agree a retainer covering: domain renewal reminders, DNS/SSL monitoring, dependency updates, content-help hours.

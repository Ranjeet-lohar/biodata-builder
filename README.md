# Marriage Biodata Builder

A local-first Next.js + Tailwind CSS editor for creating polished marriage
biodatas. Enter your details, upload a photo, customise the content and
design, then export the result as a PDF or PNG. Drafts, photos, and saved
profiles remain in the browser through `localStorage`; the app does not send
your biodata to a server.

## Features

- **Fully editable content** — every section and field is dynamic:
  add a new section, delete one you don't need, rename any title/label,
  and re-order everything by dragging.
- **Drag-and-drop sections** — grab the handle on any section card and
  drag it up/down to reorder how it appears in the biodata.
- **Two section types** — grid sections (label : value rows, e.g.
  "Height", "Occupation") and paragraph sections (free text, e.g. "About
  Me"). Add as many of either as you like.
- **Hide instead of delete** — the eye icon toggles a section's
  visibility in the output without losing its content.
- **20 ready-made templates** across 9 distinct layouts: bordered frame,
  dark sidebar, centered/circular photo, colour band header, and a
  split two-column layout — each in several colour themes (Royal
  Maroon, Modern Minimal, Floral Blush, Classic Navy, Emerald Garden,
  Midnight Gold, Sunset Peach, Ivory Lace, Teal Bloom, Crimson Regal,
  Sage Simplicity, Lavender Dream, Charcoal Professional, Marigold
  Festive, Rosewood Heritage, Ocean Pearl, Terracotta Mosaic, Pine Ink,
  Sapphire Saffron, and Lotus Editorial).
- **Hindi / English toggle** — every built-in label and section title
  has a Hindi translation baked in; flip the EN/हिं switch to relabel
  the whole biodata instantly. Custom sections/fields can have their own
  Hindi label too, and paragraph sections (About Me, Partner
  Expectations) support a separate Hindi version of the text.
- **श्री गणेशाय नमः invocation header** — toggle on/off, pick from
  common presets, or type your own line.
- **Font style picker** — 6 font packs (Signature Serif, Modern Sans,
  Classic Editorial, Royal Script, Devanagari Traditional, or match the
  template default). Devanagari fallback fonts are included everywhere
  so Hindi text always renders correctly regardless of the chosen pack.
- **Live preview** that updates as you type, scaled to fit the screen.
- **Download as PDF or PNG** (client-side, via html2canvas + jsPDF), at
  full print resolution.
- **Save / edit multiple biodatas** — name and save as many as you like,
  reload or delete them later. The current draft autosaves so a refresh
  never loses your work.
- **Responsive** — side-by-side editor/preview on desktop and tablet,
  tabbed Edit/Preview on mobile, touch-friendly drag handles.
- **Informational pages** — built-in Features, About, Pricing, Contact, and
  Login routes are available from the main navigation.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Available scripts

```bash
npm run dev       # start the development server
npm run lint      # run ESLint
npm run build     # create a production build
npm run start     # serve the production build
```

The project requires Node.js with npm. No database or environment variables
are required for local development.

## Build for production

```bash
npm run build
npm run start
```

## Project structure

```
src/
  app/
    page.tsx          # main app: state, layout, wiring
    layout.tsx          # fonts + metadata
    globals.css
  components/
    HeaderCard.tsx        # photo, name (EN/HI), invocation controls
    SectionsEditor.tsx      # drag-and-drop section/field editor (dnd-kit)
    Field.tsx                  # TextField / SelectField inputs
    PhotoUpload.tsx              # photo upload + preview
    LanguageToggle.tsx            # EN / हि switch
    FontPackSelector.tsx           # font style dropdown
    TemplateSelector.tsx          # design picker grid (20 templates)
    ProfilesBar.tsx               # save / load / delete named biodatas
    ExportBar.tsx                 # download PDF / PNG buttons
    PreviewScaler.tsx             # scales the fixed A4-size preview
    templates/
      RoyalTemplate.tsx / MinimalTemplate.tsx / FloralTemplate.tsx /
      ClassicTemplate.tsx / LotusEditorialTemplate.tsx # 5 bespoke templates
      layouts/
        FrameLayout.tsx / BandLayout.tsx / CenteredLayout.tsx /
        SidebarLayout.tsx / SplitLayout.tsx # 5 reusable layout engines
        theme.ts                       # theme config shape
        themes.ts                      # 10 colour themes -> layouts
        Motifs.tsx                     # corner decorations
      index.tsx                        # template registry
  lib/
    types.ts             # BiodataDocument data model (sections, fields…)
    defaultSections.ts     # default & sample seed content (bilingual)
    fontPacks.ts             # font style definitions
    storage.ts                 # localStorage helpers (profiles + draft)
    exportBiodata.ts             # html2canvas + jsPDF export logic
```

## Adding another template

**Fastest way — reuse a layout:** add an entry to `extraThemes` in
`src/components/templates/layouts/themes.ts` with your own colours,
fonts, photo shape and corner style, and pick one of the 5 existing
`layout` values (`frame`, `band`, `centered`, `sidebar`, `split`). It
shows up in the picker automatically — no new component needed.

**Fully custom layout:** create `src/components/templates/YourTemplate.tsx`
following the pattern in `RoyalTemplate.tsx` (accepts `{ doc, fonts }`,
forwards a ref to the root div, iterates `doc.sections`), then register
it in `src/components/templates/index.tsx`.

## Notes

- Photo upload is stored as a base64 data URL in the browser only.
- PDF/PNG export runs entirely in the browser. It captures the selected
  template with `html2canvas` at high resolution, then places it into an A4
  `jsPDF` document or downloads it directly as PNG.
- Saved biodatas use a new data shape (dynamic sections). Older drafts
  from a previous version of this app won't load and will be replaced
  with the sample biodata on first run.

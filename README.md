# CEGS Ghost Theme — User Manual & Technical Documentation

A custom Ghost theme engineered for the **Centre for Eastern Ghats Studies (CEGS)**. Designed for editorial clarity, rich visual storytelling, accessible typography, and mobile-first responsiveness.

---

## Table of Contents
1. [Theme Architecture & Files](#1-theme-architecture--files)
2. [Content Management Guide (Ghost Admin)](#2-content-management-guide-ghost-admin)
   - [A. Team Members & Advisory Board](#a-team-members--advisory-board)
   - [B. Publications (Academic & Non-Academic)](#b-publications-academic--non-academic)
   - [C. Homepage Dynamic Sections](#c-homepage-dynamic-sections)
   - [D. Header Navigation & Dropdown Menus](#d-header-navigation--dropdown-menus)
   - [E. Footer & Quick Links](#e-footer--quick-links)
   - [F. Research Projects](#f-research-projects)
   - [G. Nursery & Species Directory](#g-nursery--species-directory)
   - [H. Photography Gallery & Lightbox](#h-photography-gallery--lightbox)
   - [I. Modular Dynamic Page Sections](#i-modular-dynamic-page-sections)
3. [Internal Tag Reference Table](#3-internal-tag-reference-table)
4. [Custom Page Templates Reference](#4-custom-page-templates-reference)
5. [Theme Installation & Development](#5-theme-installation--development)

---

## 1. Theme Architecture & Files

```
cegs-theme/
├── default.hbs              # Base HTML layout, Google Fonts, Audio player, modal overlays
├── home.hbs                 # Dynamic homepage layout
├── index.hbs                # Default post archive
├── post.hbs                 # Single post layout (auto-detects team vs research vs standard)
├── page.hbs                 # Default static page layout
├── author.hbs               # Author/contributor profile
├── error-404.hbs            # Custom 404 page
├── custom-about.hbs         # About page with Mission/Vision & Dynamic Team Groups
├── custom-academic.hbs      # Peer-reviewed academic publications with live search
├── custom-non-academic.hbs  # Popular articles, media, and outreach archive with live search
├── custom-research.hbs      # Research programme directory
├── custom-nursery.hbs       # Plant nursery species directory with live taxa search
├── custom-gallery.hbs       # Photo albums directory
├── custom-gallery-post.hbs  # Album gallery view with lightbox integration
├── custom-resources.hbs     # Books, field guides, and download archives
├── custom-case-story.hbs    # Long-form case story reading experience
├── custom-contact.hbs       # Contact form template
├── custom-opportunities.hbs  # Careers & volunteer opportunities template
├── partials/                # Reusable Handlebars partials
│   ├── site-header.hbs      # Header branding and navigation
│   ├── site-footer.hbs      # Footer widgets, contact info, and secondary navigation
│   ├── card-team.hbs        # Polaroid team member card
│   ├── card-publication.hbs # Publication citation card with PDF download
│   ├── card-research.hbs    # Research project card
│   ├── dynamic-sections.hbs # Modular sub-sections loaded by tag
│   └── ...
└── assets/
    ├── css/                 # tokens.css, screen.css, components.css, post.css
    ├── js/                  # main.js, dropdown-override.js, map.js, audio.js
    └── media/               # forest-ambient.mp3
```

---

## 2. Content Management Guide (Ghost Admin)

### A. Team Members & Advisory Board

In this theme, **Team Members are created as standard Ghost Posts** (not Authors/Staff), allowing full editorial freedom over their roles, bios, and portraits.

#### How to Add a Team Member:
1. Go to **Posts > New post**.
2. **Title**: Enter the member's full name (e.g., `Dr. Karthik Shanker`).
3. **Feature Image**: Upload a portrait photo (displayed in an archival Polaroid-style card).
4. **Custom Excerpt**: Enter their role or designation (e.g., `Trustee & Senior Advisor`).
5. **Post Content**: Write their biography, background, research focus, or affiliations.
6. **Tags**: Add **only** the specific section tag:
   - `#team-governing` &rarr; Appears under *Governing Body* on the About page.
   - `#team-research` &rarr; Appears under *Research Team* on the About page.
   - `#team-advisory` &rarr; Appears under *Advisory Committee* on the About page.
   - `#team-collaborators` &rarr; Appears under *Collaborators* on the About page.
   - `#team-[any-slug]` &rarr; **Automatically creates a new section** on the About page (e.g., `#team-ground-staff` creates a *Ground Staff* section, `#team-fellows` creates a *Fellows* section).
   > **Note:** You do **NOT** need to add `#team`. Adding `#team-[section]` is all that is required.

#### How to Feature a Team Member on the Homepage:
- In the post settings panel (gear icon on top right), simply toggle **"Feature this post"** to **ON**.
- Any team post marked as featured automatically renders in the **Advisory board and Institutional collaborations** section of the homepage.
- If no team posts are featured, the section cleanly hides itself from the homepage.

#### Individual Profile View:
- When visitors click a team member's card, `post.hbs` automatically detects the `#team-*` tag and renders an exclusive profile layout featuring their polaroid photo on the left and full biographical notes on the right.

---

### B. Publications (Academic & Non-Academic)

Publications are divided into two dedicated archives, each with real-time live search:

#### 1. Academic Publications (`/academic/`)
- **Page Setup**: Create a Ghost Page with slug `academic` and assign the **Template: Academic** (`custom-academic.hbs`).
- **Adding an Academic Paper**:
  1. Create a **New Post**.
  2. **Title**: Title of the research paper or journal article.
  3. **Custom Excerpt**: Abstract, citation, journal name, year, or DOI link.
  4. **Tags**: Tag with `#academic` (or `academic`, `#publication`).
  5. **Authors**: Assign the Ghost authors or co-authors.
  6. **Feature on Homepage**: Toggle **"Feature this post"** to **ON** to display it in the homepage Publications grid.

#### 2. Non-Academic Publications (`/non-academic/`)
- **Page Setup**: Create a Ghost Page with slug `non-academic` and assign the **Template: Non Academic** (`custom-non-academic.hbs`).
- **Adding a Popular / Outreach Article**:
  1. Create a **New Post**.
  2. **Title**: Title of the article, report, or news release.
  3. **Custom Excerpt**: Brief overview, publisher, date, or publication medium.
  4. **Tags**: Tag with `#non-academic` (or `non-academic`).
  5. **Feature on Homepage**: Toggle **"Feature this post"** to **ON** to display it in the homepage Publications grid.

#### PDF Previews:
- Any link to a `.pdf` file in a publication post automatically launches Ghost's built-in modal document viewer when clicked, allowing visitors to read papers without leaving the site.

---

### C. Homepage Dynamic Sections

The homepage (`home.hbs`) is composed of modular, editor-driven blocks:

| Section | Ghost Source | Instructions |
| :--- | :--- | :--- |
| **Hero Slider** | Page or Post with slug `home-slider` | Insert a Ghost **Gallery Card** containing the slider photos. The theme automatically animates them as a fullscreen background slideshow. |
| **Hero Intro Text** | Page with slug `home-intro` | Write the welcoming heading and intro statement in the page body. It overlays directly on top of the hero slider. |
| **Case for the Eastern Ghats** | Page with slug `home-case` | Set the background via **Feature Image**. The body text is automatically parsed as the excerpt preview card. |
| **Case Statistics Chips** | Page with slug `home-case-stats` | Add bullet points or stats (e.g. `200+ Endemic Taxa`) to populate the interactive stat badges. |
| **Interactive Map** | Page with slug `home-maps` | Populates the geographic habitat layers and exploration markers. |
| **Featured Research** | Posts tagged `research` + Featured: ON | The top 3 featured research projects appear here with direct links. |
| **Featured Publications** | Posts tagged `#academic` or `#non-academic` + Featured: ON | The top 3 featured publications appear here with citation badges. |
| **Featured Team** | Posts tagged `#team-*` + Featured: ON | Renders up to 12 featured advisory and collaboration members. |

---

### D. Header Navigation & Dropdown Menus

The main navigation supports nested dropdown menus configured directly in **Ghost Admin > Settings > Navigation > Primary Navigation**:

#### Creating Dropdown Submenus:
Prefix submenu child links with a hyphen and a space (`- `):

```text
Publications        -> /academic/
- Academic          -> /academic/
- Non-Academic      -> /non-academic/
About Us            -> /about/
- Mission & Vision  -> /about/
- Our Team          -> /about/#team
Research            -> /research/
Gallery             -> /gallery/
Contact             -> /contact/
```

- **Desktop**: The theme automatically renders a smooth dropdown card underneath the parent item on hover/focus.
- **Mobile**: The mobile slide-out drawer provides touch-friendly accordions that expand and collapse cleanly without navigation conflicts.

---

### E. Footer & Quick Links

The footer contains 4 structured widgets:

1. **Quick Links**:
   - Manage these via Ghost Admin in **Settings > Navigation > Secondary Navigation**.
   - Add any desired links (e.g., `Research Programme`, `Academic Archive`, `Non-Academic Archive`, `Gallery`, `Contact`).
   - If Secondary Navigation is left empty, the theme automatically displays default fallback links to primary site sections.
2. **Contact Widget**:
   - Displays `@site.title` along with custom address and email from Ghost Design settings (`@custom.footer_contact_address` and `@custom.footer_contact_email`).
3. **Follow Us Widget**:
   - Automatically displays active social links configured in Ghost Admin.
4. **Support Our Work**:
   - Features a button linking directly to `/support-us/`.

---

### F. Research Projects

- **Page**: Create a Page with slug `research` and assign **Template: Research** (`custom-research.hbs`).
- **Projects**: Create Posts tagged with `research`.
  - **Feature Image**: Project banner image.
  - **Custom Excerpt**: Summary of the investigation.
  - **Content**: Detailed methodology, updates, and findings.
  - **Homepage**: Mark **"Feature this post"** to showcase it in the homepage Featured Research grid.

---

### G. Nursery & Species Directory

- **Page**: Create a Page with slug `nursery-restoration` and assign **Template: Nursery** (`custom-nursery.hbs`).
- **Species**: Create Posts tagged with `#species`.
  - **Title**: Scientific / botanical name (e.g., *Pterocarpus santalinus*).
  - **Custom Excerpt**: Common name, local Telugu/Tamil names, and family.
  - **Feature Image**: Specimen or leaf photo.
  - **Content**: Ecological niche, propagation notes, conservation status.
- **Search**: The template includes a live client-side search box that filters species cards by name or taxa.

---

### H. Photography Gallery & Lightbox

- **Directory Page**: Create a Page with slug `gallery` and assign **Template: Gallery** (`custom-gallery.hbs`).
- **Albums**: Create Posts tagged with `gallery`.
  - Insert Ghost **Gallery Cards** inside the post body.
  - The theme automatically extracts images to render previews and provides a full-screen **FsLightbox** viewer for high-resolution inspection.

---

### I. Modular Dynamic Page Sections

Any page can have extra modular sections appended without modifying template code:
1. Create a Ghost **Page**.
2. Add your content, heading, and optional Feature Image.
3. Tag the page with `#hash-[parent-slug]-section`.
   - Example: Tag a page `#academic-section` &rarr; It will automatically render as a styled sub-section at the bottom of the `/academic/` page.
   - Example: Tag a page `#about-section` &rarr; It will automatically render as a sub-section at the bottom of the `/about/` page.
4. Sections are displayed in order of **Publication Date** (earliest first).

---

## 3. Internal Tag Reference Table

Ghost internal tags (prefixed with `#`) keep theme logic completely hidden from public tag listings:

| Internal Tag | Destination / Purpose | Description |
| :--- | :--- | :--- |
| `#team-governing` | `/about/` | Members of the Governing Body |
| `#team-research` | `/about/` | Core Research Scientists |
| `#team-advisory` | `/about/` | Advisory Board & Mentors |
| `#team-collaborators` | `/about/` | Partner institutions & external scientists |
| `#team-[slug]` | `/about/` | **Dynamic section** created with Title Case heading (e.g. `#team-ground-staff` &rarr; "Ground Staff") |
| `#academic` | `/academic/` | Scientific papers, journals, DOI publications |
| `#non-academic` | `/non-academic/` | Popular writing, press articles, media stories |
| `#species` | `/nursery-restoration/` | Native plant species in nursery directory |
| `#home-slider` | Homepage Hero | Slideshow images extracted from gallery block |
| `#home-case` | Homepage Case Story | Teaser copy and background image |
| `#home-case-stats` | Homepage Case Story | Key statistics chips |
| `#home-maps` | Homepage Maps | Habitat and regional exploration layers |
| `#[slug]-section` | Modular sub-section | Appends modular content block to page matching `[slug]` |

*Public tags (`research`, `gallery`, `resource`) are also supported and generate public tag archives if desired.*

---

## 4. Custom Page Templates Reference

When creating or editing a Page in Ghost Admin, select the appropriate template in the Page settings panel (gear icon):

| Template Option | Handlebars File | Intended Use |
| :--- | :--- | :--- |
| **Default** | `page.hbs` | Standard content pages |
| **About** | `custom-about.hbs` | Mission, vision, and full team directory |
| **Academic** | `custom-academic.hbs` | Scientific archive with live search |
| **Non Academic** | `custom-non-academic.hbs` | Popular publications & media archive with live search |
| **Research** | `custom-research.hbs` | Research projects directory |
| **Nursery** | `custom-nursery.hbs` | Native nursery species directory |
| **Gallery** | `custom-gallery.hbs` | Photo albums and visual records |
| **Resources** | `custom-resources.hbs` | Field guides, manuals, and downloads |
| **Case Story** | `custom-case-story.hbs` | Editorial narrative storytelling |
| **Contact** | `custom-contact.hbs` | Contact information and inquiry form |
| **Opportunities** | `custom-opportunities.hbs` | Careers, grants, and volunteering |

---

## 5. Theme Installation & Development

### Local Validation
Validate theme compliance against the latest Ghost requirements using `gscan`:
```bash
npx gscan .
```

### Packaging for Production
To prepare the theme for upload to Ghost Admin:
```bash
# In PowerShell from content/themes/cegs-theme:
Compress-Archive -Path * -DestinationPath ../cegs-theme.zip -Force
```
Then upload `cegs-theme.zip` via **Ghost Admin > Settings > Design > Change theme > Upload theme**.

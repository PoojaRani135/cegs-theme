# CEGS Theme Data Architecture

This document defines how Ghost's native content model maps to the CEGS theme requirements.

---

## 1. Content Categories & Tag Taxonomy

To drive the theme, posts are categorized using Ghost tags. 
- **Internal Tags (prefixed with `#`)**: Hidden from public tag pages and clean from UI badges, but fully functional for theme routing, queries, and templates.
- **Public Tags**: Generate public post archive URLs and taxonomy badges where desired.

| Tag | Visibility | Scope & Purpose |
| :--- | :--- | :--- |
| `research` | Public | Active or completed research programme initiatives. |
| `#academic` | Internal | Peer-reviewed papers, scientific articles, and academic publications. |
| `#non-academic` | Internal | Popular articles, policy briefs, media reports, and outreach publications. |
| `#publication` | Internal | Legacy tag for publications (supported for backwards compatibility). |
| `#team-governing` | Internal | Governing body members (rendered on `/about/`). |
| `#team-research` | Internal | Core scientific research team members (rendered on `/about/`). |
| `#team-advisory` | Internal | Advisory board members and mentors (rendered on `/about/`). |
| `#team-collaborators` | Internal | Institutional or independent collaborators (rendered on `/about/`). |
| `#team-[slug]` | Internal | **Dynamic team section**: creates section automatically titled from `[slug]` (e.g. `#team-ground-staff` &rarr; "Ground Staff"). |
| `#species` | Internal | Plant species records cultivated in the native nursery directory. |
| `gallery` | Public | Visual albums containing Ghost gallery card images. |
| `resource` | Public | Educational downloads, books, field guides, and toolkits. |
| `#home-slider` | Internal | Images extracted from gallery card to power the fullscreen hero slideshow. |
| `#home-case` | Internal | Preview excerpt and background image for the "Case for Eastern Ghats" card. |
| `#home-case-stats` | Internal | Key impact statistic chips for the Case story card. |
| `#[slug]-section` | Internal | Modular sub-section appended dynamically to any page with matching slug. |

---

## 2. Ghost Native Field Mapping

The CEGS theme leverages standard Ghost fields to populate custom UI cards and layouts:

| Ghost Field | Theme Mapping | Notes |
| :--- | :--- | :--- |
| **Title** (`title`) | Main heading / Name | Used for person names, project titles, publication titles, or species botanical names. |
| **Feature Image** (`feature_image`) | Card Image / Profile Picture | Required for gallery posts and team members (rendered in polaroid frame). Lazily loaded via WebP. |
| **Custom Excerpt** (`custom_excerpt`) | Card Summary / Role / Subtitle | Used as the member's "Role/Designation", species "Taxa/Family", or publication abstract/citation. |
| **Primary Tag** (`primary_tag`) | Category Badge / Taxonomy | Displayed as a category badge on research and publication cards. |
| **Authors** (`authors`) | Byline / Investigators / Co-authors | Used on research projects and publications to denote contributors. |
| **Content** (`content`) | Body / Bio / Full Details | Full WYSIWYG editor content. Supports Markdown, HTML, galleries, and PDF embed links. |

---

## 3. Team Members & Advisory Board Data Flow

Team members are created as Ghost **Posts** (not Staff/Authors) to allow flexible biographical layouts and dedicated section assignment.

### Guidelines for Editors:
1. **Title**: Member's Name.
2. **Feature Image**: Member's portrait (displayed inside an archival polaroid card).
3. **Custom Excerpt**: Designation / Role (e.g., *Senior Scientist & Conservation Biologist*).
4. **Post Body**: Full bio, institutional history, research interests.
5. **Tags**: Tag with `#team-[section]` **only**. No generic `#team` tag is required.
6. **Homepage Featuring**: Toggle **"Feature this post"** to **ON** to feature the member on the homepage under "Advisory board and Institutional collaborations".

### Dynamic Section Generation:
- Standard sections exist for `#team-governing`, `#team-research`, `#team-advisory`, and `#team-collaborators`.
- Any other `#team-[slug]` tag (e.g., `#team-ground-staff`, `#team-field-assistants`, `#team-fellows`) is dynamically queried via `{{#get "tags"}}`. The theme creates a dedicated section on the About page and auto-formats the slug into Title Case.
- In `post.hbs`, `#has tag="#team..."` detects team posts and applies the polaroid two-column profile layout.

---

## 4. Publications Architecture (Academic vs. Non-Academic)

The previous unified publication template has been replaced by two specialized archives:

1. **Academic Archive (`/academic/`)**:
   - Template: `custom-academic.hbs`
   - Query: `tags:[hash-academic,academic,hash-publication]`
   - Features: Real-time search by author, title, or citation; PDF modal viewer.
2. **Non-Academic Archive (`/non-academic/`)**:
   - Template: `custom-non-academic.hbs`
   - Query: `tags:[hash-non-academic,hash-nonacademic,non-academic,nonacademic]`
   - Features: Real-time search; links to external press and reports.
3. **Homepage Publications Section**:
   - Query: `tags:[hash-academic,hash-non-academic,hash-publication,academic,non-academic]+featured:true` (limit 3).

---

## 5. Navigation & Hierarchy Model

### Primary Navigation (Header):
- Configured in Ghost Admin (**Settings > Navigation > Primary Navigation**).
- **Submenus**: Submenu items are prefixed with `- ` (hyphen space).
- The theme's navigation parser transforms `- ` children into clean dropdown menus on desktop and collapsible touch accordions on mobile.

### Secondary Navigation (Footer Quick Links):
- Configured in Ghost Admin (**Settings > Navigation > Secondary Navigation**).
- When populated, it dynamically renders the "Quick Links" column in the footer.
- When left unconfigured, `partials/site-footer.hbs` renders default fallback links.

---

## 6. Modular Dynamic Page Sections

Pages can include modular appended sections without template code changes.
- In `partials/dynamic-sections.hbs`, the theme runs:
  ```handlebars
  {{#get "pages" filter="tag:hash-{{slug}}-section" order="published_at asc"}}
  ```
- Any Ghost Page tagged with `#hash-[slug]-section` is automatically loaded into the bottom of the parent page matching that slug.

---

## 7. Interactive Map & Structured Data Tradeoffs

- **Species Lists**: Use standard Ghost markdown/definition blocks or post content with bold taxonomy attributes.
- **Interactive Geo Map**: Uses JSON coordinates in `assets/js/map.js` for habitat markers to ensure pixel-perfect positioning and prevent accidental corruption during content editing.

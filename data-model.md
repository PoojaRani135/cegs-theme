# CEGS Theme Data Architecture

This document defines how Ghost's native content model maps to the CEGS theme requirements.

## 1. Internal Tags / Content Categories

To drive the theme, posts should be tagged with specific internal (or public) tags. Using internal tags (starting with `#`) keeps the tags from cluttering the public UI while remaining fully functional for theme routing and filtering.

- `#research-project` -> For active or completed research initiatives.
- `#team-governing` -> For governing body members.
- `#team-research` -> For core research team members.
- `#team-advisory` -> For advisory board members.
- `#team-ground-staff` -> For field and ground staff.
- `#team-collaborator` -> For institutional or independent collaborators.
- `#academic` -> For peer-reviewed papers, scientific articles, and academic publications.
- `#non-academic` -> For popular articles, news, media, outreach, and non-academic publications.
- `#publication` -> Legacy tag for publications (supported for backward compatibility).
- `#species` -> For plant species being cultivated.
- `#gallery-landscape` -> Photos focused on habitats and ecosystems.
- `#gallery-wildlife` -> Photos focused on fauna.
- `#gallery-fieldwork` -> Photos showing the team in action.
- `#resource-book` -> For physical or digital book references.
- `#resource-guide` -> For manuals, field guides, or instructional materials.

## 2. Ghost Native Field Mapping

The CEGS template relies heavily on the standard Ghost fields to populate custom UI cards and layouts. 

| Ghost Field | Theme Mapping | Notes |
| :--- | :--- | :--- |
| **Title** (`title`) | Main heading / Name | Used for person names, project titles, publication titles, etc. |
| **Feature Image** (`feature_image`) | Card Image / Profile Picture | Required for gallery posts and team members. Rendered lazily where appropriate. |
| **Custom Excerpt** (`custom_excerpt`) | Card Summary / Role / Subtitle | Often used as the "Role" for a team member, or a brief abstract for a publication. |
| **Primary Tag** (`primary_tag`) | Category Badge / Taxonomy | Displayed as a label on research/publication cards. |
| **Authors** (`authors`) | Byline / Investigators | Used on research projects and publications to denote who was involved. |
| **Content** (`content`) | Body / Bio / Full Details | The main WYSIWYG editor content. |

## 3. Design Tradeoffs & Complex Data Structures

While Ghost is excellent for article-based content, it lacks native structured custom fields for complex data sets (e.g., repeating key-value pairs for species taxonomy, or explicit grid ordering for a board of directors).

### The Tradeoff: Native Pages vs. JSON Configs

**Option A: Native Pages (Chosen for Content Autonomy)**
*How it works*: Creating a Ghost `Page` for "Advisory Board" and relying on the author to construct a grid manually using Ghost's HTML card blocks or image grids.
*Pros*: Non-technical editors can update it directly from the Ghost Admin without writing code.
*Cons*: Less design control. Formatting could break easily if the editor makes a mistake.

**Option B: Lightweight JSON Config (Chosen for Strict Design Control)**
*How it works*: Creating a `data/board.json` file in the theme, and using Handlebars to loop over it.
*Pros*: Perfect design consistency, precise ordering, guarantees all required fields exist.
*Cons*: Requires a developer or theme redeployment to update the board members.

**Our Approach**: We use Ghost's `Posts` combined with the `#team-*` tags as a hybrid solution. This allows editors to use standard Ghost tools (Title = Name, Excerpt = Role) while the theme enforces the strict CSS Grid layout via `{{#get}}` queries. Where explicit ordering is absolutely necessary, we can rely on post published dates to sort the cards.

### Special Formats: Structured Species Lists
For nursery species where taxonomy matters (Family, Genus, Species, Local Name), we instruct editors to use a **Markdown block** or **HTML block** in the Ghost editor using a predefined definition list (`<dl>`) structure, or simply leverage the body content with bolded key names, as Ghost doesn't support native Advanced Custom Fields.

### Special Formats: Interactive Map Hotspots
The interactive Eastern Ghats map requires precise X/Y coordinate bindings and specific icon assignments (e.g. leaf vs creature) which are extremely fragile to edit within a Ghost post excerpt. For this specific structured-geo-data case, we use a JSON configuration object in `assets/js/map-data.js`. This guarantees pixel-perfect layout and prevents a content editor from accidentally breaking the map by mistyping coordinates.

## 4. Case Story Convention (Homepage)

The homepage features a "Case for the Eastern Ghats" preview section driven by the page with slug `home-case`.

**Instructions for Editors:**
When editing the "The Case for the Eastern Ghats" page in Ghost Admin, standard text content will be parsed as the excerpt for the homepage preview card. Detailed layout formatting is not required for the homepage preview, but will be visible when clicking through to the full page.

## 5. Team Members & Homepage Featuring

Team members are created as Ghost **Posts** (with their portrait as the Feature Image, their role in the Custom Excerpt, and their bio in the post content).

- **Homepage Display**: Team members only appear on the homepage when **"Feature this post"** is toggled ON in Ghost Admin.
- If no team member posts are featured, the homepage section cleanly hides itself.

## 6. Dynamic Team Sections (Automatic)

The theme automatically creates sections for any `#team-*` tag!

**How it works:**
1. In Ghost Admin, tag a team member post with only `#team-[something]` (e.g., `#team-advisory`, `#team-collaborators`, `#team-ground-staff`, `#team-fellows`). You do NOT need to add `#team`.
2. The About page ([custom-about.hbs](file:///c:/ghost-blog/content/themes/cegs-theme/custom-about.hbs)) dynamically fetches any new `#team-*` tag, creates a new team group, formats the title (e.g., `#team-ground-staff` becomes **Ground Staff**), and displays all posts with that tag.
3. If you toggle **"Feature this post"** ON, it also automatically appears on the homepage under the team section.




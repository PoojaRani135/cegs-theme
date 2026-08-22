# CEGS Ghost Theme

A custom Ghost theme built for the Centre for Eastern Ghats Studies (CEGS). Designed for "Editorial Clarity" with a mobile-first, accessible, and performant foundation.

## File Structure
- `default.hbs` - The base layout used by all pages.
- `index.hbs` - The default post feed layout.
- `home.hbs` - Custom homepage template with Hero slider and featured sections.
- `post.hbs` - Individual research project and standard post template.
- `page.hbs` - Standard page template.
- `author.hbs` - Team member profile template.
- `custom-*.hbs` - Custom templates for About, Research, Nursery, Publications, Gallery, Resources, Opportunities, and Contact.
- `partials/` - Reusable components (header, footer, cards).
- `assets/` - CSS (`screen.css`, `components.css`, `post.css`) and JS (`main.js`).

## Installation
1. Zip the `cegs-theme` folder.
2. In your Ghost Admin panel, go to **Settings > Design**.
3. Under the **Themes** section, click **Upload a theme** and select the zip file.
4. Activate the theme.

## Content Management Guidance
- **Pages**: Create static pages via the Pages section in Ghost Admin. For special pages (e.g., About, Gallery, Contact), set the Page Template to the corresponding Custom template via the page settings sidebar.
- **Posts (Research & Publications)**: Add research projects and publications as Posts. Use tags like `research`, `publication`, `resource`, `nursery-species` to ensure they appear in the correct sections.
- **Team**: Add team members as Staff (Authors) in Ghost Admin to populate the Team section and individual profiles.
- **Gallery**: Add gallery posts with a featured image and the `gallery` tag. The theme automatically uses the featured image in the lightbox gallery.
- **Forms**: The Contact and Opportunities templates use HTML forms pointing to a placeholder `formspree.io` endpoint. Update the `action` attribute in `custom-contact.hbs` and `custom-opportunities.hbs` with your actual form handler URL.

## Development & Testing
To validate the theme locally:
```bash
npx gscan .
```

Ensure that you have set the necessary basic Ghost SEO and social settings within the Ghost Admin.

## Known Limitations
- Social Media links in the footer are currently placeholders and must be updated either via Ghost Admin (if supported) or by editing `partials/site-footer.hbs`.
- The Hero Slider currently uses static placeholder images. To make this dynamic, you can implement a custom `{{#get "posts"}}` loop in `home.hbs`.

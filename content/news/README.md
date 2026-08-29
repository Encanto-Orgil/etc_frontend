# Site news articles (SEO)

Markdown drafts for the **Dashboard → Site → News** editor.

Each file includes YAML frontmatter with fields that match `SiteNewsArticle`:

| Field | Dashboard field |
|-------|-----------------|
| `title` | Title |
| `slug` | Auto-generated on save (or set manually) |
| `category` | Category |
| `excerpt` | Excerpt (also used as meta description on `/news/[slug]`) |
| `image` | Cover image path |
| `published_at` | Published date |
| `is_featured` | Featured toggle |

**Body:** Copy the markdown section below the frontmatter into your editor. The dashboard uses a rich-text (HTML) editor — paste markdown and convert to HTML, or reformat headings/lists in the editor.

**Internal links:** Each article links to `/office`, `/mall`, `/ballroom`, `/residence`, or `/` where relevant for SEO.

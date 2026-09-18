# Blog content

Each JSON file is one post in the `blog` Astro content collection. Its filename is
the stable URL slug: `example.json` is served at `/blog/example`.

All three archives (`/blog-grid`, `/blog-list`, `/blog-standard`) call
`getBlogPosts()` from `src/data/blog.ts`, and each article uses
`src/layouts/BlogSingleLayout.astro`. The view selector links between those archives
and works without JavaScript. Desktop and mobile navigation share one Blog link.

To add a post, copy a JSON entry, choose a unique filename, and edit its content.
Fields are validated in `src/content.config.ts`:

- `title`, `excerpt`, `date`, `category`, `author`, and `image`: listing metadata.
- `order`: display order shared by all views (lowest first).
- `wideImage`, `detailImage`, `sidebarImage`: optional images for different layouts.
- `intro`, `sections`, `gallery`, optional `quote` and `conclusion`: article content.
- `tags` and optional `comments`: article metadata and existing template comments.
- `aliases`: previous slugs that redirect to this entry. Keep these when renaming.

Images retain the template's existing WebP assets and CSS crops.

## Migration inventory

The template contained 15 distinct titles: eight in the blog data, three additional
sidebar titles, and four additional homepage titles. Repeated titles across layouts
are now one entry. The modern interior design post combines the content from
blog-single and blog-details, including their images, quote, and template comments.
The existing generated article text for the other seven blog-data titles is retained.

The three sidebar-only titles had no article bodies; their titles are preserved as
the initial excerpt and intro. The four homepage-only titles retain their existing
teasers as their intro. These seven entries need editorial expansion before they
can be considered complete articles. No additional article copy was invented.

`/blog-single` and `/blog-details` redirect to the modern interior design article.
Its previous duplicate slugs ending in `-2`, `-3`, and `-4` also redirect there.
Homepage links now point to the article matching their displayed title.

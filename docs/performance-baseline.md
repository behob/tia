# Production performance baseline

Captured 22 September 2026 against `https://tiadecors.com`, before the blog-image and mobile-homepage changes in this batch were deployed.

## Method

- `npm run audit:performance` using the repository's Playwright Chromium.
- Mobile/touch emulation at 390 × 844 CSS pixels, device scale factor 1.
- Three cold browser contexts per URL; table values are medians.
- No CPU or network throttling. LCP and CLS use browser Performance APIs; blocking time sums the portion of observed long tasks over 50 ms.
- This is a repeatable lab diagnostic. It does not provide 75th-percentile field LCP, INP or CLS.

## Results

| URL                                               |  TTFB |    FCP |    LCP | CLS | Long-task blocking | Resources |  Transfer |
| ------------------------------------------------- | ----: | -----: | -----: | --: | -----------------: | --------: | --------: |
| `/`                                               | 83 ms | 332 ms | 348 ms |   0 |               0 ms |        58 | 1,640 KiB |
| `/blog/transforming-spaces-into-dream-dwellings/` | 47 ms | 164 ms | 184 ms |   0 |               0 ms |        17 | 1,085 KiB |
| `/contact`                                        | 49 ms | 148 ms | 176 ms |   0 |               0 ms |        17 | 1,119 KiB |

The dominant shared transfers were Font Awesome: `fa-regular-400.woff2` (350 KiB), `fa-solid-900.woff2` (297 KiB), `fa-brands-400.woff2` (103 KiB), plus `fontawesome.min.css` (87 KiB). The homepage also ships 58 resources and the built interaction audit records 11 legacy scripts totalling 481,645 bytes.

## Decisions and next measurements

1. Implemented locally on 23 September: built pages reference a 26-glyph Font Awesome subset. CSS plus four WOFF2 files total 7,526 bytes versus 1,623,793 bytes for the previously referenced CSS/families, a 99.54% local reduction. Desktop/mobile screenshots, interaction checks and a source-glyph audit pass; production remains unchanged until deployment.
2. Re-run this command after deployment. The current production numbers do not measure the Font Awesome subset, static mobile-homepage motion or new responsive blog images.
3. Add field monitoring or check CrUX/PageSpeed when enough traffic data exists. Lab blocking time is only a diagnostic proxy; it is not INP.

Google's current guidance defines good field performance as LCP at or below 2.5 seconds, INP at or below 200 ms and CLS at or below 0.1. See [Web Vitals](https://web.dev/articles/vitals).

# Production performance baseline

## PageSpeed Insights follow-up, 23 September 2026

The [production homepage report](https://pagespeed.web.dev/analysis/https-tiadecors-com/88222xwonk?form_factor=mobile) predates the local changes below. Lighthouse 13.5.0 used a single initial-load run with Slow 4G mobile throttling; the desktop run used custom throttling. Neither view had field data.

| Mode    | Performance | Accessibility | Best Practices | SEO |   FCP |   LCP |    TBT | CLS |
| ------- | ----------: | ------------: | -------------: | --: | ----: | ----: | -----: | --: |
| Mobile  |          81 |            92 |             96 | 100 | 2.0 s | 4.4 s |  30 ms |   0 |
| Desktop |          77 |            92 |            100 | 100 | 0.5 s | 1.2 s | 450 ms |   0 |

Mobile LCP was the first hero image. Lighthouse attributed 2,040 ms of its LCP to element render delay, while its resource load took 120 ms. It estimated 280 ms savings from render-blocking CSS and 40 ms from icon-font display. The desktop report found 2.1 s of main-thread work, including 757 ms script evaluation and 711 ms style/layout. Its longest task was attributed to the legacy jQuery stack. These are one-run diagnostics, not proof of the effect of any proposed change.

Locally, the icon subset now uses `font-display: swap`, and the noninitial hero image has low fetch priority. The homepage's icon-only service/team links have names, and decorative section labels are paragraphs rather than skipped heading levels. The full verification and release build pass. Production deployment was blocked by automatic approval review, so no after score or live improvement is claimed.

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

## Post-deployment comparison

Repeated on 23 September 2026 with the same mobile lab settings after the Font Awesome subset deployment.

| URL                                               |   LCP | CLS | Long-task blocking | Resources | Transfer | Transfer change |
| ------------------------------------------------- | ----: | --: | -----------------: | --------: | -------: | --------------: |
| `/`                                               | 192ms |   0 |                0ms |        58 |  810 KiB | -830 KiB (-51%) |
| `/blog/transforming-spaces-into-dream-dwellings/` | 204ms |   0 |                0ms |        17 |  271 KiB | -814 KiB (-75%) |
| `/contact`                                        | 172ms |   0 |                0ms |        17 |  289 KiB | -830 KiB (-74%) |

## Decisions and next measurements

1. The 26-glyph Font Awesome subset is deployed and accounts for the dominant measured transfer reduction. Keep the source-glyph audit when adding icons.
2. The remaining largest known frontend cost is the homepage's 11 legacy scripts totalling 481,645 bytes; change them only with route-specific visual and interaction verification.
3. Add field monitoring or check CrUX/PageSpeed when enough traffic data exists. Lab blocking time is only a diagnostic proxy; it is not INP.

Google's current guidance defines good field performance as LCP at or below 2.5 seconds, INP at or below 200 ms and CLS at or below 0.1. See [Web Vitals](https://web.dev/articles/vitals).

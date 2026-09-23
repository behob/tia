# Production performance baseline

## PageSpeed Insights follow-up, 23 September 2026

The [production homepage report](https://pagespeed.web.dev/analysis/https-tiadecors-com/88222xwonk?form_factor=mobile) predates the local changes below. Lighthouse 13.5.0 used a single initial-load run with Slow 4G mobile throttling; the desktop run used custom throttling. Neither view had field data.

| Mode    | Performance | Accessibility | Best Practices | SEO |   FCP |   LCP |    TBT | CLS |
| ------- | ----------: | ------------: | -------------: | --: | ----: | ----: | -----: | --: |
| Mobile  |          81 |            92 |             96 | 100 | 2.0 s | 4.4 s |  30 ms |   0 |
| Desktop |          77 |            92 |            100 | 100 | 0.5 s | 1.2 s | 450 ms |   0 |

Mobile LCP was the first hero image. Lighthouse attributed 2,040 ms of its LCP to element render delay, while its resource load took 120 ms. It estimated 280 ms savings from render-blocking CSS and 40 ms from icon-font display. The desktop report found 2.1 s of main-thread work, including 757 ms script evaluation and 711 ms style/layout. Its longest task was attributed to the legacy jQuery stack. These are one-run diagnostics, not proof of the effect of any proposed change.

The icon subset uses `font-display: swap`, and the noninitial hero image has low fetch priority. The homepage's icon-only service/team links have names, and decorative section labels are paragraphs rather than skipped heading levels. The full verification and release build passed. These changes were subsequently committed; the live follow-up report below was generated after that commit.

## Mobile follow-up report, 23 September 2026

The owner's [later production report](https://pagespeed.web.dev/analysis/https-tiadecors-com/wi0a75qx4p?form_factor=mobile) records 93 performance, 97 accessibility, 96 Best Practices, and 100 SEO. Its mobile lab metrics are 1.5 s FCP, 3.2 s LCP, 20 ms TBT, and zero CLS. The desktop view scored 100 performance. This is another single run with no field data, so the score change is not a controlled measurement of the previous changes.

The mobile LCP element remains the first hero image. Its insight shows 420 ms resource load delay, 80 ms load duration, and 240 ms render delay. Lighthouse estimated 450 ms for render-blocking requests, including `swiper.min.css` (5.2 KiB), and 94 KiB for image delivery. The largest image opportunity is the below-fold `about-img-1` WebP (86.1 KiB transferred in that run).

The next local revision defers the homepage Swiper CSS while keeping first-slide layout in the critical stylesheet. It also requests quality 60 for `about-img-1`: the generated 809 px WebP falls from 88,148 to 58,134 bytes. Build and browser interaction checks pass; the production score for this revision remains unmeasured.

## Mobile report after the Swiper CSS and image changes, 23 September 2026

The owner's [new production report](https://pagespeed.web.dev/analysis/https-tiadecors-com/hmli0f91v3?form_factor=mobile) scores 83 performance, 97 accessibility, 96 Best Practices and 100 SEO. Mobile FCP is 1.5 s, LCP 4.5 s, TBT 30 ms and CLS zero. A [repeat run](https://pagespeed.web.dev/analysis/https-tiadecors-com/tf0nklej7e?form_factor=mobile) scored 82, with 2.0 s FCP, 4.2 s LCP, zero TBT and zero CLS. Both are single lab runs without CrUX field data. The earlier 93 score was also one run, so these results do not isolate the effect of the committed changes.

The first hero image remains the LCP element. Its reported render delay is 1,180 ms in the owner's report and 1,990 ms in the repeat; image load delay/duration are 50/50 ms and 150/150 ms respectively. The image-delivery opportunity fell from 94 KiB in the previous report to 31 KiB, and `swiper.min.css` no longer appears among render-blocking styles. The remaining reported render-blocking styles are the Astro layout CSS, Bootstrap and brand fonts. This points to paint timing rather than image transfer as the next area to investigate, but the report does not prove which operation causes the delay.

A local follow-up lets the first mobile hero image decode and receive a paint opportunity before initializing Swiper's fade effect. The unthrottled, three-run local homepage audit measured 128 ms median LCP before and after this change; it cannot establish a Lighthouse score gain. The built interaction audit passes. Recheck throttled mobile LCP after publication before calling PERF-003 complete.

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

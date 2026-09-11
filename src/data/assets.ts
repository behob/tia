export interface StylesheetAsset {
  href: string;
  preload?: boolean;
  deferred?: boolean;
}

export interface ScriptAsset {
  src: string;
}

export const stylesheetAssets: readonly StylesheetAsset[] = [
  { href: '/assets/css/bootstrap.min.css', preload: true },
  { href: '/assets/css/swiper.min.css', preload: true },
  { href: '/assets/css/fontawesome.min.css', preload: true, deferred: true },
  { href: '/assets/css/venobox.min.css', deferred: true },
  { href: '/assets/css/odometer.min.css', deferred: true },
  { href: '/assets/css/nice-select.css', deferred: true },
  { href: '/assets/css/carouselTicker.css', deferred: true },
  { href: '/assets/css/animation.css', deferred: true },
  { href: '/assets/css/twentytwenty.min.css', deferred: true },
] as const;

export const legacyScriptAssets = [
  { src: '/assets/js/vendor/jquery-3.7.1.min.js' },
  { src: '/assets/js/vendor/bootstrap-bundle.js' },
  { src: '/assets/js/vendor/imagesloaded-pkgd.js' },
  { src: '/assets/js/vendor/waypoints.min.js' },
  { src: '/assets/js/vendor/venobox.min.js' },
  { src: '/assets/js/vendor/odometer.min.js' },
  { src: '/assets/js/vendor/meanmenu.js' },
  { src: '/assets/js/vendor/jquery.isotope.js' },
  { src: '/assets/js/vendor/swiper.min.js' },
  { src: '/assets/js/vendor/split-type.min.js' },
  { src: '/assets/js/vendor/gsap.min.js' },
  { src: '/assets/js/vendor/scroll-trigger.min.js' },
  { src: '/assets/js/vendor/scroll-smoother.js' },
  { src: '/assets/js/vendor/jquery.carouselTicker.js' },
  { src: '/assets/js/vendor/nice-select.js' },
  { src: '/assets/js/vendor/jquery.event.move.min.js' },
  { src: '/assets/js/vendor/jquery.twentytwenty.min.js' },
  { src: '/assets/js/slider.js' },
  { src: '/assets/js/banner-process.js' },
  { src: '/assets/js/contact.js' },
  { src: '/assets/js/main.min.js' },
] as const satisfies readonly ScriptAsset[];

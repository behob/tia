// Progressive enhancement: the first slide and heading render in HTML/CSS.
(() => {
  const element = document.querySelector('.antra-slider');
  if (!element || typeof Swiper === 'undefined') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.mainSlider = new Swiper(element, {
    speed: reduced ? 0 : 600,
    loop: false,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    grabCursor: true,
    autoplay: false,
    a11y: { enabled: true },
    keyboard: { enabled: true, onlyInViewport: true },
    pagination: { el: '.antra-swiper-pagination', clickable: true },
    navigation: { nextEl: '.slider-navigation .swiper-next', prevEl: '.slider-navigation .swiper-prev' },
  });
  element.closest('.slider-section')?.classList.add('slider-ready');
})();

import type { Sponsor } from './types';

export const sponsors = [
  { image: '/assets/img/sponsor/sponsor-1.webp', alt: '', width: 168, height: 58 },
  { image: '/assets/img/sponsor/sponsor-2.webp', alt: '', width: 192, height: 58 },
  { image: '/assets/img/sponsor/sponsor-3.webp', alt: '', width: 190, height: 58 },
  { image: '/assets/img/sponsor/sponsor-4.webp', alt: '', width: 182, height: 58 },
  { image: '/assets/img/sponsor/sponsor-5.webp', alt: '', width: 141, height: 58 },
  { image: '/assets/img/sponsor/sponsor-6.webp', alt: '', width: 197, height: 58 },
] as const satisfies readonly Sponsor[];

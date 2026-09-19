export const site = {
  name: 'TIA Interior',
  tagline: 'Architecture & Interior Design',
  phone: '+971 56 805 8711',
  phoneRaw: '+971568058711',
  email: 'info@tiadecors.com',
  address: 'SkyCourts, Wadi Al Safa 5, Dubai, UAE',
  socials: [
    {
      platform: 'facebook',
      href: 'https://www.facebook.com/tia.interior.dubai',
      icon: 'fab fa-facebook-f',
      label: 'Facebook',
    },
    {
      platform: 'instagram',
      href: 'https://www.instagram.com/tia.interior.dubai/',
      icon: 'fab fa-instagram',
      label: 'Instagram',
    },
    { platform: 'twitter', href: 'https://x.com/tiadecors', icon: 'fab fa-twitter', label: 'X' },
    {
      platform: 'youtube',
      href: 'https://www.youtube.com/@TIAInteriorDecorDesign',
      icon: 'fab fa-youtube',
      label: 'YouTube',
    },
    {
      platform: 'linkedin',
      href: 'https://linkedin.com/company/tia-interior-llc',
      icon: 'fab fa-linkedin-in',
      label: 'LinkedIn',
    },
  ],
  nav: {
    home: [
      { label: 'Apartments', href: '/spaces/apartments' },
      { label: 'Villas', href: '/spaces/villas' },
      { label: 'Retail Spaces', href: '/spaces/retail-spaces' },
      { label: 'Offices & Workspaces', href: '/spaces/offices-workspaces' },
      { label: 'Restaurants & Cafes', href: '/spaces/restaurants-cafes' },
      { label: 'Hotels & Resorts', href: '/spaces/hotels-resorts' },
      { label: 'Renovation & Makeovers', href: '/spaces/renovation-makeovers' },
      { label: 'Fit-Out & Custom Joinery', href: '/spaces/fit-out-custom-joinery' },
    ],
    services: [
      { label: 'Interior Design', href: '/service' },
      { label: 'Fit-Out & Execution', href: '/service-2' },
      { label: 'Custom Furnitures', href: '/service-3' },
    ],
    portfolio: [
      { label: 'Residential Projects', href: '/portfolio' },
      { label: 'Commercial Projects', href: '/portfolio-2' },
      { label: 'Hospitality Projects', href: '/portfolio-3' },
    ],
    pages: [
      { label: 'About Us', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Gallery', href: '/gallery-1' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  footer: {
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/service' },
      { label: 'Careers', href: '/contact' },
      { label: 'Our Team', href: '/team' },
      { label: 'Blog', href: '/blog-grid' },
      { label: 'Contact Us', href: '/contact' },
    ],
    projectLinks: [
      { label: 'Our Projects', href: '/portfolio' },
    ],
  },
  copyright: `© ${new Date().getFullYear()} TIA Interior. All Rights Reserved.`,
} as const;

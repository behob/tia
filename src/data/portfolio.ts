import type { PortfolioDetail, ProjectSummary } from './types';

export const residentialProjects = [
  { image: '/assets/img/project/project-img-1.webp', title: 'Luxury Skyline', category: 'Residential', year: '2025' },
  { image: '/assets/img/project/project-img-2.webp', title: 'Bohemian Rhapsody', category: 'Residential', year: '2025' },
  { image: '/assets/img/project/project-img-3.webp', title: 'Urban Oasis', category: 'Commercial', year: '2024' },
  { image: '/assets/img/project/project-img-4.webp', title: 'Serenity Suites', category: 'Hospitality', year: '2024' },
  { image: '/assets/img/project/project-img-5.webp', title: 'Modern Workspace', category: 'Commercial', year: '2023' },
  { image: '/assets/img/project/project-img-6.webp', title: 'Coastal Retreat', category: 'Residential', year: '2023' },
] as const satisfies readonly ProjectSummary[];

export const commercialProjects = [
  { image: '/assets/img/project/project-3.webp', title: 'Coastal Harmony Home', category: 'Residential' },
  { image: '/assets/img/project/project-4.webp', title: 'Coastal Harmony Home', category: 'Residential' },
  { image: '/assets/img/project/project-5.webp', title: 'Coastal Harmony Home', category: 'Residential' },
  { image: '/assets/img/project/project-6.webp', title: 'Coastal Harmony Home', category: 'Residential' },
  { image: '/assets/img/project/project-7.webp', title: 'Coastal Harmony Home', category: 'Residential' },
  { image: '/assets/img/project/project-8.webp', title: 'Coastal Harmony Home', category: 'Residential' },
] as const satisfies readonly ProjectSummary[];

export const hospitalityProjects = [
  { image: '/assets/img/project/project-1.webp', title: 'Coastal Harmony Home', category: 'Residential' },
  { image: '/assets/img/project/project-2.webp', title: 'Coastal Harmony Home', category: 'Residential' },
  { image: '/assets/img/project/project-4.webp', title: 'Coastal Harmony Home', category: 'Residential' },
  { image: '/assets/img/project/project-2.webp', title: 'Coastal Harmony Home', category: 'Residential' },
] as const satisfies readonly ProjectSummary[];

export const portfolioDetail = {
  title: 'Stylish Family Apartment',
  architect: 'TIA Interior Team',
  projectType: 'Interior Design',
  client: 'TIA Interior',
  terms: '6 months',
  strategy: 'Minimalistic',
  date: 'March 11, 2025',
  heroImage: '/assets/img/project/project-details-img-1.webp',
  description:
    'Considering the physical, mental, and emotional needs of people, interior designers use human-centered approaches to address how we live today. Creating novel approaches to promoting health, safety, and welfare, contemporary interiors are increasingly inspired by biophilia as a holistic approach to design.',
  features: [
    {
      title: 'Open Living Spaces',
      desc: 'Creating open-plan living areas to enhance the flow and connection between indoor and outdoor spaces.',
    },
    {
      title: 'Natural Materials',
      desc: 'Using reclaimed wood, stone, and natural fibers to evoke a sense of harmony with the surrounding environment.',
    },
    {
      title: 'Large Windows',
      desc: 'Installing floor-to-ceiling windows to maximize natural light and provide unobstructed views.',
    },
    {
      title: 'Outdoor Living',
      desc: 'Designing extensive outdoor areas, including a deck, pool, and garden, for relaxation and entertaining.',
    },
    {
      title: 'Modern Amenities',
      desc: 'Incorporating state-of-the-art kitchen appliances, smart home technology, and luxurious bathroom fixtures.',
    },
  ],
  roomSizes: [
    { size: '30m2', label: 'bedroom' },
    { size: '22m2', label: 'bathroom' },
    { size: '28m2', label: 'workspace' },
    { size: '15m2', label: 'kitchen area' },
  ],
  resultDescription:
    'Establishing multi-sensory experiences, we can design interiors that resonate across ages and demographics. These rooms and spaces connect us to nature as a proven way to inspire us, boost our productivity, and create greater well-being.',
} as const satisfies PortfolioDetail;

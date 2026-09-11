import { blogPosts } from './blog';
import { portfolioDetail } from './portfolio';
import { serviceFaqs, serviceNames } from './services';
import { site } from './site';

export type OgType = 'website' | 'article';

export interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: OgType;
  robots?: string;
  schemaType?: 'home' | 'about' | 'service' | 'portfolio' | 'blog' | 'article' | 'faq' | 'contact' | 'product' | 'utility';
}

interface ResolveMetaInput {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: OgType;
  robots?: string;
}

interface JsonLdInput {
  path: string;
  title: string;
  description: string;
  canonicalURL: string;
  ogImageURL: string;
}

export const defaultPageMeta = {
  title: `${site.name} - ${site.tagline}`,
  description: `${site.name} transforms your vision into beautifully crafted spaces. Luxury interior design and architecture studio based in Dubai, UAE.`,
  ogImage: '/assets/img/bg-img/slider-img-1.webp',
  ogType: 'website',
  robots: 'index, follow',
  schemaType: 'home',
} as const satisfies PageMeta;

export const routeMeta = {
  '/': {
    title: 'TIA Interior - Architecture & Interior Design',
    description:
      'TIA Interior - Luxury interior design and architecture studio in Dubai. Transform your vision into beautifully crafted spaces.',
    schemaType: 'home',
  },
  '/index-2': {
    title: 'Apartment Interior Design Dubai - TIA Interior',
    description: 'TIA Interior - Luxury apartment interior design in Dubai. Creating elegant, functional living spaces.',
    schemaType: 'service',
  },
  '/index-3': {
    title: 'Villa Interior Design Dubai - TIA Interior',
    description: 'TIA Interior - Premium villa interior design in Dubai. Crafting timeless and inspiring residential spaces.',
    schemaType: 'service',
  },
  '/index-4': {
    title: 'Retail Interior Design Dubai - TIA Interior',
    description: 'TIA Interior - Innovative retail space design in Dubai. Elevating customer experiences through design.',
    schemaType: 'service',
  },
  '/index-5': {
    title: 'Office Interior Design Dubai - TIA Interior',
    description: 'TIA Interior - Modern office and workspace design in Dubai. Productive, inspiring work environments.',
    schemaType: 'service',
  },
  '/index-6': {
    title: 'Restaurant Interior Design Dubai - TIA Interior',
    description: 'TIA Interior - Restaurant and cafe interior design in Dubai. Creating memorable dining experiences.',
    schemaType: 'service',
  },
  '/index-7': {
    title: 'Hotel Interior Design Dubai - TIA Interior',
    description: 'TIA Interior - Luxury hotel and resort interior design in Dubai. Unforgettable hospitality spaces.',
    schemaType: 'service',
  },
  '/index-8': {
    title: 'Renovation and Makeovers Dubai - TIA Interior',
    description:
      'TIA Interior - Renovation and makeover services in Dubai. Transform your existing space into something extraordinary.',
    schemaType: 'service',
  },
  '/index-9': {
    title: 'Fit-Out and Custom Joinery Dubai - TIA Interior',
    description:
      'TIA Interior - Custom fit-out and joinery solutions in Dubai. Precision craftsmanship for luxury interiors.',
    schemaType: 'service',
  },
  '/about': {
    title: 'About Us - TIA Interior',
    description:
      'Learn about TIA Interior, a luxury interior design and architecture studio based in Dubai with over 26 years of experience.',
    schemaType: 'about',
  },
  '/service': {
    title: 'Services - TIA Interior',
    description:
      'Explore our comprehensive interior design services including residential, commercial, and hospitality design.',
    schemaType: 'service',
  },
  '/service-2': {
    title: 'Fit-Out & Execution - TIA Interior',
    description: 'Our fit-out and execution services bring your interior design vision to life with precision.',
    schemaType: 'service',
  },
  '/service-3': {
    title: 'Custom Furniture - TIA Interior',
    description: 'Custom furniture design and manufacturing for luxury interior spaces.',
    schemaType: 'service',
  },
  '/service-details': {
    title: 'Service Details - TIA Interior',
    description: 'Learn more about our comprehensive interior design services.',
    schemaType: 'service',
  },
  '/portfolio': {
    title: 'Our Projects - TIA Interior',
    description:
      'Explore our portfolio of luxury interior design projects across residential, commercial, and hospitality sectors in Dubai.',
    schemaType: 'portfolio',
  },
  '/portfolio-2': {
    title: 'Commercial Projects - TIA Interior',
    description: 'Explore our commercial interior design projects in Dubai.',
    schemaType: 'portfolio',
  },
  '/portfolio-3': {
    title: 'Hospitality Projects - TIA Interior',
    description: 'Explore our hospitality interior design projects in Dubai.',
    schemaType: 'portfolio',
  },
  '/portfolio-details': {
    title: 'Project Details - TIA Interior',
    description: 'Detailed view of our latest interior design project.',
    ogImage: portfolioDetail.heroImage,
    schemaType: 'portfolio',
  },
  '/blog-grid': {
    title: 'Blog - TIA Interior',
    description: 'Read the latest interior design tips, trends, and insights from TIA Interior.',
    schemaType: 'blog',
  },
  '/blog-list': {
    title: 'Blog List - TIA Interior',
    description: 'Read the latest interior design articles and insights.',
    schemaType: 'blog',
  },
  '/blog-standard': {
    title: 'Blog Standard - TIA Interior',
    description: 'Read our latest interior design articles and insights.',
    schemaType: 'blog',
  },
  '/blog-single': {
    title: 'Blog Single - TIA Interior',
    description: "Interior design insights and expert tips from TIA Interior's blog.",
    ogType: 'article',
    schemaType: 'article',
  },
  '/blog-details': {
    title: 'Blog Details - TIA Interior',
    description: 'Read the full article on modern interior design tips and trends.',
    ogType: 'article',
    schemaType: 'article',
  },
  '/contact': {
    title: 'Contact Us - TIA Interior',
    description: "Get in touch with TIA Interior. Let's discuss your next luxury interior design project in Dubai.",
    schemaType: 'contact',
  },
  '/faq': {
    title: 'FAQ - TIA Interior',
    description: 'Frequently asked questions about our interior design services.',
    schemaType: 'faq',
  },
  '/pricing': {
    title: 'Pricing Plans - TIA Interior',
    description: 'Explore our interior design pricing plans tailored to your project needs.',
    schemaType: 'service',
  },
  '/team': {
    title: 'Our Team - TIA Interior',
    description: "Meet the talented team behind TIA Interior's award-winning luxury design projects.",
    schemaType: 'about',
  },
  '/team-details': {
    title: 'Team Details - TIA Interior',
    description: 'Learn more about our team members and their expertise.',
    schemaType: 'about',
  },
  '/gallery-1': {
    title: 'Gallery - TIA Interior',
    description: 'Browse our gallery of stunning interior design projects.',
    schemaType: 'portfolio',
  },
  '/gallery-2': {
    title: 'Gallery Style 2 - TIA Interior',
    description: 'Browse our gallery of stunning interior design projects.',
    schemaType: 'portfolio',
  },
  '/shop': {
    title: 'Shop - TIA Interior',
    description: 'Browse our curated collection of furniture and decor.',
    schemaType: 'product',
  },
  '/shop-details': {
    title: 'Shop Details - TIA Interior',
    description: 'Product details for our curated furniture collection.',
    schemaType: 'product',
  },
  '/coming-soon': {
    title: 'Coming Soon - TIA Interior',
    description: 'We are working on something amazing. Stay tuned!',
    robots: 'noindex, nofollow',
    schemaType: 'utility',
  },
  '/error-page': {
    title: 'Page Not Found - TIA Interior',
    description: 'The page you are looking for could not be found.',
    robots: 'noindex, nofollow',
    schemaType: 'utility',
  },
} as const satisfies Record<string, PageMeta>;

export function normalizePath(pathname: string): keyof typeof routeMeta | string {
  const pathnameWithoutSlash = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return pathnameWithoutSlash || '/';
}

export function resolvePageMeta(pathname: string, input: ResolveMetaInput = {}) {
  const path = normalizePath(pathname);
  const registeredMeta = Object.prototype.hasOwnProperty.call(routeMeta, path) ? routeMeta[path as keyof typeof routeMeta] : {};
  const definedInput = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));

  return {
    ...defaultPageMeta,
    ...registeredMeta,
    ...definedInput,
  };
}

export function createSiteJsonLd(siteUrl: string) {
  const socialUrls = site.socials.map((s) => s.href).filter((url) => url !== '#');

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: site.name,
      url: siteUrl,
      logo: new URL('/assets/img/logo/logo-2.webp', siteUrl).href,
      email: site.email,
      telephone: site.phoneRaw,
      sameAs: socialUrls,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: site.name,
      publisher: { '@id': `${siteUrl}#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}#local-business`,
      name: site.name,
      description: site.tagline,
      url: siteUrl,
      telephone: site.phoneRaw,
      email: site.email,
      image: new URL('/assets/img/bg-img/slider-img-1.webp', siteUrl).href,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'SkyCourts, Wadi Al Safa 5',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.0797,
        longitude: 55.1409,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      sameAs: socialUrls,
    },
  ];
}

export function createPageJsonLd(meta: PageMeta, input: JsonLdInput) {
  const siteUrl = new URL('/', input.canonicalURL).href;
  const path = normalizePath(input.path);
  const page = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${input.canonicalURL}#webpage`,
    url: input.canonicalURL,
    name: input.title,
    description: input.description,
    image: input.ogImageURL,
    isPartOf: { '@id': `${siteUrl}#website` },
    about: { '@id': `${siteUrl}#local-business` },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      ...(path === '/'
        ? []
        : [
            {
              '@type': 'ListItem',
              position: 2,
              name: input.title.replace(` - ${site.name}`, ''),
              item: input.canonicalURL,
            },
          ]),
    ],
  };

  const schemaType = meta.schemaType ?? 'home';
  const extras: unknown[] = [];

  if (schemaType === 'service') {
    extras.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: input.title.replace(` - ${site.name}`, ''),
      description: input.description,
      provider: { '@id': `${siteUrl}#local-business` },
      areaServed: {
        '@type': 'City',
        name: 'Dubai',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Interior design services',
        itemListElement: serviceNames.map((name) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name,
          },
        })),
      },
    });
  }

  if (schemaType === 'faq') {
    extras.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: serviceFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  if (schemaType === 'article') {
    const post = blogPosts[0];
    extras.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post?.title ?? input.title,
      description: input.description,
      image: input.ogImageURL,
      author: {
        '@type': 'Organization',
        name: site.name,
      },
      publisher: { '@id': `${siteUrl}#organization` },
      mainEntityOfPage: input.canonicalURL,
    });
  }

  if (schemaType === 'portfolio') {
    extras.push({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: path === '/portfolio-details' ? portfolioDetail.title : input.title.replace(` - ${site.name}`, ''),
      description: path === '/portfolio-details' ? portfolioDetail.description : input.description,
      image: input.ogImageURL,
      creator: { '@id': `${siteUrl}#organization` },
    });
  }

  return [page, breadcrumb, ...extras];
}

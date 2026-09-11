import { blogListPosts, blogPosts, blogStandardPosts } from './blog';
import { commercialProjects, hospitalityProjects, residentialProjects } from './portfolio';
import { teamDetail, teamMembers } from './team';
import type { BlogDetailPage, BlogPost, PortfolioDetailPage, ProjectSummary, TeamDetail, TeamMember } from './types';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function uniqueSlug(title: string, used: Map<string, number>) {
  const base = slugify(title);
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);

  return count === 0 ? base : `${base}-${count + 1}`;
}

const blogSourcePosts = [...blogPosts, ...blogListPosts, ...blogStandardPosts] as readonly BlogPost[];
const blogSlugCounts = new Map<string, number>();

const blogAngles = [
  {
    sectionTitle: 'Plan the Room Before Choosing Finishes',
    sectionBody:
      'A strong interior starts with circulation, furniture scale, and the daily routines of the people using the room. Once those decisions are clear, finishes and styling choices become easier to select and easier to maintain.',
    secondSectionTitle: 'Balance Storage, Light, and Texture',
    secondSectionBody:
      'Built-in storage, layered lighting, and tactile materials help a space feel calm without becoming plain. The goal is to make every visible element useful, beautiful, and proportionate to the room.',
  },
  {
    sectionTitle: 'Create Zones That Support Real Living',
    sectionBody:
      'Modern homes work best when each zone has a clear purpose. Seating, work, dining, and display areas should feel connected while still giving the family enough flexibility for everyday life.',
    secondSectionTitle: 'Use Details to Add Character',
    secondSectionBody:
      'Wall treatments, custom joinery, lighting temperature, and carefully placed accents bring warmth to contemporary interiors. These details make the design feel tailored instead of generic.',
  },
  {
    sectionTitle: 'Prioritize Function Before Decoration',
    sectionBody:
      'A minimalist room succeeds when the practical decisions are handled first. Storage, movement, acoustics, and lighting should be resolved before the final styling layer is added.',
    secondSectionTitle: 'Keep the Palette Calm but Not Empty',
    secondSectionBody:
      'Minimal design does not mean bare design. Natural texture, soft contrast, and a small number of high-quality focal points can create a composed interior with long-term appeal.',
  },
];

export const blogDetailPages = blogSourcePosts.map((post, index) => {
  const angle = blogAngles[index % blogAngles.length];

  return {
    ...post,
    slug: uniqueSlug(post.title, blogSlugCounts),
    author: 'TIA Interior Team',
    detailImage: index % 2 === 0 ? '/assets/img/blog/blog-details-img.webp' : '/assets/img/blog/blog-details-img-1.webp',
    secondaryImage: index % 3 === 0 ? '/assets/img/blog/blog-details-img-2.webp' : '/assets/img/blog/post-inner-2.webp',
    intro: `${post.excerpt} This guide explains how TIA Interior approaches ${post.category.toLowerCase()} concepts with practical planning, refined materials, and a design process shaped for Dubai homes and modern UAE lifestyles.`,
    sectionTitle: angle.sectionTitle,
    sectionBody: angle.sectionBody,
    secondSectionTitle: angle.secondSectionTitle,
    secondSectionBody: angle.secondSectionBody,
    tags: ['Interior', post.category, index % 2 === 0 ? 'Dubai Design' : 'Modern Living'],
  };
}) satisfies BlogDetailPage[];

const portfolioSourceProjects = [
  ...residentialProjects.map((project) => ({ ...project, group: 'Residential' })),
  ...commercialProjects.map((project) => ({ ...project, group: 'Commercial' })),
  ...hospitalityProjects.map((project) => ({ ...project, group: 'Hospitality' })),
] as readonly (ProjectSummary & { group: string })[];
const portfolioSlugCounts = new Map<string, number>();

export const portfolioDetailPages = portfolioSourceProjects.map((project, index) => {
  const category = project.group || project.category;
  const year = project.year ?? `${2025 - (index % 3)}`;

  return {
    slug: uniqueSlug(`${project.title}-${category}`, portfolioSlugCounts),
    title: project.title,
    category,
    architect: 'TIA Interior Team',
    projectType: `${category} Interior Design`,
    client: `${category} Client`,
    terms: index % 2 === 0 ? '4 months' : '6 months',
    strategy: index % 3 === 0 ? 'Contemporary luxury' : index % 3 === 1 ? 'Functional elegance' : 'Warm minimalism',
    date: `March ${11 + index}, ${year}`,
    heroImage: project.image,
    seoDescription: `${project.title} is a ${category.toLowerCase()} interior design project in Dubai focused on planning, material harmony, and refined execution by TIA Interior.`,
    description: `The ${project.title} project focused on creating a ${category.toLowerCase()} environment with a clear design language, practical circulation, and finishes selected for long-term use in Dubai. The concept balances visual impact with comfort, durability, and a strong sense of place.`,
    features: [
      {
        title: 'Spatial Planning',
        desc: `The layout was organized to improve movement, sightlines, and daily usability for this ${category.toLowerCase()} setting.`,
      },
      {
        title: 'Material Direction',
        desc: 'Finishes were selected to balance warmth, durability, and a refined contemporary look.',
      },
      {
        title: 'Lighting Layers',
        desc: 'Ambient, task, and accent lighting were planned to support both function and atmosphere.',
      },
      {
        title: 'Custom Details',
        desc: 'Joinery, feature surfaces, and styling elements were tailored to the project brief.',
      },
      {
        title: 'Execution Focus',
        desc: 'The final result was coordinated around quality control, timeline clarity, and practical maintenance.',
      },
    ],
    roomSizes: [
      { size: `${24 + index}m2`, label: 'main area' },
      { size: `${16 + (index % 5)}m2`, label: 'feature zone' },
      { size: `${12 + (index % 4)}m2`, label: 'support space' },
      { size: `${10 + (index % 3)}m2`, label: 'entry area' },
    ],
    resultDescription: `The completed ${project.title} interior delivers a composed ${category.toLowerCase()} experience with improved usability, stronger visual identity, and details that support the client’s day-to-day needs.`,
  };
}) satisfies PortfolioDetailPage[];

const teamSlugCounts = new Map<string, number>();

const skillSets = [
  ['Concept Development', 'Material Coordination', 'Client Presentation'],
  ['Space Planning', 'Site Coordination', 'Detail Review'],
  ['3D Visualization', 'Finish Selection', 'Project Documentation'],
];

export const teamDetailPages = [...teamMembers, teamDetail].map((member: TeamMember | TeamDetail, index) => {
  const skills = skillSets[index % skillSets.length];

  return {
    ...member,
    slug: uniqueSlug(member.name, teamSlugCounts),
    bio:
      'bio' in member
        ? member.bio
        : `${member.name} contributes ${member.role.toLowerCase()} expertise to TIA Interior projects, helping translate client briefs into practical, elegant spaces with a clear design direction.`,
    professionalInfo:
      'professionalInfo' in member
        ? member.professionalInfo
        : `${member.name} works across concept refinement, technical coordination, and client communication. Their role supports the studio’s ability to deliver interiors that feel polished, functional, and responsive to each project brief.`,
    expertise:
      'expertise' in member
        ? member.expertise
        : [
            `${skills[0]} for residential and commercial interiors`,
            `${skills[1]} with contractors, suppliers, and internal design teams`,
            `${skills[2]} for clear decisions during project delivery`,
            'Quality review, design consistency, and practical implementation support',
          ],
    expertiseDescription:
      'expertiseDescription' in member
        ? member.expertiseDescription
        : `${member.name} combines design awareness with execution discipline, supporting TIA Interior clients from early ideas through detailed project coordination.`,
    skills:
      'skills' in member
        ? member.skills
        : [
            { title: skills[0], width: `${82 + (index % 10)}%` },
            { title: skills[1], width: `${78 + (index % 12)}%` },
            { title: skills[2], width: `${74 + (index % 14)}%` },
          ],
  };
}) satisfies TeamDetail[];

export function getBlogDetailBySlug(slug: string) {
  return blogDetailPages.find((post) => post.slug === slug);
}

export function getBlogHref(title: string) {
  return `/blog/${blogDetailPages.find((post) => post.title === title)?.slug ?? slugify(title)}`;
}

export function getPortfolioDetailBySlug(slug: string) {
  return portfolioDetailPages.find((project) => project.slug === slug);
}

export function getPortfolioHref(title: string, category?: string) {
  const project =
    portfolioDetailPages.find((item) => item.title === title && (!category || item.category === category)) ??
    portfolioDetailPages.find((item) => item.title === title);

  return `/portfolio/${project?.slug ?? slugify(title)}`;
}

export function getTeamDetailBySlug(slug: string) {
  return teamDetailPages.find((member) => member.slug === slug);
}

export function getTeamHref(name: string) {
  return `/team/${teamDetailPages.find((member) => member.name === name)?.slug ?? slugify(name)}`;
}

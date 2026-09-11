export type ImagePath = `/assets/img/${string}`;

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
  label: string;
}

export interface BlogPost {
  image: ImagePath;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  featured?: boolean;
}

export interface SidebarPost {
  image: ImagePath;
  title: string;
  date: string;
}

export interface SidebarPostSummary {
  img: ImagePath;
  title: string;
  date: string;
}

export interface BlogComment {
  author: string;
  image: ImagePath;
  date: string;
  text: string;
}

export interface ServiceCardData {
  icon: ImagePath;
  title: string;
  desc: string;
}

export interface ServiceListItem {
  num: string;
  title: string;
  image: ImagePath;
  desc: string;
  big?: boolean;
}

export interface ServiceFeature {
  icon: ImagePath;
  title: string;
  desc: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  open?: boolean;
}

export interface ProjectSummary {
  image: ImagePath;
  title: string;
  category: string;
  year?: string;
}

export interface PortfolioDetail {
  title: string;
  architect: string;
  projectType: string;
  client: string;
  terms: string;
  strategy: string;
  date: string;
  heroImage: ImagePath;
  description: string;
  features: readonly {
    title: string;
    desc: string;
  }[];
  roomSizes: readonly {
    size: string;
    label: string;
  }[];
  resultDescription: string;
}

export interface TeamMember {
  image: ImagePath;
  name: string;
  role: string;
}

export interface TeamDetail extends TeamMember {
  bio: string;
  professionalInfo: string;
  skills: readonly {
    title: string;
    width: `${number}%`;
  }[];
  expertise: readonly string[];
  expertiseDescription: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  desc: string;
}

export interface Sponsor {
  image: ImagePath;
  alt: string;
  width: number;
  height: number;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  image: ImagePath;
}

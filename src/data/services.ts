import type { FaqItem, ServiceCardData, ServiceFeature, ServiceListItem } from './types';

export const featureServices = [
  {
    icon: '/assets/img/service/feature-img-1.webp',
    title: 'Residential Interior Design',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    icon: '/assets/img/service/feature-img-2.webp',
    title: 'Commercial Interior Design',
    desc: 'Creating functional and aesthetically pleasing workspaces that boost productivity and reflect brand identity.',
  },
  {
    icon: '/assets/img/service/feature-img-3.webp',
    title: 'Interior Design Consultation',
    desc: 'Expert advice and guidance to help you make informed decisions about your space.',
  },
  {
    icon: '/assets/img/service/feature-img-4.webp',
    title: 'Outdoor & Landscape Design',
    desc: 'Beautiful outdoor spaces that extend your living area and connect with nature.',
  },
] as const satisfies readonly ServiceCardData[];

export const iconServices = [
  {
    icon: '/assets/img/icon/service-icon-1.webp',
    title: 'Architectural Design',
    desc: 'Dream it, we will design it! From big picture layouts to the tiniest details, our architectural magic brings your ideas to life.',
  },
  {
    icon: '/assets/img/icon/service-icon-2.webp',
    title: 'Interior Design & Planning',
    desc: 'We create beautiful, functional interiors that reflect your personality and lifestyle.',
  },
  {
    icon: '/assets/img/icon/service-icon-3.webp',
    title: 'Consulting Services',
    desc: 'Expert guidance to help you make the right design decisions for your space.',
  },
  {
    icon: '/assets/img/icon/service-icon-4.webp',
    title: 'Project Management',
    desc: 'We oversee every aspect of your project to ensure timely and budget-friendly delivery.',
  },
] as const satisfies readonly ServiceCardData[];

export const fitOutServices: readonly ServiceListItem[] = [
  {
    num: '01',
    title: 'Residential Interior Design',
    image: '/assets/img/service/service-img-1.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    num: '02',
    title: 'Renovation and Remodeling',
    image: '/assets/img/service/service-img-2.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
    big: true,
  },
  {
    num: '03',
    title: 'Commercial Interior Design',
    image: '/assets/img/service/service-img-3.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    num: '04',
    title: 'Interior Design Consultation',
    image: '/assets/img/service/service-img-4.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
    big: true,
  },
  {
    num: '05',
    title: 'Outdoor & Landscape Design',
    image: '/assets/img/service/service-img-5.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    num: '06',
    title: 'Renovation and Remodeling',
    image: '/assets/img/service/service-img-6.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
    big: true,
  },
] as const;

export const customFurnitureServices: readonly ServiceListItem[] = [
  {
    num: '01',
    title: 'Residential Interior Design',
    image: '/assets/img/service/service-img-1.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    num: '02',
    title: 'Commercial Interior Design',
    image: '/assets/img/service/service-img-2.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    num: '03',
    title: 'Interior Design Consultation',
    image: '/assets/img/service/service-img-3.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    num: '04',
    title: 'Outdoor & Landscape Design',
    image: '/assets/img/service/service-img-4.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    num: '05',
    title: 'Renovation and Remodeling',
    image: '/assets/img/service/service-img-5.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
  {
    num: '06',
    title: 'Interior 2D/3D Layouts',
    image: '/assets/img/service/service-img-6.webp',
    desc: 'Tailored design services for private homes, including room makeovers and complete home transformations.',
  },
] as const;

export const serviceNames = [
  'Residential Interior Design',
  'Commercial Interior Design',
  'Interior Design Consultation',
  'Outdoor & Landscape Design',
  'Renovation and Remodeling',
  'Interior 2D/3D Layouts',
] as const satisfies readonly string[];

export const serviceDetailsFeatures = [
  {
    icon: '/assets/img/icon/service-details-1.webp',
    title: 'Space Optimization',
    desc: 'Through the best smart space optimization interior design.',
  },
  {
    icon: '/assets/img/icon/service-details-2.webp',
    title: 'Flexible Layouts',
    desc: 'Through the best smart space optimization interior design.',
  },
  {
    icon: '/assets/img/icon/service-details-3.webp',
    title: 'Smart Technology',
    desc: 'Through the best smart space optimization interior design.',
  },
  {
    icon: '/assets/img/icon/service-details-4.webp',
    title: 'Cost Efficiency',
    desc: 'Through the best smart space optimization interior design.',
  },
] as const satisfies readonly ServiceFeature[];

export const serviceFaqs: readonly FaqItem[] = [
  {
    id: 'One',
    question: 'What interior design services do you offer?',
    answer:
      'Our interior design services cover everything you need to create a stunning and functional space. From initial concept development and space planning to selecting color schemes, furniture, and custom designs, we bring your vision to life.',
    open: true,
  },
  {
    id: 'Two',
    question: 'What services do you offer?',
    answer:
      'Our interior design services cover everything you need to create a stunning and functional space. From initial concept development and space planning to selecting color schemes, furniture, and custom designs, we bring your vision to life.',
  },
  {
    id: 'Three',
    question: 'What is your design process?',
    answer:
      'Our interior design services cover everything you need to create a stunning and functional space. From initial concept development and space planning to selecting color schemes, furniture, and custom designs, we bring your vision to life.',
  },
  {
    id: 'Four',
    question: 'Can I create custom design?',
    answer:
      'Our interior design services cover everything you need to create a stunning and functional space. From initial concept development and space planning to selecting color schemes, furniture, and custom designs, we bring your vision to life.',
  },
] as const;

import { getCollection } from 'astro:content';
import type { FaqItem, ServiceCardData, ServiceFeature, ServiceListItem } from './types';
const entries = (await getCollection('services')).sort((a,b) => a.data.order-b.data.order);
const list = (group:string) => entries.filter(p => p.data.group === group).map(p => p.data);
export const featureServices = list('featureServices') as ServiceCardData[];
export const iconServices = list('iconServices') as ServiceCardData[];
export const fitOutServices = list('fitOutServices') as ServiceListItem[];
export const customFurnitureServices = list('customFurnitureServices') as ServiceListItem[];
export const serviceDetailsFeatures = list('serviceDetailsFeatures') as ServiceFeature[];
export const serviceNames = [...new Set(customFurnitureServices.map(p => p.title))];
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

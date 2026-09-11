import type { PricingPlan } from './types';

export const pricingPlans = [
  {
    name: 'Basic Plan',
    price: '$99.0',
    desc: 'Our foundation plan offers essential features at an affordable price, without breaking the bank.',
  },
  {
    name: 'Premium Plan',
    price: '$199.0',
    desc: 'Our foundation plan offers essential features at an affordable price, without breaking the bank.',
  },
] as const satisfies readonly PricingPlan[];

export const pricingFeatures = [
  'Individuals & small projects',
  'Access to design features',
  'Limited library of decorative items',
  'Email support',
  'Monthly updates',
] as const satisfies readonly string[];

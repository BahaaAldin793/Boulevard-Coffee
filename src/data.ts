import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'سادة فاتح',
    roastLevel: 'فاتح',
    type: 'سادة',
    image: '/WhatsApp Image 2025-10-21 at 23.45.43_96c89c1f.jpg',
    basePrice: 50
  },
  {
    id: '2',
    name: 'سادة وسط',
    roastLevel: 'وسط',
    type: 'سادة',
    image: '/WhatsApp Image 2025-10-21 at 23.45.43_96c89c1f.jpg',
    basePrice: 50
  },
  {
    id: '3',
    name: 'سادة غامق',
    roastLevel: 'غامق',
    type: 'سادة',
    image: '/WhatsApp Image 2025-10-21 at 23.45.43_96c89c1f.jpg',
    basePrice: 50
  },
  {
    id: '4',
    name: 'محوج فاتح',
    roastLevel: 'فاتح',
    type: 'محوج',
    image: '/WhatsApp Image 2025-10-21 at 23.45.43_96c89c1f.jpg',
    basePrice: 55
  },
  {
    id: '5',
    name: 'محوج وسط',
    roastLevel: 'وسط',
    type: 'محوج',
    image: '/WhatsApp Image 2025-10-21 at 23.45.43_96c89c1f.jpg',
    basePrice: 55
  },
  {
    id: '6',
    name: 'محوج غامق',
    roastLevel: 'غامق',
    type: 'محوج',
    image: '/WhatsApp Image 2025-10-21 at 23.45.43_96c89c1f.jpg',
    basePrice: 55
  }
];

export const weightMultipliers: Record<string, number> = {
  '100 جم': 1,
  'ربع كيلو': 2.5,
  'نصف كيلو': 5,
  'كيلو': 10
};

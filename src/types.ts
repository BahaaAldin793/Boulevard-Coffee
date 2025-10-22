export type RoastLevel = 'فاتح' | 'وسط' | 'غامق';
export type CoffeeType = 'سادة' | 'محوج';
export type Weight = '100 جم' | 'ربع كيلو' | 'نصف كيلو' | 'كيلو';

export interface Product {
  id: string;
  name: string;
  roastLevel: RoastLevel;
  type: CoffeeType;
  image: string;
  basePrice: number;
}

export interface CartItem {
  product: Product;
  weight: Weight;
  quantity: number;
  price: number;
}

export interface CheckoutForm {
  name: string;
  address: string;
  phone: string;
}

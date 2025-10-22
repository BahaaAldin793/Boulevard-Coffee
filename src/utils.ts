import { CartItem, CheckoutForm, Weight } from './types';
import { weightMultipliers } from './data';

export const calculatePrice = (basePrice: number, weight: Weight): number => {
  return basePrice * weightMultipliers[weight];
};

export const getTotalPrice = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const saveCartToLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem('boulevardCart', JSON.stringify(cart));
};

export const loadCartFromLocalStorage = (): CartItem[] => {
  const saved = localStorage.getItem('boulevardCart');
  return saved ? JSON.parse(saved) : [];
};

export const sendOrderToGoogleSheet = async (form: CheckoutForm, cart: CartItem[]) => {
  const orderData = {
    timestamp: new Date().toISOString(),
    customerName: form.name,
    address: form.address,
    phone: form.phone,
    items: cart.map(item => ({
      product: item.product.name,
      weight: item.weight,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    totalAmount: getTotalPrice(cart)
  };

  console.log('Order submitted:', orderData);

  return orderData;
};

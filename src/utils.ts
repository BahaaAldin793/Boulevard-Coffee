// src/utils.ts (الدالة sendOrderToGoogleSheet المعدلة)

import { CartItem, CheckoutForm, Weight } from './types';
import { weightMultipliers } from './data';
// هنستورد الدالة الجديدة من googleSheet.ts
import { sendOrderToSheet as postToGoogleSheet } from './googleSheet'; 

// باقي الدوال زي ما هي...
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

// الدالة دي هي اللي تعدلت عشان ترجع boolean
export const sendOrderToGoogleSheet = async (form: CheckoutForm, cart: CartItem[]): Promise<boolean> => { 
  // تجميع البيانات بنفس الشكل اللي Google Script مستنيه
  const orderData = {
    customerName: form.name, // متوافق مع السكريبت
    address: form.address,   // متوافق مع السكريبت
    phone: form.phone,       // متوافق مع السكريبت
    items: cart.map(item => ({
      product: item.product.name,
      weight: item.weight,
      quantity: item.quantity,
      price: item.price, // السكريبت مش بيستخدمها بس ممكن نسيبها
      total: item.price * item.quantity // السكريبت مش بيستخدمها
    })),
    // السكريبت مش بيستخدم الإجمالي ده، هو بيحسبه لوحده لو عايز
    // totalAmount: getTotalPrice(cart) 
  };

  console.log('Order Data Prepared:', orderData); // اطبع البيانات قبل الإرسال للتأكد

  // هنستدعي الدالة اللي في googleSheet.ts ونرجع الرد بتاعها (true أو false)
  return await postToGoogleSheet(orderData); 
};
import { CartItem, Weight } from './types'; // Removed CheckoutForm import as it's not needed here anymore
import { weightMultipliers } from './data';

// Function to calculate price based on weight
export const calculatePrice = (basePrice: number, weight: Weight): number => {
  // Ensure the weight exists in the multiplier object, default to 1 if not found
  const multiplier = weightMultipliers[weight] ?? 1;
  return basePrice * multiplier;
};

// Function to calculate the total price of the cart
export const getTotalPrice = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Function to save the cart state to local storage
export const saveCartToLocalStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem('boulevardCart', JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to local storage:", error);
    // Handle potential storage errors (e.g., storage full)
  }
};

// Function to load the cart state from local storage
export const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('boulevardCart');
    // Basic check to ensure saved data is an array
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading cart from local storage:", error);
    // Clear corrupted data if parsing fails
    localStorage.removeItem('boulevardCart');
  }
  return []; // Return empty array if nothing saved or error occurred
};

// No sendOrderToGoogleSheet function needed anymore

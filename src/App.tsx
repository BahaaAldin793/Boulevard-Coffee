import React, { useState, useEffect } from 'react'; // Added React import
import { ShoppingCart, Phone, Instagram, Facebook } from 'lucide-react';
import { Product, CartItem, Weight, CheckoutForm } from './types';
import { products } from './data';
// Remove Google Sheet import from utils
import { calculatePrice, getTotalPrice, saveCartToLocalStorage, loadCartFromLocalStorage } from './utils'; // Removed sendOrderToGoogleSheet

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    name: '',
    address: '',
    phone: ''
  });
  // State to manage submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load cart from local storage on initial render
  useEffect(() => {
    const savedCart = loadCartFromLocalStorage();
    setCart(savedCart);
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    saveCartToLocalStorage(cart);
  }, [cart]);

  // Function to add items to the cart
  const addToCart = (product: Product, weight: Weight, quantity: number) => {
    const price = calculatePrice(product.basePrice, weight);
    const existingItemIndex = cart.findIndex(
      item => item.product.id === product.id && item.weight === weight
    );

    if (existingItemIndex >= 0) {
      // If item exists, update quantity
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      setCart(newCart);
    } else {
      // If item is new, add it to the cart
      setCart([...cart, { product, weight, quantity, price }]);
    }
    // Optionally alert user
    // alert(`${product.name} (${weight}) added to cart!`);
  };

  // Function to remove items from the cart
  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Function to update item quantity in the cart
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is zero or less
      removeFromCart(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };

  // --- MODIFIED handleCheckout function for Netlify Forms ---
  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission which reloads the page
    if (cart.length === 0) {
      alert('السلة فارغة. الرجاء إضافة منتجات أولاً.');
      return;
    }
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Indicate submission start

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Append form name for Netlify
    formData.append('form-name', 'order-form');

    // Append cart details as a single JSON string field
    const cartDetails = cart.map(item => ({
      product: item.product.name,
      weight: item.weight,
      quantity: item.quantity,
      price: item.price
    }));
    // Use JSON.stringify with indentation for readability in Netlify dashboard
    formData.append('cart-details', JSON.stringify(cartDetails, null, 2));

    // Append total price
    formData.append('total-price', getTotalPrice(cart).toString() + ' ج.م');

    try {
      // Post the form data to Netlify (submitting to the same path '/')
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(), // Encode form data
      });

      // If submission to Netlify is successful (fetch doesn't throw)
      alert('✅ تم استلام طلبك بنجاح! سنتواصل معك قريباً');
      // Clear cart and form
      setCart([]);
      setCheckoutForm({ name: '', address: '', phone: '' });
      setShowCart(false); // Close cart modal

    } catch (error) {
      // If there was an error submitting to Netlify
      console.error("Error submitting form to Netlify:", error);
      alert("⚠️ حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false); // Indicate submission end
    }
  };
  // --- END of MODIFIED handleCheckout function ---


  // Function to scroll smoothly to a section
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- JSX structure ---
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#D4A574] font-['Cairo']"> {/* Added dir and font */}
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-[#3B2F2F] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand Name */}
            <div className="flex items-center gap-3">
              <img
                src="/WhatsApp Image 2025-10-21 at 23.45.42_483bfdca.jpg" // Ensure this image path is correct in your public folder
                alt="Boulevard Coffee Logo"
                className="h-12 w-12 object-contain rounded-full" // Added rounded-full
              />
              <span className="text-[#C49A6C] text-xl font-bold">بن بوليفارد</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 text-white items-center">
              <button onClick={() => scrollToSection('home')} className="hover:text-[#C49A6C] transition">الرئيسية</button>
              <button onClick={() => scrollToSection('products')} className="hover:text-[#C49A6C] transition">منتجاتنا</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-[#C49A6C] transition">من نحن</button>
              <button onClick={() => setShowCart(!showCart)} className="hover:text-[#C49A6C] transition flex items-center gap-2 relative px-2 py-1">
                <ShoppingCart className="w-5 h-5" />
                السلة
                {/* Cart item count badge */}
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-[#C49A6C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-[#C49A6C] transition">تواصل معنا</button>
            </nav>

            {/* Mobile Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="md:hidden text-white relative p-2"
            >
              <ShoppingCart className="w-6 h-6" />
              {/* Cart item count badge */}
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C49A6C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[70vh] flex items-center justify-center text-center px-4 py-16 md:py-20 bg-cover bg-center " style={{ backgroundImage: "url('/HeroBackground.jpg')" }}> {/* Placeholder background */}
         <div className="absolute inset-0 bg-white opacity-30 backdrop-blur-sm"></div> {/* Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <img
            src="/WhatsApp Image 2025-10-21 at 23.45.42_483bfdca.jpg" // Ensure this image path is correct
            alt="Boulevard Coffee"
            className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-6 object-contain rounded-full shadow-lg" // Added rounded-full & shadow
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-md"> {/* White text for contrast */}
            بن بوليفارد
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-8 leading-relaxed drop-shadow-sm"> {/* Lighter text */}
            استمتع بمذاق القهوة الأصيلة من بن بوليفارد
          </p>
          <button
            onClick={() => scrollToSection('products')}
            className="bg-[#C49A6C] hover:bg-[#B8895A] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-lg md:text-xl font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            تسوق الآن
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#3B2F2F] mb-12">منتجاتنا</h2>
          {/* Responsive product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-20 px-4 bg-[#3B2F2F] text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#C49A6C] mb-8">من نحن</h2>
          <p className="text-lg md:text-xl leading-relaxed">
            بن بوليفارد يقدم لك أفضل أنواع البن المحمص بعناية ليمنحك تجربة قهوة لا تُنسى، بمذاقات تناسب جميع الأذواق.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3B2F2F] mb-12">تواصل معنا</h2>
          <div className="flex flex-col items-center gap-6">
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/201069847640"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1FAD53] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-lg md:text-xl font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Phone className="w-5 h-5 md:w-6 md:h-6" />
              تواصل عبر واتساب
            </a>
            {/* Social Media Icons */}
            <div className="flex gap-6 mt-4">
              <a href="#" aria-label="Instagram" className="text-[#3B2F2F] hover:text-[#C49A6C] transition">
                <Instagram className="w-7 h-7 md:w-8 md:h-8" />
              </a>
              <a href="#" aria-label="Facebook" className="text-[#3B2F2F] hover:text-[#C49A6C] transition">
                <Facebook className="w-7 h-7 md:w-8 md:h-8" />
              </a>
              {/* Add more social links as needed */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#3B2F2F] text-white py-6 text-center">
        <p className="text-base md:text-lg">
          © {new Date().getFullYear()} Boulevard Coffee - جميع الحقوق محفوظة
        </p>
      </footer>


      {/* Cart Modal / Side Panel */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
          {/* Cart Content */}
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Cart Header */}
            <div className="sticky top-0 bg-[#3B2F2F] text-white p-5 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold">السلة</h2>
              <button onClick={() => setShowCart(false)} className="text-3xl hover:text-[#C49A6C] transition-colors">&times;</button>
            </div>

            {/* Cart Body */}
            <div className="p-5 md:p-6 overflow-y-auto flex-grow">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 text-lg md:text-xl py-10">السلة فارغة</p>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={`${item.product.id}-${item.weight}-${index}`} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md shadow-sm" />
                        <div className="flex-1">
                          <h3 className="font-bold text-base md:text-lg text-[#3B2F2F]">{item.product.name}</h3>
                          <p className="text-gray-600 text-sm md:text-base">الوزن: {item.weight}</p>
                          <p className="text-[#C49A6C] font-semibold text-sm md:text-base">{item.price * item.quantity} ج.م</p>
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 w-7 h-7 md:w-8 md:h-8 rounded text-lg font-bold flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-base md:text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 w-7 h-7 md:w-8 md:h-8 rounded text-lg font-bold flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(index)}
                          title="إزالة المنتج"
                          className="text-red-500 hover:text-red-700 text-xl font-bold ml-2 transition-colors"
                        >
                          &times; {/* Using times symbol for remove */}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Cart Total */}
                  <div className="bg-[#F5E6D3] p-4 rounded-lg mb-6 sticky bottom-0">
                    <div className="flex justify-between text-lg md:text-xl font-bold text-[#3B2F2F]">
                      <span>الإجمالي:</span>
                      <span>{getTotalPrice(cart)} ج.م</span>
                    </div>
                  </div>

                  {/* Checkout Form (Netlify Enabled) */}
                  <form
                    name="order-form"        // Form name for Netlify
                    data-netlify="true"     // Enable Netlify Forms
                    onSubmit={handleCheckout} // Use the modified submission handler
                    className="space-y-4"
                  >
                    {/* Hidden input required by Netlify */}
                    <input type="hidden" name="form-name" value="order-form" />

                    {/* Customer Info Fields */}
                    <div>
                      <label htmlFor="name-input" className="block text-[#3B2F2F] font-semibold mb-2">الاسم</label>
                      <input
                        id="name-input"
                        type="text"
                        name="name" // Name attribute for Netlify
                        required
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C49A6C] transition-colors"
                        placeholder="اسمك الكامل"
                      />
                    </div>
                    <div>
                      <label htmlFor="address-input" className="block text-[#3B2F2F] font-semibold mb-2">العنوان</label>
                      <input
                        id="address-input"
                        type="text"
                        name="address" // Name attribute for Netlify
                        required
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C49A6C] transition-colors"
                        placeholder="عنوان التوصيل بالتفصيل"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone-input" className="block text-[#3B2F2F] font-semibold mb-2">رقم الهاتف</label>
                      <input
                        id="phone-input"
                        type="tel"
                        name="phone" // Name attribute for Netlify
                        required
                        pattern="[0-9]{11}" // Basic validation for Egyptian phone numbers
                        title="من فضلك أدخل رقم هاتف مصري صحيح (11 رقم)"
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C49A6C] transition-colors"
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                    {/* Payment Info */}
                    <p className="text-center text-gray-600 text-sm pt-2">الدفع عند الاستلام فقط</p>
                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting} // Disable button during submission
                      className={`w-full bg-[#C49A6C] hover:bg-[#B8895A] text-white py-3 md:py-4 rounded-lg text-lg md:text-xl font-semibold transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'إتمام الطلب'}
                    </button>
                  </form>
                  {/* End of Netlify Form */}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// --- ProductCard Component ---
// This component displays individual product information and allows adding to cart
function ProductCard({ product, onAddToCart }: {
  product: Product;
  onAddToCart: (product: Product, weight: Weight, quantity: number) => void;
}) {
  const [selectedWeight, setSelectedWeight] = useState<Weight>('100 جم');
  const [quantity, setQuantity] = useState(1);
  const weights: Weight[] = ['100 جم', 'ربع كيلو', 'نصف كيلو', 'كيلو'];

  // Calculate price based on selected weight
  const price = calculatePrice(product.basePrice, selectedWeight);

  // Handler for adding the product to the cart
  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight, quantity);
    // Optional: Show a confirmation message
    // alert(`${product.name} (${selectedWeight}) تمت إضافته للسلة!`);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300 flex flex-col">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 sm:h-56 md:h-64 object-cover" // Responsive height
      />
      {/* Product Details */}
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-bold text-[#3B2F2F] mb-3">{product.name}</h3>

        {/* Weight Selection */}
        <div className="mb-4">
          <label htmlFor={`weight-${product.id}`} className="block text-gray-700 font-semibold mb-1 text-sm">الوزن</label>
          <select
            id={`weight-${product.id}`}
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value as Weight)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C49A6C] transition-colors"
          >
            {weights.map(weight => (
              <option key={weight} value={weight}>{weight}</option>
            ))}
          </select>
        </div>

        {/* Quantity Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1 text-sm">الكمية</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="text-lg font-bold w-10 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Price Display */}
        <div className="flex justify-between items-center mt-auto pt-4"> {/* Pushes price and button down */}
          <span className="text-xl md:text-2xl font-bold text-[#C49A6C]">{price} ج.م</span>
        </div>

         {/* Add to Cart Button */}
         <button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-[#3B2F2F] hover:bg-[#2D2323] text-white py-2.5 rounded-lg font-semibold transition-colors duration-300"
          >
            أضف إلى السلة
          </button>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { ShoppingCart, Phone, Instagram, Facebook } from 'lucide-react';
import { Product, CartItem, Weight, CheckoutForm } from './types';
import { products } from './data';
import { calculatePrice, getTotalPrice, saveCartToLocalStorage, loadCartFromLocalStorage, sendOrderToGoogleSheet } from './utils';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    name: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    const savedCart = loadCartFromLocalStorage();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    saveCartToLocalStorage(cart);
  }, [cart]);

  const addToCart = (product: Product, weight: Weight, quantity: number) => {
    const price = calculatePrice(product.basePrice, weight);
    const existingItemIndex = cart.findIndex(
      item => item.product.id === product.id && item.weight === weight
    );

    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { product, weight, quantity, price }]);
    }
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('السلة فارغة');
      return;
    }

    await sendOrderToGoogleSheet(checkoutForm, cart);
    alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
    setCart([]);
    setCheckoutForm({ name: '', address: '', phone: '' });
    setShowCart(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#D4A574]">
      <header className="sticky top-0 z-50 bg-[#3B2F2F] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/WhatsApp Image 2025-10-21 at 23.45.42_483bfdca.jpg"
                alt="Boulevard Coffee Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="text-[#C49A6C] text-xl font-bold">بن بوليفارد</span>
            </div>

            <nav className="hidden md:flex gap-6 text-white">
              <button onClick={() => scrollToSection('home')} className="hover:text-[#C49A6C] transition">الرئيسية</button>
              <button onClick={() => scrollToSection('products')} className="hover:text-[#C49A6C] transition">منتجاتنا</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-[#C49A6C] transition">من نحن</button>
              <button onClick={() => setShowCart(!showCart)} className="hover:text-[#C49A6C] transition flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                السلة
                {cart.length > 0 && (
                  <span className="bg-[#C49A6C] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-[#C49A6C] transition">تواصل معنا</button>
            </nav>

            <button
              onClick={() => setShowCart(!showCart)}
              className="md:hidden text-white relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C49A6C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section id="home" className="relative min-h-[80vh] flex items-center justify-center text-center px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <img
            src="/WhatsApp Image 2025-10-21 at 23.45.42_483bfdca.jpg"
            alt="Boulevard Coffee"
            className="w-48 h-48 mx-auto mb-8 object-contain"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-[#3B2F2F] mb-6">
            بن بوليفارد
          </h1>
          <p className="text-2xl md:text-3xl text-[#5D4E37] mb-8 leading-relaxed">
            استمتع بمذاق القهوة الأصيلة من بن بوليفارد
          </p>
          <button
            onClick={() => scrollToSection('products')}
            className="bg-[#C49A6C] hover:bg-[#B8895A] text-white px-8 py-4 rounded-lg text-xl font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            تسوق الآن
          </button>
        </div>
      </section>

      <section id="products" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#3B2F2F] mb-12">منتجاتنا</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-[#3B2F2F]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-[#C49A6C] mb-8">من نحن</h2>
          <p className="text-xl text-white leading-relaxed">
            بن بوليفارد يقدم لك أفضل أنواع البن المحمص بعناية ليمنحك تجربة قهوة لا تُنسى، بمذاقات تناسب جميع الأذواق.
          </p>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-[#3B2F2F] mb-8">تواصل معنا</h2>
          <div className="flex flex-col items-center gap-6">
            <a
              href="https://wa.me/201069847640"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1FAD53] text-white px-8 py-4 rounded-lg text-xl font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Phone className="w-6 h-6" />
              تواصل عبر واتساب
            </a>
            <div className="flex gap-6">
              <a href="#" className="text-[#3B2F2F] hover:text-[#C49A6C] transition">
                <Instagram className="w-8 h-8" />
              </a>
              <a href="#" className="text-[#3B2F2F] hover:text-[#C49A6C] transition">
                <Facebook className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#3B2F2F] text-white py-8 text-center">
        <p className="text-lg">
          © 2025 Boulevard Coffee - جميع الحقوق محفوظة
        </p>
      </footer>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#3B2F2F] text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">السلة</h2>
              <button onClick={() => setShowCart(false)} className="text-3xl hover:text-[#C49A6C]">×</button>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 text-xl py-8">السلة فارغة</p>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 border-b pb-4">
                        <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-bold text-[#3B2F2F]">{item.product.name}</h3>
                          <p className="text-gray-600">الوزن: {item.weight}</p>
                          <p className="text-[#C49A6C] font-semibold">{item.price * item.quantity} ج.م</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700 text-xl font-bold"
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#F5E6D3] p-4 rounded-lg mb-6">
                    <div className="flex justify-between text-xl font-bold text-[#3B2F2F]">
                      <span>الإجمالي:</span>
                      <span>{getTotalPrice(cart)} ج.م</span>
                    </div>
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                      <label className="block text-[#3B2F2F] font-semibold mb-2">الاسم</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#3B2F2F] font-semibold mb-2">العنوان</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#3B2F2F] font-semibold mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        required
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                      />
                    </div>
                    <p className="text-center text-gray-600 text-sm">الدفع عند الاستلام فقط</p>
                    <button
                      type="submit"
                      className="w-full bg-[#C49A6C] hover:bg-[#B8895A] text-white py-4 rounded-lg text-xl font-semibold transition"
                    >
                      إتمام الطلب
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart }: {
  product: Product;
  onAddToCart: (product: Product, weight: Weight, quantity: number) => void;
}) {
  const [selectedWeight, setSelectedWeight] = useState<Weight>('100 جم');
  const [quantity, setQuantity] = useState(1);
  const weights: Weight[] = ['100 جم', 'ربع كيلو', 'نصف كيلو', 'كيلو'];

  const price = calculatePrice(product.basePrice, selectedWeight);

  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight, quantity);
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-[#3B2F2F] mb-4">{product.name}</h3>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">الوزن</label>
          <select
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value as Weight)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
          >
            {weights.map(weight => (
              <option key={weight} value={weight}>{weight}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">الكمية</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg text-xl font-bold"
            >
              -
            </button>
            <span className="text-xl font-bold w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-[#C49A6C]">{price} ج.م</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-[#3B2F2F] hover:bg-[#2D2323] text-white py-3 rounded-lg font-semibold transition"
        >
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
}

export default App;

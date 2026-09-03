// src/pages/cart/Cart.jsx
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import EmptyCart from './components/EmptyCart/EmptyCart';
import CartItem from './components/CartItem/CartItem';
import CartSummary from './components/CartSummary/CartSummary';

const Cart = () => {
  const cart = useSelector((state) => state.cart);

  // محاسبه مجموع
  const totalItems = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart.items]);

  const totalPrice = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart.items]);

  // اگر سبد خرید خالی است
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                سبد خرید
              </h1>
              <p className="text-sm">
                {totalItems} آیتم در سبد خرید
              </p>
            </div>
          </div>
        </div>

        {/* Cart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
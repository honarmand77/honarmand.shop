// src/pages/checkout/Checkout.jsx
import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { clearCart } from '../../features/cart/cartSlice';
import CheckoutForm from './components/CheckoutForm/CheckoutForm';
import CheckoutSummary from './components/CheckoutSummary/CheckoutSummary';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import CheckoutItem from './components/CheckoutItem/CheckoutItem';
const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // دریافت سبد خرید از Redux
  const cart = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // اگر کاربر لاگین است، اطلاعات رو پر کن
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.display_name?.split(' ')[0] || user.name?.split(' ')[0] || '',
        lastName: user.display_name?.split(' ').slice(1).join(' ') || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  // محاسبه مجموع
  const totalItems = useMemo(() => {
    return cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart.items]);

  const totalPrice = useMemo(() => {
    return cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  }, [cart.items]);

  // اگر سبد خرید خالی است، به صفحه سبد خرید برو
  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      navigate('/سبد-خرید');
    }
  }, [cart.items, navigate]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: ارسال به API وردپرس
      // const orderData = {
      //   payment_method: formData.paymentMethod === 'cod' ? 'cod' : 'bacs',
      //   billing: {
      //     first_name: formData.firstName,
      //     last_name: formData.lastName,
      //     email: formData.email,
      //     phone: formData.phone,
      //     address_1: formData.address,
      //     city: formData.city,
      //     postcode: formData.postalCode,
      //     country: 'IR'
      //   },
      //   line_items: cart.items.map(item => ({
      //     product_id: item.id,
      //     quantity: item.quantity
      //   }))
      // };
      
      // شبیه‌سازی موفقیت
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // پاک کردن سبد خرید
      dispatch(clearCart());
      
      // تنظیم شماره سفارش
      const randomOrder = Math.floor(Math.random() * 10000) + 1000;
      setOrderNumber(randomOrder.toString());
      setOrderCompleted(true);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // اگر سفارش با موفقیت ثبت شد
  if (orderCompleted) {
    return <OrderConfirmation orderNumber={orderNumber} />;
  }

  // اگر سبد خرید خالی است
  if (!cart.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>سبد خرید</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900 dark:text-white">تسویه حساب</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          تسویه حساب
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* فرم */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <CheckoutForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* خلاصه سفارش */}
          <div className="lg:col-span-5">
            <CheckoutSummary
              items={cart.items}
              totalPrice={totalPrice}
              totalItems={totalItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
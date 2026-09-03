// src/pages/Profile/Profile.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, MapPin } from 'lucide-react';

import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from '../../features/auth/authAPI';

import { updateUser, logout, selectAuth } from '../../features/auth/authSlice';

import TabButton from './components/TabButton/TabButton';
import ProfileHeader from './components/ProfileHeader/ProfileHeader';
import ProfileStats from './components/ProfileStats/ProfileStats';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';
import ProfileEditForm from './components/ProfileEditForm/ProfileEditForm';
import OrdersList from './components/OrdersList/OrdersList';
import WishlistList from './components/WishlistList/WishlistList';
import AddressList from './components/AddressList/AddressList';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: reduxUser, isAuthenticated, token } = useSelector(selectAuth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    email: '',
    phone: '',
  });

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [stats, setStats] = useState({
    ordersCount: 0,
    wishlistCount: 0,
    rating: '۰',
    discounts: '۰'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // ============================================
  // دریافت اطلاعات کاربر با RTK Query
  // ============================================
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !localStorage.getItem('auth_token'),
  });

  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  // ============================================
  // همگام‌سازی user با Redux
  // ============================================
  useEffect(() => {
    if (userData) {
      dispatch(updateUser(userData));
    }
  }, [userData, dispatch]);

  // ============================================
  // مدیریت خطای احراز هویت
  // ============================================
  useEffect(() => {
    if (isUserError && userError?.status === 401) {
      dispatch(logout());
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token_expiry');
      navigate('/ورود');
    }
  }, [isUserError, userError, dispatch, navigate]);

  // ============================================
  // بررسی توکن در ابتدا
  // ============================================
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    
    if (!authToken) {
      navigate('/ورود');
      return;
    }

    if (!isUserLoading && !dataLoaded) {
      fetchProfileData();
    }
  }, []);

  // ============================================
  // دریافت اطلاعات پروفایل
  // ============================================
  const fetchProfileData = useCallback(async () => {
    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
      navigate('/ورود');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // دریافت اطلاعات کاربر
      try {
        const userResponse = await fetch('https://api.honarmand.shop/wp-json/wp/v2/users/me', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userDataFromAPI = await userResponse.json();
          const userInfo = {
            id: userDataFromAPI.id,
            display_name: userDataFromAPI.name || userDataFromAPI.username || 'کاربر',
            email: userDataFromAPI.email || '',
            username: userDataFromAPI.username || '',
            phone: userDataFromAPI.phone || '',
          };
          dispatch(updateUser(userInfo));
          localStorage.setItem('user_data', JSON.stringify(userInfo));
        }
      } catch (userError) {
        console.warn('Could not fetch user data:', userError);
      }

      // دریافت سفارشات
      try {
        const ordersResponse = await fetch('https://api.honarmand.shop/wp-json/orders/v1/my-orders', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      } catch (orderError) {
        console.warn('Could not fetch orders:', orderError);
        setOrders([]);
      }

      // دریافت علاقه‌مندی‌ها
      try {
        const wishlistResponse = await fetch('https://api.honarmand.shop/wp-json/wishlist/v1/items', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json();
          setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        }
      } catch (wishlistError) {
        console.warn('Could not fetch wishlist:', wishlistError);
        setWishlist([]);
      }

      // دریافت آدرس‌ها
      try {
        const addressesResponse = await fetch('https://api.honarmand.shop/wp-json/addresses/v1', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (addressesResponse.ok) {
          const addressesData = await addressesResponse.json();
          setAddresses(Array.isArray(addressesData) ? addressesData : []);
        }
      } catch (addressError) {
        console.warn('Could not fetch addresses:', addressError);
        setAddresses([]);
      }

      setDataLoaded(true);
    } catch (error) {
      setError('خطا در دریافت اطلاعات پروفایل');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  // ============================================
  // تنظیم فرم ویرایش
  // ============================================
  useEffect(() => {
    const currentUser = reduxUser || userData;
    if (currentUser) {
      setEditForm({
        display_name: currentUser.display_name || currentUser.name || currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || currentUser.phone_number || '',
      });
    }
  }, [reduxUser, userData]);

  // ============================================
  // Tabs
  // ============================================
  const tabs = useMemo(() => [
    { id: 'profile', label: 'پروفایل', icon: User, count: 0 },
    { id: 'orders', label: 'سفارشات', icon: ShoppingBag, count: orders.length },
    { id: 'wishlist', label: 'علاقه‌مندی‌ها', icon: Heart, count: wishlist.length },
    { id: 'addresses', label: 'آدرس‌ها', icon: MapPin, count: addresses.length },
  ], [orders.length, wishlist.length, addresses.length]);

  // ============================================
  // خروج از حساب
  // ============================================
  const handleLogout = async () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
      try {
        await logoutMutation().unwrap();
        dispatch(logout());
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_expiry');
        localStorage.removeItem('user_data');
        navigate('/ورود');
      } catch (error) {
        console.error('Logout error:', error);
        dispatch(logout());
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_expiry');
        localStorage.removeItem('user_data');
        navigate('/ورود');
      }
    }
  };

  // ============================================
  // ویرایش پروفایل
  // ============================================
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async (data) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('https://api.honarmand.shop/wp-json/auth/v1/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (result) {
          dispatch(updateUser(result));
          await refetchUser();
        }
        setIsEditing(false);
        await fetchProfileData();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('خطا در بروزرسانی پروفایل');
    }
  };

  // ============================================
  // مدیریت آدرس‌ها
  // ============================================
  const handleAddAddress = async (addressData) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      await fetch('https://api.honarmand.shop/wp-json/addresses/v1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      await fetchProfileData();
    } catch (error) {
      console.error('Add address error:', error);
      alert('خطا در افزودن آدرس');
    }
  };

  const handleEditAddress = async (address) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      await fetch(`https://api.honarmand.shop/wp-json/addresses/v1/${address.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });
      await fetchProfileData();
    } catch (error) {
      console.error('Edit address error:', error);
      alert('خطا در بروزرسانی آدرس');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('آیا از حذف این آدرس مطمئن هستید؟')) return;

    try {
      const authToken = localStorage.getItem('auth_token');
      await fetch(`https://api.honarmand.shop/wp-json/addresses/v1/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchProfileData();
    } catch (error) {
      console.error('Delete address error:', error);
      alert('خطا در حذف آدرس');
    }
  };

  const handleRemoveWishlist = async (id) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      await fetch(`https://api.honarmand.shop/wp-json/wishlist/v1/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Remove wishlist error:', error);
      alert('خطا در حذف از علاقه‌مندی‌ها');
    }
  };

  // ============================================
  // RENDER
  // ============================================
  const currentUser = reduxUser || userData;
  const hasToken = !!localStorage.getItem('auth_token');

  if (isUserLoading && !dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full w-12 h-12 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  if (loading && !dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full w-12 h-12 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">در حال دریافت اطلاعات...</p>
        </div>
      </div>
    );
  }

  if (!hasToken) {
    return null;
  }

  if (isUserError && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">خطا در دریافت اطلاعات کاربر</p>
          <button
            onClick={() => refetchUser()}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchProfileData();
            }}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser && !isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">اطلاعات کاربر یافت نشد</p>
          <button
            onClick={() => navigate('/ورود')}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            ورود به حساب
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <ProfileHeader
              user={currentUser}
              onLogout={handleLogout}
              onEditToggle={handleEditToggle}
              isEditing={isEditing}
              isLoading={isLogoutLoading}
            />

            <ProfileStats
              ordersCount={stats.ordersCount}
              wishlistCount={stats.wishlistCount}
              rating={stats.rating}
              discounts={stats.discounts}
            />

            {isEditing ? (
              <ProfileEditForm
                initialData={editForm}
                onSave={handleSaveProfile}
                onCancel={handleEditToggle}
                isLoading={loading}
              />
            ) : (
              <ProfileInfo user={currentUser} registeredAt={currentUser?.registered_at} />
            )}
          </div>
        );

      case 'orders':
        return <OrdersList orders={orders} />;

      case 'wishlist':
        return <WishlistList items={wishlist} onRemove={handleRemoveWishlist} />;

      case 'addresses':
        return (
          <AddressList
            addresses={addresses}
            onAdd={handleAddAddress}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-lg shadow-xl p-6 md:p-8 border border-gray-200/50">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">پروفایل کاربر</h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200/50">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
              />
            ))}
          </div>

          <div className="min-h-[400px]">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
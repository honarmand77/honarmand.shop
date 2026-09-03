// src/pages/product/ProductDetail.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductByIdQuery } from '../../features/products/productsAPI';
import { addToCart, removeFromCart, updateQuantity } from '../../features/cart/cartSlice';
import { extractImageUrl, extractTitle, isValidImageUrl } from '../../utils/extractImage';
import ProductGallery from './components/ProductGallery/ProductGallery';
import ProductInfo from './components/ProductInfo/ProductInfo';
import ProductMeta from './components/ProductMeta/ProductMeta';
import RelatedProducts from './components/RelatedProducts/RelatedProducts';
import Navbar from '../../components/common/Navbar/navbar';
const ProductDetail = () => {
  const { id, slug } = useParams();
  const dispatch = useDispatch();
  
  const { items: cartItems } = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // دریافت محصول با شناسه
  const productId = id ? parseInt(id) : null;
  const { data: product, isLoading, error } = useGetProductByIdQuery(
    productId,
    { skip: !productId || isNaN(productId) }
  );

  // استخراج تصاویر
  const productImages = useMemo(() => {
    if (!product) return [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => img.src || img.url || img);
    }
    const image = extractImageUrl(product);
    if (image && isValidImageUrl(image)) {
      return [image];
    }
    return ['/placeholder-image.jpg'];
  }, [product]);

  const productData = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      name: extractTitle(product) || product.name || 'نام محصول',
      images: productImages,
      image: productImages[0] || '/placeholder-image.jpg',
      averageRating: parseFloat(product.average_rating) || 0,
      reviewCount: product.review_count || 0,
    };
  }, [product, productImages]);

  // وضعیت سبد خرید
  const isProductInCart = useMemo(() => {
    if (!product?.id) return false;
    return cartItems.some(item => String(item.id) === String(product.id));
  }, [cartItems, product?.id]);

  const productCartQuantity = useMemo(() => {
    if (!product?.id) return 0;
    const item = cartItems.find(item => String(item.id) === String(product.id));
    return item?.quantity || 0;
  }, [cartItems, product?.id]);

  // هندلرها
  const handleQuantityChange = (newQuantity) => {
    const maxStock = product?.stock_quantity || 9999;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        image: productImages[0] || null,
        quantity: quantity,
        slug: product.slug,
      }));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = () => {
    if (!product?.id) return;
    dispatch(removeFromCart(product.id));
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (!product?.id) return;
    dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
  };


  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">محصول یافت نشد</h2>
          <p className="text-gray-500 mb-4">متأسفیم، محصول مورد نظر شما در فروشگاه موجود نیست.</p>
          <Link to="/فروشگاه" className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  const isInStock = product.is_in_stock && product.is_purchasable;
  const stockText = product.stock_status === 'instock' ? 'موجود' : 'ناموجود';

  return (
    <div className="min-h-screen font-sans" dir="rtl">
    <Navbar/>
      <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-xs md:text-sm text-primary mb-4 bg-primary-foreground p-3 rounded-xl shadow-sm">
          <Link to="/" className="hover:text-red-500 transition">خانه</Link>
          <span className="text-primary mx-1">›</span>
          <Link to="/فروشگاه" className="hover:text-red-500 transition">فروشگاه</Link>
          {product.categories && product.categories.length > 0 && (
            <>
              <span className="text-primary mx-1">›</span>
              <Link to={`/دسته-بندی/${product.categories[0].slug}`} className="hover:text-red-500 transition">
                {product.categories[0].name}
              </Link>
            </>
          )}
          <span className="text-primary mx-1">›</span>
          <span className="text-primary font-semibold truncate max-w-[150px] sm:max-w-[300px]">{product.name}</span>
        </nav>

        {/* بخش گالری و اطلاعات */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="lg:col-span-5 rounded-2xl shadow-sm">
            <ProductGallery 
              images={productImages} 
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              productName={product.name}
            />
          </div>
          <div className="lg:col-span-7 bg-primary-foreground rounded-2xl shadow-sm p-3">
            <ProductInfo
              product={productData}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
              isInStock={isInStock}
              stockText={stockText}
              isInCart={isProductInCart}
              cartQuantity={productCartQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
        </div>

        {/* بخش متا */}
        <div className="bg-primary-foreground rounded-2xl shadow-sm overflow-hidden mb-4 md:mb-6">
          <ProductMeta 
            product={productData}
            reviews={[]}
            rating={{ average: productData.averageRating, count: productData.reviewCount }}
          />
        </div>

        {/* محصولات مرتبط */}
        <div className="bg-primary-foreground rounded-2xl shadow-sm p-4 md:p-6">
          <RelatedProducts 
            productId={product.id}
            product={product}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
// src/pages/product/components/ProductBreadcrumb.jsx
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ProductBreadcrumb = ({ product, categories }) => {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl shadow-sm">
      <Link to="/" className="hover:text-primary transition-colors">
        خانه
      </Link>
      <ChevronLeft className="w-3 h-3 text-gray-400" />
      
      <Link to="/فروشگاه" className="hover:text-primary transition-colors">
        فروشگاه
      </Link>
      
      {categories && categories.length > 0 && (
        <>
          <ChevronLeft className="w-3 h-3 text-gray-400" />
          <Link 
            to={`/دسته-بندی/${categories[0].slug}`} 
            className="hover:text-primary transition-colors"
          >
            {categories[0].name}
          </Link>
        </>
      )}
      
      <ChevronLeft className="w-3 h-3 text-gray-400" />
      <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[150px] sm:max-w-[300px]">
        {product?.name}
      </span>
    </nav>
  );
};

export default ProductBreadcrumb;
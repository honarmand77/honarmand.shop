// src/pages/page/Page.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPageBySlugQuery } from '../../features/pages/pagesAPI';
import { setCurrentPage, clearCurrentPage } from '../../features/pages/pagesSlice';
import { Calendar, User, Tag, ChevronLeft } from 'lucide-react';
import { extractImageUrl, isValidImageUrl } from '../../utils/extractImage';
import { OptimizedImage } from '../../components/ui/OptimizedImage/OptimizedImage';

const Page = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentPage } = useSelector((state) => state.pages);

  // ✅ دریافت صفحه از API با استفاده از RTK Query
  const { data: pageData, isLoading, error } = useGetPageBySlugQuery(slug, {
    skip: !slug,
  });

  // ✅ ذخیره صفحه در Redux
  useEffect(() => {
    if (pageData) {
      dispatch(setCurrentPage(pageData));
    }
    return () => {
      dispatch(clearCurrentPage());
    };
  }, [pageData, dispatch]);

  // ✅ استفاده از داده از Redux یا API
  const page = useMemo(() => {
    return pageData || currentPage || null;
  }, [pageData, currentPage]);

  // استخراج تصویر شاخص
  const featuredImage = useMemo(() => {
    if (page?.featured_image) {
      return page.featured_image;
    }
    // استخراج از محتوای صفحه
    const img = extractImageUrl(page);
    return img && isValidImageUrl(img) ? img : null;
  }, [page]);


  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh]">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            صفحه یافت نشد
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            متأسفیم، صفحه مورد نظر شما موجود نیست.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-primary hover:underline flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            بازگشت به خانه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">
          خانه
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-900 dark:text-white font-medium">
          {page.title}
        </span>
      </nav>

      {/* Page Content */}
      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Featured Image */}
        {featuredImage && (
          <div className="relative w-full h-64 md:h-96 overflow-hidden">
            <OptimizedImage
              src={featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                {page.title}
              </h1>
            </div>
          </div>
        )}

        {!featuredImage && (
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {page.title}
            </h1>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          {page.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(page.date).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {page.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              نویسنده
            </span>
          )}
          {page.tags && page.tags.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              {page.tags.join('، ')}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div 
            className="prose prose-base md:prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ 
              __html: page.content 
            }} 
          />
        </div>

        {/* Last Modified */}
        {page.modified && (
          <div className="px-6 md:px-8 pb-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
            <span>آخرین بروزرسانی: </span>
            {new Date(page.modified).toLocaleDateString('fa-IR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </article>

      {/* Back to Home */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:underline transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default Page;
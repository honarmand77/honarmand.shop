// pages/home/home.jsx - نسخه نهایی بدون خطا
import { lazy, Suspense, useEffect, useState } from 'react'
import { Navbar } from '../../components/common/Navbar/navbar'

// Lazy Loading
const HeroBanner = lazy(() => import('./components/HeroBanner/hero-banner'))
const CategorySection = lazy(() => import('./components/CategorySection/category-section'))
const PromoBanners = lazy(() => import('./components/PromoBanners/promo-banners'))
const FeaturedProducts = lazy(() => import('./components/FeaturedProducts/featured-products'))
const DealOfWeek = lazy(() => import('./components/DealOfWeek/deal-of-week'))
const DealsOfWeek = lazy(() => import('./components/DealsOfWeek/deals-of-week'))
const PopularBrands = lazy(() => import('./components/PopularBrands/popular-brands'))
const CollectionCards = lazy(() => import('./components/CollectionCards/collection-cards'))
const FeaturesBar = lazy(() => import('./components/FeaturesBar/features-bar'))

const SectionSkeleton = ({ height = '400px', className = '' }) => (
  <div className={`animate-pulse bg-primary-foreground rounded-lg ${className}`} style={{ height }} />
)

export default function Home() {

  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <HeroBanner />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <CategorySection />
      </Suspense>
        <>
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <PromoBanners />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <FeaturedProducts />
          </Suspense>
        </>
        <>
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <DealOfWeek />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <DealsOfWeek />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="250px" />}>
            <PopularBrands />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="200px" />}>
            <CollectionCards />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="150px" />}>
            <FeaturesBar />
          </Suspense>
        </>
    </div>
  )
}
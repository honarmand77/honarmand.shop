// src/components/home/HeroBanner/HeroBanner.jsx
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useGetSliderBannersQuery } from '../../../../features/banners/bannersAPI';
import { ArrowLeft, ChevronLeft, ChevronRight, PanelLeftOpen } from "lucide-react";
import './hero-banner.css';
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';
import { extractImageUrl, extractTitle, extractTextFromContent } from '../../../../utils/extractImage';

const NavButton = memo(({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute ${direction === 'left' ? 'left-2 md:left-4' : 'right-2 md:right-4'} 
      top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 md:p-2.5 
      text-gray-800 shadow-lg backdrop-blur-sm transition-all 
      hover:bg-white hover:scale-110 dark:bg-gray-800/80 dark:text-white 
      dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 z-20`}
  >
    {direction === 'left' ? <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />}
  </button>
));
NavButton.displayName = 'NavButton';

const DotsIndicator = memo(({ count, currentIndex, onSelect }) => (
  <div className="absolute bottom-3 md:bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 md:gap-2 z-10">
    {Array.from({ length: Math.min(count, 10) }).map((_, index) => (
      <button
        key={index}
        onClick={() => onSelect(index)}
        className={`h-1.5 md:h-2 rounded-full transition-all ${
          index === currentIndex ? 'w-6 md:w-8 bg-primary-foreground' : 'w-1.5 md:w-2 bg-gray-400/50 hover:bg-gray-400'
        }`}
      />
    ))}
  </div>
));
DotsIndicator.displayName = 'DotsIndicator';

const GalleryImages = memo(({ images, hoverGallery, bannerTitle, bannerDescription, buttonText, buttonLink }) => {
  if (!images || images.length === 0) return null;
  return (
    <div className={`absolute inset-0 transition-all duration-500 ${hoverGallery ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative z-10 h-full w-full items-center justify-around flex">
        <div className="items-top text-center text-white hov">
          {bannerTitle && <h2 className="text-[10px] md:text-2xl lg:text-2xl font-bold lg:mb-90 drop-shadow-lg flex gap-5 items-center"><PanelLeftOpen />{bannerTitle}</h2>}
          {bannerDescription && <p className="text-sm md:text-base lg:text-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">{bannerDescription}</p>}
        </div>
        <div className="flex gap-4 p-8">
          {images.slice(0, 8).map((image, index) => (
            <img key={index} src={image} alt="" loading="lazy" className="h-25 w-15 lg:w-40 lg:h-100 rounded-0 lg:rounded-lg object-cover shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-3 hover:rotate-2 cursor-pointer" style={{ transitionDelay: `${index * 70}ms` }} />
          ))}
        </div>
        <a href={buttonLink} className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3.5 text-xs md:text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 z-3 lg:mt-90">
          {buttonText} <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
});
GalleryImages.displayName = 'GalleryImages';

const HeroBanner = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverGallery, setHoverGallery] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { data: banners, isLoading } = useGetSliderBannersQuery();

  const sliderBanners = useMemo(() => {
    if (!banners || !Array.isArray(banners)) return [];
    return banners.filter(banner => Number(banner.collection_id) === 2);
  }, [banners]);

  const currentBanner = useMemo(() => {
    if (!sliderBanners || sliderBanners.length === 0) return {};
    return sliderBanners[currentIndex] || sliderBanners[0] || {};
  }, [sliderBanners, currentIndex]);

  const bannerData = useMemo(() => ({
    imageUrl: extractImageUrl(currentBanner),
    title: extractTitle(currentBanner),
    description: currentBanner.description || extractTextFromContent(currentBanner?.content),
    buttonText: currentBanner.buttonText || currentBanner.cta_text || 'مشاهده',
    buttonLink: currentBanner.buttonLink || currentBanner.link || currentBanner.slug || '/store',
    galleryImages: (() => {
      if (!currentBanner?.gallery_images) return [];
      try {
        const images = typeof currentBanner.gallery_images === 'string' ? JSON.parse(currentBanner.gallery_images) : currentBanner.gallery_images;
        return Array.isArray(images) ? images : [];
      } catch { return []; }
    })(),
  }), [currentBanner]);

  useEffect(() => {
    if (!sliderBanners || sliderBanners.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex(prev => (prev === sliderBanners.length - 1 ? 0 : prev + 1)), 6000);
    return () => clearInterval(interval);
  }, [sliderBanners]);

  const goToPrevious = useCallback(() => {
    if (!sliderBanners || sliderBanners.length === 0) return;
    setCurrentIndex(prev => prev === 0 ? sliderBanners.length - 1 : prev - 1);
  }, [sliderBanners]);

  const goToNext = useCallback(() => {
    if (!sliderBanners || sliderBanners.length === 0) return;
    setCurrentIndex(prev => prev === sliderBanners.length - 1 ? 0 : prev + 1);
  }, [sliderBanners]);

  const goToSlide = useCallback((index) => setCurrentIndex(index), []);

  useEffect(() => setImageError(false), [currentIndex]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full md:max-w-7xl md:py-6 md:px-6">
        <div className="w-full max-h-[150px] md:max-h-[400px] lg:max-h-[450px] relative overflow-hidden md:rounded-3xl animate-pulse bg-muted">
          <div className="flex h-[150px] md:h-[350px] lg:h-[480px] items-center justify-center bg-muted" />
        </div>
      </section>
    );
  }

  if (!sliderBanners || sliderBanners.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl h-full min-h-[150px] md:min-h-[350px] lg:min-h-[400px] overflow-hidden lg:p-4">
      <div className="group relative overflow-hidden h-full w-full rounded-0 lg:rounded-3xl bg-primary-foreground" onMouseEnter={() => setHoverGallery(true)} onMouseLeave={() => setHoverGallery(false)}>
        <div className="grid items-center h-full">
          <div className="relative z-10 h-full w-full">
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="relative w-full h-full">
                <OptimizedImage
                  src={bannerData.imageUrl}
                  alt={bannerData.title}
                  loading="eager"
                  className="w-full h-full max-h-[180px] md:max-h-[400px] lg:max-h-[450px] object-cover transition-all duration-700 hover:scale-105 lg:rounded-lg shadow-2xl animate-fadeInUp"
                  placeholder="/images/hero-placeholder.jpg"
                  onError={() => setImageError(true)}
                />
                <GalleryImages
                  images={bannerData.galleryImages}
                  hoverGallery={hoverGallery}
                  bannerTitle={bannerData.title}
                  bannerDescription={bannerData.description}
                  buttonText={bannerData.buttonText}
                  buttonLink={bannerData.buttonLink}
                />
              </div>
            </div>
          </div>
        </div>
        {sliderBanners.length > 1 && (
          <>
            <NavButton direction="left" onClick={goToPrevious} />
            <NavButton direction="right" onClick={goToNext} />
          </>
        )}
        {sliderBanners.length > 1 && (
          <DotsIndicator count={sliderBanners.length} currentIndex={currentIndex} onSelect={goToSlide} />
        )}
      </div>
    </section>
  );
});

HeroBanner.displayName = 'HeroBanner';
export default HeroBanner;
// src/components/home/DealOfWeek/DealOfWeek.jsx
import { useEffect, useState, useMemo, memo } from 'react';
import { useGetDealOfWeekQuery } from '../../../../features/banners/bannersAPI';
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';

const CountdownUnit = memo(({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm text-lg font-bold text-white shadow-sm md:h-14 md:w-14 md:text-xl">
      {String(value).padStart(2, '0')}
    </span>
    <span className="mt-1 text-[10px] uppercase tracking-wide text-white/80">{label}</span>
  </div>
));
CountdownUnit.displayName = 'CountdownUnit';

const DealSkeleton = () => (
  <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
    <div className="relative flex items-center justify-center rounded-lg w-full h-[180px] lg:h-[280px] animate-pulse bg-muted">
      <div className="absolute inset-0 bg-muted" />
    </div>
  </section>
);

export const DealOfWeek = memo(() => {
  const [now, setNow] = useState(Date.now());
  const [imageError, setImageError] = useState(false);

  const { data: dealData, isLoading } = useGetDealOfWeekQuery();

  const processedData = useMemo(() => {
    if (!dealData) return null;
    const image = dealData.featured_image || '/images/bag-vegetables.png';
    return {
      id: dealData.id,
      title: dealData.title || 'پیشنهاد ویژه هفته',
      image: image,
      targetDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
    };
  }, [dealData]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeLeft = useMemo(() => {
    if (!processedData?.targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = Math.max(0, processedData.targetDate - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [processedData?.targetDate, now]);

  if (isLoading) return <DealSkeleton />;
  if (!processedData) return null;

  return (
    <section className="mx-auto relative flex max-w-7xl p-5 h-[150px]  md:h-[200px] lg:h-[220px] animate-fadeInUp">
        <OptimizedImage src={imageError ? '/images/bag-vegetables.png' : processedData.image} alt={processedData.title} className=" h-full w-full object-cover opacity-80 rounded-lg" loading="eager" onError={() => setImageError(true)} />
        <div className=" bg-gradient-to-r from-bg-primary-forground/50 to-bg-primary-forground/90" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-sm md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">{processedData.title}</h2>
          <div className="flex items-center gap-2 md:gap-3">
            <CountdownUnit value={timeLeft.days} label="روز" />
            <CountdownUnit value={timeLeft.hours} label="ساعت" />
            <CountdownUnit value={timeLeft.minutes} label="دقیقه" />
            <CountdownUnit value={timeLeft.seconds} label="ثانیه" />
          </div>
        </div>
    </section>
  );
});

DealOfWeek.displayName = 'DealOfWeek';
export default DealOfWeek;
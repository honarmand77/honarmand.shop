// src/components/section-header/section-header.jsx
import { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { ArrowLeft } from "lucide-react";

export const SectionHeader = memo(({ 
  title, 
  subtitle,
  href,
  showArrows = false, 
  onPrevClick, 
  onNextClick,
  prevDisabled = false,
  nextDisabled = false 
})=> {
  return (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
            <div className="relative rounded-full bg-primary/10 p-2.5">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
             {title}
            </h2>
            <p className="text-sm text-muted-foreground hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>
      {showArrows ? (
        <div className="flex gap-2">

                  {/* دکمه چپ (قبلی) */}
          <button
            onClick={onNextClick}
            className={`p-2 rounded-full border transition-all pointer`}
            aria-label="اسکرول به چپ"
          >

                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>


                  {/* دکمه راست (بعدی) */}
          <button
            onClick={onPrevClick}
            className={`p-2 rounded-full border transition-all pointer`}
            aria-label="اسکرول به راست"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          

        </div>
      ):(        
        <a 
          href={href} 
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all duration-300"
          >
          <span>مشاهده همه</span>
          <ArrowLeft className="h-4 w-4" />
          </a>
              )}
    </div>
  );
})


SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
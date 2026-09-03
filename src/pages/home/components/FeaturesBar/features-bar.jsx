// src/components/features-bar/features-bar.jsx - نسخه اصلاح شده (فقط رفع خطا)
import React, { memo } from 'react';
import { Headphones, BadgeCheck, ShieldCheck, Tags } from "lucide-react";

const featuresData = [
  {
    id: 1,
    icon: Headphones,
    title: "پشتیبانی ۲۴/۷",
    subtitle: "پاسخگویی سریع و حرفه‌ای"
  },
  {
    id: 2,
    icon: BadgeCheck,
    title: "ضمانت اصالت کالا",
    subtitle: "همراه با ضمانت بازگشت وجه"
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "پرداخت امن",
    subtitle: "پرداخت از طریق درگاه‌های معتبر"
  },
  {
    id: 4,
    icon: Tags,
    title: "قیمت‌های ویژه",
    subtitle: "تخفیف‌های شگفت‌انگیز"
  }
];

export const FeaturesBar = memo(() => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-6 lg:grid-cols-4">
        {featuresData.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.id} className="flex flex-col md:flex-row items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground text-center md:text-right">
                  {feature.title}
                </p>
                <p className="text-xs text-muted-foreground text-center md:text-right">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

FeaturesBar.displayName = 'FeaturesBar';

export default FeaturesBar;
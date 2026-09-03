// src/utils/seo.js

// ============================================
// 1. Generate Structured Data (JSON-LD)
// ============================================
export const generateStructuredData = (data) => {
  const scripts = [];

  // Organization
  scripts.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'فروشگاه هنرمند',
    url: 'https://honarmand.shop',
    logo: 'https://honarmand.shop/icon-512.png',
    description: 'فروشگاه آنلاین مواد غذایی خارجی',
    sameAs: [
      'https://instagram.com/honarmand_shop',
      'https://telegram.me/honarmand_shop',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+98-999-991-0764',
      contactType: 'sales',
    },
  });

  // Website
  scripts.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'فروشگاه هنرمند',
    url: 'https://honarmand.shop',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://honarmand.shop/store?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  });

  // Breadcrumb (اگر داده داشت)
  if (data?.breadcrumb) {
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  // Product (اگر محصول داشت)
  if (data?.product) {
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.product.name,
      description: data.product.description,
      image: data.product.image,
      sku: data.product.sku,
      offers: {
        '@type': 'Offer',
        price: data.product.price,
        priceCurrency: 'IRR',
        availability: data.product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      aggregateRating: data.product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: data.product.rating,
        reviewCount: data.product.reviewCount,
      } : undefined,
    });
  }

  return scripts;
};

// ============================================
// 2. Inject Structured Data
// ============================================
export const injectStructuredData = (data) => {
  const scripts = generateStructuredData(data);
  
  scripts.forEach((scriptData) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(scriptData);
    document.head.appendChild(script);
  });
};

// ============================================
// 3. Generate Meta Tags
// ============================================
export const generateMetaTags = ({ title, description, image, url, type = 'website' }) => {
  const tags = [];

  // Basic
  tags.push({ name: 'title', content: title });
  tags.push({ name: 'description', content: description });

  // Open Graph
  tags.push({ property: 'og:title', content: title });
  tags.push({ property: 'og:description', content: description });
  tags.push({ property: 'og:image', content: image });
  tags.push({ property: 'og:url', content: url });
  tags.push({ property: 'og:type', content: type });
  tags.push({ property: 'og:site_name', content: 'فروشگاه هنرمند' });

  // Twitter
  tags.push({ name: 'twitter:card', content: 'summary_large_image' });
  tags.push({ name: 'twitter:title', content: title });
  tags.push({ name: 'twitter:description', content: description });
  tags.push({ name: 'twitter:image', content: image });

  return tags;
};

// ============================================
// 4. Update Meta Tags
// ============================================
export const updateMetaTags = (tags) => {
  tags.forEach((tag) => {
    let element;
    if (tag.name) {
      element = document.querySelector(`meta[name="${tag.name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.name = tag.name;
        document.head.appendChild(element);
      }
      element.content = tag.content;
    } else if (tag.property) {
      element = document.querySelector(`meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    }
  });
};
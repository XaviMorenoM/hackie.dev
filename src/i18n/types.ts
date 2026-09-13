/**
 * Shared shape for every locale file. Strings may contain the `{app}` token,
 * which `useTranslations()` replaces with `APP_NAME` from `src/config.ts`
 * (`{dApp}` = Catalan "d’{app}" / "de {app}", picked by the name's initial letter).
 * Never hard-code the product name in a locale file.
 */
export interface FeatureCopy {
  icon: FeatureIcon;
  title: string;
  body: string;
}

export type FeatureIcon =
  | 'log'
  | 'routines'
  | 'heatmap'
  | 'progress'
  | 'library'
  | 'health'
  | 'cloud'
  | 'resume';

export interface FaqItem {
  q: string;
  a: string;
}

export interface PrivacySection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Translations {
  meta: {
    /** Appended to every `<title>`. */
    siteSuffix: string;
    hubTitle: string;
    hubDescription: string;
    appTitle: string;
    appDescription: string;
    privacyTitle: string;
    privacyDescription: string;
    supportTitle: string;
    supportDescription: string;
  };
  nav: {
    skipToContent: string;
    home: string;
    app: string;
    privacy: string;
    support: string;
    language: string;
    theme: { label: string; system: string; light: string; dark: string };
    primaryAria: string;
    footerAria: string;
    /** aria-label for the wordmark link. */
    homeAria: string;
  };
  hub: {
    eyebrow: string;
    heroTitle: string;
    heroSub: string;
    productsHeading: string;
    productCardEyebrow: string;
    productCardTagline: string;
    productCardCta: string;
    aboutHeading: string;
    aboutBody: string;
  };
  product: {
    eyebrow: string;
    heroTitle: string;
    heroSub: string;
    platformNote: string;
    ctaAppStore: string;
    ctaTestFlight: string;
    ctaComingSoon: string;
    ctaComingSoonNote: string;
    featuresEyebrow: string;
    featuresHeading: string;
    featuresSub: string;
    features: FeatureCopy[];
    galleryEyebrow: string;
    galleryHeading: string;
    gallerySub: string;
    /** One alt text per screenshot, in gallery order. Extra screenshots reuse the last one. */
    screenshotAlts: string[];
    placeholderLabel: string;
    videoEyebrow: string;
    videoHeading: string;
    videoSub: string;
    videoPlaceholder: string;
    videoUnsupported: string;
    dataEyebrow: string;
    dataHeading: string;
    dataSub: string;
    dataPoints: { title: string; body: string }[];
    dataLink: string;
    finalHeading: string;
    finalSub: string;
    finalSupport: string;
  };
  privacy: {
    eyebrow: string;
    title: string;
    effective: string;
    intro: string[];
    sections: PrivacySection[];
    contactHeading: string;
    contactBody: string;
  };
  support: {
    eyebrow: string;
    title: string;
    intro: string;
    faqHeading: string;
    faq: FaqItem[];
    contactHeading: string;
    contactBody: string;
    contactCta: string;
    contactHint: string;
  };
  footer: {
    madeBy: string;
    privacy: string;
    support: string;
    github: string;
  };
  notFound: {
    title: string;
    body: string;
    cta: string;
  };
}

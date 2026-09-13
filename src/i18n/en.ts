import type { Translations } from './types';

export const en: Translations = {
  meta: {
    siteSuffix: 'hackie.dev',
    hubTitle: 'hackie.dev — indie apps, built with care',
    hubDescription:
      'hackie.dev is the home of {app} and other small, carefully made apps by an independent developer.',
    appTitle: '{app} — the gym tracker that stays out of your way',
    appDescription:
      '{app} is a fast, local-first gym tracker for iPhone. Log sets in seconds, follow routines, see your progress and keep your data on your device and your own iCloud.',
    privacyTitle: 'Privacy policy — {app}',
    privacyDescription:
      'How {app} handles your data: everything stays on your device and your own iCloud. No servers, no trackers, no ads.',
    supportTitle: 'Support — {app}',
    supportDescription: 'Answers to common questions about {app}, plus how to get in touch.',
  },
  nav: {
    skipToContent: 'Skip to content',
    home: 'Home',
    app: '{app}',
    privacy: 'Privacy',
    support: 'Support',
    language: 'Language',
    homeAria: 'hackie.dev home',
  },
  hub: {
    eyebrow: 'Independent software',
    heroTitle: 'indie apps, built with care.',
    heroSub:
      'Small tools for real life, made by one person who uses them every day. No growth hacks, no dark patterns — just software that respects your time.',
    productsHeading: 'Products',
    productCardEyebrow: 'iPhone · iOS {ios}+',
    productCardTagline: 'A gym tracker that stays out of your way. Log sets fast, follow routines, watch your progress.',
    productCardCta: 'Discover {app}',
    aboutHeading: 'About',
    aboutBody:
      'hackie.dev is where {developer} ships the things he builds for himself. Every app here is local-first, ad-free and made to last.',
  },
  product: {
    eyebrow: 'Gym tracker for iPhone',
    heroTitle: 'Log the set. Get back to lifting.',
    heroSub:
      '{app} is a workout tracker that gets out of your way. Tap in your weight and reps, let the rest timer run, and see your progress build week after week — all on your device.',
    platformNote: 'iOS {ios}+ · English & Spanish · kg / lb',
    ctaAppStore: 'Download on the App Store',
    ctaTestFlight: 'Join the TestFlight beta',
    ctaComingSoon: 'Coming soon',
    ctaComingSoonNote: 'Not on the App Store yet. Check back shortly.',
    featuresEyebrow: 'Features',
    featuresHeading: 'Everything you need on the gym floor. Nothing you don’t.',
    featuresSub:
      'Built around the way you actually train: quick logging, sensible defaults and progress you can feel.',
    features: [
      {
        icon: 'log',
        title: 'Effortless set logging',
        body: 'Weight and reps in two taps. Bodyweight exercises with added load, a rest timer between sets and keyboard shortcuts that keep you moving.',
      },
      {
        icon: 'routines',
        title: 'Routines or a blank slate',
        body: 'Build Push / Pull / Legs style routines and start them with one tap — or begin an empty workout and add exercises as you go.',
      },
      {
        icon: 'heatmap',
        title: 'Muscle heatmap',
        body: 'See which muscles each routine really hits. The map is weighted by volume load, not just the number of sets.',
      },
      {
        icon: 'progress',
        title: 'Progress you can scrub',
        body: 'Charts for every exercise, a body-weight timeline and personal records — drag across the chart to read any point in time.',
      },
      {
        icon: 'library',
        title: 'Curated exercise library',
        body: 'A hand-picked catalog with smart search, so you find the right movement in a second instead of scrolling through thousands.',
      },
      {
        icon: 'health',
        title: 'Apple Health, both ways',
        body: 'Reads your workouts and heart rate from Health and writes every completed session back, so your rings and history stay whole.',
      },
      {
        icon: 'cloud',
        title: 'Local-first, iCloud synced',
        body: 'Everything lives on your iPhone and syncs through your own iCloud account. No accounts to create, no servers in between.',
      },
      {
        icon: 'resume',
        title: 'Never lose a session',
        body: 'Close the app mid-workout and pick up exactly where you left off. Edit any completed workout afterwards — sets, weights, notes.',
      },
    ],
    galleryEyebrow: 'Screens',
    galleryHeading: 'Designed for the dark corner of the gym.',
    gallerySub: 'High contrast, big targets, one-handed. It looks the same at 6 am and 11 pm.',
    screenshotAlts: [
      '{app} today screen showing the current routine and recent workouts',
      '{app} workout logging screen with sets, weight, reps and rest timer',
      '{app} routine detail with a muscle heatmap',
      '{app} progress charts with a scrubbable line chart',
      '{app} exercise library with search',
      '{app} profile screen with units and Apple Health settings',
    ],
    placeholderLabel: 'Screenshot coming soon',
    videoEyebrow: 'In motion',
    videoHeading: 'Thirty seconds, one workout.',
    videoSub: 'Start a routine, log a few sets, finish. That’s the whole loop.',
    videoPlaceholder: 'Demo video coming soon',
    videoUnsupported: 'Your browser doesn’t support embedded video.',
    dataEyebrow: 'Your data',
    dataHeading: 'Your data stays yours.',
    dataSub:
      '{app} has no backend. There is nothing to sign up for, nothing to leak and nothing to sell.',
    dataPoints: [
      {
        title: 'On your device',
        body: 'Workouts are stored locally on your iPhone with SwiftData. The app works fully offline.',
      },
      {
        title: 'Your own iCloud',
        body: 'Optional sync uses the private CloudKit database tied to your Apple ID. The developer can’t read it.',
      },
      {
        title: 'Apple Health',
        body: 'Health data is read and written only with your permission and never leaves your device except through your iCloud.',
      },
      {
        title: 'No trackers',
        body: 'No third-party analytics, no ads, no SDKs phoning home. Only Apple’s own aggregated crash reports.',
      },
    ],
    dataLink: 'Read the full privacy policy',
    finalHeading: 'Ready when you are.',
    finalSub: '{app} for iPhone. iOS {ios} or later.',
    finalSupport: 'Questions? Visit support',
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy policy',
    effective: 'Effective {date}',
    intro: [
      '{app} is built by {developer}, an independent developer. This policy explains, in plain language, what data the app touches and where it goes. The short version: it stays with you.',
      '{app} does not run a server. There is no account with the developer, no analytics service and no advertising. The developer has no way to access anything you log in the app.',
    ],
    sections: [
      {
        heading: 'Data stored on your device',
        paragraphs: [
          'Everything you enter in {app} — workouts, sets, routines, body weight, personal records and settings — is stored locally on your iPhone. The app works fully offline.',
        ],
      },
      {
        heading: 'iCloud sync',
        paragraphs: [
          'If iCloud is enabled on your device, {app} syncs your data through Apple CloudKit using the private database attached to your Apple ID. That data is encrypted in transit and at rest by Apple and is only accessible from your own devices. The developer has no access to it.',
        ],
      },
      {
        heading: 'Sign in with Apple',
        paragraphs: [
          '{app} uses Sign in with Apple to identify your account. It receives only the name and email address that Apple provides (which may be a private relay address if you choose to hide your email). This information is used solely to identify your account and is never shared.',
        ],
      },
      {
        heading: 'Apple Health (HealthKit)',
        paragraphs: [
          'With your permission, {app} reads workouts and heart-rate samples from Apple Health and writes the workouts you complete in the app back to Apple Health. You can grant, review or revoke this access at any time in the Health app.',
          'Health data never leaves your device except through your own iCloud sync. It is never shared with third parties, never used for advertising or marketing and never sold. {app} does not use Health data for any purpose other than showing it to you inside the app.',
        ],
      },
      {
        heading: 'Diagnostics',
        paragraphs: [
          '{app} receives aggregated crash and performance reports through Apple MetricKit. These are generated and anonymised by Apple and contain no personal data and no workout data. {app} includes no third-party analytics, advertising SDKs or trackers of any kind.',
        ],
      },
      {
        heading: 'Deleting your data',
        paragraphs: ['You are in control. To remove everything:'],
        bullets: [
          'Delete the app from your iPhone to remove all local data.',
          'To remove synced data, open Settings → your name → iCloud → Manage Account Storage, select {app} and delete its data.',
          'Health data written by {app} can be removed from the Health app under Browse → Workouts.',
        ],
      },
      {
        heading: 'Children',
        paragraphs: [
          '{app} is not directed at children under 13 and does not knowingly collect information from them.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'If this policy changes, the new version will be published on this page with an updated effective date.',
        ],
      },
    ],
    contactHeading: 'Contact',
    contactBody: 'Questions or requests about your data? Email {email}.',
  },
  support: {
    eyebrow: 'Help',
    title: 'Support',
    intro: 'Answers to the questions we hear most. If yours isn’t here, send an email — a real person replies.',
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'Which devices does {app} support?',
        a: '{app} runs on iPhone with iOS {ios} or later. The interface is available in English and Spanish, and you can log in kilograms or pounds.',
      },
      {
        q: 'Do I need an account?',
        a: 'No. {app} stores everything on your iPhone. Sign in with Apple is used only to identify your account for iCloud sync — there is no password to remember and no server on the developer’s side.',
      },
      {
        q: 'How does sync work across my devices?',
        a: 'Turn on iCloud on each device with the same Apple ID and {app} syncs automatically through your private iCloud database. Nothing goes through the developer.',
      },
      {
        q: 'What does {app} do with Apple Health?',
        a: 'With your permission it reads workouts and heart rate from Apple Health, and writes every workout you finish back to Health so your history and activity rings stay complete. You can change this at any time in the Health app under Sharing.',
      },
      {
        q: 'I closed the app mid-workout. Is my session lost?',
        a: 'No. {app} keeps the in-progress workout and offers to resume or discard it the next time you open the app.',
      },
      {
        q: 'Can I edit a workout after I finish it?',
        a: 'Yes. Open any completed session from your history and change sets, weights and reps.',
      },
      {
        q: 'How do I delete my data?',
        a: 'Delete the app to remove local data. To clear synced data, go to Settings → your name → iCloud → Manage Account Storage and delete {app}’s data. See the privacy policy for details.',
      },
    ],
    contactHeading: 'Still stuck?',
    contactBody: 'Email the developer directly. Include your iOS version and what you were doing when the problem happened.',
    contactCta: 'Email support',
    contactHint: 'Or write to {email}',
  },
  footer: {
    madeBy: 'Made by {developer}',
    privacy: 'Privacy',
    support: 'Support',
    github: 'GitHub',
  },
  notFound: {
    title: 'Page not found',
    body: 'That link doesn’t go anywhere.',
    cta: 'Back to hackie.dev',
  },
};

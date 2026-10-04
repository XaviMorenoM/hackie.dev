/**
 * Re-export barrel for src/components/.
 * Prefer direct deep imports (atoms/, molecules/, organisms/) for tree-shaking.
 * This barrel is provided for convenience in tests and scripts.
 */

// atoms
export { default as Badge } from './atoms/Badge.astro'
export { default as Button } from './atoms/Button.astro'
export { default as Divider } from './atoms/Divider.astro'
export { default as FeatureIcon } from './atoms/FeatureIcon.astro'
export { default as Icon } from './atoms/Icon.astro'
export { default as SectionHeading } from './atoms/SectionHeading.astro'
export { default as Typography } from './atoms/Typography.astro'
export { THEME_ICONS } from './atoms/theme-icons'

// molecules
export { default as BubbleGlass } from './molecules/BubbleGlass.astro'
export { default as CardCover } from './molecules/CardCover.astro'
export { default as DemoVideo } from './molecules/DemoVideo.astro'
export { default as LangSelector } from './molecules/LangSelector.astro'
export { default as LangSwitcher } from './molecules/LangSwitcher.astro'
export { default as PhoneFrame } from './molecules/PhoneFrame.astro'
export { default as ProjectMeta } from './molecules/ProjectMeta.astro'
export { default as ScreenshotGallery } from './molecules/ScreenshotGallery.astro'
export { default as ThemeSelector } from './molecules/ThemeSelector.astro'
export { default as ThemeSwitch } from './molecules/ThemeSwitch.astro'

// organisms
export { default as Footer } from './organisms/Footer.astro'
export { default as Header } from './organisms/Header.astro'
export { default as LiquidGlassBubble } from './organisms/LiquidGlassBubble.astro'
export { default as ProjectCard } from './organisms/ProjectCard.astro'
export { default as SiteControls } from './organisms/SiteControls.astro'

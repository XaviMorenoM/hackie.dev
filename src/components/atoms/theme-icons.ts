/**
 * SVG path data shared by ThemeSwitch.astro and SiteControls.astro.
 * Each string is the inner HTML of a 24×24 viewBox SVG with stroke="currentColor".
 */
export const THEME_ICONS: Record<'system' | 'light' | 'dark', string> = {
  // half-filled circle
  system:
    '<circle cx="12" cy="12" r="8.25"/><path d="M12 3.75v16.5A8.25 8.25 0 0 0 12 3.75Z" fill="currentColor" stroke="none"/>',
  light:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  dark: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
}

/**
 * Design token values as typed TypeScript constants.
 * Single source of truth for tests, cover generators, and any TS code
 * that needs token values without parsing CSS.
 *
 * These values must stay in sync with src/styles/global.css.
 */

/** Brand and surface colours (dark theme values are the canonical defaults). */
export const color = {
  // Brand
  limeAccent: '#c6ff3d',
  limeAccentLight: '#4a6600',
  limeFill: '#c6ff3d',
  limeInk: '#101400',
  // Neutrals (dark)
  bgDark: '#0b0b0c',
  surfaceDark: '#141416',
  lineDark: '#232326',
  fgDark: '#f5f5f5',
  mutedDark: '#9a9a9a',
  // Neutrals (light)
  bgLight: '#f6f4ee',
  surfaceLight: '#ffffff',
  lineLight: '#e3dfd5',
  fgLight: '#141413',
  mutedLight: '#5c5a54',
  // Device chrome
  bezel: '#1c1c1f',
} as const

/** Glass surface parameters. */
export const glass = {
  bgDark: 'rgba(16, 16, 20, 0.68)',
  bgLight: 'rgba(255, 255, 255, 0.78)',
  blur: 'blur(32px) saturate(180%) brightness(105%)',
  borderDark: 'rgba(255, 255, 255, 0.09)',
  borderLight: 'rgba(0, 0, 0, 0.07)',
  shadowDark:
    'inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 8px 40px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
  shadowLight:
    'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
} as const

/** Animation easings and durations. */
export const animation = {
  easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  durationFast: '150ms',
  durationBase: '220ms',
  durationSlow: '400ms',
} as const

/** Spacing scale (rem values). */
export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const

/** Typography scale. */
export const typography = {
  textXs: '0.75rem',
  textSm: '0.8125rem',
  textBase: '1rem',
  textLg: '1.125rem',
  textXl: '1.25rem',
  text2xl: '1.5rem',
  textDisplay: '2.5rem',
  leadingTight: '1.15',
  leadingBase: '1.5',
  trackingTight: '-0.02em',
  trackingWide: '0.06em',
} as const

/** Box shadows. */
export const shadow = {
  cardDark:
    '0 1px 2px rgb(0 0 0 / 0.45), 0 4px 12px rgb(0 0 0 / 0.35), 0 12px 32px -8px rgb(0 0 0 / 0.3)',
  cardHoverDark:
    '0 2px 4px rgb(0 0 0 / 0.45), 0 12px 24px rgb(0 0 0 / 0.4), 0 24px 48px -12px rgb(0 0 0 / 0.45)',
  cardLight:
    '0 1px 2px rgb(20 20 19 / 0.06), 0 4px 12px rgb(20 20 19 / 0.05), 0 12px 32px -8px rgb(20 20 19 / 0.08)',
  cardHoverLight:
    '0 2px 4px rgb(20 20 19 / 0.08), 0 12px 24px rgb(20 20 19 / 0.1), 0 24px 48px -12px rgb(20 20 19 / 0.18)',
} as const

// src/config/tokens.config.ts
import { websiteConfig } from './website.config';

export const tokens = websiteConfig.tokens;

// CSS Custom Properties Generator
export function generateCSSVariables(): string {
    const { colors, typography, spacing, animations, radius, shadows } = tokens;

    return `
    :root {
      /* Colors */
      --color-primary: hsl(${colors.primary});
      --color-secondary: hsl(${colors.secondary});
      --color-accent: hsl(${colors.accent});
      --color-background: hsl(${colors.background});
      --color-foreground: hsl(${colors.foreground});
      --color-muted: hsl(${colors.muted});
      --color-destructive: hsl(${colors.destructive});

      /* Typography */
      --font-heading: ${typography.fontFamily.heading};
      --font-body: ${typography.fontFamily.body};
      --font-size-xs: ${typography.fontSizes.xs};
      --font-size-sm: ${typography.fontSizes.sm};
      --font-size-base: ${typography.fontSizes.base};
      --font-size-lg: ${typography.fontSizes.lg};
      --font-size-xl: ${typography.fontSizes.xl};
      --font-size-2xl: ${typography.fontSizes['2xl']};
      --font-size-3xl: ${typography.fontSizes['3xl']};
      --font-size-4xl: ${typography.fontSizes['4xl']};

      /* Spacing */
      --spacing-section: ${spacing.section};
      --container-max-width: ${spacing.container};

      /* Border Radius */
      --radius: ${getRadiusValue(radius)};

      /* Shadows */
      --shadow-sm: ${shadows.sm};
      --shadow-md: ${shadows.md};
      --shadow-lg: ${shadows.lg};

      /* Animations */
      --animation-duration: ${animations.duration};
      --animation-easing: ${animations.easing};
    }
  `.trim();
}

function getRadiusValue(radius: typeof tokens.radius): string {
    const radiusMap: Record<typeof radius, string> = {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
    };
    return radiusMap[radius];
}

// Export individual token groups for easy access
export const colors = tokens.colors;
export const typography = tokens.typography;
export const spacing = tokens.spacing;
export const animations = tokens.animations;

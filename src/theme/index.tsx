// Theme ported from Minimal UI (minimal-ui-kit/material-kit-react, MIT):
// same token structure (5-step palette, grey scale, DM Sans + Barlow, soft custom shadows,
// radius 8 / card 16), with the brand colours swapped for Ê-đê brocade red + gold.

import type { ReactNode } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { alpha, createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import '@fontsource-variable/dm-sans';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow/800.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/600.css';
import '@fontsource/noto-sans/700.css';

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
  }
  interface TypographyVariants {
    rade: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    rade?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    rade: true;
  }
}

type CustomShadows = Record<
  'z1' | 'z8' | 'z16' | 'z24' | 'card' | 'dialog' | 'dropdown' | 'primary' | 'secondary' | 'success' | 'warning' | 'error',
  string
>;

export const grey = {
  50: '#FCFDFD',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#1C252E',
  900: '#141A21',
};

export const palette = {
  primary: { lighter: '#FFE3D6', light: '#F28B66', main: '#C8401E', dark: '#902615', darker: '#5F120B', contrastText: '#FFFFFF' },
  secondary: { lighter: '#FFF4CC', light: '#FFD666', main: '#E0A100', dark: '#A06A00', darker: '#6B4100', contrastText: '#1C252E' },
  info: { lighter: '#CAFDF5', light: '#61F3F3', main: '#00B8D9', dark: '#006C9C', darker: '#003768', contrastText: '#FFFFFF' },
  success: { lighter: '#D3FCD2', light: '#77ED8B', main: '#22C55E', dark: '#118D57', darker: '#065E49', contrastText: '#FFFFFF' },
  warning: { lighter: '#FFF5CC', light: '#FFD666', main: '#FFAB00', dark: '#B76E00', darker: '#7A4100', contrastText: '#1C252E' },
  error: { lighter: '#FFE9D5', light: '#FFAC82', main: '#FF5630', dark: '#B71D18', darker: '#7A0916', contrastText: '#FFFFFF' },
};

const shadowColor = grey[500];
const colorShadow = (c: string) => `0 8px 16px 0 ${alpha(c, 0.24)}`;

const customShadows: CustomShadows = {
  z1: `0 1px 2px 0 ${alpha(shadowColor, 0.16)}`,
  z8: `0 8px 16px 0 ${alpha(shadowColor, 0.16)}`,
  z16: `0 16px 32px -4px ${alpha(shadowColor, 0.16)}`,
  z24: `0 24px 48px 0 ${alpha(shadowColor, 0.16)}`,
  card: `0 0 2px 0 ${alpha(shadowColor, 0.2)}, 0 12px 24px -4px ${alpha(shadowColor, 0.12)}`,
  dialog: `-40px 40px 80px -8px ${alpha('#000000', 0.24)}`,
  dropdown: `0 0 2px 0 ${alpha(shadowColor, 0.24)}, -20px 20px 40px -4px ${alpha(shadowColor, 0.24)}`,
  primary: colorShadow(palette.primary.main),
  secondary: colorShadow(palette.secondary.main),
  success: colorShadow(palette.success.main),
  warning: colorShadow(palette.warning.main),
  error: colorShadow(palette.error.main),
};

const primaryFont = '"DM Sans Variable", "Noto Sans", sans-serif';
const secondaryFont = 'Barlow, "Noto Sans", sans-serif';
// Ê-đê text uses Noto Sans: it covers ƀ Ƀ č ñ and stacks the combining breve correctly.
export const radeFont = '"Noto Sans", sans-serif';

// Same idea as Minimal UI's responsiveFontSizes: headings start smaller on phones and grow at sm / md
const rem = (px: number) => `${px / 16}rem`;
const responsive = (xs: number, sm: number, md: number) => ({
  fontSize: rem(xs),
  '@media (min-width:600px)': { fontSize: rem(sm) },
  '@media (min-width:900px)': { fontSize: rem(md) },
});

const theme = createTheme({
  palette: {
    ...palette,
    grey,
    text: { primary: grey[800], secondary: grey[600], disabled: grey[500] },
    background: { default: grey[100], paper: '#FFFFFF' },
    divider: alpha(grey[500], 0.2),
    action: { hover: alpha(grey[500], 0.08), selected: alpha(grey[500], 0.16) },
  },
  shape: { borderRadius: 8 },
  customShadows,
  typography: {
    fontFamily: primaryFont,
    h1: { fontFamily: secondaryFont, fontWeight: 800, lineHeight: 1.25, ...responsive(36, 48, 56) },
    h2: { fontFamily: secondaryFont, fontWeight: 800, lineHeight: 1.33, ...responsive(28, 36, 44) },
    h3: { fontFamily: secondaryFont, fontWeight: 700, lineHeight: 1.5, ...responsive(24, 28, 32) },
    h4: { fontWeight: 700, lineHeight: 1.5, ...responsive(20, 22, 24) },
    h5: { fontWeight: 700, lineHeight: 1.5, ...responsive(18, 19, 19) },
    h6: { fontWeight: 600, fontSize: '1.0625rem', lineHeight: 1.55 },
    subtitle1: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.57 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5 },
    overline: { fontWeight: 700, fontSize: '0.75rem', lineHeight: 1.5, textTransform: 'uppercase' },
    button: { fontWeight: 700, fontSize: '0.875rem', textTransform: 'unset' },
    rade: { fontFamily: radeFont, fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: { userSelect: 'none' },
        'input, textarea, [data-selectable]': { userSelect: 'text' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
        sizeLarge: { minHeight: 48, fontSize: '0.9375rem', paddingInline: 22 },
        containedInherit: {
          color: '#FFFFFF',
          backgroundColor: grey[800],
          '&:hover': { backgroundColor: grey[700] },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { position: 'relative', zIndex: 0, borderRadius: 16, boxShadow: customShadows.card },
      },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
    MuiTooltip: {
      styleOverrides: { tooltip: { backgroundColor: grey[800], fontSize: 12 }, arrow: { color: grey[800] } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 8, height: 8 }, bar: { borderRadius: 8 } },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 16, boxShadow: customShadows.dialog } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(grey[500], 0.24) },
        },
      },
    },
  },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

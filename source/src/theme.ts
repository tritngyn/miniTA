import { createTheme } from '@mui/material/styles';
import type { ApplicationStatus } from './data/types';

/** Navy + blue palette (theme refresh, 2026-11-24). Tokens are the single
 *  source for TS and, through the CSS variables in styles.css, for the
 *  homepage and shell CSS. Contrast is measured by `npm run a11y`. */
export const tokens = {
  canvas: '#F3F7F8',
  surface: '#FFFFFF',
  surfaceSunken: '#EAF1F4',
  ink: '#0F172A',
  textSecondary: '#526477',
  textMuted: '#5F7283',
  border: '#D6E1E7',
  borderStrong: '#748899',
  navy: '#0F172A',
  navySoft: '#1E293B',
  onNavy: '#F8FAFC',
  onNavyMuted: '#CBD5E1',
  blueLight: '#3B82F6',
  accent: '#2563EB',
  accentHover: '#1D4ED8',
  accentPressed: '#1E40AF',
  accentSoft: '#DBEAFE',
  selectedInk: '#1E40AF',
  link: '#1D4ED8',
  linkHover: '#1E40AF',
  teal: '#14B8A6',
  contrastText: '#FFFFFF',
  neutralInk: '#475569',
  neutralSoft: '#E8EEF2',
  warn: '#7A4D00',
  warnSoft: '#FFF1D6',
  infoInk: '#4338A3',
  infoSoft: '#EEEBFF',
  success: '#25633B',
  successSoft: '#E7F3EA',
  danger: '#A12825',
  dangerSoft: '#FBECEB',
} as const;

export const statusStyle: Record<ApplicationStatus, { bg: string; fg: string }> = {
  Applied: { bg: tokens.neutralSoft, fg: tokens.neutralInk },
  'Under Review': { bg: tokens.warnSoft, fg: tokens.warn },
  Shortlisted: { bg: tokens.infoSoft, fg: tokens.infoInk },
  Hired: { bg: tokens.successSoft, fg: tokens.success },
  Rejected: { bg: tokens.dangerSoft, fg: tokens.danger },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tokens.accent,
      dark: tokens.accentHover,
      light: tokens.accentSoft,
      contrastText: tokens.contrastText,
    },
    secondary: { main: tokens.selectedInk, contrastText: tokens.contrastText },
    error: { main: tokens.danger, contrastText: tokens.contrastText },
    warning: { main: tokens.warn, contrastText: tokens.contrastText },
    success: { main: tokens.success, contrastText: tokens.contrastText },
    info: { main: tokens.infoInk, contrastText: tokens.contrastText },
    background: { default: tokens.canvas, paper: tokens.surface },
    text: { primary: tokens.ink, secondary: tokens.textSecondary },
    divider: tokens.border,
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "'Geist Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    h1: { fontSize: 28, lineHeight: 1.2, fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontSize: 22, lineHeight: 1.28, fontWeight: 600, letterSpacing: '-0.015em' },
    h3: { fontSize: 17, lineHeight: 1.4, fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle1: { fontSize: 15, lineHeight: 1.5, fontWeight: 500 },
    subtitle2: { fontSize: 13.5, lineHeight: 1.45, fontWeight: 600 },
    body1: { fontSize: 16, lineHeight: 1.55 },
    body2: { fontSize: 14, lineHeight: 1.5 },
    caption: { fontSize: 12.5, lineHeight: 1.45 },
    button: { fontSize: 15, fontWeight: 500, textTransform: 'none', letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.canvas },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 8,
          paddingInline: 16,
          '&.Mui-focusVisible': { outline: `2px solid ${tokens.accent}`, outlineOffset: 2 },
        },
        containedPrimary: {
          backgroundColor: tokens.accent,
          color: tokens.contrastText,
          '&:hover': { backgroundColor: tokens.accentHover },
          '&:active': { backgroundColor: tokens.accentPressed },
          '&.Mui-disabled': { backgroundColor: tokens.neutralSoft, color: tokens.textMuted },
        },
        outlined: {
          borderColor: tokens.borderStrong,
          color: tokens.ink,
          backgroundColor: tokens.surface,
          '&:hover': { borderColor: tokens.textSecondary, backgroundColor: tokens.surfaceSunken },
          '&:active': { backgroundColor: tokens.accentSoft },
        },
        text: {
          paddingInline: 8,
          minHeight: 36,
          color: tokens.accent,
          '&:hover': { backgroundColor: tokens.accentSoft },
        },
        sizeSmall: { minHeight: 36, paddingInline: 12 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: tokens.textSecondary,
          '&:hover': { backgroundColor: tokens.surfaceSunken, color: tokens.ink },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.surface,
          borderRadius: 8,
          minHeight: 46,
          fontSize: 15,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: tokens.borderStrong },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tokens.textSecondary },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.accent,
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: tokens.danger },
        },
        input: { padding: '11px 14px' },
        multiline: { padding: 0 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          color: tokens.textSecondary,
          '&.Mui-focused': { color: tokens.accent },
          '&.Mui-error': { color: tokens.danger },
        },
        asterisk: { color: tokens.danger },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          color: tokens.textSecondary,
          '&.Mui-focused': { color: tokens.accent },
          '&.Mui-error': { color: tokens.danger },
        },
        asterisk: { color: tokens.danger },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { fontSize: 13, marginLeft: 0, marginTop: 6, color: tokens.textMuted },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: tokens.textMuted,
          '&:hover': { backgroundColor: tokens.accentSoft },
          '&.Mui-checked': { color: tokens.accent },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: tokens.textMuted,
          '&:hover': { backgroundColor: tokens.accentSoft },
          '&.Mui-checked': { color: tokens.accent },
        },
      },
    },
    MuiSelect: {
      styleOverrides: { select: { minHeight: 'unset', padding: '11px 14px' } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '13px 16px', fontSize: 15, borderColor: tokens.border },
        head: {
          fontSize: 13.5,
          fontWeight: 600,
          color: tokens.textSecondary,
          backgroundColor: tokens.surfaceSunken,
          letterSpacing: 0,
        },
      },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: {
        root: {
          color: tokens.link,
          fontWeight: 500,
          '&:hover': { color: tokens.linkHover, textDecoration: 'underline' },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.navy,
          color: tokens.onNavy,
          fontSize: 12.5,
          padding: '6px 10px',
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: tokens.border } } },
  },
});

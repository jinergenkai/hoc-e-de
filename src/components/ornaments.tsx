// Ornaments inspired by Ê-đê brocade (thổ cẩm): dark ground, red bands, white / gold
// geometric rows (diamonds, sawtooth, zigzag) and the Central Highlands gong (chiêng).
// Purely geometric — no claim about the meaning of a specific motif; the client's
// artisan / expert should review before release.

import type { SxProps, Theme } from '@mui/material/styles';

import { useId } from 'react';

import Box from '@mui/material/Box';

export const BROCADE = {
  black: '#1C1A1A',
  indigo: '#1F2533',
  red: '#C8401E',
  deepRed: '#8E1F12',
  gold: '#E0A100',
  white: '#F4EFE6',
};

export type Motif = 'diamond' | 'sawtooth' | 'zigzag' | 'cross' | 'stripes';

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** One repeating tile (viewBox 32×16 unless noted). */
export function motifTile(motif: Motif, c = BROCADE, vertical = false): { url: string; w: number; h: number } {
  const ground = `<rect width='32' height='16' fill='${c.black}'/>`;
  const tiles: Record<Motif, string> = {
    diamond: `${ground}<path d='M0 8 8 0 16 8 8 16Z' fill='${c.red}'/><path d='M16 8 24 0 32 8 24 16Z' fill='${c.gold}'/><path d='M5 8 8 5 11 8 8 11Z' fill='${c.white}'/><path d='M21 8 24 5 27 8 24 11Z' fill='${c.black}'/>`,
    sawtooth: `${ground}<path d='M0 16 8 6 16 16Z M16 16 24 6 32 16Z' fill='${c.red}'/><path d='M0 0 8 10 16 0Z M16 0 24 10 32 0Z' fill='${c.gold}' opacity='.9'/><path d='M6 13 8 10.5 10 13Z M22 13 24 10.5 26 13Z' fill='${c.white}'/>`,
    zigzag: `${ground}<path d='M0 11 8 4 16 11 24 4 32 11' fill='none' stroke='${c.red}' stroke-width='3'/><path d='M0 15 8 8 16 15 24 8 32 15' fill='none' stroke='${c.gold}' stroke-width='1.5'/><circle cx='8' cy='12' r='1.2' fill='${c.white}'/><circle cx='24' cy='12' r='1.2' fill='${c.white}'/>`,
    cross: `${ground}<path d='M6 8h20M16 2v12' stroke='${c.red}' stroke-width='3'/><path d='M16 4 20 8 16 12 12 8Z' fill='${c.gold}'/><circle cx='16' cy='8' r='1.4' fill='${c.white}'/><path d='M0 0h32M0 16h32' stroke='${c.gold}' stroke-width='1.5'/>`,
    stripes: `<rect width='32' height='16' fill='${c.black}'/><rect y='3' width='32' height='3' fill='${c.red}'/><rect y='8' width='32' height='1' fill='${c.white}'/><rect y='10' width='32' height='3' fill='${c.gold}'/>`,
  };
  if (vertical) {
    // rotate(90) maps (x, y) → (−y, x); translate brings it back into a 16×32 box
    return { url: svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'><g transform='translate(16 0) rotate(90)'>${tiles[motif]}</g></svg>`), w: 16, h: 32 };
  }
  return { url: svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='16' viewBox='0 0 32 16'>${tiles[motif]}</svg>`), w: 32, h: 16 };
}

// ----------------------------------------------------------------------

type BandProps = { motif?: Motif; height?: number; sx?: SxProps<Theme>; edges?: boolean };

/** Horizontal woven band: thin red edges around a repeating motif row. */
export function BrocadeBand({ motif = 'diamond', height = 16, sx, edges = true }: BandProps) {
  const t = motifTile(motif);
  const scale = height / t.h;
  return (
    <Box sx={{ width: 1, flexShrink: 0, ...(sx as object) }}>
      {edges && <Box sx={{ height: Math.max(2, height / 6), bgcolor: BROCADE.red }} />}
      <Box
        sx={{
          height,
          backgroundImage: t.url,
          backgroundRepeat: 'repeat-x',
          backgroundSize: `${t.w * scale}px ${height}px`,
        }}
      />
      {edges && <Box sx={{ height: Math.max(2, height / 6), bgcolor: BROCADE.red }} />}
    </Box>
  );
}

/** Vertical band (for the side of the nav or a card). */
export function BrocadeColumn({ motif = 'sawtooth', width = 12, sx }: { motif?: Motif; width?: number; sx?: SxProps<Theme> }) {
  const t = motifTile(motif, BROCADE, true);
  return (
    <Box
      sx={{
        width,
        height: 1,
        flexShrink: 0,
        backgroundImage: t.url,
        backgroundRepeat: 'repeat-y',
        backgroundSize: `${width}px ${t.h * (width / t.w)}px`,
        ...(sx as object),
      }}
    />
  );
}

/** Low-contrast all-over pattern for large surfaces (hero, card backs, empty states). */
export function brocadeBackdrop(color = '#FFFFFF', opacity = 0.08, size = 56): object {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='${color}' stroke-opacity='${opacity}' stroke-width='2'><path d='M28 4 52 28 28 52 4 28Z'/><path d='M28 14 42 28 28 42 14 28Z'/></g><path d='M28 24 32 28 28 32 24 28Z' fill='${color}' fill-opacity='${opacity * 1.6}'/><path d='M0 0 4 4M56 0 52 4M0 56 4 52M56 56 52 52' stroke='${color}' stroke-opacity='${opacity}' stroke-width='2'/></svg>`;
  return { backgroundImage: svgUrl(svg), backgroundSize: `${size}px ${size}px` };
}

// ----------------------------------------------------------------------

/** Stepped diamond used in card corners. */
export function CornerDiamond({ size = 28, color = BROCADE.red, sx }: { size?: number; color?: string; sx?: SxProps<Theme> }) {
  return (
    <Box component="svg" viewBox="0 0 28 28" sx={{ width: size, height: size, flexShrink: 0, ...(sx as object) }}>
      <path d="M14 0 28 14 14 28 0 14Z" fill={color} />
      <path d="M14 6 22 14 14 22 6 14Z" fill={BROCADE.gold} />
      <path d="M14 10.5 17.5 14 14 17.5 10.5 14Z" fill={BROCADE.white} />
    </Box>
  );
}

/** Gong (chiêng) with a central boss — Space of Gong Culture of the Central Highlands. */
export function Gong({ size = 160, children, sx }: { size?: number; children?: React.ReactNode; sx?: SxProps<Theme> }) {
  const id = `gong-${useId().replace(/:/g, '')}`;
  return (
    <Box sx={{ position: 'relative', width: size, height: size, display: 'grid', placeItems: 'center', ...(sx as object) }}>
      <Box component="svg" viewBox="0 0 160 160" sx={{ position: 'absolute', inset: 0, width: 1, height: 1 }}>
        <defs>
          <radialGradient id={id} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFE7A3" />
            <stop offset="45%" stopColor="#E0A100" />
            <stop offset="100%" stopColor="#8A5A00" />
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="78" fill={`url(#${id})`} />
        <circle cx="80" cy="80" r="66" fill="none" stroke="#7A4100" strokeOpacity=".35" strokeWidth="2" />
        <circle cx="80" cy="80" r="56" fill="none" stroke="#FFF5CC" strokeOpacity=".5" strokeWidth="1.5" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI) / 8;
          return <path key={i} d={`M${80 + Math.cos(a) * 60} ${80 + Math.sin(a) * 60} L${80 + Math.cos(a) * 70} ${80 + Math.sin(a) * 70}`} stroke="#7A4100" strokeOpacity=".35" strokeWidth="3" />;
        })}
        <circle cx="80" cy="80" r="40" fill="#FFF5CC" fillOpacity=".18" />
      </Box>
      <Box sx={{ position: 'relative', textAlign: 'center' }}>{children}</Box>
    </Box>
  );
}

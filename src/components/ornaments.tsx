// Ornaments drawn after Ê-đê brocade (thổ cẩm) as worn today:
// - indigo-black cloth with horizontal groups of thin stripes (red, yellow, green, cream)
// - a red woven band in the middle carrying cream geometric motifs (diamond chains, X)
// - red loincloth panels with teal side stripes and a cream diamond chain running down
// - red/black tassels at the ends, red wool pom-poms on the shoulders
// Purely geometric; motif meanings are not claimed. Have the client's artisan review.

import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import { useId } from 'react';

import Box from '@mui/material/Box';

export const BROCADE = {
  black: '#16171B',
  indigo: '#1E2230',
  red: '#C8401E',
  weaveRed: '#B5301C',
  deepRed: '#8E1F12',
  gold: '#E0A100',
  yellow: '#E8B820',
  green: '#3E9B4F',
  teal: '#2A9FB8',
  cream: '#F1E6CF',
  white: '#F4EFE6',
};

export type Motif = 'skirt' | 'sleeve' | 'pinstripe' | 'khoPanel';

type Tile = { url: string; w: number; h: number };

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const svg = (w: number, h: number, body: string) =>
  svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`);
const line = (y: number, h: number, fill: string, w: number) => `<rect y='${y}' width='${w}' height='${h}' fill='${fill}'/>`;

const c = BROCADE;

/** Repeating tiles. skirt / sleeve / pinstripe repeat horizontally, khoPanel vertically. */
export const TILES: Record<Motif, Tile> = {
  // Skirt band: stripe group · red band with cream diamond chain · mirrored stripe group
  skirt: {
    w: 24,
    h: 40,
    url: svg(
      24,
      40,
      [
        `<rect width='24' height='40' fill='${c.black}'/>`,
        line(1, 2, c.red, 24),
        line(4, 0.9, c.yellow, 24),
        line(5.8, 0.9, c.green, 24),
        line(7.6, 0.6, c.cream, 24),
        `<rect y='9.5' width='24' height='21' fill='${c.weaveRed}'/>`,
        line(10.4, 0.6, c.yellow, 24),
        line(29, 0.6, c.yellow, 24),
        `<path d='M12 13.2 18.8 20 12 26.8 5.2 20Z' fill='none' stroke='${c.cream}' stroke-width='1.7'/>`,
        `<path d='M12 17.6 14.4 20 12 22.4 9.6 20Z' fill='${c.cream}'/>`,
        `<path d='M0 15.6 4.4 20 0 24.4M24 15.6 19.6 20 24 24.4' fill='none' stroke='${c.cream}' stroke-width='1.7'/>`,
        `<rect x='1' y='12.2' width='1.6' height='1.6' fill='${c.cream}'/><rect x='21.4' y='12.2' width='1.6' height='1.6' fill='${c.cream}'/>`,
        `<rect x='1' y='26.2' width='1.6' height='1.6' fill='${c.cream}'/><rect x='21.4' y='26.2' width='1.6' height='1.6' fill='${c.cream}'/>`,
        line(31.8, 0.6, c.cream, 24),
        line(33.3, 0.9, c.green, 24),
        line(35.1, 0.9, c.yellow, 24),
        line(37, 2, c.red, 24),
      ].join('')
    ),
  },
  // Thin sleeve / hem trim: red edges, cream dashes, yellow and green lines
  sleeve: {
    w: 12,
    h: 14,
    url: svg(
      12,
      14,
      [
        `<rect width='12' height='14' fill='${c.black}'/>`,
        line(1, 2, c.red, 12),
        `<rect x='1' y='4.4' width='4' height='1.2' fill='${c.cream}'/><rect x='7' y='4.4' width='4' height='1.2' fill='${c.cream}'/>`,
        line(7, 0.9, c.yellow, 12),
        line(8.9, 0.9, c.green, 12),
        line(11, 2, c.red, 12),
      ].join('')
    ),
  },
  // Plain black cloth with groups of thin coloured lines (skirt body)
  pinstripe: {
    w: 4,
    h: 28,
    url: svg(
      4,
      28,
      [
        `<rect width='4' height='28' fill='${c.black}'/>`,
        line(3, 1.4, c.red, 4),
        line(5.4, 0.6, c.yellow, 4),
        line(6.8, 0.6, c.green, 4),
        line(8.2, 0.6, c.red, 4),
        line(9.6, 0.4, c.cream, 4),
      ].join('')
    ),
  },
  // Red loincloth panel: teal side stripes, cream diamond chain down the middle (vertical)
  khoPanel: {
    w: 16,
    h: 20,
    url: svg(
      16,
      20,
      [
        `<rect width='16' height='20' fill='${c.weaveRed}'/>`,
        `<rect x='0.8' width='1.2' height='20' fill='${c.teal}'/><rect x='14' width='1.2' height='20' fill='${c.teal}'/>`,
        `<rect x='2.7' width='0.5' height='20' fill='${c.yellow}'/><rect x='12.8' width='0.5' height='20' fill='${c.yellow}'/>`,
        `<path d='M8 3.2 11.6 10 8 16.8 4.4 10Z' fill='none' stroke='${c.cream}' stroke-width='1.3'/>`,
        `<path d='M8 8.4 9.6 10 8 11.6 6.4 10Z' fill='${c.cream}'/>`,
        `<path d='M5.6 0 8 1.6 10.4 0M5.6 20 8 18.4 10.4 20' fill='none' stroke='${c.cream}' stroke-width='1.3'/>`,
      ].join('')
    ),
  },
};

// ----------------------------------------------------------------------

type BandProps = { motif?: Motif; height?: number; sx?: SxProps<Theme> };

/** Horizontal woven band. */
export function BrocadeBand({ motif = 'skirt', height = 28, sx }: BandProps) {
  const t = TILES[motif];
  return (
    <Box
      sx={{
        width: 1,
        height,
        flexShrink: 0,
        backgroundImage: t.url,
        backgroundRepeat: 'repeat-x',
        backgroundSize: `${(t.w * height) / t.h}px ${height}px`,
        ...(sx as object),
      }}
    />
  );
}

/** Vertical red loincloth panel (side of the nav). */
export function BrocadeColumn({ width = 12, sx }: { width?: number; sx?: SxProps<Theme> }) {
  const t = TILES.khoPanel;
  return (
    <Box
      sx={{
        width,
        height: 1,
        flexShrink: 0,
        backgroundImage: t.url,
        backgroundRepeat: 'repeat-y',
        backgroundSize: `${width}px ${(t.h * width) / t.w}px`,
        ...(sx as object),
      }}
    />
  );
}

/**
 * Background for large dark surfaces: black cloth with a lattice of nested gold
 * diamonds. `size` is the tile size in px.
 */
export function brocadeBackdrop(color: string = c.gold, opacity = 0.08, size = 56): object {
  const o = opacity;
  const body = [
    `<g fill='none' stroke='${color}' stroke-opacity='${o}' stroke-width='2'><path d='M28 4 52 28 28 52 4 28Z'/><path d='M28 14 42 28 28 42 14 28Z'/></g>`,
    `<path d='M28 24 32 28 28 32 24 28Z' fill='${color}' fill-opacity='${o * 1.6}'/>`,
    `<path d='M0 0 4 4M56 0 52 4M0 56 4 52M56 56 52 52' stroke='${color}' stroke-opacity='${o}' stroke-width='2'/>`,
  ].join('');
  return {
    backgroundImage: svg(56, 56, body),
    backgroundSize: `${size}px ${size}px`,
  };
}

// ----------------------------------------------------------------------

/** Red / black tassels hanging under a woven band (ends of the loincloth). */
export function Fringe({ height = 28, sx }: { height?: number; sx?: SxProps<Theme> }) {
  const body = [
    `<rect width='10' height='3' fill='${c.cream}'/>`,
    `<path d='M2.5 3 Q2 ${height * 0.5} 2.8 ${height}' stroke='${c.red}' stroke-width='2' fill='none'/>`,
    `<path d='M7.5 3 Q8 ${height * 0.45} 7.2 ${height - 4}' stroke='${c.black}' stroke-width='2' fill='none'/>`,
  ].join('');
  return (
    <Box
      sx={{
        width: 1,
        height,
        backgroundImage: svg(10, height, body),
        backgroundRepeat: 'repeat-x',
        backgroundSize: `10px ${height}px`,
        ...(sx as object),
      }}
    />
  );
}

/** Red wool pom-pom, as sewn on the shoulders of Ê-đê shirts. */
export function Pompom({ size = 14, sx }: { size?: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: `radial-gradient(circle at 35% 35%, #F0715A 0%, ${c.red} 55%, ${c.deepRed} 100%)`,
        boxShadow: `0 0 0 1px ${c.deepRed}55, 0 2px 4px rgba(0,0,0,.3)`,
        ...(sx as object),
      }}
    />
  );
}

/** Small cream diamond on red, the motif unit of the woven band. */
export function CornerDiamond({ size = 28, sx }: { size?: number; color?: string; sx?: SxProps<Theme> }) {
  return (
    <Box component="svg" viewBox="0 0 28 28" sx={{ width: size, height: size, flexShrink: 0, ...(sx as object) }}>
      <path d="M14 0 28 14 14 28 0 14Z" fill={c.weaveRed} />
      <path d="M14 5 23 14 14 23 5 14Z" fill="none" stroke={c.cream} strokeWidth="2.2" />
      <path d="M14 10.5 17.5 14 14 17.5 10.5 14Z" fill={c.cream} />
    </Box>
  );
}

/** Gong (chiêng) with a central boss — Space of Gong Culture of the Central Highlands. */
export function Gong({ size = 160, children, sx }: { size?: number; children?: ReactNode; sx?: SxProps<Theme> }) {
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
          return (
            <path
              key={i}
              d={`M${80 + Math.cos(a) * 60} ${80 + Math.sin(a) * 60} L${80 + Math.cos(a) * 70} ${80 + Math.sin(a) * 70}`}
              stroke="#7A4100"
              strokeOpacity=".35"
              strokeWidth="3"
            />
          );
        })}
        <circle cx="80" cy="80" r="40" fill="#FFF5CC" fillOpacity=".18" />
      </Box>
      <Box sx={{ position: 'relative', textAlign: 'center' }}>{children}</Box>
    </Box>
  );
}

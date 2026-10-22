import type { TextFieldProps } from '@mui/material/TextField';

import { useRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { radeFont } from 'src/theme';
import { nfc, applyZeroShortcut, RADE_SPECIAL_KEYS } from 'src/utils/text';

import { Iconify } from './iconify';

type Props = Omit<TextFieldProps, 'onChange' | 'value'> & {
  value: string;
  onChange: (v: string) => void;
  showKeys?: boolean;
};

/**
 * Text input for Ê-đê: on-screen key bar for ƀ č ñ ĕ ê̆ …, plus the community
 * "letter + 0" shortcut (b0 → ƀ). Vietnamese IMEs (Unikey/EVKey) keep working.
 */
export function RadeInput({ value, onChange, showKeys = true, inputRef: _ignored, sx, ...other }: Props) {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const setCaret = (pos: number) => {
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(pos, pos);
    });
  };

  const insert = (ch: string) => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = nfc(value.slice(0, start) + ch + value.slice(end));
    onChange(next);
    setCaret(nfc(value.slice(0, start) + ch).length);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const shortcut = applyZeroShortcut(raw, caret);
    if (shortcut) {
      onChange(shortcut.value);
      setCaret(shortcut.caret);
    } else {
      onChange(raw);
    }
  };

  return (
    <Box sx={sx}>
      <TextField
        fullWidth
        value={value}
        onChange={handleChange}
        inputRef={ref}
        autoComplete="off"
        spellCheck={false}
        slotProps={{ htmlInput: { lang: 'rad', style: { fontFamily: radeFont, fontSize: 20 } } }}
        {...other}
      />
      {showKeys && (
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.75} sx={{ mt: 1.25 }}>
          <Tooltip title='Bấm để chèn, hoặc gõ chữ + số 0 (b0 → ƀ, c0 → č, n0 → ñ, e0 → ĕ, ô0 → ô̆)' arrow>
            <Box sx={{ display: 'flex', color: 'text.disabled', mr: 0.5 }}>
              <Iconify icon="solar:keyboard-bold-duotone" width={22} />
            </Box>
          </Tooltip>
          {RADE_SPECIAL_KEYS.map((k) => (
            <ButtonBase
              key={k}
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insert(k)}
              sx={{
                minWidth: 36,
                height: 36,
                borderRadius: 1,
                fontFamily: radeFont,
                fontSize: 18,
                fontWeight: 600,
                bgcolor: 'background.paper',
                border: (t) => `1px solid ${alpha(t.palette.grey[500], 0.24)}`,
                boxShadow: (t) => `0 2px 0 ${alpha(t.palette.grey[500], 0.24)}`,
                transition: 'all .12s',
                '&:hover': { bgcolor: 'primary.lighter', color: 'primary.dark', borderColor: 'primary.light' },
                '&:active': { transform: 'translateY(2px)', boxShadow: 'none' },
              }}
            >
              {k}
            </ButtonBase>
          ))}
          <Typography variant="caption" sx={{ color: 'text.disabled', ml: 1 }}>
            Mẹo: gõ <b>b0</b> → ƀ
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import type { CultureItem } from 'src/data/culture';
import { wordById } from 'src/data/vocab';
import cultureImages from 'src/data/culture-images.json';
import { culture, CULTURE_NOTICE } from 'src/data/culture';

import { Iconify } from 'src/components/iconify';
import { RadeText, PageTitle, AudioButton } from 'src/components/common';
import { Fringe, BROCADE, BrocadeBand, CornerDiamond, brocadeBackdrop } from 'src/components/ornaments';

const images = cultureImages as Record<string, string[]>;

export function CulturePage() {
  const [open, setOpen] = useState<CultureItem | null>(null);

  return (
    <>
      <PageTitle
        title="Góc văn hoá"
        subtitle="Tìm hiểu đời sống, phong tục của người Ê-đê và học từ vựng gắn với từng chủ đề."
        action={<Chip size="small" color="warning" variant="outlined" label={CULTURE_NOTICE} />}
      />

      <Grid container spacing={3}>
        {culture.map((item, i) => {
          const pics = images[item.id] ?? [];
          return (
            <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card sx={{ overflow: 'hidden', transition: 'transform .2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardActionArea onClick={() => setOpen(item)}>
                    <Cover item={item} src={pics[0]} height={180} />
                    <BrocadeBand motif="sleeve" height={12} />
                    <Box sx={{ p: 2.5 }}>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, minHeight: 44 }}>
                        {item.summary}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        {pics.length > 0 && <Chip size="small" icon={<Iconify icon="solar:gallery-bold-duotone" width={16} />} label={`${pics.length} ảnh`} />}
                        {item.wordIds.length > 0 && <Chip size="small" variant="outlined" label={`${item.wordIds.length} từ vựng`} />}
                      </Stack>
                    </Box>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={Boolean(open)} onClose={() => setOpen(null)} maxWidth="md" fullWidth>
        {open && <Detail item={open} onClose={() => setOpen(null)} />}
      </Dialog>
    </>
  );
}

/** Photo, or a woven placeholder until the client sends photos. */
function Cover({ item, src, height }: { item: CultureItem; src?: string; height: number }) {
  if (src) return <Box component="img" src={`./${src}`} alt={item.title} sx={{ width: 1, height, objectFit: 'cover', display: 'block' }} />;
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ height, color: BROCADE.cream, bgcolor: BROCADE.black, ...brocadeBackdrop(BROCADE.cream, 0.1, 48) }}>
      <Iconify icon={item.icon} width={56} sx={{ color: BROCADE.cream }} />
      <Typography variant="caption" sx={{ opacity: 0.6 }}>
        Ảnh sẽ được bổ sung
      </Typography>
    </Stack>
  );
}

function Detail({ item, onClose }: { item: CultureItem; onClose: () => void }) {
  const pics = images[item.id] ?? [];
  const [idx, setIdx] = useState(0);
  const related = item.wordIds.map((id) => wordById.get(id)).filter((w): w is NonNullable<typeof w> => Boolean(w));

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <Cover item={item} src={pics[idx]} height={380} />
        {pics.length > 1 && (
          <>
            <IconButton onClick={() => setIdx((i) => (i - 1 + pics.length) % pics.length)} sx={navBtn('left')}>
              <Iconify icon="solar:alt-arrow-left-linear" width={24} />
            </IconButton>
            <IconButton onClick={() => setIdx((i) => (i + 1) % pics.length)} sx={navBtn('right')}>
              <Iconify icon="solar:alt-arrow-right-linear" width={24} />
            </IconButton>
          </>
        )}
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, color: '#fff', bgcolor: 'rgba(0,0,0,.4)', '&:hover': { bgcolor: 'rgba(0,0,0,.6)' } }}>
          <Iconify icon="solar:close-circle-linear" width={24} />
        </IconButton>
      </Box>
      {pics.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ p: 1.5, overflowX: 'auto', bgcolor: BROCADE.black }}>
          {pics.map((p, i) => (
            <Box
              key={p}
              component="img"
              src={`./${p}`}
              onClick={() => setIdx(i)}
              sx={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 0.5, cursor: 'pointer', opacity: i === idx ? 1 : 0.5, outline: i === idx ? `2px solid ${BROCADE.red}` : 'none' }}
            />
          ))}
        </Stack>
      )}
      <BrocadeBand motif="skirt" height={28} />

      <Box sx={{ p: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <CornerDiamond size={26} />
          <Typography variant="h4">{item.title}</Typography>
        </Stack>
        <Stack spacing={1.5}>
          {item.body.map((p) => (
            <Typography key={p} variant="body1" sx={{ lineHeight: 1.8 }}>
              {p}
            </Typography>
          ))}
        </Stack>

        {related.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 4, mb: 1.5 }}>
              Từ vựng liên quan
            </Typography>
            <Grid container spacing={1.5}>
              {related.map((w) => (
                <Grid key={w.id} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'grey.100' }}>
                    <AudioButton id={w.id} size={36} />
                    <RadeText sx={{ fontSize: 20, minWidth: 90 }}>{w.rade}</RadeText>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {w.vi.join(', ')}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
      <Fringe height={22} />
    </Box>
  );
}

const navBtn = (side: 'left' | 'right') => ({
  position: 'absolute',
  top: '50%',
  [side]: 12,
  transform: 'translateY(-50%)',
  color: '#fff',
  bgcolor: 'rgba(0,0,0,.4)',
  '&:hover': { bgcolor: 'rgba(0,0,0,.6)' },
});

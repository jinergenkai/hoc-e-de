import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';

import { words, topics, wordsByTopic } from 'src/data/vocab';
import { useProgress } from 'src/store/progress';

import { Iconify } from './iconify';

type Props = {
  onPick: (topicId: string) => void;
  includeAll?: boolean;
  selected?: string;
  columns?: { xs?: number; sm?: number; md?: number; lg?: number };
};

export function TopicGrid({ onPick, includeAll, selected, columns = { xs: 12, sm: 6, md: 4, lg: 3 } }: Props) {
  const cards = useProgress((s) => s.cards);

  const items = [
    ...(includeAll ? [{ id: 'all', name: 'Tất cả chủ đề', icon: 'solar:star-bold-duotone', color: 'secondary' as const }] : []),
    ...topics,
  ];

  return (
    <Grid container spacing={2.5}>
      {items.map((t) => {
        const list = t.id === 'all' ? words : wordsByTopic(t.id);
        const known = list.filter((w) => cards[w.id]?.known).length;
        const pct = list.length ? Math.round((known / list.length) * 100) : 0;
        const active = selected === t.id;
        return (
          <Grid key={t.id} size={columns}>
            <Card
              sx={{
                transition: 'transform .2s, box-shadow .2s',
                outline: (th) => (active ? `2px solid ${th.palette.primary.main}` : 'none'),
                '&:hover': { transform: 'translateY(-4px)', boxShadow: (th) => th.customShadows.z16 },
              }}
            >
              <CardActionArea onClick={() => onPick(t.id)} sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      display: 'grid',
                      placeItems: 'center',
                      color: `${t.color}.dark`,
                      bgcolor: (th) => alpha(th.palette[t.color].main, 0.16),
                    }}
                  >
                    <Iconify icon={t.icon} width={28} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" noWrap>
                      {t.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {list.length} từ · đã thuộc {known}
                    </Typography>
                  </Box>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  color={t.color}
                  sx={{ bgcolor: (th) => alpha(th.palette[t.color].main, 0.16) }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ABOUT } from 'src/config/about';
import { SAMPLE_DATA_NOTICE } from 'src/data/vocab';
import { RELEASE, RELEASES } from 'src/config/release';

import { Iconify } from 'src/components/iconify';
import { PageTitle } from 'src/components/common';
import { Gong, Fringe, BROCADE, BrocadeBand, CornerDiamond, brocadeBackdrop } from 'src/components/ornaments';

const CREDITS = [
  { name: 'Minimal UI', detail: 'Khung giao diện (material-kit-react)', license: 'MIT', url: 'https://github.com/minimal-ui-kit/material-kit-react' },
  { name: 'Solar Icons', detail: 'Bộ biểu tượng, tác giả 480 Design', license: 'CC BY 4.0', url: 'https://www.figma.com/community/file/1166831539721848736' },
  { name: 'DM Sans, Barlow, Noto Sans', detail: 'Phông chữ (Noto Sans hiển thị chữ Ê-đê)', license: 'SIL OFL 1.1', url: 'https://openfontlicense.org' },
  { name: 'React, MUI, Electron', detail: 'Nền tảng phần mềm', license: 'MIT', url: 'https://mui.com' },
];

export function AboutPage() {
  return (
    <>
      <PageTitle title="Giới thiệu" subtitle="Thông tin sáng kiến và đơn vị triển khai" />

      <Box sx={{ mb: 4 }}>
        <Card sx={{ overflow: 'hidden', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, color: BROCADE.white, bgcolor: BROCADE.black, ...brocadeBackdrop(BROCADE.gold, 0.08, 64) }}>
          <BrocadeBand motif="diamond" height={16} edges />
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={4} sx={{ p: { xs: 4, md: 5 } }}>
            <Gong size={150}>
              <Typography sx={{ fontFamily: '"Noto Sans"', fontWeight: 800, fontSize: 56, color: '#5F120B', lineHeight: 1 }}>Ƀ</Typography>
            </Gong>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ color: BROCADE.yellow, letterSpacing: 2 }}>
                Sáng kiến
              </Typography>
              <Typography variant="h3" sx={{ fontFamily: '"Noto Sans"', mt: 0.5 }}>
                {ABOUT.appName}
              </Typography>
              <Typography sx={{ opacity: 0.8, mb: 2 }}>{ABOUT.tagline}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.72, maxWidth: 720 }}>
                {ABOUT.initiative}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.6 }}>
                Phiên bản {__APP_VERSION__} · Đợt {RELEASE}/{RELEASES.length}
              </Typography>
            </Box>
          </Stack>
          <BrocadeBand motif="sawtooth" height={12} />
        </Card>
        <Fringe height={26} />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Đơn vị triển khai
          </Typography>
          <Stack spacing={2}>
            {ABOUT.members.map((m) => (
              <Card key={m.name} sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                <CornerDiamond size={20} sx={{ position: 'absolute', top: 16, right: 16 }} />
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 30,
                      fontWeight: 800,
                      color: 'common.white',
                      bgcolor: BROCADE.red,
                      boxShadow: `0 0 0 3px ${BROCADE.cream}, 0 0 0 6px ${BROCADE.black}`,
                    }}
                  >
                    {m.name.trim().split(/\s+/).pop()?.charAt(0)}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6">
                      {m.title ? `${m.title} ` : ''}
                      {m.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {m.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {m.unit}
                    </Typography>
                  </Box>
                </Stack>
                {(m.phone || m.email) && (
                  <Stack spacing={0.75} sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                    {m.phone && <Typography variant="body2">📞 {m.phone}</Typography>}
                    {m.email && <Typography variant="body2">✉️ {m.email}</Typography>}
                  </Stack>
                )}
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Mục tiêu
          </Typography>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              {ABOUT.goals.map((g) => (
                <Stack key={g} direction="row" spacing={1.5} alignItems="flex-start">
                  <CornerDiamond size={18} sx={{ mt: 0.25 }} />
                  <Typography variant="body1">{g}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={12}>
          <Typography variant="h5" sx={{ mb: 2, mt: 1 }}>
            Nguồn & ghi nhận
          </Typography>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5, p: 1.5, borderRadius: 1, bgcolor: 'warning.lighter', color: 'warning.darker' }}>
              <Iconify icon="solar:info-circle-bold-duotone" width={22} />
              <Typography variant="body2">{SAMPLE_DATA_NOTICE}. Nội dung chính thức sẽ do chuyên gia tiếng Ê-đê cung cấp và duyệt.</Typography>
            </Stack>
            <Grid container spacing={2}>
              {CREDITS.map((c) => (
                <Grid key={c.name} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Iconify icon="solar:star-bold-duotone" width={20} sx={{ color: 'secondary.main', mt: 0.25 }} />
                    <Box>
                      <Link href={c.url} target="_blank" rel="noopener" underline="hover" variant="subtitle2" color="text.primary">
                        {c.name}
                      </Link>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {c.detail} · Giấy phép {c.license}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

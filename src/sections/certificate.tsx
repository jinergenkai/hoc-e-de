import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import LinearProgress from '@mui/material/LinearProgress';

import { ABOUT } from 'src/config/about';
import { useProfiles } from 'src/store/profiles';
import { useProgress } from 'src/store/progress';
import { words, topics, wordsByTopic } from 'src/data/vocab';

import { Iconify } from 'src/components/iconify';
import { PageTitle, celebrate } from 'src/components/common';
import { Gong, BROCADE, BrocadeBand, BrocadeColumn, CornerDiamond } from 'src/components/ornaments';

const COURSE_NAME = 'Tiếng Ê-đê cơ bản';

// A4 landscape at 96 dpi
const PAGE_W = 1123;
const PAGE_H = 794;

declare global {
  interface Window {
    hriam?: { isDesktop?: boolean; savePdf?: (fileName: string) => Promise<boolean> };
  }
}

export function useCourseProgress() {
  const cards = useProgress((s) => s.cards);
  const perTopic = topics.map((t) => {
    const list = wordsByTopic(t.id);
    const known = list.filter((w) => cards[w.id]?.known).length;
    return { topic: t, known, total: list.length, done: list.length > 0 && known === list.length };
  });
  const known = words.filter((w) => cards[w.id]?.known).length;
  return { perTopic, known, total: words.length, complete: perTopic.every((p) => p.done) };
}

export function CertificatePage() {
  const navigate = useNavigate();
  const { perTopic, known, total, complete } = useCourseProgress();
  const completedAt = useProgress((s) => s.courseCompletedAt);
  const xp = useProgress((s) => s.xp);
  const profileName = useProfiles((s) => s.profiles.find((p) => p.id === s.activeId)?.name ?? '');
  const [name, setName] = useState(profileName);
  const [sample, setSample] = useState(false);

  useEffect(() => {
    if (complete && !completedAt) {
      useProgress.getState().markCourseCompleted();
      celebrate();
    }
  }, [complete, completedAt]);

  const show = complete || sample;
  const date = complete && completedAt ? new Date(completedAt) : new Date();

  const savePdf = async () => {
    const file = `chung-nhan-${(name || 'hoc-vien').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-')}.pdf`;
    if (window.hriam?.savePdf) await window.hriam.savePdf(file);
    else window.print();
  };

  return (
    <>
      <PageTitle title="Chứng nhận hoàn thành khoá" subtitle={`Thuộc toàn bộ từ vựng của ${topics.length} chủ đề để nhận giấy chứng nhận khoá "${COURSE_NAME}".`} />

      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Tiến độ khoá học</Typography>
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
            {known}/{total} từ · {perTopic.filter((p) => p.done).length}/{topics.length} chủ đề
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={(known / total) * 100} sx={{ height: 10, mb: 2 }} />
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {perTopic.map((p) => (
            <Chip
              key={p.topic.id}
              clickable={!p.done}
              onClick={() => !p.done && navigate(`/learn/${p.topic.id}`)}
              color={p.done ? 'success' : 'default'}
              variant={p.done ? 'filled' : 'outlined'}
              icon={<Iconify icon={p.done ? 'solar:check-circle-bold' : 'solar:card-2-bold-duotone'} width={18} />}
              label={`${p.topic.name} ${p.known}/${p.total}`}
            />
          ))}
        </Stack>
      </Card>

      {!complete && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => setSample((v) => !v)}>
              {sample ? 'Ẩn mẫu' : 'Xem mẫu'}
            </Button>
          }
        >
          Còn {total - known} từ nữa là hoàn thành khoá. Bấm vào chủ đề chưa xong để học tiếp.
        </Alert>
      )}

      {show && (
        <>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <TextField label="Họ và tên trên giấy" value={name} onChange={(e) => setName(e.target.value)} sx={{ width: 360 }} />
            <Box sx={{ flexGrow: 1 }} />
            <Button
              size="large"
              variant="contained"
              disabled={!complete}
              onClick={savePdf}
              startIcon={<Iconify icon="solar:download-bold-duotone" />}
            >
              {window.hriam?.savePdf ? 'Lưu PDF' : 'In / Lưu PDF'}
            </Button>
          </Stack>
          <ScaledPage>
            <Certificate name={name || 'Họ và tên học viên'} date={date} known={complete ? known : total} xp={complete ? xp : 1250} sample={!complete} />
          </ScaledPage>
        </>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

/** Shows the fixed-size A4 page scaled to the content width; prints at full size. */
function ScaledPage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / PAGE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Box ref={ref} sx={{ width: 1, height: PAGE_H * scale, mb: 4 }}>
      <Box id="certificate-print" sx={{ width: PAGE_W, height: PAGE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </Box>
      <GlobalStyles
        styles={{
          '@page': { size: 'A4 landscape', margin: 0 },
          '@media print': {
            'body *': { visibility: 'hidden !important' },
            '#certificate-print, #certificate-print *': { visibility: 'visible !important' },
            '#certificate-print': { position: 'fixed', left: 0, top: 0, transform: 'none !important' },
          },
        }}
      />
    </Box>
  );
}

function Certificate({ name, date, known, xp, sample }: { name: string; date: Date; known: number; xp: number; sample: boolean }) {
  const lead = ABOUT.members[0];
  const hash = Math.abs(Array.from(name + date.toISOString().slice(0, 10)).reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7));
  const serial = `HE-${date.getFullYear()}-${String(hash % 100000).padStart(5, '0')}`;
  const dateText = `Ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;

  return (
    <Box
      sx={{
        width: PAGE_W,
        height: PAGE_H,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FBF7EF',
        color: BROCADE.black,
        boxShadow: (t) => t.customShadows.z24,
        overflow: 'hidden',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      <BrocadeBand motif="diamond" height={24} edges />
      <Stack direction="row" sx={{ flexGrow: 1, minHeight: 0 }}>
        <BrocadeColumn width={22} />
        <Box sx={{ flexGrow: 1, m: 2.5, border: `2px solid ${BROCADE.red}`, outline: `1px solid ${BROCADE.red}`, outlineOffset: 4, position: 'relative' }}>
          {[{ top: -11, left: -11 }, { top: -11, right: -11 }, { bottom: -11, left: -11 }, { bottom: -11, right: -11 }].map((pos, i) => (
            <CornerDiamond key={i} size={22} sx={{ position: 'absolute', ...pos }} />
          ))}

          <Stack alignItems="center" sx={{ height: 1, px: 8, pt: 4, pb: 3, textAlign: 'center' }}>
            <Typography sx={{ fontFamily: 'Barlow', fontWeight: 600, letterSpacing: 6, fontSize: 15, color: BROCADE.deepRed }}>
              PHẦN MỀM HỌC TIẾNG Ê-ĐÊ · {ABOUT.appName.toUpperCase()}
            </Typography>
            <Typography sx={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: BROCADE.red, mt: 1.5, letterSpacing: 4 }}>
              GIẤY CHỨNG NHẬN
            </Typography>
            <Typography sx={{ fontSize: 20, mt: 0.5 }}>Hoàn thành khoá học</Typography>
            <Typography sx={{ fontFamily: '"Noto Sans"', fontWeight: 700, fontSize: 24, color: BROCADE.deepRed }}>“{COURSE_NAME}”</Typography>

            <Typography sx={{ fontSize: 18, mt: 4, color: '#454F5B' }}>Chứng nhận học viên</Typography>
            <Typography sx={{ fontFamily: '"Noto Sans"', fontWeight: 700, fontStyle: 'italic', fontSize: 50, lineHeight: 1.3, mt: 0.5 }}>{name}</Typography>
            <Box sx={{ width: 420, height: 2, bgcolor: BROCADE.red, opacity: 0.6, my: 1 }} />
            <Typography sx={{ fontSize: 17, maxWidth: 700, color: '#454F5B' }}>
              đã hoàn thành khoá học {COURSE_NAME} trên phần mềm {ABOUT.appName}: thuộc {known} từ vựng thuộc {topics.length} chủ đề, đạt {xp} điểm kinh nghiệm.
            </Typography>

            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ width: 1, mt: 'auto' }}>
              <Box sx={{ textAlign: 'left', width: 300 }}>
                <Typography sx={{ fontSize: 15, fontStyle: 'italic' }}>{dateText}</Typography>
                <Typography sx={{ fontSize: 13, color: '#637381', mt: 0.5 }}>Số: {serial}</Typography>
              </Box>
              <Gong size={128}>
                <Typography sx={{ fontFamily: '"Noto Sans"', fontWeight: 800, fontSize: 44, color: '#5F120B', lineHeight: 1 }}>Ƀ</Typography>
              </Gong>
              <Box sx={{ textAlign: 'center', width: 300 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{lead?.unit?.toUpperCase()}</Typography>
                <Typography sx={{ fontSize: 13, color: '#637381' }}>{lead?.role}</Typography>
                <Box sx={{ height: 56 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                  {lead?.title ? `${lead.title} ` : ''}
                  {lead?.name}
                </Typography>
              </Box>
            </Stack>
            <Typography sx={{ fontSize: 11, color: '#919EAB', mt: 1.5 }}>
              Giấy chứng nhận do phần mềm cấp, ghi nhận kết quả tự học; không thay thế văn bằng, chứng chỉ theo quy định của Nhà nước.
            </Typography>
          </Stack>
        </Box>
        <BrocadeColumn width={22} />
      </Stack>
      <BrocadeBand motif="diamond" height={24} edges />

      {sample && (
        <Typography
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-24deg)',
            fontFamily: 'Barlow',
            fontWeight: 800,
            fontSize: 220,
            letterSpacing: 24,
            color: 'rgba(200,64,30,.12)',
            pointerEvents: 'none',
          }}
        >
          MẪU
        </Typography>
      )}
    </Box>
  );
}

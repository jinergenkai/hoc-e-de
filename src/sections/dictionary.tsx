import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { fold, loose, editDistance } from "src/utils/text";
import { words, topics, topicById } from "src/data/vocab";
import { useProgress } from "src/store/progress";

import { Iconify } from "src/components/iconify";
import { RadeInput } from "src/components/rade-input";
import { RadeText, PageTitle, AudioButton } from "src/components/common";

import { exampleFor } from "./learn";

export function DictionaryPage() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const cards = useProgress((s) => s.cards);

  const results = useMemo(() => {
    const query = loose(q);
    const fq = fold(q);
    const base = topic ? words.filter((w) => w.topicId === topic) : words;
    if (!query) return base;
    const scored = base
      .map((w) => {
        const keys = [w.rade, ...w.vi];
        let score = 0;
        for (const k of keys) {
          const lk = loose(k);
          const fk = fold(k);
          if (lk === query) score = Math.max(score, 100);
          else if (lk.startsWith(query)) score = Math.max(score, 80);
          else if (fk === fq) score = Math.max(score, 70);
          else if (fk.startsWith(fq)) score = Math.max(score, 60);
          else if (fk.includes(fq)) score = Math.max(score, 40);
          else if (fq.length >= 3 && editDistance(fk, fq) <= 1)
            score = Math.max(score, 30);
        }
        return { w, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.map((x) => x.w);
  }, [q, topic]);

  return (
    <>
      <PageTitle
        title="Từ điển"
        subtitle="Tra hai chiều Ê-đê ↔ Việt. Gõ không dấu vẫn tìm được (ví dụ: buon → ƀuôn)."
      />

      <Card sx={{ p: 3, mb: 3 }}>
        <RadeInput
          value={q}
          onChange={setQ}
          placeholder="Tìm từ tiếng Ê-đê hoặc tiếng Việt…"
          autoFocus
        />
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
          <Chip
            label="Tất cả"
            clickable
            color={!topic ? "primary" : "default"}
            variant={!topic ? "filled" : "outlined"}
            onClick={() => setTopic(null)}
          />
          {topics.map((t) => (
            <Chip
              key={t.id}
              label={t.name}
              clickable
              color={topic === t.id ? "primary" : "default"}
              variant={topic === t.id ? "filled" : "outlined"}
              onClick={() => setTopic(t.id)}
            />
          ))}
        </Stack>
      </Card>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
        {results.length} kết quả
      </Typography>

      <Card>
        {results.length === 0 && (
          <Stack
            alignItems="center"
            spacing={1}
            sx={{ py: 6, color: "text.disabled" }}
          >
            <Iconify icon="solar:magnifer-linear" width={40} />
            <Typography variant="body2">
              Không tìm thấy. Thử gõ không dấu hoặc từ khác.
            </Typography>
          </Stack>
        )}
        {results.map((w, i) => {
          const ex = exampleFor(w);
          return (
            <Box key={w.id}>
              {i > 0 && <Divider sx={{ borderStyle: "dashed" }} />}
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 1.5, sm: 2.5 }}
                sx={{ px: { xs: 2, sm: 3 }, py: 2 }}
              >
                <AudioButton id={w.id} />
                {/* Phones: word, meaning and example stacked; wider screens: in columns */}
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: 0.5, md: 2.5 }}
                  alignItems={{ md: "center" }}
                  sx={{ flexGrow: 1, minWidth: 0 }}
                >
                  <Box sx={{ minWidth: { md: 160 } }}>
                    <RadeText sx={{ fontSize: { xs: 20, sm: 24 } }}>
                      {w.rade}
                    </RadeText>
                    {w.pos && (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled", display: "block" }}
                      >
                        {w.pos}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1">
                      {w.vi.join(", ")}
                    </Typography>
                    {ex && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                        noWrap
                      >
                        <Box
                          component="span"
                          sx={{ fontFamily: '"Noto Sans"' }}
                        >
                          {ex.rade}
                        </Box>{" "}
                        — {ex.vi}
                      </Typography>
                    )}
                    {!ex && w.note && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                        noWrap
                      >
                        {w.note}
                      </Typography>
                    )}
                  </Box>
                </Stack>
                {cards[w.id]?.known && (
                  <Chip
                    size="small"
                    color="success"
                    variant="outlined"
                    label="Đã thuộc"
                  />
                )}
                <Chip
                  size="small"
                  label={topicById.get(w.topicId)?.name}
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                />
              </Stack>
            </Box>
          );
        })}
      </Card>
    </>
  );
}

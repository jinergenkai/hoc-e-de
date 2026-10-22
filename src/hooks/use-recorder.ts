import { useRef, useState, useEffect, useCallback } from 'react';

export type RecorderState = 'idle' | 'recording' | 'denied' | 'unsupported';

const pickMime = () =>
  ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'].find(
    (m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)
  );

/**
 * Microphone recorder with a live input level (0..1) for the meter.
 * Stops automatically after `maxMs`.
 */
export function useRecorder({ maxMs = 10_000 }: { maxMs?: number } = {}) {
  const [state, setState] = useState<RecorderState>(typeof MediaRecorder === 'undefined' ? 'unsupported' : 'idle');
  const [level, setLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLevel(0);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  /** Starts recording; the promise resolves with the audio when stop() is called. */
  const start = useCallback(async (): Promise<Blob | null> => {
    if (recRef.current?.state === 'recording') return null;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      setState('denied');
      return null;
    }
    streamRef.current = stream;
    const mimeType = pickMime();
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recRef.current = rec;

    // Level meter
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);
    const t0 = performance.now();
    const tick = () => {
      analyser.getByteTimeDomainData(buf);
      let peak = 0;
      for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
      setLevel(Math.min(1, peak / 64));
      setElapsed(performance.now() - t0);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    const done = new Promise<Blob | null>((resolve) => {
      rec.onstop = () => {
        ctx.close();
        cleanup();
        setState('idle');
        resolve(chunks.length ? new Blob(chunks, { type: rec.mimeType || mimeType || 'audio/webm' }) : null);
      };
    });

    rec.start();
    setState('recording');
    setElapsed(0);
    timerRef.current = setTimeout(() => rec.state === 'recording' && rec.stop(), maxMs);
    return done;
  }, [cleanup, maxMs]);

  const stop = useCallback(() => {
    if (recRef.current?.state === 'recording') recRef.current.stop();
  }, []);

  return { state, level, elapsed, start, stop, recording: state === 'recording' };
}

/** Play a Blob once; returns a stop function. */
export function playBlob(blob: Blob, onEnd?: () => void) {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  const finish = () => {
    URL.revokeObjectURL(url);
    onEnd?.();
  };
  audio.onended = finish;
  audio.play().catch(finish);
  return () => {
    audio.pause();
    finish();
  };
}

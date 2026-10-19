"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
} from "react";

type VideoBindings = {
  ref: RefObject<HTMLVideoElement | null>;
  onTimeUpdate: (e: SyntheticEvent<HTMLVideoElement>) => void;
  onLoadedMetadata: (e: SyntheticEvent<HTMLVideoElement>) => void;
  onPlay: () => void;
  onPause: () => void;
};

type Player = {
  currentTime: number;
  duration: number;
  playing: boolean;
  hasVideo: boolean;
  /** Bertambah setiap kali pengguna melompat ke detik tertentu; dipakai untuk auto-scroll transkrip. */
  seekToken: number;
  seek: (sec: number) => void;
  toggle: () => void;
  bindings: VideoBindings;
};

const PlayerContext = createContext<Player | null>(null);

export function usePlayer() {
  const player = useContext(PlayerContext);
  if (!player) throw new Error("usePlayer harus dipakai di dalam <PlayerProvider>");
  return player;
}

/**
 * Status pemutaran bersama untuk video, timeline, transkrip, dan daftar pertanyaan.
 * Selama backend belum mengirim URL video, jam pemutaran disimulasikan agar alur
 * klik-timestamp tetap bisa diuji.
 */
export function PlayerProvider({
  videoUrl,
  durationSec,
  children,
}: {
  videoUrl: string | null;
  durationSec: number | null;
  children: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeRef = useRef(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSec ?? 0);
  const [playing, setPlaying] = useState(false);
  const [seekToken, setSeekToken] = useState(0);
  const hasVideo = Boolean(videoUrl);

  useEffect(() => {
    if (hasVideo || !playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const next = Math.min(duration, timeRef.current + (now - last) / 1000);
      last = now;
      // Perbarui state ±4x per detik, setara event timeupdate pada <video>.
      if (Math.floor(next * 4) !== Math.floor(timeRef.current * 4)) setCurrentTime(next);
      timeRef.current = next;
      if (next >= duration) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasVideo, playing, duration]);

  const seek = useCallback(
    (sec: number) => {
      const clamped = Math.max(0, duration > 0 ? Math.min(duration, sec) : sec);
      timeRef.current = clamped;
      if (videoRef.current) videoRef.current.currentTime = clamped;
      setCurrentTime(clamped);
      setSeekToken((token) => token + 1);
    },
    [duration],
  );

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) void video.play();
      else video.pause();
      return;
    }
    if (!playing && timeRef.current >= duration) {
      timeRef.current = 0;
      setCurrentTime(0);
    }
    setPlaying((value) => !value);
  }, [playing, duration]);

  const bindings = useMemo<VideoBindings>(
    () => ({
      ref: videoRef,
      onTimeUpdate: (e) => {
        timeRef.current = e.currentTarget.currentTime;
        setCurrentTime(e.currentTarget.currentTime);
      },
      onLoadedMetadata: (e) => setDuration(e.currentTarget.duration),
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
    }),
    [],
  );

  const value = useMemo(
    () => ({ currentTime, duration, playing, hasVideo, seekToken, seek, toggle, bindings }),
    [currentTime, duration, playing, hasVideo, seekToken, seek, toggle, bindings],
  );

  return <PlayerContext value={value}>{children}</PlayerContext>;
}

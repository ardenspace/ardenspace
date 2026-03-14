import { useEffect, useRef } from "react";
import { useStore } from "../stores/useStore";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const isLoading = useStore((s) => s.isLoading);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sound/audio.wav");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
  }, []);

  // Try to play once loading is done + user has interacted
  useEffect(() => {
    if (isLoading || startedRef.current) return;

    const tryPlay = () => {
      if (!audioRef.current || startedRef.current) return;
      audioRef.current
        .play()
        .then(() => {
          startedRef.current = true;
        })
        .catch(() => {});
    };

    // Try immediately (works if user already interacted)
    tryPlay();

    // Also listen for first interaction
    const handler = () => {
      tryPlay();
      if (startedRef.current) {
        document.removeEventListener("click", handler);
        document.removeEventListener("touchstart", handler);
      }
    };
    document.addEventListener("click", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isLoading]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);
}

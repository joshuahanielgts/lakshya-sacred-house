import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// If video scrubbing is choppy, re-encode with:
// ffmpeg -i input.mp4 -vcodec libx264 -g 1 -pix_fmt yuv420p output.mp4
// The -g 1 flag sets keyframe interval to every frame, enabling smooth seeking

interface ScrollVideoIntroProps {
  onComplete: () => void;
}

const SCROLL_TUNNEL_HEIGHT = 200; // vh units for scroll tunnel (short for quick completion)
const LERP_FACTOR = 0.6; // Smoothing factor (0-1): very responsive
const SEEK_THRESHOLD = 0.01; // Minimum time difference to trigger seek

const ScrollVideoIntro = ({ onComplete }: ScrollVideoIntroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const hasScrolledRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const currentTimeRef = useRef(0);
  const targetTimeRef = useRef(0);
  const scrollHeightRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updateVideoTime = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoDuration <= 0) {
      isAnimatingRef.current = false;
      return;
    }

    const diff = Math.abs(targetTimeRef.current - currentTimeRef.current);
    
    if (diff > SEEK_THRESHOLD) {
      // Near-instant for large jumps, smooth for small movements
      const adaptiveLerp = diff > 0.3 ? 0.8 : LERP_FACTOR;
      currentTimeRef.current = lerp(
        currentTimeRef.current,
        targetTimeRef.current,
        adaptiveLerp
      );
      
      video.currentTime = currentTimeRef.current;
      rafRef.current = requestAnimationFrame(updateVideoTime);
    } else {
      currentTimeRef.current = targetTimeRef.current;
      video.currentTime = currentTimeRef.current;
      isAnimatingRef.current = false;
    }
  }, [videoDuration]);

  const handleVideoMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      setVideoDuration(video.duration);
      video.currentTime = 0;
      currentTimeRef.current = 0;
      targetTimeRef.current = 0;
    }
  }, []);

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const progress = bufferedEnd / video.duration;
      setBufferProgress(progress);
      
      if (progress >= 0.2 && !isVideoReady) {
        setIsVideoReady(true);
      }
    }
  }, [isVideoReady]);

  const handleCanPlayThrough = useCallback(() => {
    setBufferProgress(1);
    setIsVideoReady(true);
  }, []);

  const handleScroll = useCallback(() => {
    if (!isVideoReady || videoDuration <= 0) return;

    if (!hasScrolledRef.current) {
      hasScrolledRef.current = true;
      setShowHint(false);
    }

    if (!scrollHeightRef.current) {
      scrollHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
    }

    const scrollProgress = Math.min(
      Math.max(window.scrollY / scrollHeightRef.current, 0),
      1
    );
    targetTimeRef.current = scrollProgress * videoDuration;

    // Immediately update video for instant response
    const video = videoRef.current;
    if (video) {
      // Direct assignment for instant feedback
      video.currentTime = targetTimeRef.current;
      currentTimeRef.current = targetTimeRef.current;
      
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        rafRef.current = requestAnimationFrame(updateVideoTime);
      }
    }

    if (scrollProgress >= 0.98) {
      setIsComplete(true);
    }
  }, [isVideoReady, videoDuration, updateVideoTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("loadedmetadata", handleVideoMetadata);
    video.addEventListener("durationchange", handleVideoMetadata);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("canplaythrough", handleCanPlayThrough);

    if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
      handleVideoMetadata();
    }
    if (video.readyState >= 4) {
      handleCanPlayThrough();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleVideoMetadata);
      video.removeEventListener("durationchange", handleVideoMetadata);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [handleVideoMetadata, handleProgress, handleCanPlayThrough]);

  useEffect(() => {
    if (!isVideoReady) return;

    window.scrollTo(0, 0);
    scrollHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;

    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      scrollHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVideoReady, handleScroll]);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  useEffect(() => {
    if (!isComplete) {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [isComplete]);

  return (
    <AnimatePresence>
      {!isComplete ? (
        <>
          <div
            ref={containerRef}
            style={{ height: `${SCROLL_TUNNEL_HEIGHT}vh` }}
            className="relative"
          />

          <motion.div
            key="video-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] bg-black"
          >
            <video
              ref={videoRef}
              src="/Video_Ready_After_White_Room.mp4"
              preload="auto"
              muted
              playsInline
              autoPlay={false}
              className="w-full h-full object-cover"
              style={{
                willChange: "contents",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />

            <AnimatePresence>
              {showHint && isVideoReady && (
                <motion.div
                  key="scroll-hint"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center p-2"
                  >
                    <motion.div
                      animate={{ y: [0, 12, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-1 h-2 bg-white/80 rounded-full"
                    />
                  </motion.div>
                  <span className="text-white/70 text-sm tracking-[0.3em] uppercase font-light">
                    Scroll to enter
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {!isVideoReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-white/50 text-sm tracking-widest uppercase"
                >
                  Loading experience...
                </motion.div>
                <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white/40 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${bufferProgress * 100}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <span className="text-white/30 text-xs tracking-wider">
                  {Math.round(bufferProgress * 100)}%
                </span>
              </div>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default ScrollVideoIntro;

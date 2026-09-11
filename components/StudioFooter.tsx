"use client";

import { useEffect, useRef } from "react";
import styles from "./StudioFooter.module.css";
import { VIDEO_SRC } from "@/lib/site";

/* Lookup table asli dari studio_footer_page.html: [gazeAngle, videoTime] */
const GAZE_FRAMES: Array<[number, number]> = [
  [0.037186, 2.54167],
  [0.130722, 2.58333],
  [0.234912, 2.625],
  [0.321399, 2.66667],
  [0.419378, 2.70833],
  [0.493296, 2.75],
  [0.597784, 2.79167],
  [0.763067, 2.83333],
  [0.778708, 2.875],
  [0.878749, 2.91667],
  [0.993308, 2.95833],
  [1.262791, 3.0],
  [1.388902, 3.04167],
  [1.466609, 0.25],
  [1.473318, 0.29167],
  [1.520011, 3.08333],
  [1.53824, 0.33333],
  [1.6056, 0.375],
  [1.640696, 3.125],
  [1.691747, 0.41667],
  [1.779194, 0.45833],
  [1.869867, 0.5],
  [1.984485, 0.54167],
  [2.07265, 0.58333],
  [2.183915, 0.625],
  [2.267155, 0.66667],
  [2.36138, 0.70833],
  [2.44749, 0.75],
  [2.517676, 0.79167],
  [2.605329, 0.83333],
  [2.670889, 0.875],
  [2.809991, 0.91667],
  [2.918365, 0.95833],
  [3.134177, 1.0],
  [3.240289, 1.04167],
  [3.35949, 1.08333],
  [3.464119, 1.125],
  [3.549317, 1.16667],
  [3.663539, 1.20833],
  [3.78152, 1.25],
  [3.878742, 1.29167],
  [3.989446, 1.33333],
  [4.066996, 1.375],
  [4.225574, 1.45833],
  [4.260255, 1.41667],
  [4.276468, 1.5],
  [4.404025, 1.54167],
  [4.487075, 1.58333],
  [4.552949, 1.625],
  [4.628837, 1.66667],
  [4.701131, 1.70833],
  [4.773675, 1.75],
  [4.833089, 1.79167],
  [4.894145, 1.83333],
  [4.962593, 1.875],
  [5.028737, 1.91667],
  [5.090028, 1.95833],
  [5.212041, 2.0],
  [5.28302, 2.04167],
  [5.349352, 2.08333],
  [5.412121, 2.125],
  [5.473636, 2.16667],
  [5.573871, 2.20833],
  [5.656364, 2.25],
  [5.759153, 2.29167],
  [5.85261, 2.33333],
  [5.938647, 2.375],
  [6.048453, 2.41667],
  [6.153327, 2.45833],
  [6.222603, 2.5],
];

const TAU = Math.PI * 2;
const wrappedAngle = (angle: number) => ((angle % TAU) + TAU) % TAU;

function timeForAngle(angle: number) {
  const target = wrappedAngle(angle);
  let nearestTime = GAZE_FRAMES[0][1];
  let nearestDistance = Infinity;
  for (let i = 0; i < GAZE_FRAMES.length; i++) {
    const sampleAngle = GAZE_FRAMES[i][0];
    const time = GAZE_FRAMES[i][1];
    const difference = Math.abs(target - sampleAngle);
    const distance = Math.min(difference, TAU - difference);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestTime = time;
    }
  }
  return nearestTime + 1 / 240;
}

export default function StudioFooter() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let frame = 0;
    let desiredTime = 0;
    let pointer: { x: number; y: number } | null = null;
    let disposed = false;
    const mobile = window.matchMedia("(max-width: 700px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const seek = () => {
      frame = 0;
      if (disposed || mobile.matches || video.readyState < 2 || video.seeking)
        return;
      if (Math.abs(video.currentTime - desiredTime) > 1 / 48) {
        video.currentTime = Math.min(
          desiredTime,
          (video.duration || 7.04) - 1 / 24
        );
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(seek);
    };

    const updateTarget = () => {
      if (mobile.matches || !pointer) return;
      const rect = video.getBoundingClientRect();
      const scale = Math.max(rect.width / 1920, rect.height / 1080);
      const eyeX = rect.left + rect.width / 2 + (948 - 960) * scale;
      const eyeY = rect.top + rect.height / 2 + (418 - 540) * scale;
      const dx = pointer.x - eyeX;
      const dy = pointer.y - eyeY;

      if (Math.hypot(dx, dy) > 8) {
        desiredTime = timeForAngle(Math.atan2(dy, dx));
        schedule();
      }
    };

    const move = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      updateTarget();
    };

    const ready = () => {
      video.loop = mobile.matches;
      if (mobile.matches && !reducedMotion.matches) {
        void video.play().catch(() => {
          /* Keep initial frame if autoplay unavailable */
        });
      } else {
        video.pause();
        if (!mobile.matches) {
          updateTarget();
          schedule();
        }
      }
    };

    const onSeeked = () => schedule();
    const onLoaded = () => ready();
    const onMobile = () => ready();
    const onReduced = () => ready();
    const onResize = () => updateTarget();
    const onScroll = () => updateTarget();

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadeddata", onLoaded);
    mobile.addEventListener("change", onMobile);
    reducedMotion.addEventListener("change", onReduced);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (video.readyState >= 2) ready();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", onLoaded);
      mobile.removeEventListener("change", onMobile);
      reducedMotion.removeEventListener("change", onReduced);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <footer className={styles.footer} aria-label="Footer">
      <div className={styles.footerBackground} aria-hidden="true">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src={VIDEO_SRC}
        />
      </div>

      <div className={styles.logo} role="img" aria-label="Biro Medbrand">
        <span className={styles.logoText}>
          Biro
          <br />
          Medbrand
        </span>
      </div>
    </footer>
  );
}

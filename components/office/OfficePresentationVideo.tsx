"use client";

import { useEffect, useRef, useState } from "react";
import { OFFICE_VIDEO_SRC } from "@/lib/media";
import { useTranslations } from "@/lib/i18n";
import styles from "./OfficePresentationVideo.module.css";

/** Seconds into the reel used as the preview frame before play. */
const THUMBNAIL_TIME = 2;

export default function OfficePresentationVideo() {
  const copy = useTranslations().office.videoSection;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [thumbReady, setThumbReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const seekToThumbnail = () => {
      if (cancelled) return;
      const target = Number.isFinite(video.duration)
        ? Math.min(THUMBNAIL_TIME, Math.max(0, video.duration - 0.25))
        : THUMBNAIL_TIME;
      video.currentTime = target;
    };

    const onSeeked = () => {
      if (!cancelled && video.paused) setThumbReady(true);
    };

    video.addEventListener("seeked", onSeeked);

    if (video.readyState >= 1) {
      seekToThumbnail();
    } else {
      video.addEventListener("loadedmetadata", seekToThumbnail, { once: true });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.currentTime = 0;
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section className={styles.section} id="video" aria-label="Encanto Trade Center project film">
      <div className={styles.bg} style={{ backgroundImage: "url(/images/renders/render-8.jpg)" }} />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <header className={styles.header} data-office-reveal>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 className={styles.title}>{copy.title}</h2>
          </div>
          <p className={styles.lead}>{copy.lead}</p>
        </header>

        <div className={styles.playerWrap} data-office-reveal>
          <video
            ref={videoRef}
            className={`${styles.video} ${thumbReady || playing ? styles.videoReady : ""}`}
            src={OFFICE_VIDEO_SRC}
            playsInline
            controls={playing}
            preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              const video = videoRef.current;
              if (!video || !Number.isFinite(video.duration)) return;
              video.currentTime = Math.min(THUMBNAIL_TIME, Math.max(0, video.duration - 0.25));
            }}
          />
          {!playing ? (
            <button
              type="button"
              className={styles.playOverlay}
              onClick={toggle}
              aria-label="Play video"
              disabled={!thumbReady}
            >
              <span className={styles.playIcon} aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

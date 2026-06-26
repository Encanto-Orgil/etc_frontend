"use client";

import { useRef, useState } from "react";
import styles from "./OfficePresentationVideo.module.css";

export default function OfficePresentationVideo({ embedded = false }: { embedded?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      className={`${styles.section} ${embedded ? styles.embedded : ""}`}
      id="video"
      aria-label="Office Tower видео"
    >
      {!embedded ? (
        <>
          <div className={styles.bg} style={{ backgroundImage: "url(/images/renders/render-8.jpg)" }} />
          <div className={styles.overlay} />
        </>
      ) : null}

      <div className={styles.inner}>
        <div className={styles.playerWrap}>
          <video
            ref={videoRef}
            className={styles.video}
            src="/videos/office.mp4"
            poster="/images/renders/render-8.jpg"
            playsInline
            controls
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          {!playing ? (
            <button type="button" className={styles.playOverlay} onClick={toggle} aria-label="Тоглуулах">
              <span className={styles.playIcon} aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

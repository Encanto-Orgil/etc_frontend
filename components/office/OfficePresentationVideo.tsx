"use client";

import { useRef, useState } from "react";
import { OFFICE_VIDEO_SRC } from "@/lib/media";
import { officeVideoSection } from "@/lib/officeContent";
import styles from "./OfficePresentationVideo.module.css";

export default function OfficePresentationVideo() {
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
    <section className={styles.section} id="video" aria-label="Encanto Trade Center project film">
      <div className={styles.bg} style={{ backgroundImage: "url(/images/renders/render-8.jpg)" }} />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <header className={styles.header} data-office-reveal>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{officeVideoSection.eyebrow}</p>
            <h2 className={styles.title}>{officeVideoSection.title}</h2>
          </div>
          <p className={styles.lead}>{officeVideoSection.lead}</p>
        </header>

        <div className={styles.playerWrap} data-office-reveal>
          <video
            ref={videoRef}
            className={styles.video}
            src={OFFICE_VIDEO_SRC}
            poster="/images/renders/render-8.jpg"
            playsInline
            controls
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          {!playing ? (
            <button type="button" className={styles.playOverlay} onClick={toggle} aria-label="Play video">
              <span className={styles.playIcon} aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

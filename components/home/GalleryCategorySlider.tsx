"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useTranslations } from "@/lib/i18n";
import type { HomeGalleryCategory, HomeGalleryGroup } from "@/lib/homeGallery";
import GalleryFullscreenSlider from "./GalleryFullscreenSlider";
import shared from "./home.shared.module.css";
import styles from "./GalleryCategorySlider.module.css";

import "swiper/css";
import "swiper/css/pagination";

type Props = {
  groups: HomeGalleryGroup[];
};

export default function GalleryCategorySlider({ groups }: Props) {
  const copy = useTranslations().home.gallery;
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [navReady, setNavReady] = useState(false);
  const [categoryId, setCategoryId] = useState<HomeGalleryCategory>(
    groups[0]?.id ?? "renders",
  );
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeGroup = useMemo(
    () => groups.find((group) => group.id === categoryId) ?? groups[0],
    [groups, categoryId],
  );

  const images = activeGroup?.images ?? [];
  const total = images.length;

  useEffect(() => {
    setNavReady(true);
  }, []);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.keyboard.enabled = !lightboxOpen;
  }, [lightboxOpen]);

  const selectCategory = (id: HomeGalleryCategory) => {
    if (id === categoryId) return;
    setCategoryId(id);
    setIndex(0);
    setLightboxOpen(false);
  };

  if (!groups.length || !activeGroup || !total) {
    return null;
  }

  const lightboxItems = images.map((image) => ({
    image,
    title: activeGroup.title,
  }));

  return (
    <>
      <section className={shared.section} id="gallery">
        <div className={shared.container}>
          <div className={styles.header} data-home-reveal>
            <div>
              <p className={shared.eyebrow}>{copy.eyebrow}</p>
              <h2 className={shared.title}>{copy.title}</h2>
            </div>
            <p className={styles.count}>
              {activeGroup.title} · {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
          </div>

          <div className={styles.tabs} role="tablist" aria-label={copy.title} data-home-reveal>
            {groups.map((group) => {
              const selected = group.id === categoryId;
              return (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                  onClick={() => selectCategory(group.id)}
                >
                  <span>{group.title}</span>
                  <span className={styles.tabCount}>{group.images.length}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.slider} data-home-reveal>
            <button
              ref={prevRef}
              type="button"
              className={`${styles.nav} ${styles.navPrev}`}
              aria-label={copy.lightbox.prev}
            >
              <LuChevronLeft aria-hidden />
            </button>

            <div className={styles.stage}>
              {navReady ? (
                <Swiper
                  key={categoryId}
                  modules={[Navigation, Pagination, Keyboard]}
                  className={styles.swiper}
                  slidesPerView={1}
                  spaceBetween={0}
                  loop={total > 1}
                  speed={450}
                  grabCursor
                  keyboard={{ enabled: true }}
                  lazyPreloadPrevNext={1}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  pagination={{
                    el: paginationRef.current,
                    clickable: true,
                    dynamicBullets: total > 12,
                    dynamicMainBullets: 5,
                  }}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => {
                    setIndex(swiper.realIndex);
                  }}
                >
                  {images.map((image, imageIndex) => (
                    <SwiperSlide key={image} className={styles.slide}>
                      <button
                        type="button"
                        className={styles.slideButton}
                        onClick={() => setLightboxOpen(true)}
                        aria-label={`${copy.lightbox.viewImage}: ${activeGroup.title}`}
                      >
                        <img
                          src={image}
                          alt={`${activeGroup.title} ${imageIndex + 1}`}
                          className={styles.image}
                          loading={imageIndex === 0 ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={imageIndex === 0 ? "low" : "auto"}
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className={styles.slideButton}>
                  <img
                    src={images[0]}
                    alt={activeGroup.title}
                    className={styles.image}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              )}
            </div>

            <button
              ref={nextRef}
              type="button"
              className={`${styles.nav} ${styles.navNext}`}
              aria-label={copy.lightbox.next}
            >
              <LuChevronRight aria-hidden />
            </button>
          </div>

          <div ref={paginationRef} className={styles.pagination} />
        </div>
      </section>

      <GalleryFullscreenSlider
        items={lightboxItems}
        initialIndex={index}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        labels={copy.lightbox}
      />
    </>
  );
}

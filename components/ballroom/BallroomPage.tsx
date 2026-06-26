import Link from "next/link";
import SalesContacts from "@/components/SalesContacts";
import InquiryForm from "@/components/InquiryForm";
import type { Tower } from "@/lib/data";
import {
  ballroomCapacitySetups,
  ballroomDimensions,
  ballroomIntro,
  ballroomRenderGalleries,
  ballroomSizeStats,
} from "@/lib/ballroomBrochure";
import BallroomAvailability from "./BallroomAvailability";
import BallroomKeyAdvantages from "./BallroomKeyAdvantages";
import BallroomSkyfold from "./BallroomSkyfold";
import BallroomSubNav from "./BallroomSubNav";
import styles from "./BallroomPage.module.css";

type Props = {
  tower: Tower;
  others: Tower[];
};

export default function BallroomPage({ tower, others }: Props) {
  return (
    <div className={styles.page}>
      <BallroomSubNav />

      <section className={styles.section} id="overview">
        <div className={styles.inner}>
          <div className={styles.introGrid}>
            <header className={styles.sectionHead}>
              <span className={styles.eyebrow}>{ballroomIntro.name}</span>
              <h2 className={styles.title}>Дурсамжийн тансаг ёслолын орчин</h2>
              <p className={styles.lead}>{ballroomIntro.lead}</p>
              <p className={styles.metaLine}>
                {ballroomIntro.location} · {ballroomIntro.areaSqm.toLocaleString()} м² · Тааз{" "}
                {ballroomIntro.ceilingHeightM} м
              </p>
            </header>

            <figure className={styles.heroVisual}>
              <img src={tower.heroImage} alt={ballroomIntro.name} />
            </figure>
          </div>

          <div className={styles.statsRow}>
            {ballroomSizeStats.map((item) => (
              <div key={item.label} className={styles.statCard}>
                <span className={styles.statVal}>
                  {item.value}
                  {item.unit ? <small>{item.unit}</small> : null}
                </span>
                <span className={styles.statLbl}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`} id="capacity">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Багтаамж</span>
            <h2 className={styles.title}>Зохион байгуулалтаар</h2>
            <p className={styles.lead}>
              Үндсэн Ballroom-ийн таазны өндөр {ballroomIntro.ceilingHeightM} м. Доорх
              багтаамж нь layout-аас хамаарч өөрчлөгдөнө.
            </p>
          </header>

          <div className={styles.capacityWrap}>
            <table className={styles.capacityTable}>
              <thead>
                <tr>
                  <th>Зохион байгуулалт</th>
                  <th>Setup</th>
                  <th>Багтаамж</th>
                </tr>
              </thead>
              <tbody>
                {ballroomCapacitySetups.map((row) => (
                  <tr key={row.setup}>
                    <td>
                      <strong>{row.setupMn}</strong>
                      <span>{row.note}</span>
                    </td>
                    <td>{row.setup}</td>
                    <td>{row.capacity} зочин</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <BallroomSkyfold />

      <BallroomKeyAdvantages />

      <section className={styles.section} id="floor-plan">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Төлөвлөлт</span>
            <h2 className={styles.title}>Нийт хэмжээ & байршил</h2>
            <p className={styles.lead}>
              {ballroomDimensions.floors} давхарт байрлах {ballroomIntro.name} нь нийт{" "}
              {ballroomDimensions.totalAreaSqm.toLocaleString()} м² талбайтай.
            </p>
          </header>

          <div className={styles.planGrid}>
            <div className={styles.planStats}>
              <div className={styles.planStat}>
                <span>Нийт талбай</span>
                <strong>{ballroomDimensions.totalAreaSqm.toLocaleString()} м²</strong>
              </div>
              <div className={styles.planStat}>
                <span>Байршил</span>
                <strong>{ballroomDimensions.floors}</strong>
              </div>
              <div className={styles.planStat}>
                <span>Таазны өндөр</span>
                <strong>{ballroomDimensions.ceilingHeightM} м</strong>
              </div>
              <div className={styles.planStat}>
                <span>Reception багтаамж</span>
                <strong>{ballroomDimensions.capacity} хүн</strong>
              </div>
              <div className={styles.planStat}>
                <span>Хуваалт</span>
                <strong>3 танхим</strong>
              </div>
            </div>

            <figure className={styles.planVisual}>
              <img
                src={ballroomDimensions.floorPlanImage}
                alt={ballroomDimensions.floorPlanCaption}
              />
              <figcaption>{ballroomDimensions.floorPlanCaption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`} id="availability">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Захиалга</span>
            <h2 className={styles.title}>Сул өдөр, цаг шалгах</h2>
            <p className={styles.lead}>
              Календар дээрээс өдөр сонгоод боломжтой цагийг шалгаж, захиалгын хүсэлт илгээнэ үү.
            </p>
          </header>

          <BallroomAvailability />

          <SalesContacts scope="ballroom" variant="strip" />
        </div>
      </section>

      <section className={styles.section} id="gallery">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Render зураг</span>
            <h2 className={styles.title}>6, 7, 9 давхрын визуал</h2>
            <p className={styles.lead}>
              Ballroom болон 9-р давхрын open terrace-ийн render материалууд.
            </p>
          </header>

          <div className={styles.floorGalleries}>
            {ballroomRenderGalleries.map((group) => (
              <div key={group.floor} className={styles.floorGallery}>
                <div className={styles.floorGalleryHead}>
                  <h3>{group.floor}</h3>
                  <span>{group.caption}</span>
                </div>
                <div className={styles.galleryGrid}>
                  {group.images.map((item, index) => (
                    <figure
                      key={item.src + index}
                      className={`${styles.galleryCell} ${index === 0 ? styles.galleryWide : ""}`}
                    >
                      <img src={item.src} alt={item.alt} />
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`} id="explore">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Explore</span>
            <h2 className={styles.title}>Төслийн бусад хэсгүүд</h2>
          </header>

          <div className={styles.otherGrid}>
            {others.map((item) => (
              <Link key={item.slug} href={`/${item.slug}`} className={styles.otherCard}>
                <img src={item.heroImage} alt={item.nameMn} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="contact">
        <div className={styles.inner}>
          <SalesContacts scope="ballroom" />
          <div className={styles.contactGrid}>
            <header className={styles.sectionHead}>
              <span className={styles.eyebrow}>Холбоо барих</span>
              <h2 className={styles.title}>Ерөнхий лавлагаа</h2>
              <p className={styles.lead}>
                Захиалгын календар ашиглахгүйгээр ерөнхий асуултаа үлдээх бол доорх маягтыг бөглөнө үү.
              </p>
            </header>

            <div className={styles.formWrap}>
              <InquiryForm defaultInterest="ballroom" hideInterest />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

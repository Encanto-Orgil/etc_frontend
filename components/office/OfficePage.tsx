import Link from "next/link";
import SalesContacts from "@/components/SalesContacts";
import InquiryForm from "@/components/InquiryForm";
import type { Tower } from "@/lib/data";
import {
  glassBridge,
  officeFloorPlans,
  officeHighlights,
  officeIntro,
  officeLocation,
  officeServices,
  officeStandards,
  officeStoryPoints,
  officeTimeline,
} from "@/lib/officeBrochure";
import OfficePresentationVideo from "./OfficePresentationVideo";
import OfficeStackingPlan from "./OfficeStackingPlan";
import OfficeSubNav from "./OfficeSubNav";
import styles from "./OfficePage.module.css";

type Props = {
  tower: Tower;
  others: Tower[];
};

export default function OfficePage({ tower, others }: Props) {
  return (
    <div className={styles.page}>
      <OfficeSubNav />

      {/* 1. Overview */}
      <section className={styles.section} id="overview">
        <div className={styles.inner}>
          <div className={styles.overviewIntro}>
            <div className={styles.overviewCopy}>
              <header className={styles.sectionHead}>
                <h2 className={styles.title}>{officeIntro.name}</h2>
                <p className={styles.lead}>{officeIntro.lead}</p>
              </header>

              <div className={styles.statsRow}>
                {officeHighlights.map((item) => (
                  <div key={item.label} className={styles.statCard}>
                    <span className={styles.statVal}>
                      {item.value}
                      {item.unit ? <small>{item.unit}</small> : null}
                    </span>
                    <span className={styles.statLbl}>{item.label}</span>
                    {item.note ? <span className={styles.statNote}>{item.note}</span> : null}
                  </div>
                ))}
              </div>
            </div>

            <figure className={styles.overviewVisual}>
              <img src={tower.heroImage} alt={officeIntro.name} />
            </figure>
          </div>

          <div className={styles.storySection}>
            <div className={styles.storyList}>
              {officeStoryPoints.map((item, i) => (
                <article
                  key={item.title}
                  className={styles.storyItem}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className={styles.storyNum}>{String(i + 2).padStart(2, "0")}</span>
                  <div className={styles.storyBody}>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside className={styles.storyClosing}>
              <p>{officeIntro.closing}</p>
              <a href="#contact" className={styles.storyCta}>
                Түрээсийн лавлагаа авах
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* 2. Video */}
      <OfficePresentationVideo embedded />

      {/* 3. Stacking plan */}
      <OfficeStackingPlan />

      {/* 4. Location */}
      <section className={`${styles.section} ${styles.sectionSoft}`} id="location">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Байршил</span>
            <h2 className={styles.title}>Хотын төвөөс 900 метр</h2>
            <p className={styles.lead}>{officeLocation.intro}</p>
          </header>

          <div className={styles.locationGrid}>
            <div className={styles.locationMain}>
              <p className={styles.cardLabel}>Хаяг</p>
              <p className={styles.cardValue}>{officeLocation.address}</p>
              <p className={styles.cardMeta}>
                {officeLocation.zone} · Хотын төвөөс {officeLocation.fromCenter}
              </p>
            </div>

            <div className={styles.landmarkCol}>
              <p className={styles.colTitle}>Дурсгал, парк</p>
              <ul className={styles.landmarkList}>
                {officeLocation.landmarks.map((item) => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    <strong>{item.distance}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.landmarkCol}>
              <p className={styles.colTitle}>Сургууль</p>
              <ul className={styles.landmarkList}>
                {officeLocation.schools.map((item) => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    <strong>{item.distance}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Specs — floor plans, timeline, engineering */}
      <section className={styles.section} id="specs">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Техникийн мэдээлэл</span>
            <h2 className={styles.title}>Талбай, хугацаа, стандарт</h2>
          </header>

          <div className={styles.specsTop}>
            <div className={styles.planCol}>
              <h3 className={styles.blockTitle}>Давхарын сонголт</h3>
              <div className={styles.planStack}>
                {officeFloorPlans.map((plan) => (
                  <article key={plan.level} className={styles.planCard}>
                    <div className={styles.planHead}>
                      <h4>{plan.level}</h4>
                      <p>{plan.note}</p>
                    </div>
                    {"sizes" in plan && plan.sizes ? (
                      <div className={styles.sizeChips}>
                        {plan.sizes.map((size) => (
                          <span key={size} className={styles.sizeChip}>
                            {size}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {"plans" in plan && plan.plans ? (
                      <div className={styles.planRows}>
                        {plan.plans.map((p) => (
                          <div key={p.name} className={styles.planRow}>
                            <span>{p.name}</span>
                            <strong>{p.size}</strong>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <p className={styles.planParking}>{plan.parking}</p>
                  </article>
                ))}
              </div>

              <div className={styles.timelineRow}>
                {officeTimeline.map((item) => (
                  <div key={item.label} className={styles.timelineItem}>
                    <span className={styles.timelineLabel}>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.standardCol}>
              <h3 className={styles.blockTitle}>Инженерийн стандарт</h3>
              <div className={styles.standardGrid}>
                {officeStandards.map((item, i) => (
                  <article key={item.title} className={styles.standardCard}>
                    <span className={styles.standardNum}>{String(i + 1).padStart(2, "0")}</span>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Ecosystem */}
      <section className={`${styles.section} ${styles.sectionDark}`} id="ecosystem">
        <div className={styles.inner}>
          <div className={styles.ecoGrid}>
            <div>
              <span className={styles.eyebrowLight}>{glassBridge.title}</span>
              <h2 className={styles.titleLight}>Гадагш гаралгүй бүх үйлчилгээ</h2>
              <p className={styles.leadLight}>{glassBridge.description}</p>
              <div className={styles.destChips}>
                {glassBridge.destinations.map((d) => (
                  <span key={d} className={styles.destChip}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.servicesPanel}>
              <p className={styles.servicesTitle}>Encanto Trade Center</p>
              <ul className={styles.servicesList}>
                {officeServices.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Gallery */}
      <section className={`${styles.section} ${styles.sectionSoft}`} id="gallery">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Галерей</span>
            <h2 className={styles.title}>Зураг материал</h2>
          </header>
          <div className={styles.galleryGrid}>
            {tower.gallery.map((g, i) => (
              <figure
                key={g.image + i}
                className={`${styles.galleryCell} ${i === 0 ? styles.galleryWide : ""}`}
              >
                <img src={g.image} alt={g.caption || tower.nameMn} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact */}
      <section className={styles.section} id="contact">
        <div className={styles.inner}>
          <SalesContacts scope="office" />
          <div className={styles.contactGrid}>
            <div className={styles.contactCopy}>
              <span className={styles.eyebrow}>Холбоо барих</span>
              <h2 className={styles.title}>Түрээсийн лавлагаа</h2>
              <p className={styles.lead}>
                Дэлгэрэнгүй мэдээлэл, үнийн санал авахыг хүсвэл хүсэлт илгээнэ үү эсвэл
                борлуулалтын албанд шууд залгана уу.
              </p>
            </div>
            <div className={styles.formWrap}>
              <InquiryForm defaultInterest="office" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Other towers */}
      <section className={`${styles.section} ${styles.sectionSoft}`} id="explore">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Төсөл</span>
            <h2 className={styles.title}>Бусад хэсгүүд</h2>
          </header>
          <div className={styles.otherGrid}>
            {others.map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className={styles.otherCard}>
                <img src={t.heroImage} alt={t.nameMn} />
                <span>{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

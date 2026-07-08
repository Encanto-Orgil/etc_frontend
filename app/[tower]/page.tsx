import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import TowerHero from "@/components/tower/TowerHero";
import HeroSection from "@/components/HeroSection";
import SalesContacts from "@/components/SalesContacts";
import InquiryForm from "@/components/InquiryForm";
import OfficePage from "@/components/office/OfficePage";
import BallroomPage from "@/components/ballroom/BallroomPage";
import MallPage from "@/components/mall/MallPage";
import ApartmentPage from "@/components/apartment/ApartmentPage";
import JsonLd from "@/components/JsonLd";
import { getTower, towers } from "@/lib/data";
import { towerMetadata, towerWebPageJsonLd } from "@/lib/seo";
import styles from "./tower.module.css";

export function generateStaticParams() {
  return towers.map((t) => ({ tower: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tower: string }>;
}): Promise<Metadata> {
  const { tower } = await params;
  const data = getTower(tower);
  if (!data) return { title: "Encanto Trade Center" };
  return towerMetadata(data);
}

export default async function TowerPage({
  params,
}: {
  params: Promise<{ tower: string }>;
}) {
  const { tower } = await params;
  const data = getTower(tower);
  if (!data) notFound();

  const others = towers.filter((t) => t.slug !== data.slug);
  const featureImage = data.features[0]?.image || data.heroImage;

  const jsonLd = <JsonLd data={towerWebPageJsonLd(data)} />;

  if (data.slug === "office") {
    return (
      <>
        {jsonLd}
        <OfficePage tower={data} others={others} />
      </>
    );
  }

  if (data.slug === "ballroom") {
    return (
      <>
        {jsonLd}
        <BallroomPage tower={data} others={others} />
      </>
    );
  }

  if (data.slug === "mall") {
    return (
      <>
        {jsonLd}
        <MallPage tower={data} others={others} />
      </>
    );
  }

  if (data.slug === "residence") {
    return (
      <>
        {jsonLd}
        <ApartmentPage tower={data} others={others} />
      </>
    );
  }

  return (
    <>
      {jsonLd}
      <TowerHero
        image={data.heroImage}
        eyebrow={`${data.name} · ${data.floors}`}
        title={data.nameMn}
        subtitle={data.tagline}
      />

      <HeroSection
        image={featureImage}
        eyebrow="Танилцуулга"
        title={data.nameMn}
        subtitle={data.description}
      >
        <Link href="#features" className="btn-primary">
          Онцлог үзэх
        </Link>
      </HeroSection>

      <HeroSection
        image={data.features[1]?.image || data.heroImage}
        eyebrow="Тоон үзүүлэлт"
        title={
          <>
            {data.name}
            <br />
            хэмжээ
          </>
        }
      >
        <div className={styles.statsGrid}>
          {data.stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statVal}>
                {s.value}
                {s.unit ? <small>{s.unit}</small> : null}
              </span>
              <span className={styles.statLbl}>{s.label}</span>
            </div>
          ))}
        </div>
      </HeroSection>

      <HeroSection
        id="features"
        image={data.features[2]?.image || data.heroImage}
        eyebrow="Онцлог"
        title={
          <>
            {data.nameMn}
            <br />
            онцлог
          </>
        }
      >
        <ul className={styles.featureList}>
          {data.features.map((f, i) => (
            <li key={f.title} className={styles.featureItem}>
              <span className={styles.featureNum}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </HeroSection>

      <HeroSection
        image={data.gallery[0]?.image || data.heroImage}
        eyebrow="Галерей"
        title="Зураг материал"
      >
        <div className={styles.galleryGrid}>
          {data.gallery.map((g, i) => (
            <figure
              key={g.image + i}
              className={`${styles.galleryCell} ${i === 0 ? styles.galleryWide : ""}`}
            >
              <img src={g.image} alt={g.caption || data.nameMn} />
            </figure>
          ))}
        </div>
      </HeroSection>

      <HeroSection
        image={data.gallery[1]?.image || data.heroImage}
        eyebrow="Бусад хэсэг"
        title="Төслийн бусад хэсгүүд"
      >
        <div className={styles.otherGrid}>
          {others.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className={styles.otherCard}>
              <img src={t.heroImage} alt={t.nameMn} />
              <span className={styles.otherTag}>{t.name}</span>
            </Link>
          ))}
        </div>
      </HeroSection>

      <HeroSection
        id="contact"
        image={data.gallery[2]?.image || data.heroImage}
        eyebrow="Холбоо барих"
        title={
          <>
            {data.nameMn}
            <br />
            лавлах уу?
          </>
        }
        subtitle={`${data.nameMn}-ийн талаар дэлгэрэнгүй мэдээлэл, үнийн санал авахыг хүсвэл хүсэлтээ үлдээнэ үү.`}
      >
        <SalesContacts scope={data.kind as "mall" | "apartment"} />
        <div className={styles.formWrap}>
          <InquiryForm
            defaultInterest={data.kind as "office" | "mall" | "ballroom" | "apartment"}
          />
        </div>
      </HeroSection>
    </>
  );
}

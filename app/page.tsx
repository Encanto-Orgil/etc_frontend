import type { Metadata } from "next";
import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import BrandTagline from "@/components/home/BrandTagline";
import TowerFluidStack from "@/components/home/TowerFluidStack";
import HeroSection from "@/components/HeroSection";
import SalesContacts from "@/components/SalesContacts";
import InquiryForm from "@/components/InquiryForm";
import JsonLd from "@/components/JsonLd";
import { project, towers } from "@/lib/data";
import { homeListingJsonLd, homeMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = homeMetadata();

export default function Home() {
  return (
    <>
      <JsonLd data={homeListingJsonLd()} />
      <HeroSlider />

      <BrandTagline />

      <HeroSection
        id="about"
        image={project.droneImage}
        eyebrow="Танилцуулга"
        title={
          <>
            Монголын хамгийн өндөр
            <br />
            шилэн фасадтай металл бүтээц
          </>
        }
        subtitle={project.intro}
      >
        <div className={styles.statsGrid}>
          {project.heroStats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statVal}>
                {s.value}
                {s.unit || ""}
              </span>
              <span className={styles.statLbl}>{s.label}</span>
            </div>
          ))}
        </div>

        <p className={styles.location}>{project.location}</p>

        <div className={styles.aboutActions}>
          <Link href="/#towers" className="btn-primary">
            Төслийн хэсгүүд
          </Link>
          <Link href="/#contact" className="btn-outline">
            Холбоо барих
          </Link>
        </div>
      </HeroSection>

      <TowerFluidStack items={towers} id="towers" />

      <HeroSection
        id="contact"
        image="/images/drone/drone-1.jpg"
        eyebrow="Холбоо барих"
        title={
          <>
            Төслийн талаар
            <br />
            илүү ихийг мэдээрэй
          </>
        }
        subtitle="Оффис, орон сууц, худалдаа эсвэл ёслолын танхимын талаар лавлагаа авахыг хүсвэл хүсэлтээ үлдээнэ үү."
      >
        <div className={styles.contactGrid}>
          <SalesContacts scope="home" onDark className={styles.contactTeam} />
          <div className={styles.formWrap}>
            <InquiryForm />
          </div>
        </div>
      </HeroSection>
    </>
  );
}

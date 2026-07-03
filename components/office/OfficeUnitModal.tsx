"use client";

import { Modal } from "antd";
import { PhoneOutlined, MailOutlined, ClockCircleOutlined } from "@ant-design/icons";
import InquiryForm from "@/components/InquiryForm";
import type { OfficeFloor, OfficeUnit } from "@/lib/officeStacking";
import { STATUS_META } from "@/lib/officeStacking";
import { buildOfficeInquiryMessage, officeSales } from "@/lib/officeSales";
import styles from "./OfficeUnitModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  floor: OfficeFloor | null;
  unit: OfficeUnit | null;
};

export default function OfficeUnitModal({ open, onClose, floor, unit }: Props) {
  if (!floor || !unit) return null;

  const floorLabel = floor.label || `Floor ${floor.floor_number}`;
  const statusMeta = STATUS_META[unit.status];
  const defaultMessage = buildOfficeInquiryMessage(floorLabel, unit.unit_code, unit.area_sqm);
  const initials = officeSales.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      centered
      destroyOnClose
      className={styles.modal}
      title={null}
      closeIcon={<span className={styles.close}>×</span>}
    >
      <div className={styles.header}>
        <span className={styles.badge}>{statusMeta.label}</span>
        <h2 className={styles.title}>
          {floorLabel} · Office {unit.unit_code}
        </h2>
        <p className={styles.meta}>{unit.area_sqm} sqm · Office Tower</p>
      </div>

      <div className={styles.salesCard}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.salesInfo}>
          <p className={styles.salesName}>{officeSales.name}</p>
          <p className={styles.salesDept}>{officeSales.department}</p>
          <div className={styles.contacts}>
            {officeSales.phones.map((phone) => (
              <a key={phone} href={`tel:+976${phone.replace(/-/g, "")}`}>
                <PhoneOutlined /> {phone}
              </a>
            ))}
            <a href={`mailto:${officeSales.email}`}>
              <MailOutlined /> {officeSales.email}
            </a>
            <span>
              <ClockCircleOutlined /> {officeSales.hours}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.formBlock}>
        <h3 className={styles.formTitle}>Send a leasing inquiry</h3>
        <p className={styles.formSub}>
          Fill out the form below. Our sales team will contact you shortly.
        </p>
        <InquiryForm
          key={`${floor.id}-${unit.id}`}
          defaultInterest="office"
          defaultMessage={defaultMessage}
          hideInterest
          locale="en"
          onSuccess={onClose}
        />
      </div>
    </Modal>
  );
}

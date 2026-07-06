"use client";

import { CheckCircleFilled, HomeOutlined, MoreOutlined } from "@ant-design/icons";
import { Card, Dropdown, Tag } from "antd";
import type { LeaseContract } from "@/lib/propertyManagement";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import styles from "../dashboard/DashboardOverview.module.css";

const STATUS_COLORS: Record<string, string> = {
  active: "green",
  draft: "default",
  ended: "blue",
  terminated: "red",
};

function formatDate(value: string | null) {
  return value || "-";
}

export default function PortalContractCard({ contract }: { contract: LeaseContract }) {
  return (
    <Card bordered className={styles.projectCard} styles={{ body: { padding: 16 } }}>
      <div className={styles.projectTop}>
        <div className={styles.projectNameGroup}>
          <span className={`${styles.projectLogo} ${styles.black}`}>
            <HomeOutlined />
          </span>
          <strong>{contract.unit_code}</strong>
        </div>

        <div className={styles.projectActions}>
          <span className={styles.statusButton} aria-label="Contract status">
            <CheckCircleFilled />
          </span>
          <Dropdown
            menu={{
              items: [
                { key: "contract", label: contract.contract_number },
                { key: "building", label: contract.building_name },
              ],
            }}
            trigger={["click"]}
          >
            <button type="button" className={styles.moreButton} aria-label="Open contract menu">
              <MoreOutlined />
            </button>
          </Dropdown>
        </div>
      </div>

      <span className={styles.projectUrl}>
        {contract.building_name} · Floor {contract.floor_number}
      </span>

      <Tag className={styles.repoPill} color={STATUS_COLORS[contract.status]}>
        {contract.status_label}
      </Tag>

      <p className={styles.commitLine}>
        {formatDate(contract.start_date)} – {formatDate(contract.end_date)}
      </p>

      <div className={styles.metadataLine}>
        <span>{formatMoneyDisplay(contract.rent_amount)} / mo</span>
        <span>·</span>
        <span>{contract.contract_number}</span>
      </div>
    </Card>
  );
}

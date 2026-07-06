"use client";

import { EyeOutlined, GithubOutlined, MoreOutlined } from "@ant-design/icons";
import { Card, Tag } from "antd";
import type { RecentPreview } from "@/lib/dashboardMockData";
import styles from "./DashboardOverview.module.css";

export default function RecentPreviewsCard({ preview }: { preview: RecentPreview }) {
  return (
    <Card bordered className={styles.sideCard} styles={{ body: { padding: 16 } }}>
      <h2 className={styles.cardTitle}>Recent Previews</h2>
      <div className={styles.previewCard}>
        <div className={styles.previewProvider}>
          <GithubOutlined />
          <span />
        </div>
        <div className={styles.previewBody}>
          <strong>{preview.title}</strong>
          <div className={styles.previewTags}>
            <Tag className={styles.previewTag}>
              <EyeOutlined />
              Preview
            </Tag>
            <Tag className={styles.previewTag}>
              <GithubOutlined />
              {preview.issue}
            </Tag>
            <Tag className={styles.previewTag}>
              <span className={styles.greenDot} />
              {preview.hash}
            </Tag>
          </div>
        </div>
        <button type="button" className={styles.moreButton} aria-label="Open preview menu">
          <MoreOutlined />
        </button>
      </div>
    </Card>
  );
}

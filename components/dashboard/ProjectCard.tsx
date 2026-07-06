"use client";

import {
  BranchesOutlined,
  CheckCircleFilled,
  GithubOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Card, Dropdown, Tag } from "antd";
import type { Project } from "@/lib/dashboardMockData";
import styles from "./DashboardOverview.module.css";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card bordered className={styles.projectCard} styles={{ body: { padding: 16 } }}>
      <div className={styles.projectTop}>
        <div className={styles.projectNameGroup}>
          <span className={`${styles.projectLogo} ${styles[project.logoTone]}`}>
            {project.logo}
          </span>
          <strong>{project.name}</strong>
        </div>

        <div className={styles.projectActions}>
          <span className={styles.statusButton} aria-label="Deployment ready">
            <CheckCircleFilled />
          </span>
          <Dropdown
            menu={{
              items: [
                { key: "open", label: "Open project" },
                { key: "settings", label: "Project settings" },
              ],
            }}
            trigger={["click"]}
          >
            <button
              type="button"
              className={styles.moreButton}
              aria-label={`Open ${project.name} menu`}
            >
              <MoreOutlined />
            </button>
          </Dropdown>
        </div>
      </div>

      <span className={styles.projectUrl}>{project.url}</span>

      <Tag className={styles.repoPill}>
        <GithubOutlined />
        <span>{project.repo}</span>
      </Tag>

      <p className={styles.commitLine}>{project.commit}</p>

      <div className={styles.metadataLine}>
        <span>{project.time}</span>
        <span>on</span>
        <BranchesOutlined />
        <span>{project.branch}</span>
      </div>
    </Card>
  );
}

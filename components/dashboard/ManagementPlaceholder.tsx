"use client";

import { AppstoreOutlined, CheckCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { DashboardMenuGroup, DashboardSubmenuItem } from "@/lib/dashboardNav";
import styles from "./ManagementPlaceholder.module.css";

type ManagementPlaceholderProps = {
  group: DashboardMenuGroup;
  activeItem: DashboardSubmenuItem;
};

const sampleRows = [
  { name: "Overview", owner: "Operations", status: "Ready" },
  { name: "Pipeline", owner: "Management", status: "Draft" },
  { name: "Reports", owner: "Finance", status: "Ready" },
];

export default function ManagementPlaceholder({ group, activeItem }: ManagementPlaceholderProps) {
  return (
    <section className={styles.shell} aria-label={`${group.label} ${activeItem.label}`}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{group.label}</p>
          <h2>{activeItem.label}</h2>
        </div>
        <Button type="primary" className={styles.primaryButton} icon={<PlusOutlined />}>
          New
        </Button>
      </header>

      <div className={styles.moduleBar}>
        <span className={styles.moduleIcon}>
          <AppstoreOutlined />
        </span>
        <div>
          <strong>{activeItem.label}</strong>
          <span>Odoo-style workspace placeholder for this management module.</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.owner}</td>
                <td>
                  <span className={styles.status}>
                    <CheckCircleFilled />
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

"use client";

import {
  AppstoreOutlined,
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input } from "antd";
import type { Project } from "@/lib/dashboardMockData";
import ProjectCard from "./ProjectCard";
import styles from "./DashboardOverview.module.css";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section className={styles.projectsSection}>
      <div className={styles.projectToolbar}>
        <Input
          className={styles.projectSearch}
          prefix={<SearchOutlined />}
          placeholder="Search Projects..."
          variant="borderless"
        />
        <Button className={styles.iconButton} aria-label="Filter projects" icon={<FilterOutlined />} />
        <div className={styles.viewToggle} aria-label="Project view">
          <Button className={styles.iconButtonActive} aria-label="Grid view" icon={<AppstoreOutlined />} />
          <Button className={styles.iconButton} aria-label="List view" icon={<UnorderedListOutlined />} />
        </div>
        <Dropdown
          menu={{
            items: [
              { key: "project", label: "New Project" },
              { key: "template", label: "Import Template" },
            ],
          }}
          trigger={["click"]}
        >
          <Button className={styles.addButton}>
            <PlusOutlined />
            Add New...
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <h2 className={styles.sectionTitle}>Projects</h2>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

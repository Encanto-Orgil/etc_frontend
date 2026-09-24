"use client";

import { useEffect, useRef, useState } from "react";
import { CameraOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, message } from "antd";
import {
  deleteMyAvatar,
  logout,
  uploadMyAvatar,
  type AuthUser,
} from "@/lib/auth";
import styles from "./DashboardShell.module.css";

const { Header } = Layout;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (name.slice(0, 2) || "U").toUpperCase();
}

export default function TopBar({
  eyebrow,
  title,
  user,
}: {
  eyebrow: string;
  title: string;
  user: AuthUser;
}) {
  const breadcrumb = eyebrow ? `${eyebrow} / ${title}` : title || "Dashboard";
  const [currentUser, setCurrentUser] = useState(user);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const displayName =
    [currentUser.first_name, currentUser.last_name].filter(Boolean).join(" ") ||
    currentUser.username;

  const onPickAvatar = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const next = await uploadMyAvatar(file);
      setCurrentUser(next);
      message.success("Profile зураг хадгаллаа.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Алдаа гарлаа.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Header className={styles.header}>
      <Dropdown
        menu={{
          items: [
            { key: "current", label: breadcrumb },
            { key: "dashboard", label: "Dashboard" },
            { key: "property", label: "Property Management" },
          ],
        }}
        trigger={["click"]}
      >
        <button type="button" className={styles.breadcrumbButton}>
          {breadcrumb}
          <DownOutlined />
        </button>
      </Dropdown>

      <div className={styles.topBarActions}>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          hidden
          onChange={(event) => onPickAvatar(event.target.files?.[0])}
        />
        <Dropdown
          menu={{
            items: [
              {
                key: "name",
                label: (
                  <div>
                    <strong>{displayName}</strong>
                    <div style={{ fontSize: 12, opacity: 0.65 }}>
                      {currentUser.email || `@${currentUser.username}`}
                    </div>
                  </div>
                ),
                disabled: true,
              },
              { type: "divider" },
              {
                key: "upload",
                icon: <CameraOutlined />,
                label: uploading ? "Uploading…" : "Change photo",
                disabled: uploading,
                onClick: () => fileRef.current?.click(),
              },
              ...(currentUser.avatar_url
                ? [
                    {
                      key: "remove",
                      label: "Remove photo",
                      disabled: uploading,
                      onClick: async () => {
                        setUploading(true);
                        try {
                          const next = await deleteMyAvatar();
                          setCurrentUser(next);
                          message.success("Profile зураг устгалаа.");
                        } catch (error) {
                          message.error(
                            error instanceof Error ? error.message : "Алдаа гарлаа.",
                          );
                        } finally {
                          setUploading(false);
                        }
                      },
                    },
                  ]
                : []),
              { type: "divider" },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Sign out",
                onClick: async () => {
                  await logout();
                  window.location.href = "/dashboard/login";
                },
              },
            ],
          }}
          trigger={["click"]}
        >
          <button type="button" className={styles.topUserButton} aria-label="Account menu">
            <Avatar
              className={styles.topAvatar}
              src={currentUser.avatar_url || undefined}
            >
              {initials(displayName)}
            </Avatar>
            <span className={styles.topUserName}>{displayName}</span>
            <DownOutlined className={styles.topUserChevron} />
          </button>
        </Dropdown>
      </div>
    </Header>
  );
}

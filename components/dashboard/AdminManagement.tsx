"use client";

import {
  CameraOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/lib/auth";
import { getMe } from "@/lib/auth";
import {
  createDashboardStaffUser,
  deleteDashboardStaffAvatar,
  fetchDashboardAdminSummary,
  fetchDashboardStaffUsers,
  revokeDashboardStaffUser,
  updateDashboardStaffUser,
  uploadDashboardStaffAvatar,
} from "@/lib/adminManagement";
import type { DashboardAdminSummary, DashboardStaffUser } from "@/lib/adminManagement";
import styles from "./AdminManagement.module.css";

type UserFormValues = {
  username?: string;
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_superuser?: boolean;
  is_active?: boolean;
};

function userInitials(user: Pick<DashboardStaffUser, "full_name" | "username">) {
  const name = (user.full_name || user.username || "?").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AdminManagement() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardAdminSummary | null>(null);
  const [users, setUsers] = useState<DashboardStaffUser[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DashboardStaffUser | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [form] = Form.useForm<UserFormValues>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, userData] = await Promise.all([
        fetchDashboardAdminSummary(),
        fetchDashboardStaffUsers(search ? { search } : undefined),
      ]);
      setSummary(summaryData);
      setUsers(userData);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load admin users.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    getMe().then((user) => {
      if (!user?.is_superuser) {
        router.replace("/dashboard");
        return;
      }
      setCurrentUser(user);
    });
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;
    void load();
  }, [currentUser, load]);

  const openCreate = () => {
    setEditingUser(null);
    form.setFieldsValue({
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      is_superuser: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (user: DashboardStaffUser) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_superuser: user.is_superuser,
      is_active: user.is_active,
      password: "",
    });
    setModalOpen(true);
  };

  const refreshEditingUser = (next: DashboardStaffUser) => {
    setEditingUser(next);
    setUsers((prev) => prev.map((row) => (row.id === next.id ? next : row)));
  };

  const onUploadAvatar = async (file: File) => {
    if (!editingUser) return false;
    setAvatarBusy(true);
    try {
      const next = await uploadDashboardStaffAvatar(editingUser.id, file);
      refreshEditingUser(next);
      message.success("Profile зураг хадгаллаа.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Зураг хадгалахад алдаа гарлаа.");
    } finally {
      setAvatarBusy(false);
    }
    return false;
  };

  const onRemoveAvatar = async () => {
    if (!editingUser) return;
    setAvatarBusy(true);
    try {
      const next = await deleteDashboardStaffAvatar(editingUser.id);
      refreshEditingUser(next);
      message.success("Profile зураг устгалаа.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Зураг устгахад алдаа гарлаа.");
    } finally {
      setAvatarBusy(false);
    }
  };

  const saveUser = async () => {
    const values = await form.validateFields();
    try {
      if (editingUser) {
        const payload: Record<string, string | boolean> = {
          email: values.email || "",
          first_name: values.first_name || "",
          last_name: values.last_name || "",
          is_superuser: !!values.is_superuser,
          is_active: values.is_active !== false,
        };
        if (values.password) payload.password = values.password;
        const next = await updateDashboardStaffUser(editingUser.id, payload);
        refreshEditingUser(next);
        message.success("Хэрэглэгч шинэчлэгдлээ.");
      } else {
        await createDashboardStaffUser({
          username: values.username || "",
          password: values.password || "",
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          is_superuser: values.is_superuser,
        });
        message.success("Dashboard эрхтэй хэрэглэгч нэмэгдлээ.");
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save user.");
    }
  };

  const columns: ColumnsType<DashboardStaffUser> = useMemo(
    () => [
      {
        title: "Хэрэглэгч",
        key: "user",
        render: (_, row) => (
          <div className={styles.userCell}>
            <Avatar
              size={40}
              src={row.avatar_url || undefined}
              className={styles.userAvatar}
            >
              {userInitials(row)}
            </Avatar>
            <div>
              <strong>{row.full_name}</strong>
              <div className={styles.userMeta}>@{row.username}</div>
            </div>
          </div>
        ),
      },
      { title: "И-мэйл", dataIndex: "email", key: "email" },
      {
        title: "Эрх",
        key: "role",
        width: 120,
        render: (_, row) => (
          <Tag color={row.is_superuser ? "gold" : "blue"} icon={<SafetyCertificateOutlined />}>
            {row.role_label}
          </Tag>
        ),
      },
      {
        title: "Төлөв",
        dataIndex: "is_active",
        key: "is_active",
        width: 100,
        render: (active: boolean) => (
          <Tag color={active ? "green" : "default"}>{active ? "Идэвхтэй" : "Идэвхгүй"}</Tag>
        ),
      },
      {
        title: "Сүүлд нэвтэрсэн",
        dataIndex: "last_login",
        key: "last_login",
        width: 160,
        render: (value: string | null) => (value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "—"),
      },
      {
        title: "",
        key: "actions",
        width: 120,
        render: (_, row) => (
          <Space size={4}>
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)} />
            <Popconfirm
              title="Dashboard эрхийг цуцлах уу?"
              disabled={row.id === currentUser?.id}
              onConfirm={() => void revokeDashboardStaffUser(row.id).then(load)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} disabled={row.id === currentUser?.id} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [currentUser?.id, load],
  );

  if (!currentUser) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: 240 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Admin Management</h2>
          <p className={styles.subtitle}>Dashboard руу нэвтрэх staff эрх, superuser эрхийг удирдах.</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => void load()}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Хэрэглэгч нэмэх
          </Button>
        </Space>
      </div>

      <Alert
        type="info"
        showIcon
        message="Зөвхөн superuser энэ хэсгийг харж, dashboard нэвтрэх эрх олгож чадна."
      />

      <div className={styles.metricGrid}>
        <div className={styles.metricCard}>
          <strong>{summary?.summary.staff_count ?? 0}</strong>
          <span>Dashboard хэрэглэгч</span>
        </div>
        <div className={styles.metricCard}>
          <strong>{summary?.summary.active_count ?? 0}</strong>
          <span>Идэвхтэй</span>
        </div>
        <div className={styles.metricCard}>
          <strong>{summary?.summary.superuser_count ?? 0}</strong>
          <span>Superuser</span>
        </div>
      </div>

      <Card className={styles.panel} title="Dashboard Users" extra={<UserOutlined />}>
        <div className={styles.toolbar}>
          <Input.Search
            allowClear
            placeholder="Хайх: username, нэр, и-мэйл"
            style={{ maxWidth: 320 }}
            onSearch={setSearch}
          />
        </div>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingUser ? "Хэрэглэгч засах" : "Dashboard хэрэглэгч нэмэх"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => void saveUser()}
        okText="Хадгалах"
        destroyOnClose
      >
        {editingUser ? (
          <div className={styles.avatarEditor}>
            <Avatar
              size={72}
              src={editingUser.avatar_url || undefined}
              className={styles.userAvatar}
            >
              {userInitials(editingUser)}
            </Avatar>
            <div className={styles.avatarActions}>
              <div className={styles.avatarHint}>Profile зураг</div>
              <Space wrap>
                <Upload
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    void onUploadAvatar(file);
                    return false;
                  }}
                >
                  <Button icon={<CameraOutlined />} loading={avatarBusy}>
                    {editingUser.avatar_url ? "Зураг солих" : "Зураг нэмэх"}
                  </Button>
                </Upload>
                {editingUser.avatar_url ? (
                  <Button danger loading={avatarBusy} onClick={() => void onRemoveAvatar()}>
                    Устгах
                  </Button>
                ) : null}
              </Space>
            </div>
          </div>
        ) : null}

        <Form form={form} layout="vertical">
          {!editingUser ? (
            <>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Username оруулна уу." }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Нууц үг"
                rules={[{ required: true, min: 8, message: "Хамгийн багадаа 8 тэмдэгт." }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          ) : (
            <Form.Item name="password" label="Шинэ нууц үг" extra="Хоосон бол өөрчлөхгүй">
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="first_name" label="Нэр">
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Овог">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="И-мэйл">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="is_superuser" label="Superuser эрх" valuePropName="checked">
            <Switch />
          </Form.Item>
          {editingUser ? (
            <Form.Item name="is_active" label="Идэвхтэй" valuePropName="checked">
              <Switch />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
}

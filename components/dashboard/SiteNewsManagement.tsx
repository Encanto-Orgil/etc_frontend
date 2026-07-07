"use client";

import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  createDashboardSiteNews,
  deleteDashboardSiteNews,
  fetchDashboardSiteNews,
  updateDashboardSiteNews,
  type SiteNewsArticle,
} from "@/lib/siteNewsManagement";
import styles from "./PropertyManagement.module.css";

const NEWS_CATEGORIES = [
  "Construction Update",
  "Sales Launch",
  "Awards",
  "Events",
  "Press Release",
  "Other",
];

type NewsFormValues = {
  category: string;
  title: string;
  excerpt?: string;
  image: string;
  published_at: dayjs.Dayjs;
  is_published: boolean;
  is_featured: boolean;
};

export default function SiteNewsManagement() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<SiteNewsArticle[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SiteNewsArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<NewsFormValues>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setArticles(
        await fetchDashboardSiteNews({
          search: search || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
        }),
      );
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load news.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue({
      category: NEWS_CATEGORIES[0],
      published_at: dayjs(),
      is_published: true,
      is_featured: false,
      image: "/images/renders/render-8.jpg",
    });
    setModalOpen(true);
  };

  const openEdit = (record: SiteNewsArticle) => {
    setEditing(record);
    form.setFieldsValue({
      category: record.category,
      title: record.title,
      excerpt: record.excerpt,
      image: record.image,
      published_at: dayjs(record.published_at),
      is_published: record.is_published,
      is_featured: record.is_featured,
    });
    setModalOpen(true);
  };

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const payload = {
        category: values.category,
        title: values.title,
        excerpt: values.excerpt || "",
        image: values.image,
        published_at: values.published_at.format("YYYY-MM-DD"),
        is_published: values.is_published,
        is_featured: values.is_featured,
      };
      if (editing) {
        await updateDashboardSiteNews(editing.id, payload);
        message.success("News article updated.");
      } else {
        await createDashboardSiteNews(payload);
        message.success("News article created.");
      }
      setModalOpen(false);
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save news article.");
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (record: SiteNewsArticle) => {
    try {
      await updateDashboardSiteNews(record.id, { is_featured: !record.is_featured });
      message.success(record.is_featured ? "Removed from featured." : "Set as featured story.");
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update featured status.");
    }
  };

  const columns: ColumnsType<SiteNewsArticle> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (value, record) => (
        <div>
          <strong>{value}</strong>
          <div className={styles.muted}>{record.category}</div>
        </div>
      ),
    },
    {
      title: "Published",
      dataIndex: "date_label",
      width: 120,
    },
    {
      title: "Status",
      key: "status",
      width: 140,
      render: (_, record) => (
        <Space size={4} wrap>
          <Tag color={record.is_published ? "green" : "default"}>
            {record.is_published ? "Published" : "Draft"}
          </Tag>
          {record.is_featured ? <Tag color="gold">Featured</Tag> : null}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small"
            icon={record.is_featured ? <StarFilled /> : <StarOutlined />}
            onClick={() => toggleFeatured(record)}
            title={record.is_featured ? "Remove featured" : "Set as featured"}
          />
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Delete this article?"
            onConfirm={async () => {
              try {
                await deleteDashboardSiteNews(record.id);
                message.success("Article deleted.");
                load();
              } catch (error) {
                message.error(error instanceof Error ? error.message : "Delete failed.");
              }
            }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.shell}>
      <div className={styles.workspace}>
        <div className={styles.pageHead}>
          <div>
            <h1>News</h1>
            <p>Manage homepage news stories shown in the Latest News section.</p>
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              New article
            </Button>
            <Button icon={<ReloadOutlined />} onClick={load}>
              Refresh
            </Button>
          </Space>
        </div>

        <div className={styles.searchArea}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={load}
            style={{ maxWidth: 280 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: "all", label: "All statuses" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
          <Button icon={<FilterOutlined />} onClick={load}>
            Apply
          </Button>
        </div>

        <Spin spinning={loading}>
          <Table rowKey="id" columns={columns} dataSource={articles} pagination={{ pageSize: 20 }} />
        </Spin>
      </div>

      <Modal
        title={editing ? "Edit article" : "New article"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={save}
        confirmLoading={saving}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select
              options={NEWS_CATEGORIES.map((value) => ({ value, label: value }))}
              showSearch
              allowClear
            />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="excerpt" label="Excerpt">
            <Input.TextArea rows={3} placeholder="Optional summary for the featured story card" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image path"
            rules={[{ required: true }]}
            extra="Public path, e.g. /images/renders/render-8.jpg"
          >
            <Input />
          </Form.Item>
          <Form.Item name="published_at" label="Published date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="is_published" label="Published on homepage" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="is_featured"
            label="Featured story"
            valuePropName="checked"
            extra="The featured story appears large in the homepage news section."
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

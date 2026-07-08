"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Select,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import {
  createDashboardSiteNews,
  deleteDashboardSiteNews,
  fetchDashboardSiteNews,
  updateDashboardSiteNews,
  uploadDashboardNewsImage,
} from "@/lib/siteNewsManagement";
import type { SiteNewsArticle } from "@/lib/siteNewsManagement";
import styles from "./SiteNewsManagement.module.css";

type NewsFormValues = {
  category: string;
  title: string;
  excerpt?: string;
  body?: string;
  image: string;
  published_at: dayjs.Dayjs;
  is_published?: boolean;
  is_featured?: boolean;
  external_url?: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export default function SiteNewsManagement() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<SiteNewsArticle[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [editingArticle, setEditingArticle] = useState<SiteNewsArticle | null>(null);
  const [form] = Form.useForm<NewsFormValues>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardSiteNews({
        search: search || undefined,
        status: status === "all" ? undefined : status,
      });
      setArticles(data);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load news.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditingArticle(null);
    form.setFieldsValue({
      category: "",
      title: "",
      excerpt: "",
      body: "",
      image: "",
      published_at: dayjs(),
      is_published: true,
      is_featured: false,
      external_url: "",
    });
    setModalOpen(true);
  };

  const openEdit = (article: SiteNewsArticle) => {
    setEditingArticle(article);
    form.setFieldsValue({
      category: article.category,
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      image: article.image,
      published_at: dayjs(article.published_at),
      is_published: article.is_published,
      is_featured: article.is_featured,
      external_url: article.external_url || "",
    });
    setModalOpen(true);
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const result = await uploadDashboardNewsImage(file, "cover");
      form.setFieldValue("image", result.url);
      message.success("Cover image uploaded.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Cover upload failed.");
    } finally {
      setUploadingCover(false);
    }
    return false;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const payload = {
        category: values.category.trim(),
        title: values.title.trim(),
        excerpt: values.excerpt?.trim() || "",
        body: values.body || "",
        image: values.image.trim(),
        published_at: values.published_at.format("YYYY-MM-DD"),
        is_published: values.is_published ?? true,
        is_featured: values.is_featured ?? false,
        external_url: values.external_url?.trim() || "",
      };

      if (editingArticle) {
        await updateDashboardSiteNews(editingArticle.id, payload);
        message.success("News article updated.");
      } else {
        await createDashboardSiteNews(payload);
        message.success("News article created.");
      }

      setModalOpen(false);
      await load();
    } catch (error) {
      if (error instanceof Error && error.message) {
        message.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDashboardSiteNews(id);
      message.success("News article deleted.");
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  const columns: ColumnsType<SiteNewsArticle> = useMemo(
    () => [
      {
        title: "Cover",
        dataIndex: "image",
        width: 88,
        render: (image: string) =>
          image ? <Image src={image} alt="" width={56} height={40} className={styles.thumb} /> : "—",
      },
      {
        title: "Title",
        dataIndex: "title",
        render: (title: string, record) => (
          <div>
            <strong>{title}</strong>
            <div className={styles.slug}>{record.slug}</div>
          </div>
        ),
      },
      {
        title: "Category",
        dataIndex: "category",
        width: 140,
      },
      {
        title: "Date",
        dataIndex: "date_label",
        width: 100,
      },
      {
        title: "Status",
        key: "status",
        width: 130,
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
        width: 150,
        render: (_, record) => (
          <Space>
            {record.is_published ? (
              <Button
                size="small"
                icon={<EyeOutlined />}
                href={`/news/${record.slug}`}
                target="_blank"
              />
            ) : null}
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
            <Popconfirm title="Delete this article?" onConfirm={() => void handleDelete(record.id)}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  const coverImage = Form.useWatch("image", form);

  return (
    <div className={styles.page}>
      <Card
        title="Site News"
        extra={
          <Space wrap>
            <Input.Search
              allowClear
              placeholder="Search news"
              style={{ width: 220 }}
              onSearch={setSearch}
            />
            <Select value={status} options={STATUS_OPTIONS} style={{ width: 130 }} onChange={setStatus} />
            <Button icon={<ReloadOutlined />} onClick={() => void load()}>
              Refresh
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              New article
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table rowKey="id" columns={columns} dataSource={articles} pagination={{ pageSize: 10 }} />
        </Spin>
      </Card>

      <Modal
        title={editingArticle ? "Edit news article" : "Create news article"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => void handleSubmit()}
        confirmLoading={saving}
        width={920}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" className={styles.form}>
          <div className={styles.formGrid}>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: "Category is required." }]}>
              <Input placeholder="Construction Update" />
            </Form.Item>
            <Form.Item
              name="published_at"
              label="Published date"
              rules={[{ required: true, message: "Published date is required." }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required." }]}>
            <Input placeholder="Article headline" />
          </Form.Item>

          <Form.Item name="excerpt" label="Excerpt">
            <Input.TextArea rows={2} placeholder="Short summary for the homepage card" />
          </Form.Item>

          <Form.Item label="Cover image" required>
            <div className={styles.coverRow}>
              {coverImage ? (
                <Image src={coverImage} alt="Cover preview" width={160} height={110} className={styles.coverPreview} />
              ) : (
                <div className={styles.coverPlaceholder}>No cover image</div>
              )}
              <Space direction="vertical">
                <Upload
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    void handleCoverUpload(file as File);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />} loading={uploadingCover}>
                    Upload to R2
                  </Button>
                </Upload>
                <Form.Item name="image" noStyle rules={[{ required: true, message: "Cover image is required." }]}>
                  <Input placeholder="Or paste image URL" />
                </Form.Item>
              </Space>
            </div>
          </Form.Item>

          <Form.Item name="body" label="Article body">
            <RichTextEditor
              onUploadImage={(file) => uploadDashboardNewsImage(file, "content").then((result) => result.url)}
            />
          </Form.Item>

          <Form.Item name="external_url" label="External URL (optional)">
            <Input placeholder="https://… (overrides internal detail page when set)" />
          </Form.Item>

          <div className={styles.switchRow}>
            <Form.Item name="is_published" label="Published" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="is_featured" label="Featured on homepage" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

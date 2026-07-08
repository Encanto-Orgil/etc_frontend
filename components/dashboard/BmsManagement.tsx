"use client";

import {
  AlertOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  activateBmsElevatorCard,
  clearBmsFireAlarm,
  createBmsCamera,
  createBmsElevatorCard,
  createBmsFireAlarm,
  deleteBmsCamera,
  deleteBmsElevatorCard,
  fetchBmsCameras,
  fetchBmsElevatorAccessLogs,
  fetchBmsElevatorCards,
  fetchBmsFireAlarms,
  fetchBmsSummary,
  revokeBmsElevatorCard,
  updateBmsCamera,
  updateBmsElevatorCard,
} from "@/lib/bmsManagement";
import type {
  BmsCamera,
  BmsCameraLocation,
  BmsElevatorAccessCard,
  BmsElevatorAccessLog,
  BmsElevatorCardStatus,
  BmsFireAlarmLog,
  BmsFireAlarmSeverity,
  BmsSummary,
} from "@/lib/bmsManagement";
import styles from "./BmsManagement.module.css";

export type BmsManagementView = "dashboard" | "cameras" | "fire-alarms" | "elevator-access";

const CAMERA_LOCATIONS: Array<{ value: BmsCameraLocation; label: string }> = [
  { value: "ballroom", label: "Ballroom" },
  { value: "lobby", label: "Lobby" },
  { value: "parking", label: "Parking" },
  { value: "office", label: "Office Tower" },
  { value: "mall", label: "Mall" },
  { value: "other", label: "Other" },
];

const SEVERITY_COLORS: Record<BmsFireAlarmSeverity, string> = {
  info: "default",
  warning: "gold",
  alarm: "red",
};

const CARD_STATUS_COLORS: Record<BmsElevatorCardStatus, string> = {
  active: "green",
  revoked: "red",
  expired: "default",
};

function isVideoUrl(url: string) {
  return /\.(mp4|webm|m3u8)(\?|$)/i.test(url);
}

function CameraPreview({ camera }: { camera: BmsCamera }) {
  if (!camera.is_active) {
    return <div className={styles.previewFallback}>Камер идэвхгүй</div>;
  }
  if (isVideoUrl(camera.stream_url)) {
    return (
      <video controls muted playsInline src={camera.stream_url} style={{ width: "100%", height: "100%", objectFit: "cover" }}>
        <track kind="captions" />
      </video>
    );
  }
  return (
    <iframe
      src={camera.stream_url}
      title={camera.name}
      style={{ width: "100%", height: "100%", border: 0 }}
      allow="autoplay; encrypted-media"
      referrerPolicy="no-referrer"
    />
  );
}

type BmsManagementProps = {
  view: BmsManagementView;
};

export default function BmsManagement({ view }: BmsManagementProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<BmsSummary | null>(null);
  const [cameras, setCameras] = useState<BmsCamera[]>([]);
  const [alarms, setAlarms] = useState<BmsFireAlarmLog[]>([]);
  const [cards, setCards] = useState<BmsElevatorAccessCard[]>([]);
  const [accessLogs, setAccessLogs] = useState<BmsElevatorAccessLog[]>([]);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<BmsCamera | null>(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<BmsElevatorAccessCard | null>(null);
  const [logsDrawerOpen, setLogsDrawerOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cameraForm] = Form.useForm();
  const [cardForm] = Form.useForm();
  const [alarmForm] = Form.useForm();
  const [alarmModalOpen, setAlarmModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, cameraData, alarmData, cardData] = await Promise.all([
        fetchBmsSummary(),
        fetchBmsCameras(),
        fetchBmsFireAlarms(),
        fetchBmsElevatorCards(),
      ]);
      setSummary(summaryData);
      setCameras(cameraData);
      setAlarms(alarmData);
      setCards(cardData);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load BMS data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAccessLogs = useCallback(async (cardId?: number | null) => {
    try {
      const logs = await fetchBmsElevatorAccessLogs(cardId ? { card: cardId } : undefined);
      setAccessLogs(logs);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load access logs.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCameraModal = (camera?: BmsCamera) => {
    setEditingCamera(camera ?? null);
    cameraForm.setFieldsValue(
      camera ?? {
        name: "",
        location: "ballroom",
        stream_url: "",
        is_active: true,
        notes: "",
        order: cameras.length + 1,
      },
    );
    setCameraModalOpen(true);
  };

  const saveCamera = async () => {
    const values = await cameraForm.validateFields();
    try {
      if (editingCamera) {
        await updateBmsCamera(editingCamera.id, values);
        message.success("Камер шинэчлэгдлээ.");
      } else {
        await createBmsCamera(values);
        message.success("Камер нэмэгдлээ.");
      }
      setCameraModalOpen(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save camera.");
    }
  };

  const openCardModal = (card?: BmsElevatorAccessCard) => {
    setEditingCard(card ?? null);
    cardForm.setFieldsValue(
      card
        ? {
            ...card,
            valid_from: card.valid_from ? dayjs(card.valid_from) : null,
            valid_until: card.valid_until ? dayjs(card.valid_until) : null,
          }
        : {
            card_uid: "",
            holder_name: "",
            company: "",
            department: "",
            allowed_floors: "1,2,3",
            elevator_bank: "office-a",
            status: "active",
            notes: "",
          },
    );
    setCardModalOpen(true);
  };

  const saveCard = async () => {
    const values = await cardForm.validateFields();
    const payload = {
      ...values,
      valid_from: values.valid_from ? values.valid_from.format("YYYY-MM-DD") : null,
      valid_until: values.valid_until ? values.valid_until.format("YYYY-MM-DD") : null,
    };
    try {
      if (editingCard) {
        await updateBmsElevatorCard(editingCard.id, payload);
        message.success("NFC карт шинэчлэгдлээ.");
      } else {
        await createBmsElevatorCard(payload);
        message.success("NFC карт нэмэгдлээ.");
      }
      setCardModalOpen(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save card.");
    }
  };

  const saveAlarm = async () => {
    const values = await alarmForm.validateFields();
    try {
      await createBmsFireAlarm({
        ...values,
        triggered_at: values.triggered_at.toISOString(),
        is_active: true,
      });
      message.success("Галын дохиоллын log нэмэгдлээ.");
      setAlarmModalOpen(false);
      alarmForm.resetFields();
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to create alarm log.");
    }
  };

  const alarmColumns: ColumnsType<BmsFireAlarmLog> = useMemo(
    () => [
      { title: "Zone", dataIndex: "zone", key: "zone", width: 90 },
      { title: "Байршил", dataIndex: "location", key: "location" },
      { title: "Мессеж", dataIndex: "message", key: "message" },
      {
        title: "Түвшин",
        dataIndex: "severity",
        key: "severity",
        width: 100,
        render: (value: BmsFireAlarmSeverity, row) => (
          <Tag color={SEVERITY_COLORS[value]}>{row.severity_label}</Tag>
        ),
      },
      {
        title: "Дуугарсан",
        dataIndex: "triggered_at",
        key: "triggered_at",
        width: 170,
        render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
      },
      {
        title: "Төлөв",
        dataIndex: "is_active",
        key: "is_active",
        width: 110,
        render: (active: boolean) =>
          active ? <Tag color="red">Идэвхтэй</Tag> : <Tag color="green">Зогссон</Tag>,
      },
      {
        title: "",
        key: "actions",
        width: 120,
        render: (_, row) =>
          row.is_active ? (
            <Button size="small" onClick={() => void clearBmsFireAlarm(row.id).then(load)}>
              Clear
            </Button>
          ) : (
            <span>{row.cleared_at ? dayjs(row.cleared_at).format("HH:mm") : "—"}</span>
          ),
      },
    ],
    [load],
  );

  const cardColumns: ColumnsType<BmsElevatorAccessCard> = useMemo(
    () => [
      { title: "NFC UID", dataIndex: "card_uid", key: "card_uid", width: 120 },
      { title: "Эзэмшигч", dataIndex: "holder_name", key: "holder_name" },
      { title: "Компани", dataIndex: "company", key: "company" },
      { title: "Давхар", dataIndex: "allowed_floors", key: "allowed_floors", width: 120 },
      {
        title: "Төлөв",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (value: BmsElevatorCardStatus, row) => (
          <Tag color={CARD_STATUS_COLORS[value]}>{row.status_label}</Tag>
        ),
      },
      {
        title: "Сүүлд",
        key: "last_used",
        width: 150,
        render: (_, row) =>
          row.last_used_at
            ? `${dayjs(row.last_used_at).format("MM-DD HH:mm")} · F${row.last_used_floor}`
            : "—",
      },
      {
        title: "",
        key: "actions",
        width: 220,
        render: (_, row) => (
          <Space size={4}>
            <Button size="small" icon={<EditOutlined />} onClick={() => openCardModal(row)} />
            <Button
              size="small"
              onClick={() => {
                setSelectedCardId(row.id);
                setLogsDrawerOpen(true);
                void loadAccessLogs(row.id);
              }}
            >
              Log
            </Button>
            {row.status === "active" ? (
              <Button
                size="small"
                danger
                icon={<StopOutlined />}
                onClick={() => void revokeBmsElevatorCard(row.id).then(load)}
              />
            ) : (
              <Button
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => void activateBmsElevatorCard(row.id).then(load)}
              />
            )}
            <Popconfirm title="Устгах уу?" onConfirm={() => void deleteBmsElevatorCard(row.id).then(load)}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [load, loadAccessLogs],
  );

  const renderDashboard = () => (
    <>
      <div className={styles.metricGrid}>
        <div className={styles.metricCard}>
          <strong>{summary?.summary.active_camera_count ?? 0}</strong>
          <span>Идэвхтэй камер</span>
        </div>
        <div className={styles.metricCard}>
          <strong>{summary?.summary.camera_count ?? 0}</strong>
          <span>Нийт камер</span>
        </div>
        <div className={styles.metricCard}>
          <strong>{summary?.summary.active_alarm_count ?? 0}</strong>
          <span>Идэвхтэй галын дохио</span>
        </div>
        <div className={styles.metricCard}>
          <strong>{summary?.summary.active_elevator_card_count ?? 0}</strong>
          <span>Идэвхтэй NFC карт</span>
        </div>
        <div className={styles.metricCard}>
          <strong>{summary?.summary.elevator_card_count ?? 0}</strong>
          <span>Нийт NFC карт</span>
        </div>
      </div>

      <Row gutter={12}>
        <Col xs={24} lg={12}>
          <Card className={styles.panel} title="Сүүлийн галын дохиолол">
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={summary?.recent_alarms ?? []}
              columns={alarmColumns.slice(0, 5)}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className={styles.panel} title="Сүүлийн elevator access">
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={summary?.recent_access_logs ?? []}
              columns={[
                { title: "Карт", dataIndex: "holder_name", key: "holder_name" },
                { title: "Давхар", dataIndex: "floor_number", key: "floor_number", width: 70 },
                {
                  title: "Цаг",
                  dataIndex: "accessed_at",
                  key: "accessed_at",
                  render: (value: string) => dayjs(value).format("MM-DD HH:mm"),
                },
                {
                  title: "Үр дүн",
                  dataIndex: "result_label",
                  key: "result_label",
                  width: 90,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderCameras = () => (
    <>
      <div className={styles.headerRow}>
        <p className={styles.subtitle}>Камерын stream URL бүртгэж шууд харах.</p>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openCameraModal()}>
          Камер нэмэх
        </Button>
      </div>
      <div className={styles.cameraGrid}>
        {cameras.map((camera) => (
          <article key={camera.id} className={styles.cameraCard}>
            <div className={styles.cameraPreview}>
              <CameraPreview camera={camera} />
            </div>
            <div className={styles.cameraMeta}>
              <strong>{camera.name}</strong>
              <span>
                {camera.location_label} · {camera.is_active ? "Идэвхтэй" : "Идэвхгүй"}
              </span>
              <span>{camera.stream_url}</span>
            </div>
            <div className={styles.cameraActions}>
              <Button size="small" icon={<EditOutlined />} onClick={() => openCameraModal(camera)}>
                Засах
              </Button>
              <Popconfirm title="Устгах уу?" onConfirm={() => void deleteBmsCamera(camera.id).then(load)}>
                <Button size="small" danger icon={<DeleteOutlined />}>
                  Устгах
                </Button>
              </Popconfirm>
            </div>
          </article>
        ))}
      </div>
    </>
  );

  const renderFireAlarms = () => (
    <>
      <div className={styles.headerRow}>
        <p className={styles.subtitle}>Галын дохиолол дуугарсан түүх, идэвхтэй дохиог clear хийх.</p>
        <Button
          type="primary"
          icon={<AlertOutlined />}
          onClick={() => {
            alarmForm.setFieldsValue({
              zone: "",
              location: "",
              message: "",
              severity: "alarm",
              triggered_at: dayjs(),
              source: "FACP-01",
            });
            setAlarmModalOpen(true);
          }}
        >
          Log нэмэх
        </Button>
      </div>
      <Card className={styles.panel}>
        <Table rowKey="id" dataSource={alarms} columns={alarmColumns} pagination={{ pageSize: 12 }} />
      </Card>
    </>
  );

  const renderElevatorAccess = () => (
    <>
      <div className={styles.headerRow}>
        <p className={styles.subtitle}>Office elevator NFC карт удирдах, access log харах.</p>
        <Space>
          <Button onClick={() => void loadAccessLogs().then(() => setLogsDrawerOpen(true))}>
            Бүх access log
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openCardModal()}>
            NFC карт нэмэх
          </Button>
        </Space>
      </div>
      <Card className={styles.panel}>
        <Table rowKey="id" dataSource={cards} columns={cardColumns} pagination={{ pageSize: 12 }} />
      </Card>
    </>
  );

  const titles: Record<BmsManagementView, string> = {
    dashboard: "BMS Dashboard",
    cameras: "Cameras",
    "fire-alarms": "Fire Alarm Log",
    "elevator-access": "Office Elevator NFC",
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.bmsWrap}>
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.title}>{titles[view]}</h2>
            <p className={styles.subtitle}>
              Building Management System — камер, галын дохиолол, office elevator NFC.
            </p>
          </div>
          <Space wrap>
            {view !== "dashboard" ? (
              <Button onClick={() => router.push("/dashboard/bms")}>BMS Dashboard</Button>
            ) : null}
            <Button icon={<ReloadOutlined />} onClick={() => void load()}>
              Refresh
            </Button>
          </Space>
        </div>

        {view === "dashboard" ? renderDashboard() : null}
        {view === "cameras" ? renderCameras() : null}
        {view === "fire-alarms" ? renderFireAlarms() : null}
        {view === "elevator-access" ? renderElevatorAccess() : null}
      </div>

      <Modal
        title={editingCamera ? "Камер засах" : "Камер нэмэх"}
        open={cameraModalOpen}
        onCancel={() => setCameraModalOpen(false)}
        onOk={() => void saveCamera()}
        okText="Хадгалах"
      >
        <Form form={cameraForm} layout="vertical">
          <Form.Item name="name" label="Нэр" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Байршил" rules={[{ required: true }]}>
            <Select options={CAMERA_LOCATIONS} />
          </Form.Item>
          <Form.Item
            name="stream_url"
            label="Stream URL"
            rules={[{ required: true, type: "url" }]}
            extra="HTTP/HTTPS stream эсвэл .mp4 файлын URL"
          >
            <Input placeholder="https://camera.example/stream" />
          </Form.Item>
          <Form.Item name="order" label="Эрэмбэ">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="is_active" label="Идэвхтэй" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="notes" label="Тэмдэглэл">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingCard ? "NFC карт засах" : "NFC карт нэмэх"}
        open={cardModalOpen}
        onCancel={() => setCardModalOpen(false)}
        onOk={() => void saveCard()}
        okText="Хадгалах"
      >
        <Form form={cardForm} layout="vertical">
          <Form.Item name="card_uid" label="NFC UID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="holder_name" label="Эзэмшигч" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Компани">
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Хэлтэс">
            <Input />
          </Form.Item>
          <Form.Item
            name="allowed_floors"
            label="Зөвшөөрөгдсөн давхар"
            rules={[{ required: true }]}
            extra="Жишээ: 1,2,5-10"
          >
            <Input />
          </Form.Item>
          <Form.Item name="elevator_bank" label="Elevator bank">
            <Input placeholder="office-a" />
          </Form.Item>
          <Form.Item name="status" label="Төлөв">
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "revoked", label: "Revoked" },
                { value: "expired", label: "Expired" },
              ]}
            />
          </Form.Item>
          <Form.Item name="valid_from" label="Эхлэх">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="valid_until" label="Дуусах">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="notes" label="Тэмдэглэл">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Галын дохиоллын log"
        open={alarmModalOpen}
        onCancel={() => setAlarmModalOpen(false)}
        onOk={() => void saveAlarm()}
        okText="Хадгалах"
      >
        <Form form={alarmForm} layout="vertical">
          <Form.Item name="zone" label="Zone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Байршил" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="message" label="Мессеж" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="severity" label="Түвшин" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "info", label: "Info" },
                { value: "warning", label: "Warning" },
                { value: "alarm", label: "Alarm" },
              ]}
            />
          </Form.Item>
          <Form.Item name="triggered_at" label="Дуугарсан цаг" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="source" label="Эх үүсвэр">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={selectedCardId ? "Картын access log" : "Бүх elevator access log"}
        open={logsDrawerOpen}
        onClose={() => setLogsDrawerOpen(false)}
        width={560}
      >
        <Table
          size="small"
          rowKey="id"
          dataSource={accessLogs}
          pagination={{ pageSize: 20 }}
          columns={[
            { title: "Карт", dataIndex: "holder_name", key: "holder_name" },
            { title: "UID", dataIndex: "card_uid", key: "card_uid", width: 100 },
            { title: "Давхар", dataIndex: "floor_number", key: "floor_number", width: 70 },
            {
              title: "Цаг",
              dataIndex: "accessed_at",
              key: "accessed_at",
              render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
            },
            {
              title: "Үр дүн",
              dataIndex: "result_label",
              key: "result_label",
              width: 90,
            },
          ]}
        />
      </Drawer>
    </Spin>
  );
}

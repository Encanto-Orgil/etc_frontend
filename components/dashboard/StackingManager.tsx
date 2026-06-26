"use client";

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  createStackingFloor,
  createStackingUnit,
  deleteStackingFloor,
  deleteStackingUnit,
  fetchDashboardStacking,
  updateStackingFloor,
  updateStackingUnit,
} from "@/lib/dashboardStacking";
import type { StackingFloor, StackingUnit, TowerKind, UnitStatus } from "@/lib/stacking";
import {
  TOWER_KIND_LABELS,
  UNIT_STATUS_COLORS,
  UNIT_STATUS_LABELS,
} from "@/lib/stacking";
import { STACKING_TOWER_META } from "@/lib/stackingInsights";
import RentalFinanceDashboard from "@/components/dashboard/RentalFinanceDashboard";
import styles from "./StackingManager.module.css";

type FloorFormValues = {
  floor_number: number;
  label: string;
  layout_notes: string;
  is_published: boolean;
  order: number;
};

type UnitFormValues = {
  unit_code: string;
  area_sqm: number;
  status: UnitStatus;
  tenant_name: string;
  tenant_phone: string;
  tenant_email: string;
  lease_start?: dayjs.Dayjs | null;
  lease_end?: dayjs.Dayjs | null;
  notes: string;
};

export default function StackingManager({ kind }: { kind: TowerKind }) {
  const towerMeta = STACKING_TOWER_META[kind];
  const [loading, setLoading] = useState(true);
  const [floors, setFloors] = useState<StackingFloor[]>([]);
  const [summary, setSummary] = useState({
    floor_count: 0,
    unit_count: 0,
    available_count: 0,
    rented_count: 0,
    reserved_count: 0,
    unavailable_count: 0,
  });

  const [floorModalOpen, setFloorModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<StackingFloor | null>(null);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<StackingUnit | null>(null);
  const [unitFloorId, setUnitFloorId] = useState<number | null>(null);

  const [floorForm] = Form.useForm<FloorFormValues>();
  const [unitForm] = Form.useForm<UnitFormValues>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardStacking(kind);
      if (!data) throw new Error("Төлөвлөлт ачаалахад алдаа гарлаа.");
      setFloors(data.floors);
      setSummary(data.summary);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreateFloor = () => {
    setEditingFloor(null);
    floorForm.setFieldsValue({
      floor_number: (floors[0]?.floor_number ?? 0) + 1,
      label: "",
      layout_notes: "",
      is_published: true,
      order: (floors[0]?.floor_number ?? 0) + 1,
    });
    setFloorModalOpen(true);
  };

  const openEditFloor = (floor: StackingFloor) => {
    setEditingFloor(floor);
    floorForm.setFieldsValue({
      floor_number: floor.floor_number,
      label: floor.label,
      layout_notes: floor.layout_notes,
      is_published: floor.is_published,
      order: floor.order,
    });
    setFloorModalOpen(true);
  };

  const openCreateUnit = (floorId: number) => {
    setEditingUnit(null);
    setUnitFloorId(floorId);
    unitForm.setFieldsValue({
      unit_code: "",
      area_sqm: 100,
      status: "available",
      tenant_name: "",
      tenant_phone: "",
      tenant_email: "",
      lease_start: null,
      lease_end: null,
      notes: "",
    });
    setUnitModalOpen(true);
  };

  const openEditUnit = (unit: StackingUnit) => {
    setEditingUnit(unit);
    setUnitFloorId(unit.floor);
    unitForm.setFieldsValue({
      unit_code: unit.unit_code,
      area_sqm: Number(unit.area_sqm),
      status: unit.status,
      tenant_name: unit.tenant_name,
      tenant_phone: unit.tenant_phone,
      tenant_email: unit.tenant_email,
      lease_start: unit.lease_start ? dayjs(unit.lease_start) : null,
      lease_end: unit.lease_end ? dayjs(unit.lease_end) : null,
      notes: unit.notes,
    });
    setUnitModalOpen(true);
  };

  const submitFloor = async () => {
    const values = await floorForm.validateFields();
    try {
      if (editingFloor) {
        await updateStackingFloor(editingFloor.id, values);
        message.success("Давхар шинэчлэгдлээ.");
      } else {
        await createStackingFloor({ ...values, tower_kind: kind });
        message.success("Шинэ давхар нэмэгдлээ.");
      }
      setFloorModalOpen(false);
      load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Алдаа гарлаа.");
    }
  };

  const submitUnit = async () => {
    const values = await unitForm.validateFields();
    const payload = {
      ...values,
      area_sqm: values.area_sqm,
      lease_start: values.lease_start ? values.lease_start.format("YYYY-MM-DD") : null,
      lease_end: values.lease_end ? values.lease_end.format("YYYY-MM-DD") : null,
    };
    try {
      if (editingUnit) {
        await updateStackingUnit(editingUnit.id, payload);
        message.success("Нэгж шинэчлэгдлээ.");
      } else if (unitFloorId) {
        await createStackingUnit({ ...payload, floor: unitFloorId });
        message.success("Шинэ нэгж нэмэгдлээ.");
      }
      setUnitModalOpen(false);
      load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Алдаа гарлаа.");
    }
  };

  const columns: ColumnsType<StackingFloor> = [
    {
      title: "Давхар",
      dataIndex: "floor_number",
      key: "floor_number",
      width: 90,
      render: (n: number, row) => row.label || `${n} давхар`,
    },
    {
      title: "Нэгж",
      dataIndex: "unit_count",
      key: "unit_count",
      width: 80,
    },
    {
      title: "Боломжтой",
      dataIndex: "available_count",
      key: "available_count",
      width: 100,
      render: (n: number) => <Tag color="green">{n}</Tag>,
    },
    {
      title: "Нийтлэл",
      dataIndex: "is_published",
      key: "is_published",
      width: 100,
      render: (published: boolean) => (
        <Tag color={published ? "blue" : "default"}>{published ? "Тийм" : "Үгүй"}</Tag>
      ),
    },
    {
      title: "Үйлдэл",
      key: "actions",
      width: 200,
      render: (_, row) => (
        <Space size="small">
          <Button size="small" icon={<PlusOutlined />} onClick={() => openCreateUnit(row.id)}>
            Нэгж
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditFloor(row)} />
          <Popconfirm
            title="Давхарыг устгах уу?"
            description="Давхарын бүх нэгж хамт устгагдана."
            onConfirm={async () => {
              await deleteStackingFloor(row.id);
              message.success("Давхар устгагдлаа.");
              load();
            }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Link href="/dashboard/stacking" className={styles.backLink}>
            <ArrowLeftOutlined /> Буцах
          </Link>
          <div>
            <Typography.Text type="secondary">{towerMeta.subtitle}</Typography.Text>
            <Typography.Title level={4} className={styles.kindTitle}>
              {TOWER_KIND_LABELS[kind]} — {towerMeta.title}
            </Typography.Title>
          </div>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={load}>
            Шинэчлэх
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateFloor}>
            Давхар нэмэх
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className={styles.stats}>
        <Col xs={12} sm={8} xl={4}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Давхар" value={summary.floor_count} />
          </Card>
        </Col>
        <Col xs={12} sm={8} xl={4}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Нийт нэгж" value={summary.unit_count} />
          </Card>
        </Col>
        <Col xs={12} sm={8} xl={4}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Боломжтой" value={summary.available_count} valueStyle={{ color: "#16a34a" }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} xl={4}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Түрээслэгдсэн" value={summary.rented_count} />
          </Card>
        </Col>
        <Col xs={12} sm={8} xl={4}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Захиалсан" value={summary.reserved_count} />
          </Card>
        </Col>
        <Col xs={12} sm={8} xl={4}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Боломжгүй" value={summary.unavailable_count} />
          </Card>
        </Col>
      </Row>

      <Card className={styles.tableCard} title={`${TOWER_KIND_LABELS[kind]} — давхар, нэгж`}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={floors}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          expandable={{
            expandedRowRender: (floor) => (
              <div className={styles.unitGrid}>
                {floor.units.length === 0 ? (
                  <Typography.Text type="secondary">Нэгж бүртгэгдээгүй байна.</Typography.Text>
                ) : (
                  floor.units.map((unit) => (
                    <button
                      key={unit.id}
                      type="button"
                      className={styles.unitChip}
                      data-status={unit.status}
                      onClick={() => openEditUnit(unit)}
                    >
                      <strong>{unit.unit_code}</strong>
                      <span>{Number(unit.area_sqm)} м²</span>
                      <Tag color={UNIT_STATUS_COLORS[unit.status]} className={styles.unitTag}>
                        {UNIT_STATUS_LABELS[unit.status]}
                      </Tag>
                      {unit.tenant_name ? <small>{unit.tenant_name}</small> : null}
                    </button>
                  ))
                )}
              </div>
            ),
          }}
        />
      </Card>

      {kind === "office" || kind === "mall" ? <RentalFinanceDashboard kind={kind} /> : null}

      <Modal
        title={editingFloor ? "Давхар засах" : "Шинэ давхар"}
        open={floorModalOpen}
        onCancel={() => setFloorModalOpen(false)}
        onOk={submitFloor}
        okText="Хадгалах"
        cancelText="Болих"
        destroyOnHidden
      >
        <Form form={floorForm} layout="vertical" className={styles.form}>
          <Form.Item name="floor_number" label="Давхарын дугаар" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="label" label="Гарчиг">
            <Input placeholder="12 давхар" />
          </Form.Item>
          <Form.Item name="layout_notes" label="Төлөвлөлтийн тайлбар">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="order" label="Эрэмбэ">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="is_published" label="Вэб дээр харуулах" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingUnit ? "Нэгж засах" : "Шинэ нэгж"}
        open={unitModalOpen}
        onCancel={() => setUnitModalOpen(false)}
        onOk={submitUnit}
        okText="Хадгалах"
        cancelText="Болих"
        width={560}
        destroyOnHidden
        footer={(_, { OkBtn, CancelBtn }) => (
          <div className={styles.modalFooter}>
            {editingUnit ? (
              <Popconfirm
                title="Нэгжийг устгах уу?"
                onConfirm={async () => {
                  await deleteStackingUnit(editingUnit.id);
                  message.success("Нэгж устгагдлаа.");
                  setUnitModalOpen(false);
                  load();
                }}
              >
                <Button danger>Устгах</Button>
              </Popconfirm>
            ) : (
              <span />
            )}
            <Space>
              <CancelBtn />
              <OkBtn />
            </Space>
          </div>
        )}
      >
        <Form form={unitForm} layout="vertical" className={styles.form}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="unit_code" label="Нэгжийн код" rules={[{ required: true }]}>
                <Input placeholder="A, 01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="area_sqm" label="Талбай (м²)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Төлөв" rules={[{ required: true }]}>
            <Select
              options={(Object.keys(UNIT_STATUS_LABELS) as UnitStatus[]).map((s) => ({
                value: s,
                label: UNIT_STATUS_LABELS[s],
              }))}
            />
          </Form.Item>
          <Form.Item name="tenant_name" label="Түрээслэгчийн нэр / Брэнд">
            <Input />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="tenant_phone" label="Утас">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tenant_email" label="И-мэйл">
                <Input type="email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="lease_start" label="Түрээс эхлэх">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lease_end" label="Түрээс дуусах">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Тэмдэглэл">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

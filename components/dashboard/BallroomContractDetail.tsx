"use client";

import { ArrowLeftOutlined, DownloadOutlined, EditOutlined, FileWordOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tag,
} from "antd";
import MoneyInput from "@/components/dashboard/MoneyInput";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  downloadBallroomContractDocx,
  fetchDashboardBallroomContract,
  fetchDashboardBallroomEventTypes,
  updateDashboardBallroomContract,
  type BallroomContractStatus,
  type BallroomEventType,
  type BallroomEventTypeRecord,
  type DashboardBallroomContract,
} from "@/lib/ballroomManagement";
import styles from "./PropertyManagement.module.css";

const STATUS_LABELS: Record<BallroomContractStatus, string> = {
  draft: "Draft",
  final: "Final",
  signed: "Signed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<BallroomContractStatus, string> = {
  draft: "default",
  final: "blue",
  signed: "green",
  cancelled: "red",
};

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

function formatDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

type ContractFormValues = {
  client_name: string;
  client_organization?: string;
  client_registration?: string;
  client_representative?: string;
  client_address?: string;
  client_phone?: string;
  client_email?: string;
  event_date?: dayjs.Dayjs | null;
  event_start?: dayjs.Dayjs | null;
  event_end?: dayjs.Dayjs | null;
  guest_count?: number | null;
  event_type?: string;
  venue_name: string;
  rental_fee: number;
  service_fee: number;
  deposit_amount: number;
  total_amount: number;
  payment_terms?: string;
  cancellation_terms?: string;
  additional_terms?: string;
  status: BallroomContractStatus;
  signed_date?: dayjs.Dayjs | null;
  notes?: string;
};

export default function BallroomContractDetail({ contractId }: { contractId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [contract, setContract] = useState<DashboardBallroomContract | null>(null);
  const [eventTypes, setEventTypes] = useState<BallroomEventTypeRecord[]>([]);
  const [editForm] = Form.useForm<ContractFormValues>();

  const eventTypeOptions = useMemo(
    () =>
      eventTypes
        .filter((item) => item.is_active)
        .map((item) => ({ value: item.slug, label: item.label })),
    [eventTypes],
  );

  useEffect(() => {
    fetchDashboardBallroomEventTypes()
      .then(setEventTypes)
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setContract(await fetchDashboardBallroomContract(contractId));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Contract failed to load.");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = () => {
    if (!contract) return;
    editForm.setFieldsValue({
      client_name: contract.client_name,
      client_organization: contract.client_organization,
      client_registration: contract.client_registration,
      client_representative: contract.client_representative,
      client_address: contract.client_address,
      client_phone: contract.client_phone,
      client_email: contract.client_email,
      event_date: contract.event_date ? dayjs(contract.event_date) : null,
      event_start: contract.event_start ? dayjs(`2000-01-01T${contract.event_start}`) : null,
      event_end: contract.event_end ? dayjs(`2000-01-01T${contract.event_end}`) : null,
      guest_count: contract.guest_count ?? undefined,
      event_type: contract.event_type || undefined,
      venue_name: contract.venue_name,
      rental_fee: Number(contract.rental_fee),
      service_fee: Number(contract.service_fee),
      deposit_amount: Number(contract.deposit_amount),
      total_amount: Number(contract.total_amount),
      payment_terms: contract.payment_terms,
      cancellation_terms: contract.cancellation_terms,
      additional_terms: contract.additional_terms,
      status: contract.status,
      signed_date: contract.signed_date ? dayjs(contract.signed_date) : null,
      notes: contract.notes,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const values = await editForm.validateFields();
    setSaving(true);
    try {
      const rental = values.rental_fee ?? 0;
      const service = values.service_fee ?? 0;
      const updated = await updateDashboardBallroomContract(contractId, {
        client_name: values.client_name,
        client_organization: values.client_organization || "",
        client_registration: values.client_registration || "",
        client_representative: values.client_representative || "",
        client_address: values.client_address || "",
        client_phone: values.client_phone || "",
        client_email: values.client_email || "",
        event_date: values.event_date ? values.event_date.format("YYYY-MM-DD") : null,
        event_start: values.event_start ? values.event_start.format("HH:mm:ss") : null,
        event_end: values.event_end ? values.event_end.format("HH:mm:ss") : null,
        guest_count: values.guest_count ?? null,
        event_type: (values.event_type || "") as BallroomEventType | "",
        venue_name: values.venue_name,
        rental_fee: rental,
        service_fee: service,
        deposit_amount: values.deposit_amount ?? 0,
        total_amount: values.total_amount ?? rental + service,
        payment_terms: values.payment_terms || "",
        cancellation_terms: values.cancellation_terms || "",
        additional_terms: values.additional_terms || "",
        status: values.status,
        signed_date: values.signed_date ? values.signed_date.format("YYYY-MM-DD") : null,
        notes: values.notes || "",
      });
      setContract(updated);
      setEditOpen(false);
      message.success("Contract updated.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update contract.");
    } finally {
      setSaving(false);
    }
  };

  const downloadDoc = async () => {
    if (!contract) return;
    setDownloading(true);
    try {
      await downloadBallroomContractDocx(
        contractId,
        contract.contract_number || `ballroom-contract-${contractId}`,
      );
      message.success("Contract downloaded.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <Spin size="large" />
      </div>
    );
  }

  if (!contract) {
    return <div className={styles.emptyState}>Contract not found.</div>;
  }

  const contractNumber = contract.contract_number || `Draft #${contractId}`;

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailHeader}>
        <Space wrap>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/ballroom/contracts")}>
            Back
          </Button>
          <Button icon={<EditOutlined />} onClick={openEdit}>
            Edit
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloading}
            onClick={downloadDoc}
          >
            Download DOCX
          </Button>
        </Space>
      </div>

      <div className={styles.detailHero}>
        <div>
          <p className={styles.muted}>
            <FileWordOutlined /> Service contract
          </p>
          <h1>{contractNumber}</h1>
          <Space wrap>
            <Tag color={STATUS_COLORS[contract.status]}>{STATUS_LABELS[contract.status]}</Tag>
            {contract.event_type_label ? <Tag>{contract.event_type_label}</Tag> : null}
          </Space>
        </div>
      </div>

      <Descriptions bordered column={1} size="small" className={styles.descriptions}>
        <Descriptions.Item label="Client">{contract.client_name}</Descriptions.Item>
        <Descriptions.Item label="Organization">{contract.client_organization || "-"}</Descriptions.Item>
        <Descriptions.Item label="Representative">{contract.client_representative || "-"}</Descriptions.Item>
        <Descriptions.Item label="Phone">{contract.client_phone || "-"}</Descriptions.Item>
        <Descriptions.Item label="Email">{contract.client_email || "-"}</Descriptions.Item>
        <Descriptions.Item label="Venue">{contract.venue_name}</Descriptions.Item>
        <Descriptions.Item label="Event date">{formatDate(contract.event_date)}</Descriptions.Item>
        <Descriptions.Item label="Time">
          {contract.event_start && contract.event_end
            ? `${contract.event_start.slice(0, 5)} – ${contract.event_end.slice(0, 5)}`
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Guests">{contract.guest_count ?? "-"}</Descriptions.Item>
        <Descriptions.Item label="Rental fee">{formatMoney(contract.rental_fee)}</Descriptions.Item>
        <Descriptions.Item label="Service fee">{formatMoney(contract.service_fee)}</Descriptions.Item>
        <Descriptions.Item label="Deposit">{formatMoney(contract.deposit_amount)}</Descriptions.Item>
        <Descriptions.Item label="Total">{formatMoney(contract.total_amount)}</Descriptions.Item>
        <Descriptions.Item label="Signed date">{formatDate(contract.signed_date)}</Descriptions.Item>
        {contract.notes ? <Descriptions.Item label="Notes">{contract.notes}</Descriptions.Item> : null}
      </Descriptions>

      <Modal
        title={`Edit ${contractNumber}`}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={saveEdit}
        confirmLoading={saving}
        width={860}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" className={styles.formGrid}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="client_name" label="Client name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="client_organization" label="Organization">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="client_representative" label="Representative">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="client_registration" label="Registration no.">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="client_address" label="Address">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="client_phone" label="Phone">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="client_email" label="Email">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="guest_count" label="Guests">
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="event_date" label="Event date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="event_start" label="Start time">
                <DatePicker picker="time" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="event_end" label="End time">
                <DatePicker picker="time" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="event_type" label="Event type">
                <Select allowClear options={eventTypeOptions} placeholder="Select event type" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="venue_name" label="Venue" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="rental_fee" label="Rental fee">
                <MoneyInput />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="service_fee" label="Service fee">
                <MoneyInput />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="deposit_amount" label="Deposit">
                <MoneyInput />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="total_amount" label="Total">
                <MoneyInput />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="status" label="Status">
                <Select
                  options={(
                    Object.keys(STATUS_LABELS) as BallroomContractStatus[]
                  ).map((value) => ({ value, label: STATUS_LABELS[value] }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="signed_date" label="Signed date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="payment_terms" label="Payment terms">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="cancellation_terms" label="Cancellation terms">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="additional_terms" label="Additional terms">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

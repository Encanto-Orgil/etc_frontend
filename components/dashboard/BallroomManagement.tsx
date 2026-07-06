"use client";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
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
  Spin,
  Statistic,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelDashboardBallroomBooking,
  confirmDashboardBallroomBooking,
  createDashboardBallroomBooking,
  createDashboardBallroomInvoice,
  createDashboardBallroomQuote,
  declineDashboardBallroomBooking,
  deleteDashboardBallroomBooking,
  deleteDashboardBallroomInvoice,
  deleteDashboardBallroomQuote,
  fetchBallroomBillingProfile,
  fetchBallroomSummary,
  fetchDashboardBallroomBookings,
  fetchDashboardBallroomInvoices,
  fetchDashboardBallroomQuotes,
  updateBallroomBillingProfile,
  updateDashboardBallroomBooking,
  updateDashboardBallroomInvoice,
  updateDashboardBallroomQuote,
  type BallroomBillingProfile,
  type BallroomBookingStatus,
  type BallroomEventType,
  type BallroomInvoiceStatus,
  type BallroomQuoteStatus,
  type BallroomSummary,
  type DashboardBallroomBooking,
  type DashboardBallroomInvoice,
  type DashboardBallroomQuote,
} from "@/lib/ballroomManagement";
import { ballroomBookingEventTypes, formatSlotTime } from "@/lib/ballroomAvailability";
import BallroomInvoiceFormFields, {
  buildInvoicePayload,
  type InvoiceFormValues,
} from "@/components/dashboard/BallroomInvoiceFormFields";
import styles from "./PropertyManagement.module.css";

export type BallroomManagementView = "dashboard" | "bookings" | "invoices" | "quotes" | "settings";

const BOOKING_STATUS_LABELS: Record<BallroomBookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
  cancelled: "Cancelled",
};

const BOOKING_STATUS_COLORS: Record<BallroomBookingStatus, string> = {
  pending: "gold",
  confirmed: "green",
  declined: "red",
  cancelled: "default",
};

const INVOICE_STATUS_LABELS: Record<BallroomInvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  cancelled: "Cancelled",
};

const INVOICE_STATUS_COLORS: Record<BallroomInvoiceStatus, string> = {
  draft: "default",
  sent: "blue",
  paid: "green",
  cancelled: "red",
};

const QUOTE_STATUS_LABELS: Record<BallroomQuoteStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  cancelled: "Cancelled",
};

const QUOTE_STATUS_COLORS: Record<BallroomQuoteStatus, string> = {
  draft: "default",
  sent: "blue",
  accepted: "green",
  declined: "red",
  cancelled: "default",
};

const VIEW_TITLES: Record<BallroomManagementView, string> = {
  dashboard: "Ballroom Dashboard",
  bookings: "Bookings",
  invoices: "Invoices",
  quotes: "Quotes",
  settings: "Invoice settings",
};

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

function formatDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

function formatDateTime(value: string, start: string, end: string) {
  return `${formatDate(value)} · ${formatSlotTime(start)}–${formatSlotTime(end)}`;
}

type BookingFormValues = {
  date: dayjs.Dayjs;
  start_time: dayjs.Dayjs;
  end_time: dayjs.Dayjs;
  name: string;
  phone: string;
  email?: string;
  guest_count: number;
  event_type: BallroomEventType;
  message?: string;
  status?: BallroomBookingStatus;
};

type InvoiceModalValues = InvoiceFormValues & {
  booking: number;
  issue_date: dayjs.Dayjs;
  due_date: dayjs.Dayjs;
  status: BallroomInvoiceStatus;
};

type QuoteModalValues = InvoiceFormValues & {
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  event_type?: BallroomEventType;
  event_date?: dayjs.Dayjs | null;
  guest_count?: number;
  issue_date: dayjs.Dayjs;
  valid_until: dayjs.Dayjs;
  status: BallroomQuoteStatus;
};

type BillingProfileFormValues = Omit<BallroomBillingProfile, "id" | "slug" | "updated_at">;

export default function BallroomManagement({ view }: { view: BallroomManagementView }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<BallroomSummary | null>(null);
  const [bookings, setBookings] = useState<DashboardBallroomBooking[]>([]);
  const [invoices, setInvoices] = useState<DashboardBallroomInvoice[]>([]);
  const [quotes, setQuotes] = useState<DashboardBallroomQuote[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<DashboardBallroomBooking | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<DashboardBallroomInvoice | null>(null);
  const [editingQuote, setEditingQuote] = useState<DashboardBallroomQuote | null>(null);
  const [bookingForm] = Form.useForm<BookingFormValues>();
  const [invoiceForm] = Form.useForm<InvoiceModalValues>();
  const [quoteForm] = Form.useForm<QuoteModalValues>();
  const [billingForm] = Form.useForm<BillingProfileFormValues>();
  const [billingProfile, setBillingProfile] = useState<BallroomBillingProfile | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (view === "dashboard") {
        setSummary(await fetchBallroomSummary());
      } else if (view === "bookings") {
        setBookings(
          await fetchDashboardBallroomBookings({
            search: search || undefined,
            status: statusFilter === "all" ? undefined : statusFilter,
          }),
        );
      } else if (view === "invoices") {
        const [invoiceList, bookingList] = await Promise.all([
          fetchDashboardBallroomInvoices({
            search: search || undefined,
            status: statusFilter === "all" ? undefined : statusFilter,
          }),
          fetchDashboardBallroomBookings(),
        ]);
        setInvoices(invoiceList);
        setBookings(bookingList);
      } else if (view === "quotes") {
        setQuotes(
          await fetchDashboardBallroomQuotes({
            search: search || undefined,
            status: statusFilter === "all" ? undefined : statusFilter,
          }),
        );
      } else if (view === "settings") {
        const profile = await fetchBallroomBillingProfile();
        setBillingProfile(profile);
        billingForm.setFieldsValue(profile);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load ballroom data.");
    } finally {
      setLoading(false);
    }
  }, [view, search, statusFilter, billingForm]);

  const saveBillingProfile = async () => {
    const values = await billingForm.validateFields();
    setSaving(true);
    try {
      const profile = await updateBallroomBillingProfile(values);
      setBillingProfile(profile);
      message.success("Billing profile saved.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save billing profile.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  const openCreateBooking = () => {
    setEditingBooking(null);
    bookingForm.setFieldsValue({
      date: dayjs(),
      start_time: dayjs().hour(10).minute(0).second(0),
      end_time: dayjs().hour(14).minute(0).second(0),
      guest_count: 100,
      event_type: "corporate",
      status: "pending",
    });
    setBookingModalOpen(true);
  };

  const openEditBooking = (record: DashboardBallroomBooking) => {
    setEditingBooking(record);
    bookingForm.setFieldsValue({
      date: dayjs(record.slot_date),
      start_time: dayjs(`${record.slot_date}T${record.slot_start}`),
      end_time: dayjs(`${record.slot_date}T${record.slot_end}`),
      name: record.name,
      phone: record.phone,
      email: record.email,
      guest_count: record.guest_count,
      event_type: record.event_type,
      message: record.message,
      status: record.status,
    });
    setBookingModalOpen(true);
  };

  const saveBooking = async () => {
    const values = await bookingForm.validateFields();
    setSaving(true);
    try {
      if (editingBooking) {
        await updateDashboardBallroomBooking(editingBooking.id, {
          name: values.name,
          phone: values.phone,
          email: values.email || "",
          guest_count: values.guest_count,
          event_type: values.event_type,
          message: values.message || "",
          status: values.status,
        });
        message.success("Booking updated.");
      } else {
        await createDashboardBallroomBooking({
          date: values.date.format("YYYY-MM-DD"),
          start_time: values.start_time.format("HH:mm"),
          end_time: values.end_time.format("HH:mm"),
          name: values.name,
          phone: values.phone,
          email: values.email,
          guest_count: values.guest_count,
          event_type: values.event_type,
          message: values.message,
          status: values.status,
        });
        message.success("Booking created.");
      }
      setBookingModalOpen(false);
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save booking.");
    } finally {
      setSaving(false);
    }
  };

  const runBookingAction = async (id: number, action: "confirm" | "decline" | "cancel" | "delete") => {
    try {
      if (action === "confirm") await confirmDashboardBallroomBooking(id);
      else if (action === "decline") await declineDashboardBallroomBooking(id);
      else if (action === "cancel") await cancelDashboardBallroomBooking(id);
      else await deleteDashboardBallroomBooking(id);
      message.success(`Booking ${action === "delete" ? "removed" : action + "ed"}.`);
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Action failed.");
    }
  };

  const openCreateInvoice = () => {
    setEditingInvoice(null);
    invoiceForm.setFieldsValue({
      issue_date: dayjs(),
      due_date: dayjs().add(14, "day"),
      lines: [{ description: "", quantity: 1, unit_price: 0 }],
      discount_amount: 0,
      vat_mode: "included",
      status: "draft",
    });
    setInvoiceModalOpen(true);
  };

  const openEditInvoice = (record: DashboardBallroomInvoice) => {
    setEditingInvoice(record);
    invoiceForm.setFieldsValue({
      booking: record.booking,
      issue_date: dayjs(record.issue_date),
      due_date: dayjs(record.due_date),
      lines: record.lines.map((line) => ({
        description: line.description,
        quantity: Number(line.quantity),
        unit_price: Number(line.unit_price),
      })),
      discount_amount: Number(record.discount_amount),
      vat_mode: record.vat_mode,
      status: record.status,
      notes: record.notes,
    });
    setInvoiceModalOpen(true);
  };

  const saveInvoice = async () => {
    const values = await invoiceForm.validateFields();
    setSaving(true);
    try {
      const payload = {
        ...buildInvoicePayload(values),
        issue_date: values.issue_date.format("YYYY-MM-DD"),
        due_date: values.due_date.format("YYYY-MM-DD"),
        status: values.status,
      };
      if (editingInvoice) {
        await updateDashboardBallroomInvoice(editingInvoice.id, payload);
        message.success("Invoice updated.");
      } else {
        const created = await createDashboardBallroomInvoice({
          booking: values.booking,
          ...payload,
        });
        message.success("Invoice created.");
        setInvoiceModalOpen(false);
        router.push(`/dashboard/ballroom/invoices/${created.id}`);
        return;
      }
      setInvoiceModalOpen(false);
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save invoice.");
    } finally {
      setSaving(false);
    }
  };

  const openCreateQuote = () => {
    setEditingQuote(null);
    quoteForm.setFieldsValue({
      issue_date: dayjs(),
      valid_until: dayjs().add(14, "day"),
      lines: [{ description: "", quantity: 1, unit_price: 0 }],
      discount_amount: 0,
      vat_mode: "included",
      status: "draft",
      guest_count: 100,
      event_type: "corporate",
    });
    setQuoteModalOpen(true);
  };

  const openEditQuote = (record: DashboardBallroomQuote) => {
    setEditingQuote(record);
    quoteForm.setFieldsValue({
      customer_name: record.customer_name,
      customer_phone: record.customer_phone,
      customer_email: record.customer_email,
      event_type: record.event_type || undefined,
      event_date: record.event_date ? dayjs(record.event_date) : null,
      guest_count: record.guest_count ?? undefined,
      issue_date: dayjs(record.issue_date),
      valid_until: dayjs(record.valid_until),
      lines: record.lines.map((line) => ({
        description: line.description,
        quantity: Number(line.quantity),
        unit_price: Number(line.unit_price),
      })),
      discount_amount: Number(record.discount_amount),
      vat_mode: record.vat_mode,
      status: record.status,
      notes: record.notes,
    });
    setQuoteModalOpen(true);
  };

  const saveQuote = async () => {
    const values = await quoteForm.validateFields();
    setSaving(true);
    try {
      const payload = {
        customer_name: values.customer_name,
        customer_phone: values.customer_phone || "",
        customer_email: values.customer_email || "",
        event_type: (values.event_type || "") as BallroomEventType | "",
        event_date: values.event_date ? values.event_date.format("YYYY-MM-DD") : null,
        guest_count: values.guest_count ?? null,
        ...buildInvoicePayload(values),
        issue_date: values.issue_date.format("YYYY-MM-DD"),
        valid_until: values.valid_until.format("YYYY-MM-DD"),
        status: values.status,
      };
      if (editingQuote) {
        await updateDashboardBallroomQuote(editingQuote.id, payload);
        message.success("Quote updated.");
      } else {
        const created = await createDashboardBallroomQuote(payload);
        message.success("Quote created.");
        setQuoteModalOpen(false);
        router.push(`/dashboard/ballroom/quotes/${created.id}`);
        return;
      }
      setQuoteModalOpen(false);
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save quote.");
    } finally {
      setSaving(false);
    }
  };

  const bookingOptions = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "confirmed" || b.status === "pending")
        .map((b) => ({
          value: b.id,
          label: `${b.name} · ${formatDateTime(b.slot_date, b.slot_start, b.slot_end)}`,
        })),
    [bookings],
  );

  const bookingColumns: ColumnsType<DashboardBallroomBooking> = [
    {
      title: "Customer",
      dataIndex: "name",
      render: (_, record) => (
        <div>
          <strong>{record.name}</strong>
          <div className={styles.muted}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Event",
      dataIndex: "event_type_label",
      width: 120,
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_, record) => formatDateTime(record.slot_date, record.slot_start, record.slot_end),
    },
    {
      title: "Guests",
      dataIndex: "guest_count",
      width: 80,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      render: (status: BallroomBookingStatus) => (
        <Tag color={BOOKING_STATUS_COLORS[status]}>{BOOKING_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space size={4} wrap>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditBooking(record)} />
          {record.status === "pending" && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => runBookingAction(record.id, "confirm")}
              />
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => runBookingAction(record.id, "decline")}
              />
            </>
          )}
          {record.status === "confirmed" && (
            <Button
              size="small"
              icon={<StopOutlined />}
              onClick={() => runBookingAction(record.id, "cancel")}
            />
          )}
          <Popconfirm title="Remove this booking?" onConfirm={() => runBookingAction(record.id, "delete")}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const invoiceColumns: ColumnsType<DashboardBallroomInvoice> = [
    {
      title: "Invoice",
      dataIndex: "invoice_number",
      render: (value, record) => (
        <div>
          <strong>{value || `Draft #${record.id}`}</strong>
          <div className={styles.muted}>{record.booking_name}</div>
        </div>
      ),
    },
    {
      title: "Event date",
      key: "event",
      render: (_, record) => formatDateTime(record.booking_date, record.booking_start, record.booking_end),
    },
    {
      title: "Issue / Due",
      key: "dates",
      render: (_, record) => `${formatDate(record.issue_date)} → ${formatDate(record.due_date)}`,
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      width: 120,
      render: (value) => formatMoney(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status: BallroomInvoiceStatus) => (
        <Tag color={INVOICE_STATUS_COLORS[status]}>{INVOICE_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/dashboard/ballroom/invoices/${record.id}`)}
          />
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditInvoice(record)} />
          <Popconfirm
            title="Delete this invoice?"
            onConfirm={async () => {
              try {
                await deleteDashboardBallroomInvoice(record.id);
                message.success("Invoice deleted.");
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

  const quoteColumns: ColumnsType<DashboardBallroomQuote> = [
    {
      title: "Quote",
      dataIndex: "quote_number",
      render: (value, record) => (
        <div>
          <strong>{value || `Draft #${record.id}`}</strong>
          <div className={styles.muted}>{record.customer_name}</div>
        </div>
      ),
    },
    {
      title: "Event",
      key: "event",
      render: (_, record) => (
        <div>
          <div>{record.event_type_label || "-"}</div>
          <div className={styles.muted}>{formatDate(record.event_date)}</div>
        </div>
      ),
    },
    {
      title: "Issue / Valid",
      key: "dates",
      render: (_, record) => `${formatDate(record.issue_date)} → ${formatDate(record.valid_until)}`,
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      width: 120,
      render: (value) => formatMoney(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status: BallroomQuoteStatus) => (
        <Tag color={QUOTE_STATUS_COLORS[status]}>{QUOTE_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/dashboard/ballroom/quotes/${record.id}`)}
          />
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditQuote(record)} />
          <Popconfirm
            title="Delete this quote?"
            onConfirm={async () => {
              try {
                await deleteDashboardBallroomQuote(record.id);
                message.success("Quote deleted.");
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
            <h1>{VIEW_TITLES[view]}</h1>
            <p>Ballroom reservations, billing, and event operations.</p>
          </div>
          <Space>
            {view === "bookings" && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateBooking}>
                New booking
              </Button>
            )}
            {view === "invoices" && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateInvoice}>
                New invoice
              </Button>
            )}
            {view === "quotes" && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateQuote}>
                New quote
              </Button>
            )}
            {view === "settings" && (
              <Button type="primary" loading={saving} onClick={saveBillingProfile}>
                Save settings
              </Button>
            )}
            {view === "dashboard" && (
              <Button icon={<CalendarOutlined />} onClick={() => router.push("/dashboard/ballroom/calendar")}>
                Open calendar
              </Button>
            )}
            <Button icon={<ReloadOutlined />} onClick={load}>
              Refresh
            </Button>
          </Space>
        </div>

        {(view === "bookings" || view === "invoices" || view === "quotes") && (
          <div className={styles.searchArea}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search..."
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
                ...(view === "bookings"
                  ? (Object.keys(BOOKING_STATUS_LABELS) as BallroomBookingStatus[]).map((s) => ({
                      value: s,
                      label: BOOKING_STATUS_LABELS[s],
                    }))
                  : view === "invoices"
                    ? (Object.keys(INVOICE_STATUS_LABELS) as BallroomInvoiceStatus[]).map((s) => ({
                        value: s,
                        label: INVOICE_STATUS_LABELS[s],
                      }))
                    : (Object.keys(QUOTE_STATUS_LABELS) as BallroomQuoteStatus[]).map((s) => ({
                        value: s,
                        label: QUOTE_STATUS_LABELS[s],
                      }))),
              ]}
            />
            <Button icon={<FilterOutlined />} onClick={load}>
              Apply
            </Button>
          </div>
        )}

        <Spin spinning={loading}>
          {view === "dashboard" && summary && (
            <>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card className={styles.statCard}>
                    <Statistic title="Total bookings" value={summary.summary.total_bookings} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className={styles.statCard}>
                    <Statistic title="Pending" value={summary.summary.pending_bookings} valueStyle={{ color: "#d48806" }} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className={styles.statCard}>
                    <Statistic title="This month" value={summary.summary.month_bookings} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className={styles.statCard}>
                    <Statistic
                      title="Outstanding"
                      value={formatMoney(summary.summary.outstanding_amount)}
                      prefix={<DollarOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                <Col xs={24} lg={8}>
                  <Card title="Recent bookings" className={styles.statCard}>
                    <Table
                      size="small"
                      rowKey="id"
                      pagination={false}
                      dataSource={summary.recent_bookings}
                      columns={bookingColumns.filter((c) => c.key !== "actions")}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Recent invoices" className={styles.statCard}>
                    <Table
                      size="small"
                      rowKey="id"
                      pagination={false}
                      dataSource={summary.recent_invoices}
                      columns={invoiceColumns.filter((c) => c.key !== "actions")}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Recent quotes" className={styles.statCard}>
                    <Table
                      size="small"
                      rowKey="id"
                      pagination={false}
                      dataSource={summary.recent_quotes}
                      columns={quoteColumns.filter((c) => c.key !== "actions")}
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {view === "bookings" && (
            <Table rowKey="id" columns={bookingColumns} dataSource={bookings} pagination={{ pageSize: 20 }} />
          )}

          {view === "invoices" && (
            <Table rowKey="id" columns={invoiceColumns} dataSource={invoices} pagination={{ pageSize: 20 }} />
          )}

          {view === "quotes" && (
            <Table rowKey="id" columns={quoteColumns} dataSource={quotes} pagination={{ pageSize: 20 }} />
          )}

          {view === "settings" && billingProfile && (
            <Card title="Company & bank details on invoices" className={styles.statCard}>
              <Form form={billingForm} layout="vertical">
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="company_name" label="Company name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="registration_number" label="Registration no.">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="address" label="Address">
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="phone" label="Phone">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="email" label="Email">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="bank_name" label="Bank name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="bank_branch" label="Branch">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="bank_account_number" label="Account number">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="bank_account_name" label="Account holder">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="payment_notes" label="Payment notes">
                  <Input.TextArea rows={3} placeholder="Transfer instructions shown on invoice PDF" />
                </Form.Item>
              </Form>
            </Card>
          )}
        </Spin>
      </div>

      <Modal
        title={editingBooking ? "Edit booking" : "New booking"}
        open={bookingModalOpen}
        onCancel={() => setBookingModalOpen(false)}
        onOk={saveBooking}
        confirmLoading={saving}
        width={640}
        destroyOnClose
      >
        <Form form={bookingForm} layout="vertical">
          {!editingBooking && (
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="start_time" label="Start" rules={[{ required: true }]}>
                  <DatePicker.TimePicker style={{ width: "100%" }} format="HH:mm" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="end_time" label="End" rules={[{ required: true }]}>
                  <DatePicker.TimePicker style={{ width: "100%" }} format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="name" label="Customer name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="guest_count" label="Guests" rules={[{ required: true }]}>
                <InputNumber min={1} max={2000} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="event_type" label="Event type" rules={[{ required: true }]}>
                <Select options={[...ballroomBookingEventTypes]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Select
                  options={(Object.keys(BOOKING_STATUS_LABELS) as BallroomBookingStatus[]).map((s) => ({
                    value: s,
                    label: BOOKING_STATUS_LABELS[s],
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="message" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingInvoice ? "Edit invoice" : "New invoice"}
        open={invoiceModalOpen}
        onCancel={() => setInvoiceModalOpen(false)}
        onOk={saveInvoice}
        confirmLoading={saving}
        width={920}
        destroyOnClose
      >
        <Form form={invoiceForm} layout="vertical">
          <Form.Item name="booking" label="Booking" rules={[{ required: true }]}>
            <Select
              showSearch
              optionFilterProp="label"
              options={bookingOptions}
              disabled={Boolean(editingInvoice)}
            />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="issue_date" label="Issue date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="due_date" label="Due date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <BallroomInvoiceFormFields form={invoiceForm} />
          <Form.Item name="status" label="Status">
            <Select
              options={(Object.keys(INVOICE_STATUS_LABELS) as BallroomInvoiceStatus[]).map((s) => ({
                value: s,
                label: INVOICE_STATUS_LABELS[s],
              }))}
            />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingQuote ? "Edit quote" : "New quote"}
        open={quoteModalOpen}
        onCancel={() => setQuoteModalOpen(false)}
        onOk={saveQuote}
        confirmLoading={saving}
        width={920}
        destroyOnClose
      >
        <Form form={quoteForm} layout="vertical">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="customer_name" label="Customer name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customer_phone" label="Phone">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="customer_email" label="Email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="event_type" label="Event type">
                <Select allowClear options={[...ballroomBookingEventTypes]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="event_date" label="Event date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="guest_count" label="Guests">
                <InputNumber min={1} max={2000} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="issue_date" label="Issue date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="valid_until" label="Valid until" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <BallroomInvoiceFormFields form={quoteForm} />
          <Form.Item name="status" label="Status">
            <Select
              options={(Object.keys(QUOTE_STATUS_LABELS) as BallroomQuoteStatus[]).map((s) => ({
                value: s,
                label: QUOTE_STATUS_LABELS[s],
              }))}
            />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

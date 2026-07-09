"use client";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  PhoneOutlined,
  ReloadOutlined,
  RightOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Form, Input, InputNumber, Segmented, Select, Spin, Tag, message } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createDashboardBallroomBooking,
  fetchDashboardBallroomBookings,
  fetchDashboardBallroomEventTypes,
  type DashboardBallroomBooking,
} from "@/lib/ballroomManagement";
import { formatSlotTime } from "@/lib/ballroomAvailability";
import styles from "./BallroomCalendar.module.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_HOURS = Array.from({ length: 14 }, (_, index) => index + 9);
const CALENDAR_START_MINUTES = 9 * 60;
const CALENDAR_END_MINUTES = 23 * 60;
const TIME_STEP_MINUTES = 15;

type CalendarView = "day" | "week" | "month";
type BookingFormValues = {
  start_time: string;
  end_time: string;
  name: string;
  phone: string;
  email?: string;
  guest_count: number;
  event_type: string;
  message?: string;
};
type DraftSelection = {
  date: string;
  start: string;
  end: string;
};
type DragStart = {
  date: string;
  minutes: number;
};

const BOOKING_STATUS_META: Record<DashboardBallroomBooking["status"], { label: string; color: string }> = {
  pending: { label: "Pending", color: "gold" },
  confirmed: { label: "Confirmed", color: "green" },
  declined: { label: "Declined", color: "red" },
  cancelled: { label: "Cancelled", color: "default" },
};

function calendarStart(month: Dayjs) {
  const firstDay = month.startOf("month");
  const mondayOffset = (firstDay.day() + 6) % 7;
  return firstDay.subtract(mondayOffset, "day");
}

function weekStart(day: Dayjs) {
  return day.subtract((day.day() + 6) % 7, "day").startOf("day");
}

function formatTimeRange(start: string, end: string) {
  return `${formatSlotTime(start)}-${formatSlotTime(end)}`;
}

function groupBookingsByDate(bookings: DashboardBallroomBooking[]) {
  return bookings.reduce<Record<string, DashboardBallroomBooking[]>>((acc, booking) => {
    if (!acc[booking.slot_date]) acc[booking.slot_date] = [];
    acc[booking.slot_date].push(booking);
    return acc;
  }, {});
}

function sortBookingsByStart(bookings: DashboardBallroomBooking[]) {
  return [...bookings].sort((a, b) => a.slot_start.localeCompare(b.slot_start));
}

function minutesFromTime(value: string) {
  const [hourText, minuteText] = value.split(":");
  return Number(hourText) * 60 + Number(minuteText || 0);
}

function formatMinutes(value: number) {
  const hour = Math.floor(value / 60);
  const minute = value % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function clampMinutes(value: number, max = CALENDAR_END_MINUTES) {
  return Math.min(Math.max(value, CALENDAR_START_MINUTES), max);
}

function roundToStep(value: number) {
  return Math.round(value / TIME_STEP_MINUTES) * TIME_STEP_MINUTES;
}

function pointerMinutes(clientY: number, element: HTMLElement, max = CALENDAR_END_MINUTES) {
  const rect = element.getBoundingClientRect();
  const ratio = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
  const rawMinutes = CALENDAR_START_MINUTES + ratio * (CALENDAR_END_MINUTES - CALENDAR_START_MINUTES);
  return clampMinutes(roundToStep(rawMinutes), max);
}

function eventPosition(start: string, end: string) {
  const totalMinutes = CALENDAR_END_MINUTES - CALENDAR_START_MINUTES;
  const startMinutes = Math.max(CALENDAR_START_MINUTES, minutesFromTime(start));
  const endMinutes = Math.min(CALENDAR_END_MINUTES, minutesFromTime(end));
  const heightPercent = ((endMinutes - startMinutes) / totalMinutes) * 100;
  return {
    top: `${((startMinutes - CALENDAR_START_MINUTES) / totalMinutes) * 100}%`,
    height: `${Math.max(4, heightPercent)}%`,
  };
}

function dedupeById<T extends { id: number }>(rows: T[]) {
  return Array.from(new Map(rows.map((row) => [row.id, row])).values());
}

export default function BallroomCalendar() {
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format("YYYY-MM-DD"));
  const [bookings, setBookings] = useState<DashboardBallroomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [draftSelection, setDraftSelection] = useState<DraftSelection | null>(null);
  const [dragStart, setDragStart] = useState<DragStart | null>(null);
  const [bookingForm] = Form.useForm<BookingFormValues>();
  const [eventTypeOptions, setEventTypeOptions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    fetchDashboardBallroomEventTypes({ active_only: true })
      .then((types) => {
        const options = types.map((item) => ({ value: item.slug, label: item.label }));
        setEventTypeOptions(options);
        if (options.length && !bookingForm.getFieldValue("event_type")) {
          bookingForm.setFieldValue("event_type", options[0].value);
        }
      })
      .catch(() => {});
  }, [bookingForm]);

  const selectedDay = useMemo(() => dayjs(selectedDate), [selectedDate]);

  const visibleDays = useMemo(() => {
    if (calendarView === "day") return [selectedDay];
    if (calendarView === "week") {
      const start = weekStart(selectedDay);
      return Array.from({ length: 7 }, (_, index) => start.add(index, "day"));
    }

    const start = calendarStart(selectedDay.startOf("month"));
    return Array.from({ length: 42 }, (_, index) => start.add(index, "day"));
  }, [calendarView, selectedDay]);

  const visibleMonths = useMemo(() => {
    const months = new Map<string, { year: number; month: number }>();
    visibleDays.forEach((day) => {
      const key = day.format("YYYY-MM");
      months.set(key, { year: day.year(), month: day.month() + 1 });
    });
    return Array.from(months.values());
  }, [visibleDays]);

  const visibleMonthKey = visibleMonths.map((item) => `${item.year}-${item.month}`).join("|");

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const results = await Promise.all(
        visibleMonths.map(({ year, month }) => fetchDashboardBallroomBookings({ year, month })),
      );

      setBookings(dedupeById(results.flat()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ballroom calendar.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [visibleMonthKey]);

  useEffect(() => {
    void loadCalendar();
  }, [loadCalendar]);

  const bookingsByDate = useMemo(() => groupBookingsByDate(bookings), [bookings]);

  const selectedBookings = sortBookingsByStart(bookingsByDate[selectedDate] ?? []);
  const visibleDateKeys = useMemo(() => new Set(visibleDays.map((day) => day.format("YYYY-MM-DD"))), [visibleDays]);
  const visibleBookings = bookings.filter((booking) => visibleDateKeys.has(booking.slot_date));
  const pendingCount = visibleBookings.filter((booking) => booking.status === "pending").length;
  const confirmedCount = visibleBookings.filter((booking) => booking.status === "confirmed").length;
  const totalCount = visibleBookings.length;

  const moveCalendar = (offset: number) => {
    const nextDay =
      calendarView === "day"
        ? selectedDay.add(offset, "day")
        : calendarView === "week"
          ? selectedDay.add(offset, "week")
          : selectedDay.add(offset, "month").startOf("month");
    setSelectedDate(nextDay.format("YYYY-MM-DD"));
  };

  const selectDay = (day: Dayjs) => {
    setSelectedDate(day.format("YYYY-MM-DD"));
  };

  const setDraftBookingRange = (date: string, anchorMinutes: number, focusMinutes: number) => {
    const startMinutes = Math.min(anchorMinutes, focusMinutes);
    let endMinutes = Math.max(anchorMinutes, focusMinutes);

    if (endMinutes === startMinutes) {
      endMinutes = Math.min(startMinutes + 60, CALENDAR_END_MINUTES);
    }

    const start = formatMinutes(startMinutes);
    const end = formatMinutes(endMinutes);
    setDraftSelection({ date, start, end });
    bookingForm.setFieldsValue({ start_time: start, end_time: end });
  };

  const goToday = () => {
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
  };

  const calendarTitle = useMemo(() => {
    if (calendarView === "day") return selectedDay.format("MMMM D, YYYY");
    if (calendarView === "week") {
      const start = visibleDays[0];
      const end = visibleDays[visibleDays.length - 1];
      if (start.isSame(end, "month")) return `${start.format("MMM D")}-${end.format("D, YYYY")}`;
      return `${start.format("MMM D")}-${end.format("MMM D, YYYY")}`;
    }
    return selectedDay.format("MMMM YYYY");
  }, [calendarView, selectedDay, visibleDays]);

  const createBooking = async (values: BookingFormValues) => {
    if (values.start_time >= values.end_time) {
      message.warning("Start time must be before end time.");
      return;
    }

    setCreating(true);
    try {
      await createDashboardBallroomBooking({
        date: selectedDate,
        start_time: values.start_time,
        end_time: values.end_time,
        name: values.name,
        phone: values.phone,
        email: values.email || "",
        guest_count: values.guest_count,
        event_type: values.event_type,
        message: values.message || "",
      });
      message.success("Booking marked on the calendar.");
      setDraftSelection(null);
      bookingForm.resetFields();
      await loadCalendar();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Unable to create booking.");
    } finally {
      setCreating(false);
    }
  };

  const renderTimedEvents = (day: Dayjs) => {
    const dateKey = day.format("YYYY-MM-DD");
    const dayBookings = bookingsByDate[dateKey] ?? [];

    return dayBookings.map((booking) => {
      const position = eventPosition(booking.slot_start, booking.slot_end);
      return (
        <button
          key={`booking-${booking.id}`}
          type="button"
          className={`${styles.timeEvent} ${styles[`timeEvent_${booking.status}`]}`}
          style={position}
          onClick={() => selectDay(day)}
        >
          <strong>{booking.event_type_label}</strong>
          <span>{formatTimeRange(booking.slot_start, booking.slot_end)}</span>
          <small>{booking.name}</small>
        </button>
      );
    });
  };

  const renderDraftSelection = (day: Dayjs) => {
    const dateKey = day.format("YYYY-MM-DD");
    if (!draftSelection || draftSelection.date !== dateKey) return null;

    return (
      <div className={styles.draftEvent} style={eventPosition(draftSelection.start, draftSelection.end)}>
        <strong>New booking</strong>
        <span>{formatTimeRange(draftSelection.start, draftSelection.end)}</span>
        <small>Fill the form to register</small>
      </div>
    );
  };

  const renderDayColumns = () => (
    <div className={styles.timeGrid}>
      <div className={styles.timeAxis}>
        <span />
        {DAY_HOURS.map((hour) => (
          <span key={hour}>{`${String(hour).padStart(2, "0")}:00`}</span>
        ))}
      </div>
      <div
        className={styles.timeColumns}
        style={{ gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))` }}
      >
        {visibleDays.map((day) => {
          const dateKey = day.format("YYYY-MM-DD");
          const isSelected = dateKey === selectedDate;
          const isToday = day.isSame(dayjs(), "day");

          return (
            <section
              key={dateKey}
              className={`${styles.timeDayColumn} ${isSelected ? styles.timeDaySelected : ""}`}
              onClick={() => selectDay(day)}
            >
              <button type="button" className={styles.timeDayHead} onClick={() => selectDay(day)}>
                <span>{day.format("ddd")}</span>
                <strong className={isToday ? styles.todayNumber : ""}>{day.format("D")}</strong>
              </button>
              <div
                className={styles.timeDayBody}
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  if ((event.target as HTMLElement).closest(`.${styles.timeEvent}`)) return;

                  event.currentTarget.setPointerCapture(event.pointerId);
                  const startMinutes = pointerMinutes(
                    event.clientY,
                    event.currentTarget,
                    CALENDAR_END_MINUTES - TIME_STEP_MINUTES,
                  );
                  setDragStart({ date: dateKey, minutes: startMinutes });
                  selectDay(day);
                  setDraftBookingRange(
                    dateKey,
                    startMinutes,
                    Math.min(startMinutes + 60, CALENDAR_END_MINUTES),
                  );
                }}
                onPointerMove={(event) => {
                  if (!dragStart || dragStart.date !== dateKey) return;
                  const focusMinutes = pointerMinutes(event.clientY, event.currentTarget);
                  setDraftBookingRange(dateKey, dragStart.minutes, focusMinutes);
                }}
                onPointerUp={(event) => {
                  if (dragStart?.date === dateKey) {
                    const focusMinutes = pointerMinutes(event.clientY, event.currentTarget);
                    setDraftBookingRange(dateKey, dragStart.minutes, focusMinutes);
                    setDragStart(null);
                  }
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
                onPointerCancel={() => setDragStart(null)}
              >
                {DAY_HOURS.map((hour) => (
                  <span
                    key={hour}
                    className={styles.hourLine}
                  />
                ))}
                {renderTimedEvents(day)}
                {renderDraftSelection(day)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className={styles.shell} aria-label="Ballroom calendar">
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderMain}>
          <span className={styles.eyebrow}>Ballroom Management</span>
          <h1>Reservation Calendar</h1>
          <p>Track inquiries, confirm events, and register bookings synced with the public reservation form.</p>
        </div>
      </header>

      <div className={styles.summaryGrid}>
        <Card className={`${styles.summaryCard} ${styles.summaryCard_total}`}>
          <div className={styles.summaryCopy}>
            <span>Visible reservations</span>
            <strong>{totalCount}</strong>
          </div>
          <span className={styles.summaryIcon} aria-hidden>
            <CalendarOutlined />
          </span>
        </Card>
        <Card className={`${styles.summaryCard} ${styles.summaryCard_day}`}>
          <div className={styles.summaryCopy}>
            <span>Selected day</span>
            <strong>{selectedBookings.length}</strong>
          </div>
          <span className={styles.summaryIcon} aria-hidden>
            <TeamOutlined />
          </span>
        </Card>
        <Card className={`${styles.summaryCard} ${styles.summaryCard_pending}`}>
          <div className={styles.summaryCopy}>
            <span>Pending requests</span>
            <strong>{pendingCount}</strong>
          </div>
          <span className={styles.summaryIcon} aria-hidden>
            <ClockCircleOutlined />
          </span>
        </Card>
        <Card className={`${styles.summaryCard} ${styles.summaryCard_confirmed}`}>
          <div className={styles.summaryCopy}>
            <span>Confirmed events</span>
            <strong>{confirmedCount}</strong>
          </div>
          <span className={styles.summaryIcon} aria-hidden>
            <CheckCircleOutlined />
          </span>
        </Card>
      </div>

      <div className={styles.legendBar} aria-label="Booking status legend">
        <span className={styles.legendLabel}>Status</span>
        {Object.entries(BOOKING_STATUS_META).map(([key, meta]) => (
          <span key={key} className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles[`legendDot_${key}`]}`} />
            {meta.label}
          </span>
        ))}
      </div>

      {error ? (
        <Card className={styles.errorCard}>{error}</Card>
      ) : (
        <Spin spinning={loading}>
          <div className={styles.workspace}>
            <Card className={styles.calendarCard}>
              <div className={styles.calendarHead}>
                <span className={styles.calendarTitle}>
                  <CalendarOutlined />
                  {calendarTitle}
                </span>
                <div className={styles.calendarToolbar}>
                  <div className={styles.toolbarGroup}>
                    <Button size="small" onClick={() => moveCalendar(-1)} icon={<LeftOutlined />} />
                    <Button size="small" onClick={goToday}>
                      Today
                    </Button>
                    <Button size="small" onClick={() => moveCalendar(1)} icon={<RightOutlined />} />
                  </div>
                  <Segmented
                    size="small"
                    value={calendarView}
                    onChange={(value) => setCalendarView(value as CalendarView)}
                    options={[
                      { label: "Day", value: "day" },
                      { label: "Week", value: "week" },
                      { label: "Month", value: "month" },
                    ]}
                  />
                  <Button size="small" onClick={() => void loadCalendar()} icon={<ReloadOutlined />}>
                    Refresh
                  </Button>
                </div>
              </div>

              {calendarView === "month" ? (
                <>
                  <div className={styles.weekdays}>
                    {WEEKDAYS.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>

                  <div className={styles.grid}>
                    {visibleDays.map((day) => {
                      const dateKey = day.format("YYYY-MM-DD");
                      const dayBookings = sortBookingsByStart(bookingsByDate[dateKey] ?? []);
                      const visibleEvents = dayBookings.slice(0, 4);
                      const hiddenEventCount = dayBookings.length - visibleEvents.length;
                      const isSelected = dateKey === selectedDate;
                      const isOutsideMonth = !day.isSame(selectedDay, "month");
                      const isToday = day.isSame(dayjs(), "day");

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          className={[
                            styles.dayCell,
                            isSelected ? styles.daySelected : "",
                            dayBookings.length ? styles.dayHasBooking : "",
                            isOutsideMonth ? styles.dayMuted : "",
                          ].join(" ")}
                          onClick={() => selectDay(day)}
                        >
                          <span className={`${styles.dayNumber} ${isToday ? styles.todayNumber : ""}`}>
                            {day.date()}
                          </span>
                          <span className={styles.monthEventList}>
                            {visibleEvents.map((booking) => (
                              <span
                                key={booking.id}
                                className={`${styles.monthEvent} ${styles[`monthEvent_${booking.status}`]}`}
                              >
                                <span className={styles.monthEventTime}>{formatSlotTime(booking.slot_start)}</span>
                                <span className={styles.monthEventTitle}>
                                  {booking.event_type_label}
                                  {booking.name ? ` · ${booking.name}` : ""}
                                </span>
                              </span>
                            ))}
                            {hiddenEventCount > 0 ? (
                              <span className={styles.moreEvents}>+{hiddenEventCount} more</span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                renderDayColumns()
              )}
            </Card>

            <aside className={styles.detailPanel}>
              <div className={styles.selectedDateBanner}>
                <div>
                  <strong>{selectedDay.format("MMMM D, YYYY")}</strong>
                  <span>{selectedDay.format("dddd")}</span>
                </div>
                <span className={styles.selectedDateCount}>
                  {selectedBookings.length} booking{selectedBookings.length === 1 ? "" : "s"}
                </span>
              </div>

              <Card className={styles.detailCard} title="Mark booking">
                <Form<BookingFormValues>
                  form={bookingForm}
                  layout="vertical"
                  className={styles.bookingForm}
                  initialValues={{
                    start_time: "10:00",
                    end_time: "14:00",
                    guest_count: 200,
                  }}
                  onValuesChange={(_, values) => {
                    if (values.start_time && values.end_time) {
                      setDraftSelection({
                        date: selectedDate,
                        start: values.start_time,
                        end: values.end_time,
                      });
                    }
                  }}
                  onFinish={createBooking}
                >
                  <p className={styles.formHint}>
                    In day or week view, drag on the timeline to pick a time range, then complete the form below.
                  </p>
                  <div className={styles.timeFormGrid}>
                    <Form.Item name="start_time" label="Start" rules={[{ required: true }]}>
                      <input type="time" min="09:00" max="23:00" className={styles.timeInput} />
                    </Form.Item>
                    <Form.Item name="end_time" label="End" rules={[{ required: true }]}>
                      <input type="time" min="09:00" max="23:00" className={styles.timeInput} />
                    </Form.Item>
                  </div>

                  <Form.Item name="name" label="Customer name" rules={[{ required: true }]}>
                    <Input placeholder="Customer name" />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input placeholder="99xxxxxx" />
                  </Form.Item>

                  <div className={styles.timeFormGrid}>
                    <Form.Item name="guest_count" label="Guests" rules={[{ required: true }]}>
                      <InputNumber min={1} max={2000} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="event_type" label="Event type" rules={[{ required: true }]}>
                      <Select options={eventTypeOptions} placeholder="Select event type" />
                    </Form.Item>
                  </div>

                  <Form.Item name="email" label="Email">
                    <Input placeholder="name@example.com" />
                  </Form.Item>
                  <Form.Item name="message" label="Notes">
                    <Input.TextArea rows={3} placeholder="Setup, catering, special requests..." />
                  </Form.Item>

                  <Button type="primary" htmlType="submit" loading={creating} className={styles.createButton}>
                    Mark booking
                  </Button>
                </Form>
              </Card>

              <Card className={styles.detailCard} title="Requests for selected day">
                {selectedBookings.length ? (
                  <div className={styles.bookingList}>
                    {selectedBookings.map((booking) => {
                      const status = BOOKING_STATUS_META[booking.status];
                      return (
                        <article
                          key={booking.id}
                          className={`${styles.bookingCard} ${styles[`bookingCard_${booking.status}`]}`}
                        >
                          <div className={styles.bookingHead}>
                            <strong>{booking.event_type_label}</strong>
                            <Tag color={status.color}>{status.label}</Tag>
                          </div>
                          <div className={styles.bookingLine}>
                            <UserOutlined />
                            <span>{booking.name}</span>
                          </div>
                          <div className={styles.bookingLine}>
                            <PhoneOutlined />
                            <span>{booking.phone}</span>
                          </div>
                          <div className={styles.bookingMeta}>
                            <span>{formatTimeRange(booking.slot_start, booking.slot_end)}</span>
                            <span>{booking.guest_count.toLocaleString()} guests</span>
                          </div>
                          {booking.message ? <p>{booking.message}</p> : null}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No reservation requests for this day"
                  />
                )}
              </Card>
            </aside>
          </div>
        </Spin>
      )}
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import {
  checkBallroomTime,
  fetchBallroomAvailability,
  submitBallroomBooking,
} from "@/lib/api";
import type { BallroomTimeSlot } from "@/lib/ballroomAvailability";
import {
  dayAvailabilitySummary,
  groupSlotsByDate,
} from "@/lib/ballroomAvailability";
import {
  getBallroomBookingEventTypes,
  translateBallroomCheckTimeMessage,
  useLocale,
  useTranslations,
} from "@/lib/i18n";
import styles from "./BallroomAvailability.module.css";

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ day: number | null; key: string }> = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push({ day: null, key: `empty-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, key: toDateKey(year, month, day) });
  }

  return cells;
}

export default function BallroomAvailability({
  variant = "light",
  embedded = false,
}: {
  variant?: "light" | "dark";
  embedded?: boolean;
}) {
  const { locale } = useLocale();
  const copy = useTranslations().ballroom.availability;
  const eventTypes = getBallroomBookingEventTypes(locale);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [slots, setSlots] = useState<BallroomTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [customStart, setCustomStart] = useState("10:00");
  const [customEnd, setCustomEnd] = useState("14:00");
  const [customChecked, setCustomChecked] = useState(false);
  const [customAvailable, setCustomAvailable] = useState<boolean | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [checkingCustom, setCheckingCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form] = Form.useForm();

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    const data = await fetchBallroomAvailability(year, month);
    setSlots(data?.slots ?? []);
    setLoading(false);
  }, [year, month]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const slotsByDate = useMemo(() => groupSlotsByDate(slots), [slots]);
  const monthCells = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const resetCustomCheck = () => {
    setCustomChecked(false);
    setCustomAvailable(null);
    setCustomMessage("");
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(year, month - 1 + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth() + 1);
    setSelectedDate(null);
    resetCustomCheck();
    setDone(false);
  };

  const onCheckCustomTime = async () => {
    if (!selectedDate) return;

    setCheckingCustom(true);
    try {
      const result = await checkBallroomTime({
        date: selectedDate,
        start_time: customStart,
        end_time: customEnd,
      });
      if (!result) {
        message.error(copy.checkError);
        return;
      }
      const translated = translateBallroomCheckTimeMessage(result.message, locale);
      setCustomChecked(true);
      setCustomAvailable(result.available);
      setCustomMessage(translated);
      if (result.available) {
        message.success(translated);
      } else {
        message.warning(translated);
      }
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : copy.checkError,
      );
    } finally {
      setCheckingCustom(false);
    }
  };

  const canSubmit = customChecked && customAvailable === true;

  const onSubmit = async (values: {
    name: string;
    phone: string;
    email?: string;
    guest_count: number;
    event_type: "wedding" | "corporate" | "gala" | "conference" | "other";
    message?: string;
  }) => {
    if (!selectedDate) return;

    if (!canSubmit) {
      message.warning(copy.submitWarning);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        date: selectedDate,
        start_time: customStart,
        end_time: customEnd,
        ...values,
      };

      await submitBallroomBooking(payload);
      setDone(true);
      message.success(copy.bookingSuccess);
      form.resetFields();
      resetCustomCheck();
      await loadAvailability();
    } catch (error) {
      message.error(error instanceof Error ? error.message : copy.bookingError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${styles.wrap} ${variant === "dark" ? styles.wrapDark : ""} ${embedded ? styles.wrapEmbedded : ""}`}
    >
      <div className={styles.layout}>
        <div className={styles.calendarPanel}>
          <div className={styles.calendarHead}>
            <button type="button" className={styles.navBtn} onClick={() => shiftMonth(-1)} aria-label={copy.prevMonth}>
              ←
            </button>
            <h3 className={styles.monthLabel}>
              {year}.{String(month).padStart(2, "0")}
            </h3>
            <button type="button" className={styles.navBtn} onClick={() => shiftMonth(1)} aria-label={copy.nextMonth}>
              →
            </button>
          </div>

          <div className={styles.weekdays}>
            {copy.weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className={styles.grid} data-loading={loading ? "true" : "false"}>
            {monthCells.map((cell) => {
              if (!cell.day) {
                return <span key={cell.key} className={styles.emptyCell} />;
              }

              const dateKey = cell.key;
              const daySlots = slotsByDate[dateKey] ?? [];
              const summary = dayAvailabilitySummary(daySlots);
              const isSelected = selectedDate === dateKey;
              const cellDate = new Date(year, month - 1, cell.day);
              const isPast =
                cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={styles.dayCell}
                  data-summary={summary}
                  data-selected={isSelected ? "true" : "false"}
                  data-past={isPast ? "true" : "false"}
                  disabled={isPast}
                  onClick={() => {
                    setSelectedDate(dateKey);
                    resetCustomCheck();
                    setDone(false);
                  }}
                >
                  <span className={styles.dayNum}>{cell.day}</span>
                  {daySlots.length ? <span className={styles.dayDot} /> : null}
                </button>
              );
            })}
          </div>

          <div className={styles.legend}>
            <span><i data-status="available" /> {copy.available}</span>
            <span><i data-status="full" /> {copy.fullyBooked}</span>
            <span><i data-status="blocked" /> {copy.closed}</span>
          </div>
        </div>

        <div className={styles.detailPanel}>
          {!selectedDate ? (
            <div className={styles.placeholder}>
              <h3>{copy.selectDateTitle}</h3>
              <p>{copy.selectDateBody}</p>
            </div>
          ) : (
            <>
              <div className={styles.detailHead}>
                <h3>{selectedDate}</h3>
                <p>{copy.customTimeLead}</p>
              </div>

              <div className={styles.customPanel}>
                <p className={styles.customHint}>{copy.customTimeHint}</p>

                <div className={styles.customTimeRow}>
                  <label className={styles.timeField}>
                    <span>{copy.start}</span>
                    <input
                      type="time"
                      value={customStart}
                      min="09:00"
                      max="23:00"
                      onChange={(event) => {
                        setCustomStart(event.target.value);
                        resetCustomCheck();
                      }}
                    />
                  </label>
                  <label className={styles.timeField}>
                    <span>{copy.end}</span>
                    <input
                      type="time"
                      value={customEnd}
                      min="09:00"
                      max="23:00"
                      onChange={(event) => {
                        setCustomEnd(event.target.value);
                        resetCustomCheck();
                      }}
                    />
                  </label>
                </div>

                <Button
                  size="large"
                  onClick={onCheckCustomTime}
                  loading={checkingCustom}
                  className={styles.checkBtn}
                >
                  {copy.checkAvailability}
                </Button>

                {customChecked ? (
                  <p
                    className={styles.checkResult}
                    data-available={customAvailable ? "true" : "false"}
                  >
                    {customMessage}
                  </p>
                ) : null}
              </div>

              {done ? (
                <div className={styles.successBox}>
                  <h4>{copy.requestSubmittedTitle}</h4>
                  <p>{copy.requestSubmittedBody}</p>
                  <Button onClick={() => setDone(false)}>{copy.submitAnother}</Button>
                </div>
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  className={styles.form}
                  initialValues={{ guest_count: 200, event_type: "wedding" }}
                  onFinish={onSubmit}
                >
                  <Form.Item
                    name="name"
                    label={copy.name}
                    rules={[{ required: true, message: copy.nameRequired }]}
                  >
                    <Input size="large" placeholder={copy.namePlaceholder} />
                  </Form.Item>

                  <div className={styles.formRow}>
                    <Form.Item
                      name="phone"
                      label={copy.phone}
                      rules={[{ required: true, message: copy.phoneRequired }]}
                    >
                      <Input size="large" placeholder={copy.phonePlaceholder} />
                    </Form.Item>
                    <Form.Item name="email" label={copy.email}>
                      <Input size="large" placeholder={copy.emailPlaceholder} />
                    </Form.Item>
                  </div>

                  <div className={styles.formRow}>
                    <Form.Item
                      name="guest_count"
                      label={copy.guestCount}
                      rules={[{ required: true, message: copy.guestCountRequired }]}
                    >
                      <InputNumber min={20} max={1200} size="large" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="event_type" label={copy.eventType}>
                      <Select size="large" options={eventTypes} />
                    </Form.Item>
                  </div>

                  <Form.Item name="message" label={copy.additionalDetails}>
                    <Input.TextArea rows={3} placeholder={copy.detailsPlaceholder} />
                  </Form.Item>

                  {customChecked && customAvailable ? (
                    <p className={styles.selectedSummary}>
                      {copy.selectedSummary
                        .replace("{date}", selectedDate)
                        .replace("{start}", customStart)
                        .replace("{end}", customEnd)}
                    </p>
                  ) : null}

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    disabled={!canSubmit}
                    className={styles.submitBtn}
                  >
                    {copy.submitBooking}
                  </Button>
                </Form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

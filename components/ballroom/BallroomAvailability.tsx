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
  ballroomBookingEventTypes,
  dayAvailabilitySummary,
  displaySlotStatus,
  formatSlotTime,
  groupSlotsByDate,
  slotPeriodLabel,
  translateCheckTimeMessage,
} from "@/lib/ballroomAvailability";
import styles from "./BallroomAvailability.module.css";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type TimeMode = "preset" | "custom";

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
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [slots, setSlots] = useState<BallroomTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeMode, setTimeMode] = useState<TimeMode>("preset");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
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
  const selectedSlots = selectedDate ? slotsByDate[selectedDate] ?? [] : [];
  const selectedSlot = selectedSlots.find((slot) => slot.id === selectedSlotId) ?? null;

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
    setSelectedSlotId(null);
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
        message.error("Unable to check availability. Please try again.");
        return;
      }
      const translated = translateCheckTimeMessage(result.message);
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
        error instanceof Error ? error.message : "Unable to check availability. Please try again.",
      );
    } finally {
      setCheckingCustom(false);
    }
  };

  const canSubmit =
    timeMode === "preset"
      ? Boolean(selectedSlotId)
      : customChecked && customAvailable === true;

  const onSubmit = async (values: {
    name: string;
    phone: string;
    email?: string;
    guest_count: number;
    event_type: (typeof ballroomBookingEventTypes)[number]["value"];
    message?: string;
  }) => {
    if (!selectedDate) return;

    if (timeMode === "preset" && !selectedSlotId) {
      message.warning("Please select a Morning, Afternoon, or Evening slot first.");
      return;
    }

    if (timeMode === "custom" && !canSubmit) {
      message.warning("Please check your custom time before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const payload =
        timeMode === "preset" && selectedSlotId
          ? { slot: selectedSlotId, ...values }
          : {
              date: selectedDate,
              start_time: customStart,
              end_time: customEnd,
              ...values,
            };

      await submitBallroomBooking(payload);
      setDone(true);
      message.success("Your booking request has been submitted.");
      form.resetFields();
      setSelectedSlotId(null);
      resetCustomCheck();
      await loadAvailability();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Unable to submit. Please try again.");
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
            <button type="button" className={styles.navBtn} onClick={() => shiftMonth(-1)} aria-label="Previous month">
              ←
            </button>
            <h3 className={styles.monthLabel}>
              {year}.{String(month).padStart(2, "0")}
            </h3>
            <button type="button" className={styles.navBtn} onClick={() => shiftMonth(1)} aria-label="Next month">
              →
            </button>
          </div>

          <div className={styles.weekdays}>
            {WEEKDAYS.map((day) => (
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
                  disabled={isPast || summary === "none" || summary === "blocked"}
                  onClick={() => {
                    setSelectedDate(dateKey);
                    setSelectedSlotId(null);
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
            <span><i data-status="available" /> Available</span>
            <span><i data-status="full" /> Fully booked</span>
            <span><i data-status="blocked" /> Closed</span>
          </div>
        </div>

        <div className={styles.detailPanel}>
          {!selectedDate ? (
            <div className={styles.placeholder}>
              <h3>Select a Date</h3>
              <p>Choose a date on the calendar, then pick a time slot and submit your request.</p>
            </div>
          ) : (
            <>
              <div className={styles.detailHead}>
                <h3>{selectedDate}</h3>
                <p>Select a Time</p>
              </div>

              <div className={styles.modeTabs}>
                <button
                  type="button"
                  className={styles.modeTab}
                  data-active={timeMode === "preset" ? "true" : "false"}
                  onClick={() => {
                    setTimeMode("preset");
                    resetCustomCheck();
                  }}
                >
                  Morning · Afternoon · Evening
                </button>
                <button
                  type="button"
                  className={styles.modeTab}
                  data-active={timeMode === "custom" ? "true" : "false"}
                  onClick={() => {
                    setTimeMode("custom");
                    setSelectedSlotId(null);
                  }}
                >
                  Custom Time
                </button>
              </div>

              {timeMode === "preset" ? (
                <div className={styles.slotList}>
                  {selectedSlots.length === 0 ? (
                    <p className={styles.emptySlots}>No time slots are available for this date.</p>
                  ) : (
                    selectedSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        className={styles.slotBtn}
                        data-status={slot.status}
                        data-selected={selectedSlotId === slot.id ? "true" : "false"}
                        disabled={slot.status !== "available"}
                        onClick={() => {
                          setSelectedSlotId(slot.id);
                          setDone(false);
                        }}
                      >
                        <span className={styles.slotTime}>
                          {formatSlotTime(slot.start_time)} – {formatSlotTime(slot.end_time)}
                        </span>
                        <span className={styles.slotLabel}>{slotPeriodLabel(slot.label)}</span>
                        <span className={styles.slotStatus}>
                          {displaySlotStatus(slot.status, slot.status_label)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className={styles.customPanel}>
                  <p className={styles.customHint}>
                    Choose a start and end time between 09:00 and 23:00, then check availability.
                  </p>

                  <div className={styles.customTimeRow}>
                    <label className={styles.timeField}>
                      <span>Start</span>
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
                      <span>End</span>
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
                    Check Availability
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
              )}

              {done ? (
                <div className={styles.successBox}>
                  <h4>Request Submitted</h4>
                  <p>We will review your selected date and time and contact you shortly.</p>
                  <Button onClick={() => setDone(false)}>Submit Another Request</Button>
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
                    label="Name"
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input size="large" placeholder="Your name" />
                  </Form.Item>

                  <div className={styles.formRow}>
                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[{ required: true, message: "Please enter your phone number" }]}
                    >
                      <Input size="large" placeholder="99xxxxxx" />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                      <Input size="large" placeholder="name@example.com" />
                    </Form.Item>
                  </div>

                  <div className={styles.formRow}>
                    <Form.Item
                      name="guest_count"
                      label="Guest Count"
                      rules={[{ required: true, message: "Please enter guest count" }]}
                    >
                      <InputNumber min={20} max={1200} size="large" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="event_type" label="Event Type">
                      <Select size="large" options={[...ballroomBookingEventTypes]} />
                    </Form.Item>
                  </div>

                  <Form.Item name="message" label="Additional Details">
                    <Input.TextArea rows={3} placeholder="Setup, catering, special requests..." />
                  </Form.Item>

                  {timeMode === "preset" && selectedSlot ? (
                    <p className={styles.selectedSummary}>
                      Selected: {selectedDate} · {slotPeriodLabel(selectedSlot.label)} (
                      {formatSlotTime(selectedSlot.start_time)}–
                      {formatSlotTime(selectedSlot.end_time)})
                    </p>
                  ) : null}

                  {timeMode === "custom" && customChecked && customAvailable ? (
                    <p className={styles.selectedSummary}>
                      Selected: {selectedDate} · {customStart}–{customEnd} (custom time)
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
                    Submit Booking Request
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

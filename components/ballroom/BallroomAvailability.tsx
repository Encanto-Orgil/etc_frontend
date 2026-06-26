"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import {
  checkBallroomTime,
  fetchBallroomAvailability,
  submitBallroomBooking,
} from "@/lib/api";
import { ballroomEventTypes } from "@/lib/ballroomBrochure";
import type { BallroomTimeSlot } from "@/lib/ballroomAvailability";
import {
  dayAvailabilitySummary,
  formatSlotTime,
  groupSlotsByDate,
  slotPeriodLabel,
} from "@/lib/ballroomAvailability";
import styles from "./BallroomAvailability.module.css";

const WEEKDAYS = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];

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

export default function BallroomAvailability() {
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
        message.error("Цаг шалгахад алдаа гарлаа.");
        return;
      }
      setCustomChecked(true);
      setCustomAvailable(result.available);
      setCustomMessage(result.message);
      if (result.available) {
        message.success(result.message);
      } else {
        message.warning(result.message);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Цаг шалгахад алдаа гарлаа.");
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
    event_type: (typeof ballroomEventTypes)[number]["value"];
    message?: string;
  }) => {
    if (!selectedDate) return;

    if (timeMode === "preset" && !selectedSlotId) {
      message.warning("Эхлээд Өглөө / Өдөр / Орой цагаас сонгоно уу.");
      return;
    }

    if (timeMode === "custom" && !canSubmit) {
      message.warning("Эхлээд тусгай цагаа шалгана уу.");
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
      message.success("Захиалгын хүсэлт амжилттай илгээгдлээ.");
      form.resetFields();
      setSelectedSlotId(null);
      resetCustomCheck();
      await loadAvailability();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Илгээхэд алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.layout}>
        <div className={styles.calendarPanel}>
          <div className={styles.calendarHead}>
            <button type="button" className={styles.navBtn} onClick={() => shiftMonth(-1)}>
              ←
            </button>
            <h3 className={styles.monthLabel}>
              {year}.{String(month).padStart(2, "0")}
            </h3>
            <button type="button" className={styles.navBtn} onClick={() => shiftMonth(1)}>
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
            <span><i data-status="available" /> Боломжтой</span>
            <span><i data-status="full" /> Дүүрсэн</span>
            <span><i data-status="blocked" /> Хаалттай</span>
          </div>
        </div>

        <div className={styles.detailPanel}>
          {!selectedDate ? (
            <div className={styles.placeholder}>
              <h3>Өдөр сонгох</h3>
              <p>Календар дээрээс өдөр сонгоод цагаа шалгаж, хүсэлт илгээнэ үү.</p>
            </div>
          ) : (
            <>
              <div className={styles.detailHead}>
                <h3>{selectedDate}</h3>
                <p>Цаг сонгох</p>
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
                  Өглөө · Өдөр · Орой
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
                  Тусгай цаг
                </button>
              </div>

              {timeMode === "preset" ? (
                <div className={styles.slotList}>
                  {selectedSlots.length === 0 ? (
                    <p className={styles.emptySlots}>Энэ өдөр цагийн хуваарь байхгүй.</p>
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
                        <span className={styles.slotStatus}>{slot.status_label}</span>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className={styles.customPanel}>
                  <p className={styles.customHint}>
                    09:00 – 23:00 хооронд эхлэх, дуусах цагаа сонгоод шалгана уу.
                  </p>

                  <div className={styles.customTimeRow}>
                    <label className={styles.timeField}>
                      <span>Эхлэх</span>
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
                      <span>Дуусах</span>
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
                    Цаг шалгах
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
                  <h4>Хүсэлт илгээгдлээ</h4>
                  <p>Бид таны сонгосон өдөр, цагийг шалгаад удахгүй холбогдоно.</p>
                  <Button onClick={() => setDone(false)}>Шинэ хүсэлт</Button>
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
                    label="Нэр"
                    rules={[{ required: true, message: "Нэрээ оруулна уу" }]}
                  >
                    <Input size="large" placeholder="Таны нэр" />
                  </Form.Item>

                  <div className={styles.formRow}>
                    <Form.Item
                      name="phone"
                      label="Утас"
                      rules={[{ required: true, message: "Утас оруулна уу" }]}
                    >
                      <Input size="large" placeholder="99xxxxxx" />
                    </Form.Item>
                    <Form.Item name="email" label="И-мэйл">
                      <Input size="large" placeholder="name@example.com" />
                    </Form.Item>
                  </div>

                  <div className={styles.formRow}>
                    <Form.Item
                      name="guest_count"
                      label="Зочдын тоо"
                      rules={[{ required: true, message: "Зочдын тоо оруулна уу" }]}
                    >
                      <InputNumber min={20} max={1200} size="large" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="event_type" label="Арга хэмжээний төрөл">
                      <Select size="large" options={[...ballroomEventTypes]} />
                    </Form.Item>
                  </div>

                  <Form.Item name="message" label="Нэмэлт мэдээлэл">
                    <Input.TextArea rows={3} placeholder="Setup, catering, тусгай хүсэлт..." />
                  </Form.Item>

                  {timeMode === "preset" && selectedSlot ? (
                    <p className={styles.selectedSummary}>
                      Сонгосон: {selectedDate} · {slotPeriodLabel(selectedSlot.label)} (
                      {formatSlotTime(selectedSlot.start_time)}–
                      {formatSlotTime(selectedSlot.end_time)})
                    </p>
                  ) : null}

                  {timeMode === "custom" && customChecked && customAvailable ? (
                    <p className={styles.selectedSummary}>
                      Сонгосон: {selectedDate} · {customStart}–{customEnd} (тусгай цаг)
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
                    Захиалгын хүсэлт илгээх
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

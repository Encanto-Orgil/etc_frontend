export type BallroomSlotStatus = "available" | "reserved" | "booked" | "blocked";

export type BallroomTimeSlot = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  label: string;
  status: BallroomSlotStatus;
  status_label: string;
};

export type BallroomAvailability = {
  year: number;
  month: number;
  slots: BallroomTimeSlot[];
};

export type BallroomPresetBookingPayload = {
  slot: number;
  name: string;
  phone: string;
  email?: string;
  guest_count: number;
  event_type: "wedding" | "corporate" | "gala" | "conference" | "other";
  message?: string;
};

export type BallroomCustomBookingPayload = {
  date: string;
  start_time: string;
  end_time: string;
  name: string;
  phone: string;
  email?: string;
  guest_count: number;
  event_type: "wedding" | "corporate" | "gala" | "conference" | "other";
  message?: string;
};

export type BallroomBookingPayload =
  | BallroomPresetBookingPayload
  | BallroomCustomBookingPayload;

export type BallroomCheckTimePayload = {
  date: string;
  start_time: string;
  end_time: string;
};

export type BallroomCheckTimeResponse = {
  available: boolean;
  message: string;
  date: string;
  start_time: string;
  end_time: string;
};

export type BallroomBookingResponse = {
  id: number;
  slot: number;
  slot_date: string;
  slot_start: string;
  slot_end: string;
  slot_label: string;
  name: string;
  phone: string;
  email?: string;
  guest_count: number;
  event_type: string;
  event_type_label: string;
  message?: string;
  status: string;
  status_label: string;
  created_at: string;
};

export function formatSlotTime(value: string) {
  return value.slice(0, 5);
}

export function groupSlotsByDate(slots: BallroomTimeSlot[]) {
  return slots.reduce<Record<string, BallroomTimeSlot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});
}

export function dayAvailabilitySummary(slots: BallroomTimeSlot[]) {
  if (!slots.length) return "none";
  if (slots.some((slot) => slot.status === "available")) return "available";
  if (slots.every((slot) => slot.status === "blocked")) return "blocked";
  return "full";
}

export function slotPeriodLabel(label: string) {
  const map: Record<string, string> = {
    "Өглөөний үе": "Morning",
    "Өдрийн үе": "Afternoon",
    "Оройн үе": "Evening",
    "Оройн үe": "Evening",
    "Өглөө": "Morning",
    "Өдөр": "Afternoon",
    "Орой": "Evening",
    Morning: "Morning",
    Afternoon: "Afternoon",
    Evening: "Evening",
  };
  return map[label] || label;
}

export function displaySlotStatus(status: string, statusLabel?: string) {
  const byStatus: Record<string, string> = {
    available: "Available",
    reserved: "Reserved",
    booked: "Fully Booked",
    blocked: "Closed",
  };
  if (byStatus[status]) return byStatus[status];

  const byLabel: Record<string, string> = {
    Боломжтой: "Available",
    Захиалсан: "Reserved",
    "Бүрэн захиалсан": "Fully Booked",
    Хаалттай: "Closed",
  };
  if (statusLabel && byLabel[statusLabel]) return byLabel[statusLabel];
  return statusLabel || status;
}

export const ballroomBookingEventTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "gala", label: "Gala Dinner" },
  { value: "conference", label: "Conference" },
  { value: "other", label: "Other" },
] as const;

export function translateCheckTimeMessage(message: string) {
  const exact: Record<string, string> = {
    "Сонгосон цаг боломжтой.": "Selected time is available.",
    "Эхлэх цаг дуусах цагаас өмнө байх ёстой.":
      "Start time must be before end time.",
    "Цаг 09:00–23:00 хооронд байх ёстой.":
      "Time must be between 09:00 and 23:00.",
  };
  if (exact[message]) return exact[message];

  const conflictMatch = message.match(/^Сонгосон цаг давхцаж байна: (.+)$/);
  if (conflictMatch) {
    return `Selected time conflicts with: ${conflictMatch[1]}`;
  }

  return message;
}

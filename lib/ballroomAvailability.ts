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
    "Өглөөний үе": "Өглөө",
    "Өдрийн үе": "Өдөр",
    "Оройн үе": "Орой",
    "Оройн үe": "Орой",
  };
  return map[label] || label;
}

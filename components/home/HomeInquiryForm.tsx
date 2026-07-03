"use client";

import InquiryForm from "@/components/InquiryForm";
import type { InquiryPayload } from "@/lib/api";

const HOME_INTEREST_OPTIONS: { value: InquiryPayload["interest"]; label: string }[] = [
  { value: "office", label: "Office" },
  { value: "apartment", label: "Residence" },
  { value: "mall", label: "Retail" },
  { value: "general", label: "Investment" },
];

export default function HomeInquiryForm() {
  return (
    <InquiryForm
      defaultInterest="general"
      interestOptions={HOME_INTEREST_OPTIONS}
    />
  );
}

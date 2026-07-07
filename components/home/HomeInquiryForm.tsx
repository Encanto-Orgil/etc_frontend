"use client";

import InquiryForm from "@/components/InquiryForm";
import type { InquiryPayload } from "@/lib/api";
import { useLocale } from "@/lib/i18n";

export default function HomeInquiryForm() {
  const { locale, t } = useLocale();

  const interestOptions: { value: InquiryPayload["interest"]; label: string }[] =
    t.home.contact.interestOptions.map((option) => ({
      value: option.value as InquiryPayload["interest"],
      label: option.label,
    }));

  return (
    <InquiryForm
      defaultInterest="office"
      interestOptions={interestOptions}
      locale={locale}
      theme="light"
    />
  );
}

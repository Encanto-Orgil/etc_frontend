"use client";

import InquiryForm from "@/components/InquiryForm";
import { useLocale } from "@/lib/i18n";

export default function MallInquiryForm() {
  const { locale } = useLocale();

  return <InquiryForm defaultInterest="mall" locale={locale} theme="light" />;
}

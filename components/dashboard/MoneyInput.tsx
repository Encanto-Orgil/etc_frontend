"use client";

import { Input } from "antd";
import type { InputProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { formatMoneyDigits, parseMoneyDigits } from "@/lib/moneyFormat";

type MoneyInputProps = Omit<InputProps, "value" | "onChange"> & {
  value?: number | string | null;
  onChange?: (value: number) => void;
  min?: number;
};

export default function MoneyInput({ value, onChange, min = 0, className, style, ...rest }: MoneyInputProps) {
  const focusedRef = useRef(false);
  const [text, setText] = useState(() => formatMoneyDigits(value));

  useEffect(() => {
    if (!focusedRef.current) {
      setText(formatMoneyDigits(value));
    }
  }, [value]);

  const commit = (raw: string) => {
    if (raw.replace(/[^\d]/g, "") === "") {
      setText("");
      onChange?.(0);
      return;
    }
    const parsed = Math.max(parseMoneyDigits(raw), min);
    setText(formatMoneyDigits(parsed));
    onChange?.(parsed);
  };

  return (
    <Input
      {...rest}
      className={className}
      style={style}
      inputMode="numeric"
      value={text}
      onFocus={(event) => {
        focusedRef.current = true;
        rest.onFocus?.(event);
      }}
      onBlur={(event) => {
        focusedRef.current = false;
        commit(text);
        rest.onBlur?.(event);
      }}
      onChange={(event) => {
        const raw = event.target.value;
        if (raw.replace(/[^\d]/g, "") === "") {
          setText("");
          onChange?.(0);
          return;
        }
        const parsed = Math.max(parseMoneyDigits(raw), min);
        setText(formatMoneyDigits(parsed));
        onChange?.(parsed);
      }}
    />
  );
}

"use client";

import { Button, Card, Form, Input, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getLoginRedirect, login } from "@/lib/auth";
import styles from "./LoginForm.module.css";

type Props = {
  title: string;
  subtitle: string;
};

export default function LoginForm({ title, subtitle }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(values.username, values.password);
      router.replace(getLoginRedirect(user));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <Typography.Title level={3}>{title}</Typography.Title>
        <Typography.Paragraph type="secondary">{subtitle}</Typography.Paragraph>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
}

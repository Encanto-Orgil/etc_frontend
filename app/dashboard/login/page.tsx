"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe, login } from "@/lib/auth";
import styles from "./login.module.css";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMe().then((user) => {
      if (user) router.replace("/dashboard");
      else setChecking(false);
    });
  }, [router]);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError("");
    try {
      await login(values.username, values.password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэвтрэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.copy}>
          <span className={styles.badge}>ETC удирдлага</span>
          <Typography.Title level={2} className={styles.title}>
            Түрээсийн удирдлагын систем
          </Typography.Title>
          <Typography.Paragraph className={styles.subtitle}>
            Оффис, молл, орон сууцны stacking plan, түрээслэгчийн мэдээлэл, ballroom
            захиалга болон хүсэлтийг нэг дороос удирдана.
          </Typography.Paragraph>
        </div>

        <Card className={styles.card}>
          <Typography.Title level={4}>Нэвтрэх</Typography.Title>
          <Typography.Paragraph type="secondary">
            Staff эрхтэй хэрэглэгчийн нэр, нууц үгээ оруулна уу.
          </Typography.Paragraph>

          {error ? <Alert type="error" message={error} showIcon className={styles.alert} /> : null}

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="username"
              label="Хэрэглэгчийн нэр"
              rules={[{ required: true, message: "Хэрэглэгчийн нэр оруулна уу" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="admin"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Нууц үг"
              rules={[{ required: true, message: "Нууц үг оруулна уу" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Системд нэвтрэх
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined, BankOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      const ok = login(values.username, values.password);
      if (ok) {
        message.success('登录成功');
        router.replace('/supplier/dashboard');
      } else {
        message.error('用户名或密码错误');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A1628 0%, #1A365D 50%, #2B6CB0 100%)',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'linear-gradient(135deg, #2B6CB0, #4299E1)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
            boxShadow: '0 8px 32px rgba(43,108,176,0.4)',
          }}>
            <BankOutlined style={{ fontSize: 40, color: '#fff' }} />
          </div>
          <Title level={2} style={{ color: '#fff', margin: '0 0 4px', fontWeight: 600, letterSpacing: 1 }}>
            保理业务管理系统
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, letterSpacing: 0.5 }}>
            Factoring Business Management System
          </Text>
        </div>

        {/* Login Card */}
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            border: 'none',
          }}
          styles={{ body: { padding: '40px 32px 32px' } }}
        >
          <Form name="login" onFinish={onFinish} size="large" autoComplete="off">
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input
                prefix={<UserOutlined style={{ color: '#A0AEC0' }} />}
                placeholder="用户名"
                style={{ borderRadius: 10, height: 48 }}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: '#A0AEC0' }} />}
                placeholder="密码"
                style={{ borderRadius: 10, height: 48 }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" block loading={loading}
                style={{
                  height: 48, borderRadius: 10, fontSize: 16, fontWeight: 500,
                  background: 'linear-gradient(135deg, #2B6CB0, #4299E1)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(43,108,176,0.4)',
                }}>
                登 录
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            © 2025 保理业务管理系统
          </Text>
        </div>
      </div>
    </div>
  );
}

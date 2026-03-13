'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { LockOutlined, UserOutlined, BankOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 16,
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <BankOutlined style={{ fontSize: 36, color: '#fff' }} />
          </div>
          <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>
            保理业务管理系统
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            Factoring Business Management System
          </Text>
        </div>

        {/* Login Card */}
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: 'none',
          }}
          styles={{ body: { padding: '40px 32px 32px' } }}
        >
          <Form name="login" onFinish={onFinish} size="large" autoComplete="off">
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="用户名"
                style={{ borderRadius: 8, height: 48 }}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="密码"
                style={{ borderRadius: 8, height: 48 }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" block loading={loading}
                style={{
                  height: 48, borderRadius: 8, fontSize: 16, fontWeight: 500,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}>
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div style={{
            background: '#f6f8fa', borderRadius: 8, padding: '12px 16px',
            border: '1px dashed #d9d9d9',
          }}>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                <SafetyOutlined /> 测试账号
              </Text>
              <Text copyable style={{ fontSize: 13 }}>
                用户名：admin　密码：admin123
              </Text>
            </Space>
          </div>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            保理系统可交互原型 v1.0 · 演示环境
          </Text>
        </div>
      </div>
    </div>
  );
}

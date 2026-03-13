'use client';

import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Statistic } from 'antd';
import { BankOutlined, UserOutlined, FundOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const router = useRouter();

  const portals = [
    {
      title: '银行管理端',
      icon: <BankOutlined style={{ fontSize: 48, color: '#1677ff' }} />,
      desc: '标签配置 · 产品管理 · 定价规则 · 协议管理 · 角色权限',
      path: '/admin/tags',
      color: '#e6f4ff',
      stats: [{ label: '产品SKU', value: 22 }, { label: '标签维度', value: 2 }],
    },
    {
      title: '供应商端',
      icon: <UserOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      desc: '注册审批 · 额度申请 · 融资管理 · 资产管理 · 费用查询',
      path: '/supplier/dashboard',
      color: '#f6ffed',
      stats: [{ label: '注册供应商', value: 3 }, { label: '活跃额度', value: 2 }],
    },
    {
      title: '资金方端',
      icon: <FundOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
      desc: '客群管理 · 额度管理 · 业务管理 · 结算 · 市场经营',
      path: '/funder/customers',
      color: '#f9f0ff',
      stats: [{ label: '在途融资', value: 1 }, { label: '已放款', value: 1 }],
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <Title level={1} style={{ marginBottom: 8 }}>
          <BankOutlined style={{ marginRight: 12, color: '#1677ff' }} />
          保理业务管理系统
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          Interactive Factoring System Prototype · 可交互原型演示
        </Paragraph>
        <Text type="secondary">
          本系统为前端交互原型，数据存储于浏览器 localStorage，刷新页面数据不丢失
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {portals.map((p) => (
          <Col xs={24} md={8} key={p.title}>
            <Card
              hoverable
              style={{ height: '100%', borderRadius: 12, background: p.color }}
              styles={{ body: { padding: 32 } }}
              onClick={() => router.push(p.path)}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>{p.icon}</div>
                <Title level={3} style={{ textAlign: 'center', margin: 0 }}>{p.title}</Title>
                <Paragraph type="secondary" style={{ textAlign: 'center', margin: 0 }}>
                  {p.desc}
                </Paragraph>
                <Row gutter={16}>
                  {p.stats.map(s => (
                    <Col span={12} key={s.label}>
                      <Statistic title={s.label} value={s.value} />
                    </Col>
                  ))}
                </Row>
                <Button type="primary" block icon={<ArrowRightOutlined />} size="large">
                  进入
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: 48, color: '#999', fontSize: 12 }}>
        <Text type="secondary">
          保理系统可交互原型 v1.0 · 基于 Next.js + Ant Design · 纯前端 Mock 数据
        </Text>
      </div>
    </div>
  );
}

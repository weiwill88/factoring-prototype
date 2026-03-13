'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Space, Divider, List, Badge } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, CreditCardOutlined, FundOutlined, BellOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getAppData } from '@/lib/mockData';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [data, setData] = useState({ totalCredit: 0, availableCredit: 0, financingBalance: 0, recentFinancing: [] as any[], alerts: [] as any[] });

  useEffect(() => {
    const appData = getAppData();
    const credits = appData.creditApplications.filter(c => c.status === '已生效');
    const totalCredit = credits.reduce((s, c) => s + c.totalAmount, 0);
    const availableCredit = credits.reduce((s, c) => s + c.availableAmount, 0);
    const financingBalance = appData.financingApplications.filter(f => f.status === '已放款').reduce((s, f) => s + f.appliedAmount, 0);

    setData({
      totalCredit, availableCredit, financingBalance,
      recentFinancing: appData.financingApplications.slice(0, 5),
      alerts: [
        { id: 1, type: 'warning', message: '融资 FIN-20251001-001 将于 2026-01-01 到期', time: '2025-12-15' },
        { id: 2, type: 'info', message: '额度 CL-2025-001 将于 2026-08-20 到期', time: '2026-07-20' },
        { id: 3, type: 'success', message: '注册审批已通过', time: '2025-08-15' },
      ],
    });
  }, []);

  const fmtMoney = (v: number) => `¥ ${(v / 10000).toFixed(0)} 万`;

  const columns = [
    { title: '业务编号', dataIndex: 'appNumber', key: 'appNumber', width: 180 },
    { title: '产品', dataIndex: 'productName', key: 'productName', ellipsis: true },
    { title: '交易对手', dataIndex: 'counterpartyName', key: 'counterpartyName', ellipsis: true },
    { title: '金额(元)', dataIndex: 'appliedAmount', key: 'appliedAmount', render: (v: number) => v.toLocaleString() },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => {
        const colors: Record<string, string> = { '已放款': 'green', '客户经理审批中': 'orange', '草稿': 'default', '已结清': 'blue' };
        return <Tag color={colors[s] || 'default'}>{s}</Tag>;
      },
    },
    { title: '申请日', dataIndex: 'applyDate', key: 'applyDate', width: 110 },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>驾驶舱</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card><Statistic title="授信额度总额" value={data.totalCredit} precision={0} prefix={<CreditCardOutlined />} formatter={v => fmtMoney(Number(v))} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="额度余额" value={data.availableCredit} precision={0} prefix={<FundOutlined />} formatter={v => fmtMoney(Number(v))} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="融资余额" value={data.financingBalance} precision={0} prefix={<DollarOutlined />} formatter={v => fmtMoney(Number(v))} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="最近融资记录" size="small">
            <Table dataSource={data.recentFinancing} columns={columns} rowKey="id" size="small" pagination={false} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<><BellOutlined /> 提醒</>} size="small">
            <List dataSource={data.alerts} renderItem={(item: any) => (
              <List.Item>
                <Space direction="vertical" size={0}>
                  <Badge status={item.type === 'warning' ? 'warning' : item.type === 'info' ? 'processing' : 'success'} text={item.message} />
                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 14 }}><ClockCircleOutlined /> {item.time}</Text>
                </Space>
              </List.Item>
            )} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

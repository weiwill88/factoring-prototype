'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Typography, Tabs, Descriptions, Row, Col, Statistic, Space, Input, message, Modal, Form, DatePicker, InputNumber, Select } from 'antd';
import { PlusOutlined, ExportOutlined, EditOutlined, EyeOutlined, BarChartOutlined, TeamOutlined } from '@ant-design/icons';
import { getAppData } from '@/lib/mockData';
import type { BusinessMetric, MarketingRecord } from '@/lib/types';

const { Title, Text } = Typography;

export default function MarketingMetricsPage() {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [marketing, setMarketing] = useState<MarketingRecord[]>([]);

  useEffect(() => {
    const d = getAppData();
    setMetrics(d.metrics);
    setMarketing(d.marketing);
  }, []);

  const metricColumns = [
    { title: '指标名称', dataIndex: 'metricName' },
    { title: '目标值', dataIndex: 'targetValue', render: (v: number, r: BusinessMetric) => `${v} ${r.unit}` },
    { title: '当前值', dataIndex: 'currentValue', render: (v: number, r: BusinessMetric) => <Text strong>{v} {r.unit}</Text> },
    { title: '完成率', key: 'progress', render: (_: unknown, r: BusinessMetric) => {
      const pct = Math.round(r.currentValue / r.targetValue * 100);
      return <Tag color={pct >= 80 ? 'green' : pct >= 50 ? 'orange' : 'red'}>{pct}%</Tag>;
    }},
    { title: '年度', dataIndex: 'year', width: 70 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={s === '已完成' ? 'green' : s === '进行中' ? 'blue' : 'red'}>{s}</Tag> },
    { title: '操作', width: 80, render: () => <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button> },
  ];

  const marketingColumns = [
    { title: '客户名称', dataIndex: 'customerName', ellipsis: true },
    { title: '联系人', dataIndex: 'contactPerson', width: 80 },
    { title: '联系电话', dataIndex: 'contactPhone', width: 130 },
    { title: '拜访日期', dataIndex: 'visitDate', width: 100 },
    { title: '拜访内容', dataIndex: 'visitContent', ellipsis: true },
    { title: '跟进计划', dataIndex: 'followUpPlan', ellipsis: true },
    { title: '客户经理', dataIndex: 'customerManager', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={s === '已签约' ? 'green' : s === '跟进中' ? 'blue' : 'red'}>{s}</Tag> },
    { title: '操作', width: 80, render: () => <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button> },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>市场经营</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {metrics.map(m => (
          <Col xs={24} sm={8} key={m.id}>
            <Card size="small">
              <Statistic title={m.metricName} value={m.currentValue} suffix={`/ ${m.targetValue} ${m.unit}`}
                valueStyle={{ color: m.currentValue >= m.targetValue * 0.8 ? '#52c41a' : '#faad14' }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Tabs items={[
          {
            key: 'metrics', label: <><BarChartOutlined /> 业务指标</>,
            children: (
              <>
                <div style={{ marginBottom: 12 }}><Button type="primary" icon={<PlusOutlined />}>新增指标</Button></div>
                <Table dataSource={metrics} columns={metricColumns} rowKey="id" size="middle" bordered pagination={false} />
              </>
            ),
          },
          {
            key: 'marketing', label: <><TeamOutlined /> 客户营销</>,
            children: (
              <>
                <div style={{ marginBottom: 12 }}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />}>新增拜访记录</Button>
                    <Input.Search placeholder="搜索客户名称" style={{ width: 250 }} />
                  </Space>
                </div>
                <Table dataSource={marketing} columns={marketingColumns} rowKey="id" size="middle" bordered />
              </>
            ),
          },
        ]} />
      </Card>
    </div>
  );
}

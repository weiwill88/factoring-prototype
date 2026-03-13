'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Typography, message } from 'antd';
import { PlusOutlined, EyeOutlined, FileSearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getAppData } from '@/lib/mockData';
import type { FinancingApplication } from '@/lib/types';

const { Title, Text } = Typography;

export default function FinancingPage() {
  const [data, setData] = useState<FinancingApplication[]>([]);
  const router = useRouter();

  useEffect(() => {
    setData(getAppData().financingApplications);
  }, []);

  const statusColors: Record<string, string> = {
    '草稿': 'default', '客户经理审批中': 'orange', '供应商复核中': 'processing',
    '运营复核中': 'orange', '四级审批中': 'orange', '五级审批中': 'orange',
    '待中登登记': 'blue', '中登登记中': 'processing', '待放款': 'blue',
    '收费中': 'processing', '放款中': 'processing', '已放款': 'green',
    '部分回款': 'cyan', '已结清': 'default', '已退回': 'red',
  };

  const columns = [
    { title: '业务编号', dataIndex: 'appNumber', key: 'appNumber', width: 180 },
    { title: '产品', dataIndex: 'productName', key: 'productName', ellipsis: true },
    { title: '交易对手', dataIndex: 'counterpartyName', key: 'counterpartyName', ellipsis: true },
    { title: '发票总额', dataIndex: 'invoiceTotal', key: 'invoiceTotal', render: (v: number) => `¥ ${v.toLocaleString()}` },
    { title: '申请金额', dataIndex: 'appliedAmount', key: 'appliedAmount', render: (v: number) => <Text strong>¥ {v.toLocaleString()}</Text> },
    { title: '放款方式', dataIndex: 'loanMethod', key: 'loanMethod', render: (v: string) => <Tag>{v}</Tag> },
    { title: '申请日', dataIndex: 'applyDate', key: 'applyDate', width: 110 },
    { title: '到期日', dataIndex: 'dueDate', key: 'dueDate', width: 110 },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={statusColors[s] || 'default'}>{s}</Tag>,
    },
    { title: '操作', width: 100,
      render: (_: unknown, r: FinancingApplication) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} size="small">查看</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>业务管理 — 国内保理</Title>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/supplier/financing/apply')}>
              融资申请
            </Button>
          </Space>
        </div>
        <Table dataSource={data} columns={columns} rowKey="id" size="middle" bordered
          pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条` }} />
      </Card>
    </div>
  );
}

'use client';

import React from 'react';
import { Card, Table, Button, Tag, Space, Typography, Input } from 'antd';
import { PlusOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const mockData = [
    { id: "pre-1", businessNumber: "PRE-2025-001", supplierName: "上海明远科技有限公司", buyerName: "中兵科技集团有限公司", productName: "预保理-有追", totalAmount: 4000000, status: "已放款", applyDate: "2025-08-10", dueDate: "2026-02-10" },
    { id: "pre-2", businessNumber: "PRE-2025-002", supplierName: "深圳鼎力达机械有限公司", buyerName: "长安汽车股份有限公司", productName: "预保理-无追", totalAmount: 2500000, status: "审批中", applyDate: "2025-11-01", dueDate: "2026-05-01" },
  ];

export default function Page() {
  const columns = [
    { title: '业务编号', dataIndex: 'businessNumber', width: 150 },
    { title: '融资人', dataIndex: 'supplierName', ellipsis: true },
    { title: '买方', dataIndex: 'buyerName', ellipsis: true },
    { title: '产品', dataIndex: 'productName', width: 160 },
    { title: '金额', dataIndex: 'totalAmount', render: (v: number) => `¥ ${v.toLocaleString()}` },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (s: string) => <Tag color={s === '已放款' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '申请日', dataIndex: 'applyDate', width: 100 },
    { title: '到期日', dataIndex: 'dueDate', width: 100 },
    { title: '操作', width: 100, render: () => <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button> },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>{'预保理'}</Title>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>新增</Button>
            <Input.Search placeholder="搜索业务编号" style={{ width: 250 }} />
          </Space>
        </div>
        <Table dataSource={mockData} columns={columns} rowKey="id" size="middle" bordered />
      </Card>
    </div>
  );
}

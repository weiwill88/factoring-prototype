'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Descriptions, DatePicker, InputNumber, Select, Input, message } from 'antd';
import { PlusOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const mockBusinessData = [
  { id: 'pool-1', businessNumber: 'POOL-2025-001', supplierName: '上海明远科技有限公司', buyerName: '中兵科技集团有限公司', productName: '池保理-有追', totalAmount: 3000000, poolAssetCount: 5, status: '已放款', applyDate: '2025-09-01', dueDate: '2026-03-01' },
  { id: 'pool-2', businessNumber: 'POOL-2025-002', supplierName: '深圳鼎力达机械有限公司', buyerName: '长安汽车股份有限公司', productName: '池保理-有追', totalAmount: 2000000, poolAssetCount: 3, status: '审批中', applyDate: '2025-10-15', dueDate: '2026-04-15' },
];

export default function PoolFactoringPage() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<typeof mockBusinessData[0] | null>(null);

  const columns = [
    { title: '业务编号', dataIndex: 'businessNumber', key: 'businessNumber', width: 150 },
    { title: '融资人', dataIndex: 'supplierName', key: 'supplierName', ellipsis: true },
    { title: '买方', dataIndex: 'buyerName', key: 'buyerName', ellipsis: true },
    { title: '产品', dataIndex: 'productName', key: 'productName', width: 120 },
    { title: '入池金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => `¥ ${v.toLocaleString()}` },
    { title: '入池资产数', dataIndex: 'poolAssetCount', key: 'poolAssetCount', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (s: string) => <Tag color={s === '已放款' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '申请日', dataIndex: 'applyDate', key: 'applyDate', width: 100 },
    { title: '到期日', dataIndex: 'dueDate', key: 'dueDate', width: 100 },
    { title: '操作', width: 120, render: (_: unknown, r: typeof mockBusinessData[0]) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelected(r); setDetailOpen(true); }}>查看</Button>
        {r.status === '审批中' && <Button type="link" size="small" icon={<CheckCircleOutlined />}>审批</Button>}
      </Space>
    )},
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>池保理</Title>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>新增池保理</Button>
            <Input.Search placeholder="搜索业务编号/融资人" style={{ width: 250 }} />
          </Space>
        </div>
        <Table dataSource={mockBusinessData} columns={columns} rowKey="id" size="middle" bordered />
      </Card>

      <Modal title={selected ? `池保理详情 — ${selected.businessNumber}` : ''} open={detailOpen}
        onCancel={() => setDetailOpen(false)} footer={null} width={600}>
        {selected && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="业务编号">{selected.businessNumber}</Descriptions.Item>
            <Descriptions.Item label="产品">{selected.productName}</Descriptions.Item>
            <Descriptions.Item label="融资人">{selected.supplierName}</Descriptions.Item>
            <Descriptions.Item label="买方">{selected.buyerName}</Descriptions.Item>
            <Descriptions.Item label="入池金额">¥ {selected.totalAmount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="入池资产数">{selected.poolAssetCount}</Descriptions.Item>
            <Descriptions.Item label="申请日">{selected.applyDate}</Descriptions.Item>
            <Descriptions.Item label="到期日">{selected.dueDate}</Descriptions.Item>
            <Descriptions.Item label="状态" span={2}><Tag color={selected.status === '已放款' ? 'green' : 'orange'}>{selected.status}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

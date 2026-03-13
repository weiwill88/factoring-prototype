'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Tabs, InputNumber, Modal, Descriptions, Input, Select, message, Switch, DatePicker } from 'antd';
import { SwapOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const billsData = [
  { id: 'b-1', businessNumber: 'FIN-20251001-001', productName: '国内保理-有追', supplierName: '上海明远科技有限公司', counterpartyName: '中兵科技集团有限公司', billType: '银票', billNumber: 'BP-20250915-001', faceAmount: 1200000, dueDate: '2026-03-15', status: '待兑付' },
  { id: 'b-2', businessNumber: 'FIN-20251001-001', productName: '国内保理-有追', supplierName: '上海明远科技有限公司', counterpartyName: '中兵科技集团有限公司', billType: '发票', billNumber: 'FP-2025100001', faceAmount: 800000, dueDate: '2026-03-20', status: '已兑付' },
];

const tailData = [
  { id: 't-1', businessNumber: 'FIN-20251001-001', clearDate: '2026-01-05', productName: '国内保理-有追', supplierName: '上海明远科技有限公司', counterpartyName: '中兵科技集团有限公司', tailAmount: 200000, transferDate: '', status: '待划转' },
];

const refundData = [
  { id: 'r-1', businessNumber: 'FIN-20251001-001', clearDate: '2026-01-05', productName: '国内保理-有追', supplierName: '上海明远科技有限公司', counterpartyName: '中兵科技集团有限公司', refundAmount: 15000, refundDate: '', status: '待划转' },
];

export default function SettlementBillsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('bills');

  const billColumns = [
    { title: '业务编号', dataIndex: 'businessNumber', width: 160 },
    { title: '产品', dataIndex: 'productName', ellipsis: true },
    { title: '融资人', dataIndex: 'supplierName', ellipsis: true },
    { title: '交易对手', dataIndex: 'counterpartyName', ellipsis: true },
    { title: '票据类型', dataIndex: 'billType', width: 80, render: (v: string) => <Tag>{v}</Tag> },
    { title: '票面金额', dataIndex: 'faceAmount', render: (v: number) => `¥ ${v.toLocaleString()}` },
    { title: '到期日', dataIndex: 'dueDate', width: 100 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={s === '已兑付' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '操作', width: 100, render: (_: unknown, r: any) => r.status === '待兑付' && (
      <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => { setSelectedItem(r); setConfirmOpen(true); }}>兑付</Button>
    )},
  ];

  const tailColumns = [
    { title: '业务编号', dataIndex: 'businessNumber', width: 160 },
    { title: '结清日', dataIndex: 'clearDate', width: 100 },
    { title: '产品', dataIndex: 'productName', ellipsis: true },
    { title: '融资人', dataIndex: 'supplierName', ellipsis: true },
    { title: '交易对手', dataIndex: 'counterpartyName', ellipsis: true },
    { title: '尾款金额', dataIndex: 'tailAmount', render: (v: number) => <Text strong>¥ {v.toLocaleString()}</Text> },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={s === '已划转' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '操作', width: 100, render: (_: unknown, r: any) => r.status === '待划转' && (
      <Button type="link" size="small" icon={<SwapOutlined />} onClick={() => message.success('尾款划转已确认')}>确认划转</Button>
    )},
  ];

  const refundColumns = [
    { title: '业务编号', dataIndex: 'businessNumber', width: 160 },
    { title: '结清日', dataIndex: 'clearDate', width: 100 },
    { title: '产品', dataIndex: 'productName', ellipsis: true },
    { title: '融资人', dataIndex: 'supplierName', ellipsis: true },
    { title: '交易对手', dataIndex: 'counterpartyName', ellipsis: true },
    { title: '退息金额', dataIndex: 'refundAmount', render: (v: number) => <Text strong style={{ color: '#52c41a' }}>¥ {v.toLocaleString()}</Text> },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={s === '已划转' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '操作', width: 100, render: (_: unknown, r: any) => r.status === '待划转' && (
      <Button type="link" size="small" icon={<SwapOutlined />} onClick={() => message.success('退息划转已确认')}>确认退息</Button>
    )},
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>结算管理</Title>
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
          { key: 'bills', label: '票据管理-回款兑付', children: <Table dataSource={billsData} columns={billColumns} rowKey="id" size="middle" bordered /> },
          { key: 'tail', label: '尾款划转', children: <Table dataSource={tailData} columns={tailColumns} rowKey="id" size="middle" bordered /> },
          { key: 'refund', label: '退息划转', children: <Table dataSource={refundData} columns={refundColumns} rowKey="id" size="middle" bordered /> },
        ]} />
      </Card>

      <Modal title="确认兑付" open={confirmOpen} onCancel={() => setConfirmOpen(false)}
        onOk={() => { setConfirmOpen(false); message.success('兑付操作已确认'); }}>
        {selectedItem && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="票据编号">{selectedItem.billNumber}</Descriptions.Item>
            <Descriptions.Item label="票面金额">¥ {selectedItem.faceAmount?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="到期日">{selectedItem.dueDate}</Descriptions.Item>
            <Descriptions.Item label="融资人">{selectedItem.supplierName}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

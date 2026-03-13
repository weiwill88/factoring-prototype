'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Drawer, Descriptions, InputNumber, Select, Form, message, Divider, Switch } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { getAppData } from '@/lib/mockData';

const { Title, Text } = Typography;

interface CoreEnterprise {
  id: string; name: string; creditCode: string; productType: string;
  creditAmount: number; usedAmount: number; remainingAmount: number;
  isRevolving: boolean; status: string;
}

export default function CoreEnterpriseCreditPage() {
  const [data] = useState<CoreEnterprise[]>([
    { id: 'ce-1', name: '中兵科技集团有限公司', creditCode: '91110000710913455K', productType: '国内保理-应收账款', creditAmount: 50000000, usedAmount: 10000000, remainingAmount: 40000000, isRevolving: true, status: '启用' },
    { id: 'ce-2', name: '长安汽车股份有限公司', creditCode: '91500000202816442P', productType: '国内保理-商票', creditAmount: 30000000, usedAmount: 0, remainingAmount: 30000000, isRevolving: true, status: '启用' },
    { id: 'ce-3', name: '中兵红箭股份有限公司', creditCode: '91430000737004948R', productType: '池保理', creditAmount: 20000000, usedAmount: 5000000, remainingAmount: 15000000, isRevolving: false, status: '启用' },
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<CoreEnterprise | null>(null);

  const columns = [
    { title: '核心企业名称', dataIndex: 'name', key: 'name' },
    { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 },
    { title: '产品类型', dataIndex: 'productType', key: 'productType', width: 160 },
    { title: '授信金额', dataIndex: 'creditAmount', key: 'creditAmount', render: (v: number) => `¥ ${(v/10000).toFixed(0)}万` },
    { title: '已使用', dataIndex: 'usedAmount', key: 'usedAmount', render: (v: number) => `¥ ${(v/10000).toFixed(0)}万` },
    { title: '剩余额度', dataIndex: 'remainingAmount', key: 'remainingAmount',
      render: (v: number) => <Text strong style={{ color: '#52c41a' }}>¥ {(v/10000).toFixed(0)}万</Text> },
    { title: '循环', dataIndex: 'isRevolving', key: 'isRevolving', width: 60, render: (v: boolean) => v ? <Tag color="blue">是</Tag> : <Tag>否</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 70, render: (s: string) => <Tag color={s === '启用' ? 'green' : 'default'}>{s}</Tag> },
    { title: '操作', width: 90, render: (_: unknown, r: CoreEnterprise) => (
      <Button type="link" icon={<EditOutlined />} onClick={() => { setSelected(r); setDrawerOpen(true); }}>编辑</Button>
    )},
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>核心企业额度管理</Title>
      <Card>
        <div style={{ marginBottom: 16 }}><Button type="primary" icon={<PlusOutlined />}>新增核心企业额度</Button></div>
        <Table dataSource={data} columns={columns} rowKey="id" size="middle" bordered />
      </Card>
      <Drawer title={selected ? `编辑 — ${selected.name}` : ''} open={drawerOpen} onClose={() => setDrawerOpen(false)} width={600}
        extra={<Button type="primary" onClick={() => { setDrawerOpen(false); message.success('已保存'); }}>保存</Button>}>
        {selected && (
          <Form layout="vertical">
            <Card title="客户信息" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="企业名称">{selected.name}</Descriptions.Item>
                <Descriptions.Item label="信用代码">{selected.creditCode}</Descriptions.Item>
              </Descriptions>
            </Card>
            <Card title="额度设置" size="small">
              <Table size="small" bordered pagination={false}
                dataSource={[
                  { key: '1', category: '国内保理', type: '应收账款', credit: selected.creditAmount, used: selected.usedAmount, remaining: selected.remainingAmount, revolving: selected.isRevolving },
                ]}
                columns={[
                  { title: '产品大类', dataIndex: 'category' },
                  { title: '类型', dataIndex: 'type' },
                  { title: '授信额度', dataIndex: 'credit', render: (v: number) => <InputNumber value={v} style={{ width: 130 }} /> },
                  { title: '已使用', dataIndex: 'used', render: (v: number) => `¥${(v/10000).toFixed(0)}万` },
                  { title: '剩余', dataIndex: 'remaining', render: (v: number) => `¥${(v/10000).toFixed(0)}万` },
                  { title: '循环', dataIndex: 'revolving', render: (v: boolean) => <Switch checked={v} size="small" /> },
                ]}
              />
            </Card>
          </Form>
        )}
      </Drawer>
    </div>
  );
}

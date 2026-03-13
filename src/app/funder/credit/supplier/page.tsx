'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Steps, Descriptions, Drawer, Divider } from 'antd';
import { EyeOutlined, PlusOutlined, DownloadOutlined, LockOutlined, UnlockOutlined, AuditOutlined } from '@ant-design/icons';
import { getAppData } from '@/lib/mockData';
import type { CreditApplication, ApprovalStep } from '@/lib/types';

const { Title, Text } = Typography;

export default function SupplierCreditFunderPage() {
  const [data, setData] = useState<CreditApplication[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<CreditApplication | null>(null);

  useEffect(() => {
    setData(getAppData().creditApplications);
  }, []);

  const statusColors: Record<string, string> = {
    '已生效': 'green', '客户经理审批中': 'orange', '待签约': 'blue', '已退回': 'red',
  };

  const columns = [
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName' },
    { title: '额度编号', dataIndex: 'appNumber', key: 'appNumber', width: 180 },
    { title: '总额度', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => `¥ ${(v/10000).toFixed(0)}万` },
    { title: '已使用', dataIndex: 'usedAmount', key: 'usedAmount', render: (v: number) => `¥ ${(v/10000).toFixed(0)}万` },
    { title: '剩余可用', dataIndex: 'availableAmount', key: 'availableAmount', render: (v: number) => <Text strong style={{ color: '#52c41a' }}>¥ {(v/10000).toFixed(0)}万</Text> },
    { title: '签约', dataIndex: 'signingStatus', key: 'signingStatus', render: (s: string) => <Tag color={s === '已签约' ? 'green' : 'blue'}>{s}</Tag> },
    { title: '审批状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s] || 'default'}>{s}</Tag> },
    { title: '操作', width: 160, render: (_: unknown, r: CreditApplication) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelected(r); setDrawerOpen(true); }}>查看</Button>
        {r.status.includes('审批') && <Button type="link" size="small" icon={<AuditOutlined />}>审批</Button>}
      </Space>
    )},
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>供应商额度管理</Title>
      <Card>
        <div style={{ marginBottom: 16 }}><Button type="primary" icon={<PlusOutlined />}>新增额度</Button></div>
        <Table dataSource={data} columns={columns} rowKey="id" size="middle" bordered />
      </Card>

      <Drawer title={selected ? `额度详情 — ${selected.supplierName}` : ''} open={drawerOpen} onClose={() => setDrawerOpen(false)} width={720}>
        {selected && (
          <>
            <Card title="审批进度" size="small" style={{ marginBottom: 16 }}>
              <Steps size="small" current={selected.approvalSteps.findIndex(s => s.status === '进行中')}
                items={selected.approvalSteps.map(s => ({
                  title: s.role,
                  description: s.status === '已通过' ? `${s.approver} ${s.approvedAt}` : s.status,
                  status: s.status === '已通过' ? 'finish' : s.status === '进行中' ? 'process' : s.status === '已拒绝' ? 'error' : 'wait',
                }))}
              />
            </Card>
            <Card title="额度信息" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small" bordered>
                <Descriptions.Item label="总额度">¥ {(selected.totalAmount/10000).toFixed(0)}万</Descriptions.Item>
                <Descriptions.Item label="已使用">¥ {(selected.usedAmount/10000).toFixed(0)}万</Descriptions.Item>
                <Descriptions.Item label="起始日">{selected.startDate}</Descriptions.Item>
                <Descriptions.Item label="到期日">{selected.endDate}</Descriptions.Item>
              </Descriptions>
            </Card>
            <Card title="子额度列表" size="small" style={{ marginBottom: 16 }}>
              <Table size="small" bordered pagination={false} dataSource={selected.subCredits} rowKey="id"
                columns={[
                  { title: '额度编号', dataIndex: 'creditNumber', width: 150 },
                  { title: '产品', dataIndex: 'productName', ellipsis: true },
                  { title: '金额', dataIndex: 'amount', render: (v: number) => `¥${(v/10000).toFixed(0)}万` },
                  { title: '循环', dataIndex: 'isRevolving', width: 60, render: (v: boolean) => v ? <Tag color="blue">是</Tag> : <Tag>否</Tag> },
                  { title: '追索权', dataIndex: 'recourse', width: 70 },
                  { title: '明暗', dataIndex: 'factoringType', width: 70 },
                ]}
              />
            </Card>
            <Card title="费用列表" size="small" style={{ marginBottom: 16 }}>
              <Table size="small" bordered pagination={false} dataSource={selected.feeList} rowKey="id"
                columns={[
                  { title: '收费项目', dataIndex: 'feeItem' },
                  { title: '计费方式', dataIndex: 'billingMode' },
                  { title: '收费方式', dataIndex: 'paymentMode' },
                  { title: '费率(%)', dataIndex: 'rate' },
                  { title: '金额', dataIndex: 'calculatedAmount', render: (v: number) => `¥${v.toLocaleString()}` },
                ]}
              />
            </Card>
            <Card title="交易对手" size="small">
              <Table size="small" bordered pagination={false} dataSource={selected.counterparties} rowKey="id"
                columns={[
                  { title: '名称', dataIndex: 'companyName' },
                  { title: '结算方式', dataIndex: 'settlementMethod', render: (v: string[]) => v?.map(s => <Tag key={s}>{s}</Tag>) },
                  { title: '账期(月)', dataIndex: 'accountPeriodMonths', width: 80 },
                  { title: '融资比例(%)', dataIndex: 'financingRatio', width: 100 },
                  { title: '集团成员', dataIndex: 'isGroupMember', width: 80, render: (v: boolean) => v ? <Tag color="blue">是</Tag> : <Tag>否</Tag> },
                ]}
              />
            </Card>
          </>
        )}
      </Drawer>
    </div>
  );
}

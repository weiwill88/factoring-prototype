'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Tabs, Typography, Descriptions, Space } from 'antd';
import { getAppData } from '@/lib/mockData';
import type { BusinessAccount, TransactionFlow } from '@/lib/types';

const { Title, Text } = Typography;

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<BusinessAccount[]>([]);
  const [flows, setFlows] = useState<TransactionFlow[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    const d = getAppData();
    setAccounts(d.accounts);
    setFlows(d.flows);
  }, []);

  const accountColumns = [
    { title: '账户名称', dataIndex: 'accountName' },
    { title: '账号', dataIndex: 'accountNumber', width: 200 },
    { title: '开户行', dataIndex: 'bankName' },
    { title: '余额', dataIndex: 'balance', render: (v: number) => <Text strong>¥ {v.toLocaleString()}</Text> },
    { title: '操作', width: 100, render: (_: unknown, r: BusinessAccount) => (
      <Button type="link" onClick={() => setSelectedAccount(r.id)}>流水</Button>
    )},
  ];

  const flowColumns = [
    { title: '流水号', dataIndex: 'flowNumber', width: 180 },
    { title: '交易日期', dataIndex: 'transactionDate', width: 100 },
    { title: '金额', dataIndex: 'amount', render: (v: number, r: TransactionFlow) => (
      <Text strong style={{ color: r.direction === '转入' ? '#52c41a' : '#ff4d4f' }}>
        {r.direction === '转入' ? '+' : '-'}¥ {v.toLocaleString()}
      </Text>
    )},
    { title: '方向', dataIndex: 'direction', width: 70, render: (v: string) => <Tag color={v === '转入' ? 'green' : 'red'}>{v}</Tag> },
    { title: '付款方', dataIndex: 'payerName' },
    { title: '收款方', dataIndex: 'payeeName' },
    { title: '摘要', dataIndex: 'remark', ellipsis: true },
  ];

  const filteredFlows = selectedAccount ? flows.filter(f => f.accountId === selectedAccount) : flows;

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>账户管理</Title>
      <Card style={{ marginBottom: 16 }}>
        <Table dataSource={accounts} columns={accountColumns} rowKey="id" size="middle" bordered pagination={false} />
      </Card>
      <Card>
        <Tabs items={[
          { key: 'flow', label: '流水', children: (
            <>
              {selectedAccount && <div style={{ marginBottom: 8 }}><Tag closable onClose={() => setSelectedAccount(null)}>已选账户：{accounts.find(a=>a.id===selectedAccount)?.accountName}</Tag></div>}
              <Table dataSource={filteredFlows} columns={flowColumns} rowKey="id" size="middle" bordered />
            </>
          )},
          { key: 'pending', label: '流水挂账', children: <Table dataSource={[]} columns={[{title:'暂无数据',dataIndex:'none'}]} size="middle" bordered /> },
          { key: 'deposit', label: '保证金挂账', children: <Table dataSource={[]} columns={[{title:'暂无数据',dataIndex:'none'}]} size="middle" bordered /> },
        ]} />
      </Card>
    </div>
  );
}

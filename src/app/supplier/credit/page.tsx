'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Progress, Modal, message } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getAppData } from '@/lib/mockData';
import type { CreditApplication } from '@/lib/types';

const { Title, Text } = Typography;

export default function CreditPage() {
  const [data, setData] = useState<CreditApplication[]>([]);
  const router = useRouter();

  useEffect(() => {
    setData(getAppData().creditApplications);
  }, []);

  const statusColors: Record<string, string> = {
    '草稿': 'default', '供应商复核中': 'processing', '客户经理审批中': 'orange',
    '市场总监审批中': 'orange', '风险复核中': 'orange', '风险总监审批中': 'orange',
    '审查委员会审批中': 'orange', '总经理审批中': 'orange', '已通过': 'green',
    '待签约': 'blue', '已生效': 'green', '已退回': 'red',
  };

  const columns = [
    { title: '额度编号', dataIndex: 'appNumber', key: 'appNumber', width: 180 },
    { title: '资金方', dataIndex: 'funderName', key: 'funderName' },
    { title: '总额度', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => `¥ ${(v/10000).toFixed(0)}万` },
    { title: '已使用', dataIndex: 'usedAmount', key: 'usedAmount', render: (v: number) => `¥ ${(v/10000).toFixed(0)}万` },
    { title: '剩余可用', dataIndex: 'availableAmount', key: 'availableAmount', render: (v: number) => <Text strong style={{ color: '#52c41a' }}>¥ {(v/10000).toFixed(0)}万</Text> },
    { title: '使用率', key: 'usage', width: 120,
      render: (_: unknown, r: CreditApplication) => {
        const pct = r.totalAmount > 0 ? (r.usedAmount / r.totalAmount) * 100 : 0;
        return <Progress percent={Math.round(pct)} size="small" />;
      },
    },
    { title: '起始日', dataIndex: 'startDate', key: 'startDate', width: 110 },
    { title: '到期日', dataIndex: 'endDate', key: 'endDate', width: 110 },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={statusColors[s] || 'default'}>{s}</Tag>,
    },
    { title: '签约', dataIndex: 'signingStatus', key: 'signingStatus',
      render: (s: string) => <Tag color={s === '已签约' ? 'green' : s === '待签约' ? 'blue' : 'default'}>{s}</Tag>,
    },
    { title: '操作', width: 100,
      render: (_: unknown, r: CreditApplication) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => router.push(`/supplier/credit/approval?id=${r.id}`)}>
          查看
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>我的额度</Title>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/supplier/credit/apply')}>
            申请额度
          </Button>
        </div>
        <Table dataSource={data} columns={columns} rowKey="id" size="middle" bordered
          pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条` }} />
      </Card>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Drawer, Descriptions, Tabs, Input, Select, message } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import { getAppData } from '@/lib/mockData';
import type { Supplier } from '@/lib/types';

const { Title, Text } = Typography;

export default function CustomersPage() {
  const [data, setData] = useState<Supplier[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Supplier | null>(null);

  useEffect(() => {
    setData(getAppData().suppliers);
  }, []);

  const columns = [
    { title: '序号', width: 50, render: (_: unknown, __: unknown, i: number) => i + 1 },
    { title: '企业名称', dataIndex: 'companyName', key: 'companyName' },
    { title: '统一社会信用代码', dataIndex: 'unifiedCreditCode', key: 'unifiedCreditCode', width: 200 },
    { title: '客户经理', dataIndex: 'customerManager', key: 'customerManager', width: 90,
      render: (v: string) => v || <Text type="secondary">未分配</Text> },
    { title: '所属板块', key: 'sector', width: 80,
      render: (_: unknown, r: Supplier) => r.tags?.['所属板块'] ? <Tag>{r.tags['所属板块']}</Tag> : '-' },
    { title: '集团成员', key: 'group', width: 80,
      render: (_: unknown, r: Supplier) => r.tags?.['集团成员'] === '是' ? <Tag color="blue">是</Tag> : <Tag>否</Tag> },
    { title: '注册时间', dataIndex: 'registrationDate', key: 'registrationDate', width: 110 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => {
        const c: Record<string, string> = { '已通过': 'green', '待审批': 'orange', '已拒绝': 'red' };
        return <Tag color={c[s] || 'default'}>{s}</Tag>;
      },
    },
    { title: '操作', width: 100,
      render: (_: unknown, r: Supplier) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => { setSelected(r); setDrawerOpen(true); }}>查看</Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>客户管理</Title>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input.Search placeholder="搜索企业名称" style={{ width: 300 }} prefix={<SearchOutlined />} />
            <Select defaultValue="all" style={{ width: 120 }} options={[
              { label: '全部状态', value: 'all' }, { label: '已通过', value: '已通过' },
              { label: '待审批', value: '待审批' }, { label: '已拒绝', value: '已拒绝' },
            ]} />
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>
        <Table dataSource={data} columns={columns} rowKey="id" size="middle" bordered
          pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条` }} />
      </Card>

      <Drawer title="客户详情" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={600}>
        {selected && (
          <Tabs items={[
            {
              key: 'basic', label: '基本信息',
              children: (
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="企业名称" span={2}>{selected.companyName}</Descriptions.Item>
                  <Descriptions.Item label="信用代码">{selected.unifiedCreditCode}</Descriptions.Item>
                  <Descriptions.Item label="企业性质">{selected.enterpriseNature}</Descriptions.Item>
                  <Descriptions.Item label="所属行业">{selected.industry}</Descriptions.Item>
                  <Descriptions.Item label="从业人数">{selected.employeeCount || '-'}</Descriptions.Item>
                  <Descriptions.Item label="注册地" span={2}>{selected.province} {selected.city}</Descriptions.Item>
                  <Descriptions.Item label="详细地址" span={2}>{selected.address}</Descriptions.Item>
                  <Descriptions.Item label="法人">{selected.legalRepName}</Descriptions.Item>
                  <Descriptions.Item label="客户经理">{selected.customerManager || '未分配'}</Descriptions.Item>
                  <Descriptions.Item label="注册日期">{selected.registrationDate}</Descriptions.Item>
                  <Descriptions.Item label="状态"><Tag color={selected.status === '已通过' ? 'green' : 'orange'}>{selected.status}</Tag></Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'tags', label: '标签信息',
              children: selected.tags ? (
                <Descriptions column={2} bordered size="small">
                  {Object.entries(selected.tags).map(([k, v]) => (
                    <Descriptions.Item label={k} key={k}><Tag>{v}</Tag></Descriptions.Item>
                  ))}
                </Descriptions>
              ) : <Text type="secondary">暂无标签信息</Text>,
            },
            {
              key: 'contact', label: '联系信息',
              children: (
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="操作人">{selected.operatorName}</Descriptions.Item>
                  <Descriptions.Item label="手机">{selected.operatorPhone}</Descriptions.Item>
                  <Descriptions.Item label="邮箱">{selected.operatorEmail}</Descriptions.Item>
                </Descriptions>
              ),
            },
          ]} />
        )}
      </Drawer>
    </div>
  );
}

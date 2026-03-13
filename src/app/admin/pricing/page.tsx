'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Tag, Select, InputNumber, Typography, Space } from 'antd';
import { getAppData } from '@/lib/mockData';
import type { TagPricing, ProductPricing } from '@/lib/types';

const { Title, Text } = Typography;

export default function PricingPage() {
  const [tagPricings, setTagPricings] = useState<TagPricing[]>([]);
  const [productPricings, setProductPricings] = useState<ProductPricing[]>([]);

  useEffect(() => {
    const d = getAppData();
    setTagPricings(d.tagPricings);
    setProductPricings(d.productPricings);
  }, []);

  const tagColumns = [
    { title: '标签', dataIndex: 'tagName', key: 'tagName' },
    { title: '枚举值', dataIndex: 'enumValue', key: 'enumValue', render: (v: string) => <Tag>{v}</Tag> },
    { title: '定价方式', dataIndex: 'method', key: 'method',
      render: (v: string) => <Tag color={v === '上浮' ? 'red' : v === '下浮' ? 'green' : 'blue'}>{v}</Tag> },
    { title: '调整值(%/BP)', dataIndex: 'value', key: 'value',
      render: (v: number) => <Text strong>{v}%</Text> },
  ];

  const productColumns = [
    { title: '产品名称', dataIndex: 'productName', key: 'productName' },
    { title: '基准价(%)', dataIndex: 'basePrice', key: 'basePrice',
      render: (v: number) => <Text strong style={{ color: '#1677ff' }}>{v}%</Text> },
    { title: '关联标签数', key: 'tagCount', render: (_: unknown, r: ProductPricing) => <Tag>{r.linkedTags.length}</Tag> },
    { title: '价格区间', dataIndex: 'priceRange', key: 'priceRange' },
    { title: '适用费项', dataIndex: 'applicableFees', key: 'applicableFees', ellipsis: true },
    { title: '费项关系', dataIndex: 'relationship', key: 'relationship',
      render: (v: string) => <Tag color={v === '共用' ? 'purple' : 'cyan'}>{v}</Tag> },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>产品定价</Title>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text>资金方：</Text>
            <Select defaultValue="天逸保理" style={{ width: 200 }} options={[{ label: '天逸保理', value: '天逸保理' }]} />
          </Space>
        </div>
        <Tabs items={[
          {
            key: 'tag', label: '标签定价',
            children: (
              <>
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                  标签对产品价格的影响规则：调整基价=替换基准价，上浮=基准价+值，下浮=基准价-值
                </Text>
                <Table dataSource={tagPricings} columns={tagColumns} rowKey="id" size="middle" bordered pagination={false} />
              </>
            ),
          },
          {
            key: 'product', label: '产品基准定价',
            children: (
              <>
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                  每个产品的基准定价，及关联的标签和价格区间约束
                </Text>
                <Table dataSource={productPricings} columns={productColumns} rowKey="id" size="middle" bordered pagination={false} />
              </>
            ),
          },
        ]} />
      </Card>
    </div>
  );
}

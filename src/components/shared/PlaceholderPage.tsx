'use client';

import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PlaceholderPageProps {
  title: string;
  module: string;
  description?: string;
}

export default function PlaceholderPage({ title, module, description }: PlaceholderPageProps) {
  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center', padding: '40px 0' }}>
        <ToolOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
        <Title level={3} style={{ margin: 0 }}>{title}</Title>
        <Tag color="orange">{module}</Tag>
        {description && <Text type="secondary">{description}</Text>}
        <Text type="secondary" style={{ fontSize: 12 }}>该模块开发中...</Text>
      </Space>
    </Card>
  );
}

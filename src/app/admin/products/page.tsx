'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Drawer, Form, Input, Select, Switch, InputNumber, Typography, Popconfirm, message, Divider } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAppData, saveAppData, generateId } from '@/lib/mockData';
import type { Product, FeeConfig } from '@/lib/types';

const { Title, Text } = Typography;

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [feeConfigs, setFeeConfigs] = useState<FeeConfig[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setData(getAppData().products);
  }, []);

  const openDrawer = (product: Product) => {
    setEditingProduct(product);
    setFeeConfigs(product.feeConfigs.length > 0 ? product.feeConfigs : [
      { id: generateId('fee'), feeItem: '保理手续费', billingMode: '逐笔', paymentMode: '先收', isInvoiceable: true },
      { id: generateId('fee'), feeItem: '利息', billingMode: '年化', paymentMode: '先收', isInvoiceable: false },
    ]);
    form.setFieldsValue({
      hasHandlingFee: product.hasHandlingFee,
      showFeeDetail: product.showFeeDetail,
      isGuarantee: product.isGuarantee,
      guaranteeType: product.guaranteeType,
      isZhongdeng: product.isZhongdeng,
      zhongdengStage: product.zhongdengStage,
    });
    setDrawerOpen(true);
  };

  const saveProduct = () => {
    if (!editingProduct) return;
    const values = form.getFieldsValue();
    const updated = data.map(p => {
      if (p.id === editingProduct.id) {
        return { ...p, ...values, feeConfigs: feeConfigs };
      }
      return p;
    });
    setData(updated);
    const appData = getAppData();
    appData.products = updated;
    saveAppData(appData);
    setDrawerOpen(false);
    message.success('产品配置已保存');
  };

  const addFeeRow = () => {
    setFeeConfigs([...feeConfigs, {
      id: generateId('fee'), feeItem: '平台服务费', billingMode: '逐笔', paymentMode: '先收', isInvoiceable: true,
    }]);
  };

  const removeFeeRow = (id: string) => {
    setFeeConfigs(feeConfigs.filter(f => f.id !== id));
  };

  const updateFeeRow = (id: string, field: keyof FeeConfig, value: unknown) => {
    setFeeConfigs(feeConfigs.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const columns = [
    { title: '产品大类', dataIndex: 'category', key: 'category', width: 100,
      filters: [
        { text: '国内保理', value: '国内保理' }, { text: '反向保理', value: '反向保理' },
        { text: '汽配订单', value: '汽配订单' }, { text: '再保理', value: '再保理' },
        { text: '预付保理', value: '预付保理' },
      ],
      onFilter: (value: unknown, record: Product) => record.category === value,
    },
    { title: '类型', dataIndex: 'type', key: 'type', width: 160 },
    { title: '追索权', dataIndex: 'recourse', key: 'recourse', width: 80,
      render: (v: string) => <Tag color={v === '有追' ? 'blue' : v === '无追' ? 'green' : 'default'}>{v}</Tag>,
    },
    { title: '现有产品名', dataIndex: 'legacyName', key: 'legacyName', ellipsis: true },
    { title: '中登登记', dataIndex: 'isZhongdeng', key: 'isZhongdeng', width: 80,
      render: (v: boolean) => v ? <Tag color="blue">是</Tag> : <Tag>否</Tag>,
    },
    { title: '费项数', key: 'feeCount', width: 70,
      render: (_: unknown, r: Product) => <Tag>{r.feeConfigs.length}</Tag>,
    },
    { title: '状态', dataIndex: 'status', key: 'status', width: 70,
      render: (s: string) => <Tag color={s === '启用' ? 'green' : 'default'}>{s}</Tag>,
    },
    { title: '操作', width: 100,
      render: (_: unknown, record: Product) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => openDrawer(record)}>配置</Button>
      ),
    },
  ];

  const feeColumns = [
    { title: '费用项目', dataIndex: 'feeItem', width: 140,
      render: (v: string, r: FeeConfig) => (
        <Select value={v} style={{ width: 130 }} onChange={val => updateFeeRow(r.id, 'feeItem', val)}
          options={['保理手续费','平台服务费','利息','宽限期利息','罚息','票据服务费','贴息费'].map(i => ({ label: i, value: i }))} />
      ),
    },
    { title: '计费方式', dataIndex: 'billingMode', width: 110,
      render: (v: string, r: FeeConfig) => (
        <Select value={v} style={{ width: 100 }} onChange={val => updateFeeRow(r.id, 'billingMode', val)}
          options={['逐笔','年化','一口价'].map(i => ({ label: i, value: i }))} />
      ),
    },
    { title: '一口价%', dataIndex: 'fixedRate', width: 90,
      render: (v: number | undefined, r: FeeConfig) => (
        <InputNumber value={v} style={{ width: 80 }} min={0} max={100} step={0.1}
          onChange={val => updateFeeRow(r.id, 'fixedRate', val)} disabled={r.billingMode !== '一口价'} />
      ),
    },
    { title: '付费方式', dataIndex: 'paymentMode', width: 140,
      render: (v: string, r: FeeConfig) => (
        <Select value={v} style={{ width: 130 }} onChange={val => updateFeeRow(r.id, 'paymentMode', val)}
          options={['先收','等额本金','等额本息','按月','按季','到期还本付息','利随本清'].map(i => ({ label: i, value: i }))} />
      ),
    },
    { title: '开票', dataIndex: 'isInvoiceable', width: 60,
      render: (v: boolean, r: FeeConfig) => (
        <Switch checked={v} size="small" onChange={val => updateFeeRow(r.id, 'isInvoiceable', val)} />
      ),
    },
    { title: '', width: 40,
      render: (_: unknown, r: FeeConfig) => (
        <Popconfirm title="确定删除？" onConfirm={() => removeFeeRow(r.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>产品管理</Title>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text strong>共 {data.length} 个产品SKU</Text>
            <Tag color="blue">{data.filter(p => p.status === '启用').length} 个启用</Tag>
          </Space>
        </div>
        <Table dataSource={data} columns={columns} rowKey="id" size="middle" bordered
          pagination={{ pageSize: 25, showTotal: t => `共 ${t} 条` }} />
      </Card>

      <Drawer title={editingProduct ? `产品配置 — ${editingProduct.category} · ${editingProduct.type}` : ''}
        open={drawerOpen} onClose={() => setDrawerOpen(false)} width={720}
        extra={<Button type="primary" onClick={saveProduct}>保存配置</Button>}>
        {editingProduct && (
          <Form form={form} layout="vertical">
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>产品大类：<Tag>{editingProduct.category}</Tag></Text>
                <Text>类型：<Tag>{editingProduct.type}</Tag></Text>
                <Text>追索权：<Tag color={editingProduct.recourse === '有追' ? 'blue' : 'green'}>{editingProduct.recourse}</Tag></Text>
                <Text>现有产品名：{editingProduct.legacyName}</Text>
              </Space>
            </Card>

            <Card title="费项配置" size="small" style={{ marginBottom: 16 }}>
              <Form.Item label="是否收取保理手续费" name="hasHandlingFee" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="供应商是否展示费用明细" name="showFeeDetail" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Divider>费用项目明细</Divider>
              <Table dataSource={feeConfigs} columns={feeColumns} rowKey="id" size="small" pagination={false} bordered />
              <Button type="dashed" block icon={<PlusOutlined />} style={{ marginTop: 8 }} onClick={addFeeRow}>
                + 新增费用项目
              </Button>
            </Card>

            <Card title="担保配置" size="small" style={{ marginBottom: 16 }}>
              <Form.Item label="是否需要担保" name="isGuarantee" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="担保权人类型" name="guaranteeType">
                <Select options={[{ label: '企业', value: '企业' }, { label: '个人', value: '个人' }]} allowClear />
              </Form.Item>
            </Card>

            <Card title="中登登记" size="small">
              <Form.Item label="是否中登登记" name="isZhongdeng" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="中登登记环节" name="zhongdengStage">
                <Select options={[
                  { label: '资金方审核通过放款前', value: '资金方审核通过放款前' },
                  { label: '放款后', value: '放款后' },
                ]} allowClear />
              </Form.Item>
            </Card>
          </Form>
        )}
      </Drawer>
    </div>
  );
}

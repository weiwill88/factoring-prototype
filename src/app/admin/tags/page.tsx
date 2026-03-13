'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Button, Tag, Space, Input, Select, Form, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getAppData, saveAppData, generateId } from '@/lib/mockData';
import type { Tag as TagType } from '@/lib/types';

const { Title } = Typography;

interface EditableRowData extends TagType {
  isEditing?: boolean;
}

function TagTable({ dimension, dataKey }: { dimension: '客户维度' | '融资维度'; dataKey: 'customerTags' | 'financingTags' }) {
  const [data, setData] = useState<EditableRowData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const appData = getAppData();
    setData(appData[dataKey]);
  }, [dataKey]);

  const saveAll = (newData: EditableRowData[]) => {
    setData(newData);
    const appData = getAppData();
    appData[dataKey] = newData.map(({ isEditing, ...rest }) => rest);
    saveAppData(appData);
  };

  const startEdit = (record: EditableRowData) => {
    form.setFieldsValue({ name: record.name, enumValues: record.enumValues.join(','), judgeLogic: record.judgeLogic });
    setEditingId(record.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setData(prev => prev.filter(r => r.id !== 'new'));
  };

  const saveEdit = async () => {
    const row = await form.validateFields();
    const newData = data.map(item => {
      if (item.id === editingId || item.id === 'new') {
        return {
          ...item,
          id: item.id === 'new' ? generateId('tag') : item.id,
          name: row.name,
          enumValues: row.enumValues.split(',').map((v: string) => v.trim()),
          judgeLogic: row.judgeLogic,
        };
      }
      return item;
    });
    saveAll(newData);
    setEditingId(null);
    message.success('保存成功');
  };

  const toggleStatus = (id: string) => {
    const newData = data.map(item =>
      item.id === id ? { ...item, status: item.status === '启用' ? '停用' as const : '启用' as const } : item
    );
    saveAll(newData);
    message.success('状态已更新');
  };

  const addRow = () => {
    const newRow: EditableRowData = {
      id: 'new', name: '', dimension, enumValues: [], status: '启用', judgeLogic: '',
    };
    setData([...data, newRow]);
    form.setFieldsValue({ name: '', enumValues: '', judgeLogic: '' });
    setEditingId('new');
  };

  const columns = [
    { title: '序号', width: 60, render: (_: unknown, __: unknown, index: number) => index + 1 },
    {
      title: '标签名称', dataIndex: 'name', key: 'name',
      render: (text: string, record: EditableRowData) => {
        if (editingId === record.id) return <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true, message: '请输入' }]}><Input /></Form.Item>;
        return text;
      },
    },
    {
      title: '枚举值', dataIndex: 'enumValues', key: 'enumValues',
      render: (values: string[], record: EditableRowData) => {
        if (editingId === record.id) return <Form.Item name="enumValues" style={{ margin: 0 }} rules={[{ required: true, message: '请输入（逗号分隔）' }]}><Input placeholder="逗号分隔" /></Form.Item>;
        return values?.map(v => <Tag key={v}>{v}</Tag>);
      },
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (s: string) => <Tag color={s === '启用' ? 'green' : 'default'}>{s}</Tag>,
    },
    {
      title: '判断逻辑', dataIndex: 'judgeLogic', key: 'judgeLogic',
      render: (text: string, record: EditableRowData) => {
        if (editingId === record.id) return <Form.Item name="judgeLogic" style={{ margin: 0 }}><Input /></Form.Item>;
        return <span style={{ color: '#999', fontSize: 12 }}>{text}</span>;
      },
    },
    {
      title: '操作', width: 150,
      render: (_: unknown, record: EditableRowData) => {
        if (editingId === record.id) {
          return (
            <Space>
              <Button type="link" icon={<CheckOutlined />} onClick={saveEdit}>保存</Button>
              <Button type="link" icon={<CloseOutlined />} onClick={cancelEdit}>取消</Button>
            </Space>
          );
        }
        return (
          <Space>
            <Button type="link" icon={<EditOutlined />} onClick={() => startEdit(record)}>编辑</Button>
            <Popconfirm title={`确定${record.status === '启用' ? '停用' : '启用'}？`} onConfirm={() => toggleStatus(record.id)}>
              <Button type="link" danger={record.status === '启用'}>{record.status === '启用' ? '停用' : '启用'}</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Select defaultValue="天逸保理" style={{ width: 200 }} options={[{ label: '天逸保理', value: '天逸保理' }, { label: '长安保理', value: '长安保理' }]} />
        </Space>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" pagination={false} size="middle" bordered />
      <Button type="dashed" block icon={<PlusOutlined />} style={{ marginTop: 16 }} onClick={addRow} disabled={editingId !== null}>
        + 新增标签
      </Button>
    </Form>
  );
}

export default function TagsPage() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>标签管理</Title>
      <Card>
        <Tabs items={[
          { key: 'customer', label: '客户维度标签', children: <TagTable dimension="客户维度" dataKey="customerTags" /> },
          { key: 'financing', label: '融资维度标签', children: <TagTable dimension="融资维度" dataKey="financingTags" /> },
        ]} />
      </Card>
    </div>
  );
}
